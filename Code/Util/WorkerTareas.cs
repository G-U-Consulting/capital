using System;
using capital.Code.Inte.Davivienda;
using capital.Code.Inte.Salesforce;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;
using orca.Code.Logger;
namespace capital.code.Util;
public class WorkerTareas(string rootPath) : BackgroundService
{
    private readonly string rootPath = rootPath;
    private int consecutiveErrors = 0;
    private const int MaxConcurrentTasks = 5;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            JToken? resData = (await Generic.ProcessRequest(null, null, "genericDT", "General/Get_ColaTareas", "{}", rootPath))["data"];
            if (resData != null && resData is JArray arr && arr.HasValues)
            {
                var tasks = new List<Task>();
                var semaphore = new SemaphoreSlim(MaxConcurrentTasks);
                int errorsAtStart = consecutiveErrors;

                foreach (JObject obj in resData.Children<JObject>())
                {
                    //Console.WriteLine("Execute task " + obj["id_cola_tareas_rpa"]);
                    string? tipo = obj["tipo"]?.ToString(),
                        subtipo = obj["sub_tipo"]?.ToString(),
                        datos = obj["datos"]?.ToString();
                    if (tipo == "salesforce" && !string.IsNullOrWhiteSpace(subtipo) && !string.IsNullOrWhiteSpace(datos))
                    {
                        await semaphore.WaitAsync(stoppingToken);
                        tasks.Add(ProcessTaskSF(obj, subtipo, datos, semaphore));
                    }
                    else if(tipo == "unassign" && !string.IsNullOrWhiteSpace(datos))
                    {
                        await semaphore.WaitAsync(stoppingToken);
                        tasks.Add(ProcessTaskLiberarUnd(obj, datos, semaphore));
                    }
                }

                await Task.WhenAll(tasks);
                
                if (consecutiveErrors == errorsAtStart)
                {
                    consecutiveErrors = 0;
                    await Task.Delay(5000, stoppingToken);
                }
                else
                {
                    int delayMs = Math.Min(120000, 20000 + (consecutiveErrors * 10000));
                    await Task.Delay(delayMs, stoppingToken);
                }
            }
            else await Task.Delay(20000, stoppingToken);
            //CleanDavRequest();
        }
    }

    private async Task ProcessTaskSF(JObject obj, string subtipo, string datos, SemaphoreSlim semaphore)
    {
        try
        {
            int errorsAtStart = consecutiveErrors;
            obj["resultado"] = await SendSalesforce(subtipo, datos);
            if (errorsAtStart != consecutiveErrors)
            {
                DateTime reprogramar = DateTime.UtcNow.AddMinutes(5);
                obj["is_active"] = "1";
                obj["fecha_programada"] = reprogramar.ToString("yyyy-MM-dd HH:mm:ss");
            }
            else obj["is_active"] = "0";
            await Generic.ProcessRequest(null, null, "genericST", "General/Upd_ColaTareas", JsonConvert.SerializeObject(obj), rootPath);
        }
        catch (Exception ex)
        {
            Logger.Log("Util.WorkerTareas.ProcessTaskSF" + "   " + subtipo + " - " + ex.Message + Environment.NewLine + ex.StackTrace);
            consecutiveErrors++;
        }
        finally
        {
            semaphore.Release();
        }
    }

    private async Task ProcessTaskLiberarUnd(JObject obj, string datos, SemaphoreSlim semaphore)
    {
        try
        {
            int errorsAtStart = consecutiveErrors;
            obj["resultado"] = await LiberarUnidad(datos);
            if (errorsAtStart != consecutiveErrors)
            {
                DateTime reprogramar = DateTime.UtcNow.AddMinutes(5);
                obj["is_active"] = "1";
                obj["fecha_programada"] = reprogramar.ToString("yyyy-MM-dd HH:mm:ss");
            }
            else
            {
                obj["is_active"] = "0";

                try
                {
                    JObject datosObj = JObject.Parse(datos);
                    if (datosObj["id_negocios_unidades"] != null)
                    {
                        string idNegociosUnidades = datosObj["id_negocios_unidades"]!.ToString();
                        await EnviarCorreoAtencion(idNegociosUnidades);
                    }
                }
                catch (Exception exCorreo)
                {
                    Logger.Log("Util.WorkerTareas.ProcessTaskLiberarUnd - Error al enviar correo: " + exCorreo.Message);
                }
            }
            await Generic.ProcessRequest(null, null, "genericST", "General/Upd_ColaTareas", JsonConvert.SerializeObject(obj), rootPath);
        }
        catch (Exception ex)
        {
            Logger.Log("Util.WorkerTareas.ProcessTaskLiberarUnd - " + ex.Message + Environment.NewLine + ex.StackTrace);
            consecutiveErrors++;
        }
        finally
        {
            semaphore.Release();
        }
    }

    private async Task<string> SendSalesforce(string subtipo, string datos)
    {
        string sql = "integraciones/Get_" + subtipo;
        JToken? res = new JObject();
        string resultado;
        try
        {
            JsonConvert.DeserializeObject(datos);
            if (Handlers.TryGetValue(subtipo, out var handler))
                res = await handler(sql, datos, rootPath);
            resultado = JsonConvert.SerializeObject(res);
        }
        catch (Exception ex)
        {
            Logger.Log("Util.WorkerTareas.SendSalesforce" + "   " + subtipo + " - " + ex.Message + Environment.NewLine + datos + Environment.NewLine + ex.StackTrace);
            resultado = ex.Message;
            consecutiveErrors++;
        }
        return resultado[..Math.Min(255, resultado.Length)];
    }

    private static readonly Dictionary<string, Func<string, string, string, Task<JToken?>>> Handlers =
    new()
    {
        ["VisitaSF"] = async (sql, datos, rp) => 
            await (await Visita.CreateAsync(sql, datos, rp).LoadData()).Send(),
        ["CotizacionSF"] = async (sql, datos, rp) => 
            await (await Cotizacion.CreateAsync(sql, datos, rp).LoadData()).Send(),
        ["ListaEsperaSF"] = async (sql, datos, rp) => 
            await (await ListaEspera.CreateAsync(sql, datos, rp).LoadData()).Send(),
    };

    private async Task<string> LiberarUnidad(string datos)
    {
        try {
            JToken? resData = (await Generic.ProcessRequest(null, null, "genericST", "ProcesoNegocio/Upd_LiberarUnidad", datos, rootPath))["data"];
            string? res = resData?.ToString();
            Console.WriteLine(res);
            if (string.IsNullOrWhiteSpace(res) || !res.StartsWith("OK"))
                throw new Exception(res);
            return res;
        }
        catch (Exception ex)
        {
            Logger.Log("Util.WorkerTareas.LiberarUnidad - " + ex.Message + Environment.NewLine + datos + Environment.NewLine + ex.StackTrace);
            consecutiveErrors++;
            return ex.Message;
        }
    }

    private async Task EnviarCorreoAtencion(string idNegociosUnidades)
    {
        try
        {
            var paramsJson = JsonConvert.SerializeObject(new { id_negocios_unidades = idNegociosUnidades });

            var resValidacion = await Generic.ProcessRequest(null, null, "genericDS", "ProcesoNegocio/Get_ValidarModoUnidad", paramsJson, rootPath);
            var modoData = resValidacion?["data"]?[0]?[0];

            if (modoData == null)
            {
                Logger.Log("Util.WorkerTareas.EnviarCorreoAtencion - No se pudo obtener el modo de la unidad");
                return;
            }

            int modo = Convert.ToInt32(modoData["modo"]?.ToString() ?? "0");

            if (modo == 1)
            {
                await EnviarCorreoRegistro(idNegociosUnidades);
            }
            else if (modo == 2)
            {
                await EnviarCorreoCotizacion(idNegociosUnidades);
            }
        }
        catch (Exception ex)
        {
            Logger.Log("Util.WorkerTareas.EnviarCorreoAtencion - " + ex.Message + Environment.NewLine + ex.StackTrace);
        }
    }

    private async Task EnviarCorreoRegistro(string idNegociosUnidades)
    {
        try
        {
            var paramsJson = JsonConvert.SerializeObject(new { id_negocios_unidades = idNegociosUnidades });
            var respDatos = await Generic.ProcessRequest(null, null, "genericDS", "ProcesoNegocio/Get_DatosRegistroCorreo", paramsJson, rootPath);

            var datosRegistro = respDatos?["data"]?[0]?[0];
            var cliente = respDatos?["data"]?[1]?[0];

            if (datosRegistro == null || cliente == null)
            {
                Logger.Log("Util.WorkerTareas.EnviarCorreoRegistro - No se pudieron obtener los datos");
                return;
            }

            string? emailCliente = cliente["email"]?.ToString();
            if (string.IsNullOrWhiteSpace(emailCliente))
            {
                Logger.Log("Util.WorkerTareas.EnviarCorreoRegistro - Cliente sin email");
                return;
            }

            var emailData = new JObject
            {
                ["nombre_cliente"] = cliente["nombre_cliente"]?.ToString() ?? "",
                ["fecha_visita"] = datosRegistro["fecha_visita"]?.ToString() ?? "",
                ["proyecto"] = datosRegistro["proyecto"]?.ToString() ?? "",
                ["nombre_asesor"] = datosRegistro["nombre_asesor"]?.ToString() ?? "",
                ["email_asesor"] = datosRegistro["email_asesor"]?.ToString() ?? "",
                ["telefono_asesor"] = datosRegistro["telefono_asesor"]?.ToString() ?? "",
                ["sala_venta"] = datosRegistro["sala_venta"]?.ToString() ?? "",
                ["direccion_sala"] = datosRegistro["direccion_sala"]?.ToString() ?? "",
                ["logo_proyecto_img"] = string.IsNullOrWhiteSpace(datosRegistro["logo_proyecto_llave"]?.ToString())
                    ? ""
                    : $"<img src=\"https://dev.serlefinpbi.com/file/S3get/{datosRegistro["logo_proyecto_llave"]}\" alt=\"{datosRegistro["proyecto"]}\" style=\"max-width: 180px; max-height: 80px;\">"
            };

            SendMail.Send(
                emailCliente,
                $"Gracias por su visita - {datosRegistro["proyecto"]}",
                "RegistroFinalizado",
                emailData,
                rootPath
            );

            Logger.Log($"Util.WorkerTareas.EnviarCorreoRegistro - Correo enviado exitosamente a {emailCliente}");
        }
        catch (Exception ex)
        {
            Logger.Log("Util.WorkerTareas.EnviarCorreoRegistro - " + ex.Message + Environment.NewLine + ex.StackTrace);
        }
    }

    private async Task EnviarCorreoCotizacion(string idNegociosUnidades)
    {
        try
        {
            var paramsJson = JsonConvert.SerializeObject(new { id_negocios_unidades = idNegociosUnidades });
            var respDatos = await Generic.ProcessRequest(null, null, "genericDS", "ProcesoNegocio/Get_DatosCotizacionCorreo", paramsJson, rootPath);

            var datosCotizacion = respDatos?["data"]?[0]?[0];
            var cliente = respDatos?["data"]?[1]?[0];
            var unidades = respDatos?["data"]?[2] as JArray;

            if (datosCotizacion == null || cliente == null)
            {
                Logger.Log("Util.WorkerTareas.EnviarCorreoCotizacion - No se pudieron obtener los datos");
                return;
            }

            string? emailCliente = cliente["email"]?.ToString();
            if (string.IsNullOrWhiteSpace(emailCliente))
            {
                Logger.Log("Util.WorkerTareas.EnviarCorreoCotizacion - Cliente sin email");
                return;
            }

            var unidadesSection = new System.Text.StringBuilder();
            if (unidades != null && unidades.Count > 0)
            {
                for (int i = 0; i < unidades.Count; i++)
                {
                    var u = unidades[i];
                    unidadesSection.Append($@"
                        <div class=""unidad-item"">
                            <h3>Unidad {i + 1}: {u["nombre_unidad"]} - Torre {u["torre"]}</h3>
                            <table>
                                <tr><td class=""label"">Tipo</td><td class=""value"">{u["tipo_unidad"]}</td></tr>
                                <tr><td class=""label"">Área Privada</td><td class=""value"">{u["area_privada"]} m²</td></tr>
                                <tr><td class=""label"">Área Construida</td><td class=""value"">{u["area_construida"]} m²</td></tr>
                                <tr><td class=""label"">Valor Unidad</td><td class=""value highlight-value"">${u["valor_unidad"]}</td></tr>
                                <tr><td class=""label"">Descuento</td><td class=""value"">${u["valor_descuento"]}</td></tr>
                                <tr><td class=""label"">Valor Final</td><td class=""value highlight-value"">${u["valor_final"]}</td></tr>
                            </table>
                        </div>");
                }
            }

            var emailData = new JObject
            {
                ["nombre_cliente"] = cliente["nombre_cliente"]?.ToString() ?? "",
                ["tipo_documento"] = cliente["tipo_documento"]?.ToString() ?? "",
                ["numero_documento"] = cliente["numero_documento"]?.ToString() ?? "",
                ["telefono"] = cliente["telefono"]?.ToString() ?? "",
                ["email"] = emailCliente,
                ["proyecto"] = datosCotizacion["proyecto"]?.ToString() ?? "",
                ["id_cotizacion"] = datosCotizacion["id_cotizacion"]?.ToString() ?? "",
                ["fecha_cotizacion"] = datosCotizacion["fecha_cotizacion"]?.ToString() ?? "",
                ["nombre_asesor"] = datosCotizacion["nombre_asesor"]?.ToString() ?? "",
                ["email_asesor"] = datosCotizacion["email_asesor"]?.ToString() ?? "",
                ["telefono_asesor"] = datosCotizacion["telefono_asesor"]?.ToString() ?? "",
                ["unidades_section"] = unidadesSection.ToString(),
                ["logo_proyecto_img"] = string.IsNullOrWhiteSpace(datosCotizacion["logo_proyecto_llave"]?.ToString())
                    ? ""
                    : $"<img src=\"https://dev.serlefinpbi.com/file/S3get/{datosCotizacion["logo_proyecto_llave"]}\" alt=\"{datosCotizacion["proyecto"]}\" style=\"max-width: 180px; max-height: 80px;\">"
            };

            SendMail.Send(
                emailCliente,
                $"Resumen de Cotización - {datosCotizacion["proyecto"]}",
                "CotizacionFinalizada",
                emailData,
                rootPath
            );

            string? emailAsesor = datosCotizacion["email_asesor"]?.ToString();
            if (!string.IsNullOrWhiteSpace(emailAsesor) && emailAsesor != emailCliente)
            {
                SendMail.Send(
                    emailAsesor,
                    $"Resumen de Cotización - {datosCotizacion["proyecto"]}",
                    "CotizacionFinalizada",
                    emailData,
                    rootPath
                );
            }

            Logger.Log($"Util.WorkerTareas.EnviarCorreoCotizacion - Correo enviado exitosamente a {emailCliente}");
        }
        catch (Exception ex)
        {
            Logger.Log("Util.WorkerTareas.EnviarCorreoCotizacion - " + ex.Message + Environment.NewLine + ex.StackTrace);
        }
    }

    private static void CleanDavRequest()
    {
        int c = 0;
        foreach (string key in Davivienda.requests.Keys)
        {
            Davivienda dav = Davivienda.requests[key];
            if (DateTimeOffset.Now.ToUnixTimeSeconds() >= dav.validUntil)
                Davivienda.requests.Remove(key);
            c++;
        }
        Console.WriteLine("Dav clean: " + c);
    }
}
