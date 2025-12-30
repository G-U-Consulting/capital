using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;
using orca.Code.Logger;

namespace capital.Code.Inte;

public class Stradata(string body, string id_opcion, string id_cliente, string rootPath)
{
    private static readonly string url = "https://sds.stradata.com.co/api/v3/buscador";
    private string body = body;
    private readonly string id_opcion = id_opcion;
    private readonly string id_cliente = id_cliente;
    public string rootPath = rootPath;

    public async Task Validate()
    {
        try
        {
            JObject? obj = (JObject?)JsonConvert.DeserializeObject(body);
            if (obj != null)
            {
                obj["min"] = 85;
                obj["Extra"] = 1;
                obj["format"] = "json";
                body = JsonConvert.SerializeObject(obj);
                using HttpClient client = new();
                var byteArray = Encoding.ASCII.GetBytes("ws.ccapital:l38QoWzRMX_XZ"); 
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
                HttpResponseMessage response = await client.PostAsync(url, new StringContent(body, Encoding.UTF8, "application/json"));
                string data = await response.Content.ReadAsStringAsync();
                await ProcessResults(data);
            }
        }
        catch (Exception ex)
        {
            Logger.Log("Inte.Stradata.Validate" + "   opcion: " + id_opcion + "    cliente: " + id_cliente + " - " +
                ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        }
    }
    private async Task ProcessResults(string data)
    {
        JObject? obj = (JObject?)JsonConvert.DeserializeObject(data);
        if (obj != null)
        {
            JArray results = (JArray?)obj.GetValue("resultados") ?? [];
            results = new(results.OfType<JObject>().Where(r => r["nivel_riesgo"]?.ToString() != "Ninguno"));
            if (results.Count > 0)
                await SaveLista(results.ToString());
        }
    }
    private async Task SaveLista(string resultados)
    {
        JObject obj = [];
        obj["id_cliente"] = id_cliente;
        obj["id_opcion"] = id_opcion;
        obj["resultados"] = resultados;
        await Generic.ProcessRequest(null, null, "genericST", "Clientes/Ins_ListaRestrictiva", JsonConvert.SerializeObject(obj), rootPath);
    }
}
