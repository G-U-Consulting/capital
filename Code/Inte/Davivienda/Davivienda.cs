using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Runtime.InteropServices;
using IniParser;
using IniParser.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Logger;

namespace capital.Code.Inte.Davivienda;

public class Davivienda
{
    public Davivienda(string ciudad, string rootPath, string body)
    {
        if (string.IsNullOrWhiteSpace(ciudad) || string.IsNullOrWhiteSpace(rootPath) || string.IsNullOrWhiteSpace(body))
            throw new ArgumentNullException("Los parámetros no pueden estar vacíos");
        this.ciudad = ciudad;
        this.rootPath = rootPath;
        this.body = body;
        if (ciudad == "bogota")
        {
            entorno = "aws";
            conexion = "pdn";
        }
        else if (ciudad == "medellin")
        {
            entorno = "aws";
            conexion = "lab";
        }
        else throw new Exception("Ciudad inválida");

        GetApiCredentials();

        GenerateKey(credentials["clientId"]?.ToString());
    }
    public string ciudad;      // ['bogota', 'medellin']
    public string entorno;    // ['aws', 'local']
    public string conexion;  // ['pdn', 'lab']
    public string body;     // request
    public string rootPath;
    private byte[]? key;
    private static Dictionary<string, Dictionary<string, object?>> tokens = [];
    public static Dictionary<string, Davivienda> requests = [];
    private JObject credentials = [];
    public long validUntil = DateTimeOffset.Now.ToUnixTimeSeconds() + 3600;

    public void GetApiCredentials()
    {
        string pathBase = Path.Combine(rootPath, "llaves", "Davivienda", ciudad),
            p_ini = Path.Combine(pathBase, $"{conexion}.ini");
        FileIniDataParser parser = new();
        IniData data = parser.ReadFile(p_ini);

        credentials["url"] = data[$"--------{conexion.ToUpper()}"]["davivienda_url"].Replace("_", "").Replace("-", "").Replace("'", "").Replace(" ", "");
        credentials["clientId"] = data[$"--------{conexion.ToUpper()}"]["davivienda_client_id"].Replace("_", "").Replace("-", "").Replace("'", "").Replace(" ", "");
        credentials["clientSecret"] = data[$"--------{conexion.ToUpper()}"]["davivienda_client_secret"].Replace("_", "").Replace("-", "").Replace("'", "").Replace(" ", "");
        credentials["pfxPath"] = Path.Combine(pathBase, $"{conexion}.pfx");
        credentials["crtPath"] = Path.Combine(pathBase, $"{conexion}.crt");
        credentials["pemPath"] = Path.Combine(pathBase, $"{conexion}.pem");
        if (!tokens.TryGetValue(ciudad, out Dictionary<string, object?>? current) || current == null)
        {
            Dictionary<string, object?> temp = new()
            {
                ["token"] = null,
                ["validUntil"] = null
            };
            tokens.Add(ciudad, temp);
        }

    }

    public void GenerateKey(string clientId)
    {
        if (clientId.Length <= 45)
            clientId = clientId.PadLeft(46, '0');
        // 1. decodificar base64
        byte[] keyEncode = Convert.FromBase64String(clientId);
        // 2. convertir a hex y tomar primeros 64 caracteres
        string hexSubstring = string.Concat(keyEncode.Select(b => b.ToString("x2")))[..64];
        // 3. convertir hex a bytes
        key = HexToBytes(hexSubstring);
        if (key == null)
            throw new InvalidOperationException("No se pudo generar la clave de encriptación");
    }

