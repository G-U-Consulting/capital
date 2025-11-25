using System;
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
                    if (obj["tipo"]?.ToString() is string tipo && tipo == "salesforce"
                        && obj["sub_tipo"]?.ToString() is string subtipo
                        && obj["datos"]?.ToString() is string datos)
                    {
                        await semaphore.WaitAsync(stoppingToken);
                        tasks.Add(ProcessTaskAsync(obj, subtipo, datos, semaphore));
                    }
                }

                await Task.WhenAll(tasks);
                
                if (consecutiveErrors == errorsAtStart)
                {
                    consecutiveErrors = 0;
                    await Task.Delay(1000, stoppingToken);
                }
                else
                {
                    int delayMs = Math.Min(120000, 20000 + (consecutiveErrors * 10000));
                    await Task.Delay(delayMs, stoppingToken);
                }
            }
            else await Task.Delay(20000, stoppingToken);
        }
    }

    private async Task ProcessTaskAsync(JObject obj, string subtipo, string datos, SemaphoreSlim semaphore)
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
            Console.WriteLine(JsonConvert.SerializeObject(obj));
            await Generic.ProcessRequest(null, null, "genericST", "General/Upd_ColaTareas", JsonConvert.SerializeObject(obj), rootPath);
        }
        catch (Exception ex)
        {
            Logger.Log("Util.WorkerTareas.ProcessTaskAsync" + "   " + subtipo + " - " + ex.Message + Environment.NewLine + ex.StackTrace);
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
}
