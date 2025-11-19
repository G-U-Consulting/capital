using System;
using System.Text.Json.Serialization;
using dotenv.net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;

namespace capital.Code.Inte.Salesforce;

public abstract class Salesforce<T> where T : Salesforce<T>
{
    protected Salesforce(string tipo, string subtipo, string datos)
    {
        this.tipo = tipo;
        this.subtipo = subtipo;
        this.datos = datos;
    }
    static Salesforce()
    {
        DotEnv.Load();
    }
    protected static string? instance_url { get; set; }
    protected static string? token { get; set; }
    protected string? tipo { get; set; }
    protected string? subtipo { get; set; }
    protected string? datos { get; set; }
    private JObject? JData { get; set; }
    protected string? route { get; set; }


    public static async Task<T> CreateAsync(string tipo, string subtipo, string datos,
        HttpRequest request, HttpResponse response, string rootPath)
    {
        try
        {
            var inst = Activator.CreateInstance(typeof(T), tipo, subtipo, datos) as T
                ?? throw new InvalidOperationException($"Could not create instance of type {typeof(T).FullName}");
            await inst.LoadData(request, response, datos, rootPath);
            return inst;
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex);
            throw;
        }
    }
    private async Task LoadData(HttpRequest request, HttpResponse response, string body, string rootPath)
    {
        try
        {
            JData = (JObject?)(await Generic.ProcessRequest(request, response, "genericDT", subtipo, body, rootPath))["data"]?[0];
            if (JData != null)
            {
                if (this is not T target) throw new InvalidOperationException("La instancia actual no es del tipo genérico");
                JsonConvert.PopulateObject(JData.ToString(), target);
            }
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex);
            throw;
        }
    }
    private async Task GetAccess()
    {
        using var client = new HttpClient();
        string? url = Environment.GetEnvironmentVariable("SALESFORCE_API_URL");
        var pars = new[]
        {
            new KeyValuePair<string, string>("grant_type", Environment.GetEnvironmentVariable("SALESFORCE_GRANT_TYPE")),
            new KeyValuePair<string, string>("client_id", Environment.GetEnvironmentVariable("SALESFORCE_CLIENT_ID")),
            new KeyValuePair<string, string>("client_secret", Environment.GetEnvironmentVariable("SALESFORCE_CLIENT_SECRET")),
            new KeyValuePair<string, string>("username", Environment.GetEnvironmentVariable("SALESFORCE_USERNAME")),
            new KeyValuePair<string, string>("password", Environment.GetEnvironmentVariable("SALESFORCE_PASSWORD"))
        };
        FormUrlEncodedContent body = new(pars);

        Console.WriteLine("body: \t" + body);
        if (url == null) throw new Exception("No se configuró la conexión con Salesforce");
        HttpResponseMessage response = await client.PostAsync(url, body);
        string res = await response.Content.ReadAsStringAsync();
        Console.WriteLine("res: \t" + res);
        JObject? obj = JsonConvert.DeserializeObject<JObject>(res);
        if (obj == null) throw new Exception("No se completó la autenticación en Salesforce");
        else
        {
            instance_url = obj["instance_url"]?.ToString();
            token = obj["access_token"]?.ToString();
        }
    }
    public async Task Request()
    {
        if (instance_url == null || token == null)
            await GetAccess();
        Dictionary<string, string> headers = [];
        headers.Add("Authorization", $"Bearer {token}");
        string data = JsonConvert.SerializeObject(this);
        string url = $"{instance_url}{route}";
        string res = await WebUt.WebRequest(url, HttpMethod.Post, data, "application/json", headers);
        Console.WriteLine("sf res: \t" + res);
    }
}