    public string Encrypt(string data)
    {
        // 1. Generar IV aleatorio de 16 bytes
        byte[] iv = new byte[16];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(iv);
        // 2. Cifrar con AES-256-CBC
        byte[] encrypted;
        using var aes = Aes.Create();
        aes.KeySize = 256;
        aes.BlockSize = 128;
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.Key = key;
        aes.IV = iv;
        using var encryptor = aes.CreateEncryptor();
        byte[] plainBytes = Encoding.UTF8.GetBytes(data);
        encrypted = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);
        // 3. Concatenar IV en hex + ciphertext en hex
        return BytesToHex(iv) + BytesToHex(encrypted);
    }

    public string Decrypt(string data)
    {
        // 1. Extraer IV (primeros 32 chars hex = 16 bytes)
        byte[] iv = HexToBytes(data[..32]);
        // 2. Extraer ciphertext (resto de la cadena hex)
        byte[] encryptedData = HexToBytes(data[32..]);
        // 3. Desencriptar con AES-256-CBC
        string decrypted;
        using var aes = Aes.Create();
        aes.KeySize = 256;
        aes.BlockSize = 128;
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.Key = key;
        aes.IV = iv;
        using var decryptor = aes.CreateDecryptor();
        byte[] plainBytes = decryptor.TransformFinalBlock(encryptedData, 0, encryptedData.Length);
        decrypted = Encoding.UTF8.GetString(plainBytes);
        // 4. Trim: eliminar \n, \t, espacio, \r, \0
        char[] trimChars = ['\n', '\t', ' ', '\r', '\0'];
        return decrypted.Trim(trimChars);
    }

    private HttpClient LoadCertificates()
    {
        string? pfxPath = credentials["pfxPath"]?.ToString();
        string crtPath = credentials["crtPath"]?.ToString() ?? throw new ArgumentException("crtPath no configurado");
        string pemPath = credentials["pemPath"]?.ToString() ?? throw new ArgumentException("pemPath no configurado");
        X509Certificate2 cert;
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) || RuntimeInformation.IsOSPlatform(OSPlatform.OSX)){
                cert = X509Certificate2.CreateFromPemFile(crtPath, pemPath);
            }
            else
            {
                cert = X509CertificateLoader.LoadPkcs12FromFile(
                    pfxPath,
                    $"{conexion}pfx",
                    X509KeyStorageFlags.Exportable
                );
            }
            HttpClientHandler handler = new()
            {
                AllowAutoRedirect = false,
                AutomaticDecompression = System.Net.DecompressionMethods.None
            };
            handler.ClientCertificates.Add(cert);

            HttpClient client = new(handler);
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            return client;
    }

    private async Task<string> GetAccess()
    {
        var tokenData = tokens.GetValueOrDefault(ciudad) ?? throw new Exception($"Llaves no inicializadas para {ciudad}");
        object? token = tokenData.GetValueOrDefault("token");
        object? validUntil = tokenData.GetValueOrDefault("validUntil");
        if (token is string accessToken && validUntil is long timestamp && DateTimeOffset.Now.ToUnixTimeSeconds() < timestamp - 60)
            return accessToken;
        else
        {
            string url = credentials["url"]?.ToString() ?? throw new ArgumentException("url no configurado");
            string clientId = credentials["clientId"]?.ToString() ?? throw new ArgumentException("clientId no configurado");
            string clientSecret = credentials["clientSecret"]?.ToString() ?? throw new ArgumentException("clientSecret no configurado");
            
            string endpoint = string.Concat(url, "oauth2Provider/type1/v1/token");

            FormUrlEncodedContent postfields = new(
            [
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret),
                new KeyValuePair<string, string>("scope", "initMortgage")
            ]);
            HttpClient client = LoadCertificates();
            
            HttpResponseMessage response = await client.PostAsync(endpoint, postfields);
            string content = await response.Content.ReadAsStringAsync();

            //Console.WriteLine("Endpoint: \n" + endpoint);
            //Console.WriteLine("Content: \n" + content);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Error en la petición: {response.StatusCode}");
            JObject res = JsonConvert.DeserializeObject<JObject>(content) ?? [];
            string tokenType = res["token_type"]?.ToString() ?? throw new Exception($"No se obtuvo el token_type davivienda \n{content}");
            string access_token = res["access_token"]?.ToString() ?? throw new Exception($"No se obtuvo el token davivienda \n{content}");
            if ((long)res["expires_in"] is long expiresIn && expiresIn > 0)
            {
                tokens[ciudad]["token"] = $"{tokenType} {access_token}";
                tokens[ciudad]["validUntil"] = DateTimeOffset.Now.ToUnixTimeSeconds() + expiresIn;
            }
            else throw new Exception($"No se obtuvo expires_in davivienda \n{content}");
            return $"{tokenType} {access_token}";
        }
    }

    public async Task RequestDavivienda(HttpContext http)
    {
        try
        {
            string data = "";
            InfoRequest? info = JsonConvert.DeserializeObject<InfoRequest>(body) ?? throw new InvalidOperationException("Body JSON inválido");
            info.customerInformation?.SetUtil(this);
            info.builderInformartion?.SetUtil(this);
            JObject obj = JObject.FromObject(info);
            string? workActivity = obj.SelectToken("customerInformation.workActivity")?.ToString();
            if (!string.Equals(workActivity, "EMPLOYEE", StringComparison.OrdinalIgnoreCase))
            {
                JObject? cust = obj["customerInformation"] as JObject;
                cust?.Property("contractType")?.Remove();
            }
            data = obj.ToString(Formatting.None);
            
            string token = await GetAccess();
            if (string.IsNullOrEmpty(token))
                throw new InvalidOperationException("No se pudo obtener token válido");
            //Console.WriteLine(token);
            var contentBytes = Encoding.UTF8.GetBytes(data);
            int contentLength = contentBytes.Length;
            //Console.WriteLine(data);

            string url = credentials["url"]?.ToString() ?? throw new ArgumentException("url no configurado");
            string endpoint = string.Concat(url, "mortgage/v1/initBuilderRequest");
            //Console.WriteLine("Endpoint: " + url);
            
            HttpClient client = LoadCertificates();

            HttpRequestMessage request = new(HttpMethod.Post, endpoint);
            request.Version = new Version(1, 1);
            request.Headers.ExpectContinue = false;
            request.Content = new StringContent(data, Encoding.UTF8, "application/json");

            //Console.WriteLine($"client id: {credentials["clientId"]?.ToString()}");

            request.Headers.Add("x-ibm-client-id", credentials["clientId"]?.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.UserAgent.ParseAdd("MyCustomUserAgent/1.0 (http://www.constructoracapital.com)");
            request.Headers.Authorization = AuthenticationHeaderValue.Parse(token);

            HttpResponseMessage response = await client.SendAsync(request);
            string content = await response.Content.ReadAsStringAsync();

            string contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";
            int statusCode = (int)response.StatusCode;
            if (contentType.Contains("application/json") && response.IsSuccessStatusCode || response.StatusCode == System.Net.HttpStatusCode.Found)
            {
                JObject resJson = JsonConvert.DeserializeObject<JObject>(content) ?? [];
                resJson["davUrl"] = response.Headers.Location?.ToString();
                content = resJson.ToString(Formatting.None);
                statusCode = 200;
            }
            else if (!response.IsSuccessStatusCode)
            {
                contentType = "application/json";
                content = JsonConvert.SerializeObject(new { isError = true, message = $"Error en la petición: {response.StatusCode}", details = content.Trim() });
            }
            http.Response.StatusCode = statusCode;
            http.Response.Headers.ContentType = contentType;
            await http.Response.WriteAsync(content);

            //Console.WriteLine("Davivienda response: \n" + response);
            //Console.WriteLine("Davivienda content: \n" + content);
        }
        catch (Exception ex)
        {
            http.Response.StatusCode = 500;
            http.Response.Headers.ContentType = "application/json";
            await http.Response.WriteAsync(JsonConvert.SerializeObject(new { isError = true, message = ex.Message }));
            Logger.Log("Inte.Davivienda.RequestDavivienda" + "   " + ciudad + " - " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
        }
    }

    public static string BytesToHex(byte[] bytes)
    {
        return string.Concat(bytes.Select(b => b.ToString("x2")));
    }
    static byte[] HexToBytes(string hex)
    {
        return [.. Enumerable.Range(0, hex.Length / 2).Select(i => Convert.ToByte(hex.Substring(i * 2, 2), 16))];
    }
}