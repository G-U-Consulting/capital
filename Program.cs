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
using Microsoft.AspNetCore.DataProtection;
using System.Text.RegularExpressions;
using capital.Code.Inte.Salesforce;
using capital.code.Util;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using capital.Code.Inte.Davivienda;

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
builder.Services.AddDataProtection()
        .PersistKeysToDbContext<AuthDBContext>()
        .SetApplicationName("Capital");
//builder.Services.AddSingleton(sp => new WorkerTareas(builder.Environment.ContentRootPath));
//builder.Services.AddHostedService(sp => sp.GetRequiredService<WorkerTareas>());

var app = builder.Build();
/*
 * Add-Migration AddDataProtectionKeysTable
 * Update-Database
 */
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
app.Map("/util/reports/{view}/{type?}", async (HttpRequest request, HttpResponse response, string view, string? type) => {
    bool isCsv = type == "csv";
    try
    {
        response.ContentType = isCsv ? "text/csv" : "application/json";
        JObject obj = [];
        obj.Add("view", view);
        string pars = obj.ToString();
        string json;
        JObject jres = (JObject)await Generic.ProcessRequest(request, response, "genericDT", "Dashboard/Get_Dashboard", pars, rootPath);
        if (jres["isError"] != null && (bool)jres["isError"])
            throw new Exception(jres["errorMessage"]?.ToString() ?? jres["data"]?.ToString());
        else json = jres["data"]?.ToString() ?? "[]";
        if (isCsv)
        {
            DataTable? dt = Newtonsoft.Json.JsonConvert.DeserializeObject<DataTable>(json);
            return WebBDUt.ToCsv(dt);
        }
        else return json;
    }
    catch (Exception ex)
    {
        Logger.Log("generic/reports/Dashboard/Get_Dashboard" + "    " + ex.Message + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }

}).WithName("Reports").RequireAuthorization();
app.Map("/util/Json2File/{type}/{filename?}", async (HttpRequest request, HttpResponse response, string type, string? filename) => {
    string body = "";
    try {
        response.ContentType = "application/json";
        using (var stream = new StreamReader(request.Body)) {
            body = await stream.ReadToEndAsync();
        }
        return WebBDUt.SetJsonToFile(body, type == "csv", filename).ToString(Newtonsoft.Json.Formatting.None);
    } catch (Exception ex) {
        Logger.Log("util/Json2File    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }

}).WithName("Json2File");
app.Map("/util/ImportFiles/{op}/{sp}/{pars}", async (HttpContext context, HttpResponse response, HttpRequest request, string op, string sp, string pars) => {
    var errorList = new JArray();
    try {
        response.ContentType = "application/json";
        JArray files = await WebBDUt.FileUpload(context, rootPath);
        string json = string.Empty;
        sp = sp.Replace(':', '/');
        for (int x = 0; x < files.Count; x++)
        {
            JObject obj = (JObject)files[x];
            string path = Path.Combine(rootPath, "wwwroot", obj.GetValue("serverPath")?.ToString());
            json = obj.GetValue("fileName")?.ToString().EndsWith(".csv") ?? false
                ? WebBDUt.CsvToJson(path)
                : WebBDUt.ExcelToJson(path);
            if (File.Exists(path)) File.Delete(path);
            if (string.IsNullOrEmpty(json))
            {
                response.StatusCode = 500;
                return WebBDUt.NewBasicResponse(true, "Error processing file: " + obj.GetValue("fileName")?.ToString()).ToString(Formatting.None);
            }
            else
            {
                JArray table = [], fileErrors = [];
                if (obj.GetValue("fileName")?.ToString().EndsWith(".xlsx") ?? false)
                {
                    JObject jsonObj = JObject.Parse(json);
                    table = (JArray?)jsonObj["Table1"] ?? [];
                }
                else table = JArray.Parse(json);
                
                for (int i = 0; i < table.Count; i++)
                {
                    JObject row = (JObject)table[i];
                    if (!string.IsNullOrEmpty(pars))
                    {
                        JObject par = JObject.Parse(pars);
                        foreach (JProperty prop in par.Properties())
                            row[prop.Name] = par[prop.Name];
                    }
                    foreach (JProperty prop in row.Properties())
                    {
                        if (prop.Name.StartsWith("fecha", StringComparison.CurrentCultureIgnoreCase))
                        {
                            string? date = row[prop.Name]?.ToString();
                            if (!string.IsNullOrEmpty(date) && DateTime.TryParse(date, out DateTime parsedDate))
                                row[prop.Name] = parsedDate.ToString("yyyy-MM-dd HH:mm:ss");
                        }
                    }
                    string res = (await Generic.ProcessRequest(request, response, op, sp, row.ToString(), rootPath)).ToString(Newtonsoft.Json.Formatting.None);
                    JObject jres = JObject.Parse(res);
                    if (jres["isError"] != null && (bool)jres["isError"])
                    {
                        var rowError = new JObject
                        {
                            ["rowIndex"] = i,
                            ["rowData"] = row,
                            ["errorMessage"] = jres["errorMessage"] ?? jres["data"]
                        };
                        if (jres["fieldErrors"] != null)
                            rowError["fieldErrors"] = jres["fieldErrors"];
                        fileErrors.Add(rowError);
                    }
                }

                if (fileErrors.Count > 0)
                {
                    errorList.Add(new JObject {
                        ["fileName"] = obj.GetValue("fileName")?.ToString(),
                        ["errors"] = fileErrors
                    });
                }
            }
        }
        if (errorList.Count == 0)
            return WebBDUt.NewBasicResponse(false, "OK").ToString(Newtonsoft.Json.Formatting.None);
        else
            return WebBDUt.NewBasicResponse(true, errorList).ToString(Newtonsoft.Json.Formatting.None);
    }
    catch (Exception ex)
    {
        Logger.Log("util/ImportFiles    " + ex.Message + Environment.NewLine + errorList.ToString() + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }
}).WithName("ImportFiles");
app.Map("/util/SendMail/{template}", async (HttpRequest request, HttpResponse response, string template) => {
    string body = "";
    try {
        response.ContentType = "application/json";
        using (var stream = new StreamReader(request.Body))
        {
            body = await stream.ReadToEndAsync();
        }
        JObject obj = JObject.Parse(body);
        JArray? emails = (JArray?)obj["emails"];
        string? subject = (string?)obj["subject"];
        foreach (JObject data in emails.Cast<JObject>())
        {
            string? email = data["email"]?.ToString();
            if (email != null)
                SendMail.Send(email, subject ?? "", template, data, rootPath);
        }
        return "OK";
    } catch (Exception ex) {
        Logger.Log("util/SendMail/" + template + "    " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        response.StatusCode = 500;
        return ex.Message + Environment.NewLine + ex.StackTrace;
    }

}).WithName("SendMail");
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
            ret = (await WebBDUt.ExecuteLocalSQLJson<DataSet>("Presentacion/Get_Duracion", new JObject())).ToString();
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
app.Map("/file/upload", async (HttpContext context) =>
{
    var ret = await WebBDUt.FileUpload(context, rootPath);
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
                .UploadFile(Path.Combine(rootPath, "wwwroot", item["serverPath"].Value<string>()), item["fileName"].Value<string>(), false, context.User.Identity?.Name, true);
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
/* app.Map("/davivienda/{ciudad}", async (HttpContext context, string ciudad) =>
{
    string body;
    using (var stream = new StreamReader(context.Request.Body)) {
        body = await stream.ReadToEndAsync();
    }
    Davivienda d = new(ciudad, rootPath, body);
    await d.RequestDavivienda();
    return "OK";
}); */
app.Run();
