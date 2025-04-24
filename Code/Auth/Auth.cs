using Azure.Core;
using Azure;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Security.Principal;

namespace orca.Code.Auth {
    public static class Auth {
        public static async Task<JObject> ProcessRequest(HttpRequest request, HttpResponse response, string op, string body, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager) {
            response.ContentType = "application/json";
            JObject result = null;
            if (op == "getUserProfile") 
                result = GetUserProfile(request, response);
            else if (op == "createUser") 
                result = await CreateUser(JObject.Parse(body), userManager);
            else if (op == "createUsers")
                result = await CreateUsers(JArray.Parse(body), userManager);
            else if (op == "login")
                result = await Login(JObject.Parse(body), signInManager);
            else if (op == "logout")
                result = await Logout(request, response, signInManager);

            if (result == null) {
                response.StatusCode = 404;
                result = WebBDUt.NewBasicResponse(true, "op inválida");
            }
            return result;

        }
        public static JObject GetUserProfile(HttpRequest request, HttpResponse response) {
            var user = request.HttpContext.User;
            if(user == null || !user.Identity.IsAuthenticated) {
                response.StatusCode = 401;
                return WebBDUt.NewBasicResponse(true, "El usuario no está autenticado");
            }
            JObject result = WebBDUt.NewBasicResponse(false, null);
            JObject tmp = new JObject();
            tmp["user"] = "administrador";
            tmp["roles"] = new JArray();
            tmp["debug"] = true;
            result[WebBDUt.DATA] = tmp;
            return result;
        }
        public static async Task<JObject> Login(JObject data, SignInManager<IdentityUser> signInManager) {
            string username = data["username"].Value<string>();
            IdentityUser iuser = signInManager.UserManager.Users.Where(user => user.UserName == username).FirstOrDefault();
            if(iuser != null) { 
                SignInResult sr = await signInManager.PasswordSignInAsync(iuser, data["password"].Value<string>(), true, false  );
                if (sr.Succeeded)
                    return WebBDUt.NewBasicResponse(false, "OK");
                else 
                    return WebBDUt.NewBasicResponse(true, "Datos incorrectos");
            }
            return WebBDUt.NewBasicResponse(true, "El usuario no existe");
        }
        public static async Task<JObject> Logout(HttpRequest request, HttpResponse response, SignInManager<IdentityUser> signInManager) {
            var user = request.HttpContext.User;
            if (user == null || !user.Identity.IsAuthenticated) {
                response.StatusCode = 401;
                return WebBDUt.NewBasicResponse(true, "El usuario no está autenticado");
            }
            await signInManager.SignOutAsync();
            return WebBDUt.NewBasicResponse(false, "OK");
        }
        public static async Task<JObject> CreateUsers(JArray data, UserManager<IdentityUser> userManager) {
            JArray resp = new JArray();
            JObject tmp;
            foreach (JObject item in data) {
                tmp = await CreateUser(item, userManager);
                resp.Add(tmp);
            }
            JObject ret = WebBDUt.NewBasicResponse(true, null);
            ret[WebBDUt.DATA] = resp;
            return ret;
        }
        public static async Task<JObject> CreateUser(JObject data, UserManager<IdentityUser> userManager) {
            string username = data["username"].Value<string>();
            IdentityUser iuser = userManager.Users.Where(user => user.UserName == username).FirstOrDefault();
            if (iuser == null) {
                iuser = new IdentityUser(username);
                IdentityResult ir = await userManager.CreateAsync(iuser, data["password"].Value<string>());
                if (ir.Succeeded)
                    return WebBDUt.NewBasicResponse(false, "OK");
                else 
                    return WebBDUt.NewBasicResponse(true, ir.Errors.First().Description);
            }

            return WebBDUt.NewBasicResponse(true, "El usuario ya existe");
        }
    }
}
