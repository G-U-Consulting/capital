using capital.Code.Inte;
using capital.Code.Util;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using orca.Code.Api;
using orca.Code.Auth;
using orca.Code.Logger;
using System.Data;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();
builder.Services.AddDbContext<AuthDBContext>();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<AuthDBContext>();
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()){
    app.MapOpenApi();
}
app.MapIdentityApi<IdentityUser>();
app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions() {
    OnPrepareResponse = (context) => {
        string fileName = context.File.Name.ToLower();
        string filePath = (context.File.PhysicalPath??"").ToLower();
        if (filePath.Contains("/web/") || filePath.Contains("\\web\\")) {
            context.Context.Response.Headers["Cache-Control"] = "no-cache, no-store";
            context.Context.Response.Headers["Pragma"] = "no-cache";
            context.Context.Response.Headers["Expires"] = "-1";
        }
        if (filePath.Contains("/css/") || filePath.Contains("/js/") || filePath.Contains("/img/") ||
            filePath.Contains("\\css\\") || filePath.Contains("\\js\\") || filePath.Contains("\\img\\") ||
            fileName == "login.html" || fileName == "login.js")
            return;
        if (fileName != "login.html" && !(context.Context.User?.Identity?.IsAuthenticated ?? false)) {
            context.Context.Response.Clear();
            context.Context.Response.Body = new MemoryStream();
            context.Context.Response.StatusCode = 302;
            context.Context.Response.Headers.Location = "/login.html";
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
string defaultDB = WebBDUt.GetConnectionStringByName(orca.ConfigurationManager.AppSetting["DefaultDB"]);
/*****************************************************************************/
/***************************** Servicios *************************************/
/*****************************************************************************/
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

}).WithName("Generic").RequireAuthorization();
app.Map("/util/{ut}", async (HttpRequest request, HttpResponse response, string ut) => {
    string body = "";
    try {
        response.ContentType = "application/json";
        using (var stream = new StreamReader(request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        string ret = "";
        if(ut == "ExcelFormater")
            ret = ExcelFormater.Format(JObject.Parse(body), rootPath);
        if (ut == "Presentacion")
            ret = (await WebBDUt.ExecuteLocalSQLJson<DataSet>("Presentacion/Get_Presentacion", new JObject())).ToString();
        return ret;
    } catch (Exception ex) {
        Logger.Log("util/" + ut + "    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }

}).WithName("Util");
/*****************************************************************************/
/***************************** Autenticacion *********************************/
/*****************************************************************************/
app.Map("/auth/{op}", async (HttpRequest request, HttpResponse response, string op, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager) => {
    string body = "";
    try {
        response.ContentType = "application/json";
        using (var stream = new StreamReader(request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        return await Auth.ProcessRequest(request, response, op, body, userManager, signInManager);
    } catch (Exception ex) {
        Logger.Log("auth/" + op + "    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }

}).WithName("Auth");
/*****************************************************************************/
/***************************** API  ******************************************/
/*****************************************************************************/
app.Map("/api/upload", async (HttpContext context, IWebHostEnvironment env) =>
{
    var form = await context.Request.ReadFormAsync();
    var files = form.Files;
    var uploadsFolder = Path.Combine(env.WebRootPath, "img", "carrusel");

    if (!Directory.Exists(uploadsFolder))
    {
        Directory.CreateDirectory(uploadsFolder);
    }
    foreach (var file in Directory.GetFiles(uploadsFolder))
    {
        File.Delete(file);
    }
    string connectionString = WebBDUt.DefaultDBConnetionString;
    await WebBDUt.ExecuteLocalSQLJson<DataSet>("Presentacion/Del_Presentacion", new JObject(), connectionString);
    int orden = 0;
    foreach (var file in files)
    {
        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{orden:D2}_{Guid.NewGuid().ToString().Substring(0, 6)}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
        await WebBDUt.ExecuteLocalSQLJson<DataSet>("Presentacion/Ins_Presentacion", new JObject { ["nombre_archivo"] = fileName, ["orden"] = orden }, connectionString);
        orden++;
    }
    return Results.Ok(new { message = "✅ ¡Imágenes actualizadas!" });
});
app.Map("/api/internal/{op}", async (HttpRequest request, HttpResponse response, string op) => {
    string body = "";
    try {
        response.ContentType = "application/json";
        using (var stream = new StreamReader(request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        return await Api.ProcessRequest(request, response, op, body, defaultDB, rootPath);
    } catch (Exception ex) {
        Logger.Log("api/internal/" + op + "\t" + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message;
    }

}).WithName("ApiInternal");
app.Run();

