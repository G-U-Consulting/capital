using Azure.Core;
using Azure;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Security.Principal;
using System.IO.Compression;
using System.Text;
using Microsoft.AspNetCore.Html;
using DocumentFormat.OpenXml.InkML;
using System.Xml;
using System.Web;
using orca.Code.Api;

namespace orca.Code.Auth {
    public static class Auth {
        public static string? rootPath = null;
        public static async Task<string> ProcessRequest(HttpRequest request, HttpResponse response, string op, string body, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager) {
            response.ContentType = "application/json";
            string result = null;
            if (op == "getUserProfile") 
                result = (await GetUserProfile(request, response)).ToString();
            else if (op == "createUser") 
                result = (await CreateUser(JObject.Parse(body), userManager)).ToString();
            else if (op == "createUsers")
                result = (await CreateUsers(JArray.Parse(body), userManager)).ToString();
            else if (op == "login")
                result = (await Login(JObject.Parse(body), signInManager)).ToString();
            else if (op == "logout")
                result = (await Logout(request, response, signInManager)).ToString();
            else if (op == "getADRedirectPage")
                result = GetADRedirectPage(response);
            else if (op == "adlogin")
                result = await ADLoginCallback(response, signInManager, body);
            else if (op == "resetPassword")
                result = (await ResetPassword(JObject.Parse(body), userManager)).ToString();

            if (result == null) {
                response.StatusCode = 404;
                result = WebBDUt.NewBasicResponse(true, "op inválida").ToString() ;
            }
            return result;

        }
        public static string GetADRedirectPage(HttpResponse response) {
            String startUrl = "3db430f7-92dd-43b8-9a0f-3183287271a1";
            //Azure SAML endpoint. You need to get this from Azure
            String azureSamlUrl = "https://login.microsoftonline.com/"+ "362a3a1b-6a5b-4aa1-8e74-2edb90c6363a" + "/saml2";
            StringBuilder samlRequest = new StringBuilder();
            samlRequest.Append("<samlp:AuthnRequest ");
            samlRequest.Append("xmlns=\"urn:oasis:names:tc:SAML:2.0:metadata\" ");
            samlRequest.Append("ID=\"id" + Guid.NewGuid() + "\" ");
            samlRequest.Append("Version=\"2.0\" IssueInstant=\"" + DateTime.Now.ToString("yyyy-MM-dd'T'HH:mm:ss'Z'") + "\" ");
            samlRequest.Append("xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\"> ");
            samlRequest.Append("<Issuer xmlns=\"urn:oasis:names:tc:SAML:2.0:assertion\">" + startUrl + "</Issuer> ");
            samlRequest.Append("</samlp:AuthnRequest>");

            var bytes = Encoding.UTF8.GetBytes(samlRequest.ToString());
            string html = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head><title></title></head><body><form id=\"samlForm\" method=\"GET\" action={0}>Redireccionando ... <input name=\"SAMLRequest\" value=\"{1}\" type=\"hidden\"/></form><script>document.getElementById(\"samlForm\").submit();</script></body></html>";
            using (var msi = new MemoryStream(bytes)) {
                using (var mso = new MemoryStream()) {
                    using (var gs = new DeflateStream(mso, CompressionMode.Compress)) {
                        msi.CopyTo(gs);
                    }
                    String base64Request = Convert.ToBase64String(mso.ToArray());
                    html = string.Format(html, azureSamlUrl, base64Request);
                    //SAMLRequest.Value = base64Request;
                    //samlForm.Action = azureSamlUrl;
                }
            }
            response.ContentType = "text/html";
            return html;
        }
        public static async Task<string> ADLoginCallback(HttpResponse response, SignInManager<IdentityUser> signInManager, string bodyData) {
            string ret = "";
            if (bodyData != "" && bodyData != null)
                try {
                    bodyData = HttpUtility.UrlDecode(bodyData.Replace("SAMLResponse=", ""));
                    string xmlstring = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(bodyData));
                    XmlDocument xmldoc = new XmlDocument();
                    xmldoc.LoadXml(xmlstring);
                    bool encontrado = false;
                    foreach (XmlNode node in xmldoc.GetElementsByTagName("Attribute")) {
                        if (node.Attributes["Name"] != null && node.Attributes["Name"].Value == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name") {
                            string username = node.ChildNodes[0].InnerText;
                            ret = username;
                            IdentityUser iuser = signInManager.UserManager.Users.Where(user => user.UserName == username).FirstOrDefault();
                            if (iuser == null) {
                                ret = "Usuario no encontrado";
                            } else {
                                await signInManager.SignInAsync(iuser, true);
                                response.StatusCode = 302;
                                response.Headers.Location = "/";
                            }
                        }
                    }

                } catch (Exception ex) {
                    ret = "AzureResponse- " + ex.Message + Environment.NewLine + bodyData + Environment.NewLine + ex.StackTrace;
                }
            return ret;
        }
        public static async Task<JObject> GetUserProfile(HttpRequest request, HttpResponse response) {
            var user = request.HttpContext.User;
            if (user == null || !user.Identity.IsAuthenticated)
            {
                response.StatusCode = 401;
                return WebBDUt.NewBasicResponse(true, "El usuario no está autenticado");
            }
            JObject result = WebBDUt.NewBasicResponse(false, "");
            JObject tmp = new JObject();
            var res = await Generic.ProcessRequest(request, response, "genericDS", "Usuarios/Get_RolesUsuario", "{username:'" + user.Identity.Name + "'}", rootPath);
            tmp["user"] = user.Identity.Name;
            tmp["roles"] = res["data"]?[0];
            tmp["permisos"] = res["data"]?[1];
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
            JObject ret = WebBDUt.NewBasicResponse(true, "");
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
        public static async Task<JObject> ResetPassword(JObject data, UserManager<IdentityUser> userManager) {
            string? username = data["username"]?.Value<string>();
            string? newPassword = data["newPassword"]?.Value<string>();
            IdentityUser? iuser = userManager.Users.Where(user => user.UserName == username).FirstOrDefault();
            if (iuser != null && username != null && newPassword != null) {
                string token = await userManager.GeneratePasswordResetTokenAsync(iuser);
                IdentityResult ir = await userManager.ResetPasswordAsync(iuser, token, newPassword);
                if (ir.Succeeded)
                    return WebBDUt.NewBasicResponse(false, "OK");
                else 
                    return WebBDUt.NewBasicResponse(true, ir.Errors.First().Description);
            }
            return WebBDUt.NewBasicResponse(true, "Datos incorrectos");
        }
    }
}
