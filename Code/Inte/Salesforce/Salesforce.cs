using System;
using dotenv.net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;
using orca.Code.Logger;

namespace capital.Code.Inte.Salesforce;

public abstract class Salesforce<T>(string subtipo, string datos, string rootPath) where T : Salesforce<T>
{
    static Salesforce()
    {
        DotEnv.Load();
    }
    protected static string? instance_url { get; set; }
    protected static string? token { get; set; }
    protected string? subtipo { get; set; } = subtipo;
    protected string? datos { get; set; } = datos;
    protected string? rootPath { get; set; } = rootPath;
    private JObject? JData { get; set; }
    protected string? route { get; set; }


    public static T CreateAsync(string subtipo, string datos, string rootPath)
    {
        return Activator.CreateInstance(typeof(T), subtipo, datos, rootPath) as T
            ?? throw new InvalidOperationException($"Could not create instance of type {typeof(T).FullName}");
    }
    public async Task<T> LoadData()
    {
        try
        {
            JToken resData = await Generic.ProcessRequest(null, null, "genericDT", subtipo, datos, rootPath);
            if (resData != null)
            {
                var content = resData["data"];
                if (content is JArray arr && arr.Count > 0)
                    JData = arr[0] as JObject;
                else if (content is JObject obj)
                    JData = obj;
                else
                    JData = null;
            }
            if (JData == null) throw new Exception("No se encontró el registro");
            else
            {
                //Console.WriteLine("JsonData: \n" + JData.ToString());
                if (this is not T target) throw new InvalidOperationException("La instancia actual no es del tipo genérico");
                JsonConvert.PopulateObject(JData.ToString(), target);
                return target;
            }
        }
        catch(Exception ex)
        {
            Logger.Log("Inte.Salesforce.LoadData" + "   " + subtipo + " - " + ex.Message + Environment.NewLine + datos + Environment.NewLine + ex.StackTrace);
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

        if (url == null) throw new Exception("No se configuró la conexión con Salesforce");
        using CancellationTokenSource cts = new(TimeSpan.FromSeconds(30));
        HttpResponseMessage response = await client.PostAsync(url, body, cts.Token);
        string auth = await response.Content.ReadAsStringAsync();
        JObject? obj = JsonConvert.DeserializeObject<JObject>(auth);
        if (obj == null) throw new Exception("No se completó la autenticación en Salesforce");
        else
        {
            instance_url = obj["instance_url"]?.ToString();
            token = obj["access_token"]?.ToString();
        }
    }
    private async Task<JToken?> Request()
    {
        if (instance_url == null || token == null)
            await GetAccess();
        Dictionary<string, string> headers = [];
        headers.Add("Authorization", $"Bearer {token}");
        string data = JsonConvert.SerializeObject(this);
        data = System.Text.RegularExpressions.Regex.Replace(data, @"""_[^""]*"":""?[^,""]*""?,?", "");
        Console.WriteLine("\ndata: \t" + data);
        using CancellationTokenSource cts = new(TimeSpan.FromSeconds(30));
        string res = await WebUt.WebRequest(instance_url + route, HttpMethod.Post, data, "application/json", cts.Token, headers);
        //Console.WriteLine("\nsalesforce res: \t" + res);
        JToken? jRes = JsonConvert.DeserializeObject<JToken>(res);
        await UpdateData(jRes);
        return jRes;
    }
    public static void resetSession()
    {
        instance_url = null;
        token = null;
    }

    public async Task<JToken?> Send()
    {
        JToken? res = await Request();
        try {
            if (res != null && res is JArray)
            {
                JToken? jt = res[0];
                if (jt is JObject obj)
                {
                    if (obj["errorCode"]?.ToString() == "INVALID_SESSION_ID")
                    {
                        resetSession();
                        res = await Request();
                    }
                }
            }
        }
        catch(Exception ex)
        {
            Logger.Log("Inte.Salesforce.Send" + "   " + subtipo + " - " + ex.Message + Environment.NewLine + datos + Environment.NewLine + ex.StackTrace);
            throw;
        }
        return res;
    }

    protected abstract Task UpdateData(JToken? jRes);

}