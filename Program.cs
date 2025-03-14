using Newtonsoft.Json.Linq;
using orca.Code.Api;
using orca.Code.Auth;
using orca.Code.Crypto;
using orca.Code.Logger;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()){
    app.MapOpenApi();
}
app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions() {
    OnPrepareResponse = (context) => {
        if (context.File.Name.EndsWith(".html") || context.File.Name.EndsWith(".js")) {
            context.Context.Response.Headers["Cache-Control"] = "no-cache, no-store";
            context.Context.Response.Headers["Pragma"] = "no-cache";
            context.Context.Response.Headers["Expires"] = "-1";
        }
        if (false) { 
            context.Context.Response.Clear();
            context.Context.Response.Body = new MemoryStream();
            context.Context.Response.StatusCode = 403;
        }
    }
});

/*****************************************************************************/
/***************************** Constantes ************************************/
/*****************************************************************************/
string rootPath = builder.Environment.ContentRootPath;
Logger.Init(rootPath);
Logger.Log("INIT");
WebBDUt.Init(rootPath, !app.Environment.IsDevelopment(), orca.ConfigurationManager.AppSetting["DefaultDB"]);
/*****************************************************************************/
/***************************** Servicios *************************************/
/*****************************************************************************/
app.Map("/crypto/{op}", async (HttpRequest request, HttpResponse response, string op) => {
    string body = "";
    try {
        op = op.ToLower();
        string? token = request.Headers.Authorization;
        if (token != "Bearer l4e2wNsc7nWNvoPL2C1xzkxcZv1ks3LPJtG56Y61bSEv6h6XHWk66H6T2iCGmm43") {
            response.StatusCode = 401;
            return "";
        }
        using (var stream = new StreamReader(request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        return Crypto.ProcessRequest(request, response, op, body, rootPath);
    } catch (Exception ex) {
        Logger.Log("crypto/"+op +"    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }
    
}).WithName("Crypto");
app.Map("/api/{op}", async (HttpRequest request, HttpResponse response, string op) => {
    string body = "";
    try {
        op = op.ToLower();
        string? token = request.Headers.Authorization;
        if (token != "Bearer l4e2wNsc7nWNvoPL2C1xzkxcZv1ks3LPJtG56Y61bSEv6h6XHWk66H6T2iCGmm43") {
            response.StatusCode = 401;
            return "";
        }
        using (var stream = new StreamReader(request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        return await Api.ProcessRequest(request, response, op, body, rootPath);
    } catch (Exception ex) {
        Logger.Log("api/" + op + "    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }

}).WithName("Api");

app.Map("/generic/{op}/{sp}", async (HttpRequest request, HttpResponse response, string op, string sp) => {
    string body = "";
    try {
        response.ContentType = "application/json";
        using (var stream = new StreamReader(request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        sp = sp.Replace(':', '/');
        return (await Generic.ProcessRequest(request, response, op, sp, body, rootPath)).ToString(Newtonsoft.Json.Formatting.None);
    } catch (Exception ex) {
        Logger.Log("generic/" + op + "    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }

}).WithName("Generic");
app.Map("/auth/{op}", async (HttpRequest request, HttpResponse response, string op) => {
    string body = "";
    try {
        response.ContentType = "application/json";
        return Auth.ProcessRequest(request, response, op, body).ToString(Newtonsoft.Json.Formatting.None);
    } catch (Exception ex) {
        Logger.Log("generic/" + op + "    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }

}).WithName("Auth");
app.Map("/test/{op}", async (HttpRequest request, HttpResponse response, string op) => {
    string body = "";
    try {
        op = op.ToLower();
        if (op == "last")
            return Logger.LastError;
        string? token = request.Headers.Authorization;
        if (token != "Bearer l4e2wNsc7nWNvoPL2C1xzkxcZv1ks3LPJtG56Y61bSEv6h6XHWk66H6T2iCGmm43") {
            response.StatusCode = 401;
            return "";
        }
        using (var stream = new StreamReader(request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        if (op == "getclient") {
            response.ContentType = "application/json";
            return Api.GetClient(JObject.Parse(body)).ToString();
        }
        return Crypto.ProcessRequest(request, response, op, body, rootPath);
    } catch (Exception ex) {
        Logger.Log("test/" + op + "    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message;
    }
}).WithName("Test");
/*****************************************************************************/
/***************************** Autenticacion *********************************/
/*****************************************************************************/

app.Run();
