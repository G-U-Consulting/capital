using Newtonsoft.Json.Linq;
using orca.Code.Api;
using orca.Code.Auth;
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

/*****************************************************************************/
/***************************** Autenticacion *********************************/
/*****************************************************************************/
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

/*****************************************************************************/
/***************************** Carrusel  *************************************/
/*****************************************************************************/
app.Map("/img/carrusel", (HttpRequest request) =>
{
    var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img", "carrusel");

    if (!Directory.Exists(wwwrootPath))
    {
        return Results.NotFound("La carpeta de imágenes no existe.");
    }
    var files = Directory.GetFiles(wwwrootPath)
                         .Where(file => file.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                                        file.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
                                        file.EndsWith(".gif", StringComparison.OrdinalIgnoreCase))
                         .Select(file => $"/img/carrusel/{Path.GetFileName(file)}")
                         .ToList();

    return Results.Ok(new { images = files });
});

app.Map("/api/upload", async (HttpContext context, IWebHostEnvironment env) =>
{
    var form = await context.Request.ReadFormAsync();
    var files = form.Files;
    var uploadsFolder = Path.Combine(env.WebRootPath, "img", "carrusel");

    if (!Directory.Exists(uploadsFolder))
        Directory.CreateDirectory(uploadsFolder);
    var existingImages = form["existingImages"].ToString().Split(",").Select(i => i.Trim()).ToList();
    var currentFiles = Directory.GetFiles(uploadsFolder)
                                .Select(f => Path.GetFileName(f))
                                .ToList();
    foreach (var file in currentFiles)
    {
        if (!existingImages.Contains(file))
        {
            File.Delete(Path.Combine(uploadsFolder, file));
        }
    }
    foreach (var file in files)
    {
        var filePath = Path.Combine(uploadsFolder, file.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
    }
    return Results.Ok(new { message = "✅ Imágenes actualizadas correctamente!" });
});
app.Run();
