using System;
using capital.Code.Inte.Salesforce;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;
namespace capital.code.Util;
public class WorkerTareas(string rootPath) : BackgroundService
{
    private readonly string rootPath = rootPath;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {

            JToken? resData = (await Generic.ProcessRequest(null, null, "genericDT", "General/Get_ColaTareas", "{}", rootPath))["data"];
            if (resData != null)
            {
                foreach (JObject obj in resData.Children<JObject>())
                {
                    if (obj["tipo"]?.ToString() is string tipo && tipo == "salesforce"
                        && obj["sub_tipo"]?.ToString() is string subtipo
                        && obj["datos"]?.ToString() is string datos)
                    {
                        obj["resultado"] = await SendSalesforce(subtipo, datos);
                        obj["is_active"] = "0";
                        Console.WriteLine(JsonConvert.SerializeObject(obj));
                        var r = await Generic.ProcessRequest(null, null, "genericST", "General/Upd_ColaTareas", JsonConvert.SerializeObject(obj), rootPath);
                    }
                }
            }
            await Task.Delay(20000, stoppingToken);
        }
    }

    private async Task<string> SendSalesforce(string subtipo, string datos)
    {
        string sql = "integraciones/Get_" + subtipo;
        JToken? res = new JObject();
        string resultado;
        try
        {
            if (subtipo.Equals("VisitaSF", StringComparison.CurrentCultureIgnoreCase))
                res = await (await Salesforce<Visita>.CreateAsync(sql, datos).LoadData(rootPath)).Send();
            if (subtipo.Equals("CotizacionSF", StringComparison.CurrentCultureIgnoreCase))
                res = await (await Salesforce<Cotizacion>.CreateAsync(sql, datos).LoadData(rootPath)).Send();
            if (subtipo.Equals("ListaEsperaSF", StringComparison.CurrentCultureIgnoreCase))
                res = await (await Salesforce<ListaEspera>.CreateAsync(sql, datos).LoadData(rootPath)).Send();
            resultado = JsonConvert.SerializeObject(res);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            resultado = e.Message;
        }
        return resultado[..Math.Min(100, resultado.Length)];
    }
}
