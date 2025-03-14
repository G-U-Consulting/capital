//namespace experiann.Code {
using Newtonsoft.Json.Linq;
using System.Data;
namespace orca.Code.Api {
    public static class Api {
        public static async Task<string> ProcessRequest(HttpRequest request, HttpResponse response, string op, string body, string rootPath) {
            response.ContentType = "application/json";
            JObject result = new JObject(), jbody;
            if (op == "getclient") {
                string ekey = request.Headers["aes_key"].FirstOrDefault() ?? "";
                string key = Crypto.Crypto.RSADecrypt(ekey, rootPath);
                body = Crypto.Crypto.AESDecrypt(key, body);
                jbody = JObject.Parse(body);
                if (!jbody.ContainsKey("tipoDocumento") || !jbody.ContainsKey("documento")) {
                    result[WebBDUt.ISERROR] = true;
                    result[WebBDUt.DATA] = "";
                    result[WebBDUt.ERRORMESSAGE] = "Estructura inválida";
                    response.StatusCode = 400;
                } else {
                    result = await GetClient(jbody);
                    return Crypto.Crypto.AESEncrypt(key, result.ToString(Newtonsoft.Json.Formatting.None));
                }
            }
            return result.ToString(Newtonsoft.Json.Formatting.None);

        }
        public static async Task<JObject> GetClient(JObject jbody) {
            string cnstring = WebBDUt.GetConnectionStringByName("SERLEFIN");
            DataTable dt = await WebBDUt.ExecuteLocalSQL<DataTable>("Api/Get_Client", new string[]{
                "@Tipo_Documento",
                "@Documento"
            }, new object[] {
                jbody["tipoDocumento"].Value<string>(),
                jbody["documento"].Value<string>()
            }, cnstring);
            JObject ret = new JObject();
            ret["esError"] = true;
            ret["mensaje"] = "OK";
            JArray obl = WebBDUt.tableToJObject(dt);
            foreach (JObject item in obl) {
                item["idObligacion"] = long.Parse(item["idObligacion"].Value<string>());
                item["fuenteCartera"] = int.Parse(item["idObligacion"].Value<string>());
                item["diasMora"] = int.Parse(item["idObligacion"].Value<string>());
                item["saldoTotal"] = double.Parse(item["saldoTotal"].Value<string>());
                item["saldoCapital"] = double.Parse(item["idObligacion"].Value<string>());
                item["negociaciones"] = new JArray();
                item["compromisoPago"] = null;
            }
            ret["obligaciones"] = obl;
            return ret;
        }
    }
}
