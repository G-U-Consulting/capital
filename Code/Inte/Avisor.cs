using System.Text;
using System.Xml.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;

namespace capital.Code.Inte;

public class Avisor
{
    private static readonly string url_pdn = "https://www.e-collect.com/app_express/webservice/eCollectWebservicesv4.asmx?wsdl";
    private static readonly string url_test = "https://test1.e-collect.com/app_express/webservice/eCollectWebservicesv4.asmx?wsdl";
    private JArray data = [];
    private static string rootPath = "";

    public static async Task<Avisor> GetInstance(JObject obj, string rp)
    {
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
            data = JData
        };
    }

    public async Task<string> GetLinks()
    {
        JArray cupones = [];
        foreach (JObject cupon in data.Cast<JObject>())
        {
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
                            <ecol:PaymentSystem></ecol:PaymentSystem>
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

            JObject res = [];
            if (result != null)
            {
                string? returnCode = result.Element(ns + "ReturnCode")?.Value;
                res["Invoice"] = cupon["Invoice"]?.ToString();
                res["unidad"] = cupon["unidad"]?.ToString();
                if (returnCode == "SUCCESS")
                {
                    res["isError"] = false;
                    res["ticketId"] = result.Element(ns + "TicketId")?.Value;
                    res["eCollectUrl"] = result.Element(ns + "eCollectUrl")?.Value;
                }
                else {
                    res["isError"] = true;
                    res["errorMessage"] = returnCode;
                }
            }
            cupones.Add(res);
        }

        return JsonConvert.SerializeObject(cupones);
    }
}
