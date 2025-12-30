using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;

namespace capital.Code.Inte;

public class Avisor
{
    private static readonly string url_pdn = "https://www.e-collect.com/app_express/webservice/eCollectWebservicesv4.asmx?wsdl";
    private static readonly string url_test = "https://test1.e-collect.com/app_express/webservice/eCollectWebservicesv4.asmx?wsdl";
    private JObject? data;
    private static string rootPath = "";

    public static async Task<Avisor> GetInstance(string id_opcion, string rp)
    {
        if (string.IsNullOrEmpty(rootPath)) rootPath = rp;
        JObject? obj = [], JData = [];
        obj["id_opcion"] = id_opcion;
        JToken resData = await Generic.ProcessRequest(null, null, "genericDT", "ProcesoNegocio/Get_Avisor", JsonConvert.SerializeObject(obj), rootPath);
        if (resData != null)
        {
            var content = resData["data"];
            if (content is JArray arr && arr.Count > 0)
                JData = arr[0] as JObject;
            else if (content is JObject jobj)
                JData = jobj;
            else
                JData = null;
        }
        return new Avisor()
        {
            data = JData
        };
    }

    public async Task<string> GenerarLink()
    {
        string xml = $@"
            <soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ecol=""http://www.avisortech.com/eCollectWebservices"">
            <soapenv:Header/>
            <soapenv:Body>
                <ecol:createTransactionPayment>
                    <ecol:request>
                        <ecol:EntityCode>10497</ecol:EntityCode>
                        <ecol:SrvCode>{data?["SrvCode"]}</ecol:SrvCode>
                        <ecol:TransValue>{data?["TransValue"]}</ecol:TransValue>
                        <ecol:TransVatValue>0</ecol:TransVatValue>
                        <ecol:SrvCurrency>COP</ecol:SrvCurrency>
                        <ecol:URLRedirect>https://www.constructoracapital.com</ecol:URLRedirect>
                        <ecol:ReferenceArray>{data?["cedula"]}</ecol:ReferenceArray>
                        <ecol:ReferenceArray>{data?["textoReferenciaCupon"]}</ecol:ReferenceArray>
                        <ecol:ReferenceArray>{data?["ReferenceArray3"]}</ecol:ReferenceArray>
                        <ecol:ReferenceArray>{data?["tipo_doc"]}</ecol:ReferenceArray>
                        <ecol:ReferenceArray>{data?["nombreCompletoComprador"]}</ecol:ReferenceArray>
                        <ecol:ReferenceArray></ecol:ReferenceArray>
                        <ecol:ReferenceArray>{data?["email"]}</ecol:ReferenceArray>
                        <ecol:ReferenceArray>{data?["ean"]}</ecol:ReferenceArray>
                        <ecol:ReferenceArray>{data?["cuenta_tipo"]}</ecol:ReferenceArray>
                        <ecol:ReferenceArray>{data?["cuenta_numero"]}</ecol:ReferenceArray>
                        <ecol:ReferenceArray>{data?["convenio"]}</ecol:ReferenceArray>
                        <ecol:PaymentSystem></ecol:PaymentSystem>
                        <ecol:Invoice>{data?["Invoice"]}</ecol:Invoice>
                    </ecol:request>
                </ecol:createTransactionPayment>
            </soapenv:Body>
        </soapenv:Envelope>";
        Console.WriteLine(xml);
        HttpClient client = new();
        StringContent content = new(xml, Encoding.UTF8, "text/xml");
        HttpResponseMessage response = await client.PostAsync(url_pdn, content);
        string result = await response.Content.ReadAsStringAsync();
        Console.WriteLine(result);
        return result;
    }
}
