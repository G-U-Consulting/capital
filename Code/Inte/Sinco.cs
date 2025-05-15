using ClosedXML.Excel;
using Newtonsoft.Json.Linq;

namespace capital.Code.Inte {
    public class Sinco {
        private DateTime LiveUntil = DateTime.Now;
        private static Sinco Instance;
        private string  ConnectionString, Url,
            AutToken1, AutToken2;
        public Sinco(string connectionString) {
            ConnectionString = connectionString;
        }
        public static Sinco GetInstance(string connectionString) {
            if (Instance == null)
                Instance = new Sinco(connectionString);
            return Instance;
        }
        public async Task UpdToken() {
            if (Url == null || AutToken1 == null || LiveUntil < DateTime.Now) {
                string sdata = await WebBDUt.ExecuteLocalSQL<string>("General/Get_Variable", ["@nombre_variable"], ["DatosSinco"], ConnectionString);
                JObject jdata = JObject.Parse(sdata);
                Url =  jdata["Url"].Value<string>();
                JObject pdata = new JObject();
                pdata["NomUsuario"] = jdata["NomUsuario"].Value<string>();
                pdata["ClaveUsuario"] = jdata["ClaveUsuario"].Value<string>();
                Dictionary<string, string> headers = new Dictionary<string, string>();
                //headers.Add("User-Agent", "PostmanRuntime/7.43.4");
                sdata = await WebUt.WebRequest(Url + "V3/API/Auth/Usuario", HttpMethod.Post, pdata.ToString(), "application/json", headers);
                jdata = JObject.Parse(sdata);
                LiveUntil = DateTime.Now.AddSeconds(jdata["expires_in"].Value<int>() - 60);
                AutToken1 = "Bearer " + jdata["access_token"];
            }
        }
        public async Task<JArray> GetEmpresas() {
            await UpdToken();
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("Authorization", AutToken1);
            string sdata = await WebUt.WebRequest(Url + "V3/API/Cliente/Empresas", HttpMethod.Get, null, null, headers);
            JArray jdata = JArray.Parse(sdata);
            return jdata;
        }
        public async Task<JObject> GetTokenEmpresa(JObject data) {
            string url = string.Format("V3/API/Auth/Sesion/Iniciar/{0}/Empresa/{1}/Sucursal/{2}",
                data["IdOrigen"].Value<string>(), data["IdEmpresa"].Value<string>(), data["Sucursal"].Value<string>());
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("Authorization", AutToken1);
            string sdata = await WebUt.WebRequest(Url + url, HttpMethod.Get, null, null, headers);
            JObject jdata = JObject.Parse(sdata);
            AutToken2 = "Bearer " + jdata["token"]["access_token"].Value<string>();
            return jdata;
        }
        public async Task<JArray> GetMacroproyectos(JObject data) {
            if (!data.ContainsKey("Sucursal"))
                data["Sucursal"] = "0";
            await GetTokenEmpresa(data);
            string url = string.Format("V3/CBRClientes/API/Macroproyectos/Basica");
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("Authorization", AutToken2);
            string sdata = await WebUt.WebRequest(Url + url, HttpMethod.Get, null, null, headers);
            JArray jdata = JArray.Parse(sdata);
            return jdata;
        }
        public async Task<JArray> GetProyectos(JObject data) {
            string url = string.Format("V3/CBRClientes/API/Proyectos/{0}",
                data["id"].Value<string>());
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("Authorization", AutToken2);
            string sdata = await WebUt.WebRequest(Url + url, HttpMethod.Get, null, null, headers);
            JArray jdata = JArray.Parse(sdata);
            return jdata;
        }
        public async Task<JArray> GetAgrupaciones(JObject data) {
            string url = string.Format("V3/CBRClientes/API/Agrupaciones/IdProyecto/{0}",
                data["id"].Value<string>());
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("Authorization", AutToken2);
            string sdata = await WebUt.WebRequest(Url + url, HttpMethod.Get, null, null, headers);
            JArray jdata = JArray.Parse(sdata);
            return jdata;
        }
    }
}
