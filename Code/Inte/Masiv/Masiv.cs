using dotenv.net;
using Newtonsoft.Json;
namespace capital.Code.Inte.Masiv;

public class Masiv
{
    private static readonly string url = "https://api.masiv.masivian.com/email/v1/delivery";
    private readonly string ciudad;
    private readonly string body;
    public Masiv(string ciudad, string body)
    {
        this.ciudad = ciudad;
        this.body = body;
        DotEnv.Load();
    }
    
    public async Task<string> Send()
    {
        Body? fields = JsonConvert.DeserializeObject<Body>(body);
        return await Request(fields);
    }

    public async Task<string> Request(Body? body) {
        string? User = Environment.GetEnvironmentVariable("MASIV_USERNAME_" + ciudad.ToUpper()),
            Password = Environment.GetEnvironmentVariable("MASIV_PASSWORD_" + ciudad.ToUpper());
            
        byte[] bytes = System.Text.Encoding.UTF8.GetBytes($"{User}:{Password}");
        string auth = Convert.ToBase64String(bytes);

        using HttpClient client = new();
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", auth);

        string jsonContent = JsonConvert.SerializeObject(body, new JsonSerializerSettings { StringEscapeHandling = StringEscapeHandling.Default });
        //Console.WriteLine("\nMasiv body:\n" + jsonContent);

        StringContent content = new(jsonContent, System.Text.Encoding.UTF8, "application/json");

        HttpResponseMessage response = await client.PostAsync(url, content);
        string responseContent = await response.Content.ReadAsStringAsync();
        
        //Console.WriteLine("\nMasiv response:\n" + responseContent);

        return responseContent;
    }

/*     private static async Task LoadBase64Img(EmbedImage[] images) {
        var tasks = images
            .Where(img => !string.IsNullOrWhiteSpace(img.Path) && img.Path.StartsWith("http"))
            .Select(async img => {
                try {
                    Dictionary<string, string> tmp = await WebUt.Url2base64(img.Path);
                    img.Path = tmp["base64"] ?? img.Path;
                    img.ImageType = tmp["fileType"] ?? img.ImageType;
                }
                catch {}
            });

        await Task.WhenAll(tasks);
    } */
}