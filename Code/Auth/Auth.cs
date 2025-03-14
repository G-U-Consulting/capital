using Newtonsoft.Json.Linq;

namespace orca.Code.Auth {
    public static class Auth {
        public static JObject ProcessRequest(HttpRequest request, HttpResponse response, string op, string body) {
            response.ContentType = "application/json";
            JObject result = null, jbody;
            if (op == "getUserProfile") {
                result = GetUserProfile(null);
            }
            if (result == null) {
                response.StatusCode = 404;
                result = WebBDUt.NewBasicResponse(true, "op inválida");
            }
            return result;

        }
        public static JObject GetUserProfile(string cookie) { 
            JObject result = WebBDUt.NewBasicResponse(false, null);
            JObject tmp = new JObject();
            tmp["user"] = "administrador";
            tmp["roles"] = new JArray();
            tmp["debug"] = true;
            result[WebBDUt.DATA] = tmp;
            return result;
        }
    }
}
