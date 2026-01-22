using dotenv.net;
using Newtonsoft.Json;

namespace capital.Code.Inte.Masiv;

public class Masiv
{
    private static readonly string url = "https://api.masiv.masivian.com/email/v1/delivery";
    private string ciudad;
    private string body;
    public Masiv(string ciudad, string body)
    {
        this.ciudad = ciudad;
        this.body = body;
        DotEnv.Load();
    }
    
    public async Task<string> Send()
    {
        string? User = Environment.GetEnvironmentVariable("MASIV_USERNAME_" + ciudad.ToUpper()),
            Password = Environment.GetEnvironmentVariable("MASIV_PASSWORD_" + ciudad.ToUpper());

        Body? fields = JsonConvert.DeserializeObject<Body>(body);

        byte[] bytes = System.Text.Encoding.UTF8.GetBytes($"{User}:{Password}");
        string auth = Convert.ToBase64String(bytes);

        using HttpClient client = new();
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", auth);
        client.DefaultRequestHeaders.Add("Content-Type", "application/json");

        string jsonContent = JsonConvert.SerializeObject(fields, new JsonSerializerSettings
        {
            StringEscapeHandling = StringEscapeHandling.EscapeHtml
        });
        Console.WriteLine("Masiv body:\n" + jsonContent);

        StringContent content = new(jsonContent, System.Text.Encoding.UTF8, "application/json");

        HttpResponseMessage response = await client.PostAsync(url, content);
        string responseContent = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine("Masiv response:\n" + responseContent);

        return responseContent;
    }
}