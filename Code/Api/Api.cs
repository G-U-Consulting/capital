//namespace experiann.Code {
using Newtonsoft.Json.Linq;
using System.Data;
namespace orca.Code.Api {
    public static class Api {
        public static async Task<string> ProcessRequest(HttpRequest request, HttpResponse response, string op, string body, string rootPath) {
            response.ContentType = "application/json";
            JObject result = new JObject(), jbody;

            return result.ToString(Newtonsoft.Json.Formatting.None);

        }
    }
}
