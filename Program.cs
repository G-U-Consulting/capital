using Azure.Core;
using Azure;
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
builder.Services.ConfigureApplicationCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromHours(12);
    options.SlidingExpiration = false;
    options.LoginPath = "/login.html";
});
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
app.Map("/util/Json2Excel", async (HttpRequest request, HttpResponse response) => {
    string body = "";
    try {
        response.ContentType = "application/json";
        using (var stream = new StreamReader(request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        return WebBDUt.SetJsonToFile(body).ToString(Newtonsoft.Json.Formatting.None);
    } catch (Exception ex) {
        Logger.Log("util/Json2Excel    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }

}).WithName("Json2Excel");
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
        if (ut == "Test")
            ret = (await Sinco.GetInstance(defaultDB).GetEmpresas()).ToString();
        if (ut == "Test2")
            ret = "OK";
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
        if (Auth.rootPath == null) Auth.rootPath = rootPath;
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
app.Map("/api/uploadfile/{path}", async (string path, IFormFile file, IWebHostEnvironment env) =>
{
    if (file == null || file.Length == 0)
        return Results.BadRequest(new { message = "No se encontró ningún archivo.", data = "Error" });
    path = Path.Combine(env.WebRootPath, "img", path);
    if (!Directory.Exists(path))
        Directory.CreateDirectory(path);
    string extension = Path.GetExtension(file.FileName);
    string fullPath = Path.Combine(path, file.FileName);
    using var stream = new FileStream(fullPath, FileMode.Create);
    await file.CopyToAsync(stream);
    return Results.Ok(new { message = "✅ ¡Archivo actualizado!", data = "OK" });
}).DisableAntiforgery();
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
app.Map("/file/upload", async (HttpContext context) => {
    var form = await context.Request.ReadFormAsync();
    var files = form.Files;
    string serverPath = "upload";
    string uploadsFolder = Path.Combine(rootPath, "wwwroot", serverPath);
    if (!Directory.Exists(uploadsFolder)) 
        Directory.CreateDirectory(uploadsFolder);
    JArray ret = new JArray();
    JObject tmp;
    foreach (var file in files) {
        tmp = new JObject();
        string serverName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        string filePath = Path.Combine(uploadsFolder, serverName);
        using (var stream = new FileStream(filePath, FileMode.Create)) {
            await file.CopyToAsync(stream);
        }
        tmp["fileName"] = file.FileName;
        tmp["serverName"] = serverName;
        tmp["serverPath"] = serverPath +"/" +serverName;
        ret.Add(tmp);
    }
    return WebBDUt.NewBasicResponse(false, ret).ToString();
});
app.Map("/file/S3upload", async (HttpContext context) => {
    string body = "";
    try {
        using (var stream = new StreamReader(context.Request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        JArray data = JArray.Parse(body);
        JArray result = new JArray();
        JObject tmp;
        S3HelperUploadResponse stmp;
        foreach (JObject item in data) {
            stmp = await S3Helper.GetInstance(rootPath, defaultDB)
                .UploadFile(Path.Combine(rootPath, "wwwroot", item["serverPath"].Value<string>()), item["fileName"].Value<string>(), false, context.User.Identity.Name, true);
            tmp = JObject.FromObject(stmp);
            tmp["FileName"] = item["fileName"];
            result.Add(tmp);
        }
        return WebBDUt.NewBasicResponse(false, result).ToString();
    } catch (Exception ex) {
        Logger.Log("file/S3upload/" + "    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        context.Response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }
}).RequireAuthorization();
app.Map("/file/S3get/{key}", async (HttpContext context, string key) => {
    string body = "";
    try {
        S3HelperDownloadResponse resp = await S3Helper.GetInstance(rootPath, defaultDB).DownloadFileByKey(key);
        if (!resp.Success) {
            Logger.Log("file/S3get/" + "   " + key + " - (RESP)" + resp.Message);
        }
        string path = resp.Path;
        resp.Path = Path.GetFileName(resp.Path);
        return Results.File(path, WebUt.GetContentType(Path.GetExtension(path)));
    } catch (Exception ex) {
        Logger.Log("file/S3get/" + "   "+ key + " - " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        context.Response.StatusCode = 500;
        return null;
    }
});
app.Map("/api/uploaddocs/{**folder}", async (string folder, HttpContext context, IWebHostEnvironment env) =>
{
    Dictionary<string, string> data = [];
    var form = await context.Request.ReadFormAsync();
    var files = form.Files;
    string path = Path.Combine(env.WebRootPath, folder);
    if (Directory.Exists(path))
        Directory.Delete(path, true);
    Directory.CreateDirectory(path);
    foreach (IFormFile file in files)
    {
        if (file == null || file.Length == 0)
            return Results.BadRequest(new { message = "No se encontró ningún archivo.", data = "Error" });
        string extension = Path.GetExtension(file.FileName);
        var fileName = Guid.NewGuid() + extension;
        string fullPath = Path.Combine(path, fileName);
        data.Add(file.FileName, fileName);
        using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);
    }
    return Results.Ok(new { message = "✅ ¡Archivos actualizados!", data });
}).DisableAntiforgery();
app.Run();
