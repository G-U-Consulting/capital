using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using orca.Code.Api;

namespace orca.Code.Auth {
    public static class Auth {
        public async static Task<JObject> ProcessRequest(HttpRequest request, HttpResponse response, string op, string body) {
            return await ProcessRequest(request, response, op, body, null);
        }
        public async static Task<JObject> ProcessRequest(HttpRequest request, HttpResponse response, string op, string body, string? rootPath) {
            response.ContentType = "application/json";
            JObject result = null, jbody;
            if (op == "getUserProfile") {
                result = GetUserProfile(null);
            }
            if (op == "resetPassword" && rootPath != null)
                result = await ResetPassword(request, response, rootPath);
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
        public async static Task<JObject> ResetPassword(HttpRequest request, HttpResponse response, string rootPath) { 
            JObject result = WebBDUt.NewBasicResponse(false, null);
            using (var reader = new StreamReader(request.Body))
            {
                string body = await reader.ReadToEndAsync();
                /*var manager = request.HttpContext.RequestServices.GetService<UserManager<IdentityUser>>();
                if (manager == null)
                {
                    throw new InvalidOperationException("UserManager<IdentityUser> service is not available.");
                }
                IdentityUser? user = manager.Users.Where(u => u.UserName == "").FirstOrDefault();*/
                result = (JObject) await Generic.ProcessRequest(request,response,"genericST","Seguridad/Upd_AspUsers", body, rootPath);;
            }
            return result;
        }
    }
}
