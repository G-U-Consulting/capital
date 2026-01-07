using System.Text;
using System.Xml.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;

namespace capital.Code.Inte;

public class Avisor
{
    private static readonly Dictionary<string, string> options = new()
    {
        [""] = "enviar",
        ["10"] = "descargar",
    };
    private static readonly string url_pdn = "https://www.e-collect.com/app_express/webservice/eCollectWebservicesv4.asmx?wsdl";
    private static readonly string url_test = "https://test1.e-collect.com/app_express/webservice/eCollectWebservicesv4.asmx?wsdl";
    private JArray data = [];
    private static string rootPath = "";
    private string? id_cupon;
    private string? opt;
    private string? usuario;

    public static async Task<Avisor> GetInstance(JObject obj, string rp)
    {
        string? usuario = obj["usuario"]?.ToString();
        if (string.IsNullOrWhiteSpace(usuario)) throw new ArgumentException("No se envió el usuario");
        if (string.IsNullOrEmpty(rootPath)) rootPath = rp;
        JArray JData = [];
        JToken resData = await Generic.ProcessRequest(null, null, "genericDT", "ProcesoNegocio/Get_Avisor", JsonConvert.SerializeObject(obj), rootPath);
        if (resData != null)
        {
            var content = resData["data"];
            if (content is JArray arr && arr.Count > 0)
                JData = arr;
        }
        return new Avisor() 
        { 
            data = JData, 
            id_cupon = obj["id_cupon"]?.ToString(), 
            opt = obj["opt"]?.ToString() ?? "", 
            usuario = usuario
        };
    }

    public async Task<string> GetLinks()
    {
        JObject cupon = (JObject)data[0];
        string xml = $@"
            <soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ecol=""http://www.avisortech.com/eCollectWebservices"">
                <soapenv:Header/>
                <soapenv:Body>
                    <ecol:createTransactionPayment>
                        <ecol:request>
                            <ecol:EntityCode>10497</ecol:EntityCode>
                            <ecol:SrvCode>{cupon["convenio"]}</ecol:SrvCode>
                            <ecol:TransValue>{cupon["TransValue"]}</ecol:TransValue>
                            <ecol:TransVatValue>0</ecol:TransVatValue>
                            <ecol:SrvCurrency>COP</ecol:SrvCurrency>
                            <ecol:URLRedirect>https://www.constructoracapital.com</ecol:URLRedirect>
                            <ecol:ReferenceArray>{cupon["cedula"]}</ecol:ReferenceArray>
                            <ecol:ReferenceArray>{cupon["textoReferenciaCupon"]}</ecol:ReferenceArray>
                            <ecol:ReferenceArray>{cupon["ReferenceArray3"]}</ecol:ReferenceArray>
                            <ecol:ReferenceArray>{cupon["tipo_doc"]}</ecol:ReferenceArray>
                            <ecol:ReferenceArray>{cupon["nombreCompletoComprador"]}</ecol:ReferenceArray>
                            <ecol:ReferenceArray></ecol:ReferenceArray>
                            <ecol:ReferenceArray>{cupon["email"]}</ecol:ReferenceArray>
                            <ecol:ReferenceArray>{cupon["ean"]}</ecol:ReferenceArray>
                            <ecol:ReferenceArray>{cupon["cuenta_tipo"]}</ecol:ReferenceArray>
                            <ecol:ReferenceArray>{cupon["cuenta_numero"]}</ecol:ReferenceArray>
                            <ecol:ReferenceArray>{cupon["convenio"]}</ecol:ReferenceArray>
                            <ecol:PaymentSystem>{opt}</ecol:PaymentSystem>
                            <ecol:Invoice>{cupon["Invoice"]}</ecol:Invoice>
                        </ecol:request>
                    </ecol:createTransactionPayment>
                </soapenv:Body>
            </soapenv:Envelope>";
        Console.WriteLine(xml);
        HttpClient client = new();
        StringContent content = new(xml, Encoding.UTF8, "text/xml");
        HttpResponseMessage response = await client.PostAsync(url_pdn, content);
        string soapResponse = await response.Content.ReadAsStringAsync();

        Console.WriteLine("Response avisor: \n" + soapResponse);
        XDocument xdoc = XDocument.Parse(soapResponse);
        XNamespace ns = "http://www.avisortech.com/eCollectWebservices";
        var result = xdoc.Descendants(ns + "createTransactionPaymentResult").FirstOrDefault();

        string Response = "OK-";
        if (result != null)
        {
            string? returnCode = result.Element(ns + "ReturnCode")?.Value;
            if (returnCode == "SUCCESS")
            {
                Response += result.Element(ns + "eCollectUrl")?.Value;
                JObject res = new()
                {
                    ["id_cupon"] = id_cupon,
                    [$"ticket_id_{options.GetValueOrDefault(opt ?? "", "enviar")}"] = result.Element(ns + "TicketId")?.Value,
                    [$"ecollect_url_{options.GetValueOrDefault(opt ?? "", "enviar")}"] = Response[3..],
                    ["usuario"] = usuario
                };
                await Generic.ProcessRequest(null, null, "genericST", "ProcesoNegocio/Upd_Avisor", JsonConvert.SerializeObject(res), rootPath);
            }
            else Response = returnCode ?? "No hubo respuesta de Avisor";
        }
        else Response = "No hubo respuesta de Avisor";
        return Response;
    }
}
