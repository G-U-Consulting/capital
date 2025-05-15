using capital.Code.Inte;
using Newtonsoft.Json.Linq;

namespace capital.Code.Api {
    public class FileHelper {
        public static async Task<string> ProcessRequest(HttpRequest request, HttpResponse response, string op, string body, string connectionString, string rootPath) {
            response.ContentType = "application/json";
            JContainer result = new JObject();
            if (op == "save")
                result = await Sinco.GetInstance(connectionString).GetEmpresas();
            else if (op == "SincoGetMacroproyectos")
                result = await Sinco.GetInstance(connectionString).GetMacroproyectos(JObject.Parse(body));
            else if (op == "SincoGetProyectos")
                result = await Sinco.GetInstance(connectionString).GetProyectos(JObject.Parse(body));
            else if (op == "SincoGetAgrupaciones")
                result = await Sinco.GetInstance(connectionString).GetAgrupaciones(JObject.Parse(body));
            return result.ToString(Newtonsoft.Json.Formatting.None);
        }
    }
}
