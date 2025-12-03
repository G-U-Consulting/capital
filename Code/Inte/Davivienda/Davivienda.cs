using System;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using DocumentFormat.OpenXml.InkML;
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
        Console.WriteLine("Key:\t" + key);
    }
    public string ciudad;      // ['bogota', 'medellin']
    public string entorno;    // ['aws', 'local']
    public string conexion;  // ['pdn', 'lab']
    public string body;     // request
    public string rootPath;
    private byte[]? key;
    private static Dictionary<string, Dictionary<string, object?>> tokens = [];
    private JObject credentials = [];

    public void GetApiCredentials()
    {
        string pathBase = Path.Combine(rootPath, "llaves", "Davivienda", ciudad),
            p_ini = Path.Combine(pathBase, $"{conexion}.ini");

        FileIniDataParser parser = new();
        IniData data = parser.ReadFile(p_ini);

        credentials["url"] = data[$"--------{conexion.ToUpper()}"]["davivienda_url"];
        credentials["clientId"] = data[$"--------{conexion.ToUpper()}"]["davivienda_client_id"];
        credentials["clientSecret"] = data[$"--------{conexion.ToUpper()}"]["davivienda_client_secret"];
        credentials["pfxPath"] = Path.Combine(pathBase, $"{conexion}.pfx");
        //credentials["pemPath"] = Path.Combine(pathBase, $"{conexion}.pem");
        if (!tokens.TryGetValue(ciudad, out Dictionary<string, object?>? current) || current == null)
        {
            Dictionary<string, object?> temp = new()
            {
                ["token"] = null,
                ["validUntil"] = null
            };
            tokens.Add(ciudad, temp);
        }

        Console.WriteLine(credentials.ToString());

    }

    public void GenerateKey(string clientId)
    {
        clientId = clientId.Replace("_", "").Replace("-", "").Replace("'", "").Replace(" ", "");
        while (clientId.Length < 46)
            clientId = "0" + clientId;
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

    private async Task<string> GetAccess()
    {
        var tokenData = tokens.GetValueOrDefault(ciudad) ?? throw new Exception($"Llaves no inicializadas para {ciudad}");
        object? token = tokenData.GetValueOrDefault("token");
        object? validUntil = tokenData.GetValueOrDefault("validUntil");
        if (token is string accessToken && validUntil is long timestamp && DateTimeOffset.Now.ToUnixTimeSeconds() < timestamp - 100)
            return accessToken;
        else
        {
            string url = credentials["url"]?.ToString().Trim('\'') ?? throw new ArgumentException("url no configurado");
            string clientId = credentials["clientId"]?.ToString() ?? throw new ArgumentException("clientId no configurado");
            string clientSecret = credentials["clientSecret"]?.ToString() ?? throw new ArgumentException("clientSecret no configurado");
            string pfxPath = credentials["pfxPath"]?.ToString() ?? throw new ArgumentException("pfxPath no configurado");
            //string pemPath = credentials["pemPath"]?.ToString() ?? throw new ArgumentException("pemPath no configurado");
            
            string endpoint = string.Concat(url, "oauth2Provider/type1/v1/token");
            Console.WriteLine("endpoint: \t" + endpoint);

            FormUrlEncodedContent postfields = new(
            [
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret),
                new KeyValuePair<string, string>("scope", "initMortgage")
            ]);

            // Certificado
            var store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
            store.Open(OpenFlags.ReadOnly);

            var certs = store.Certificates.Find(
                X509FindType.FindByThumbprint,
                "",
                validOnly: false);

            if (certs.Count == 0)
                throw new Exception("Certificado no encontrado");

            var cert = certs[0];
            Console.WriteLine($"Clave privada: {cert.HasPrivateKey}"); 

            var handler = new HttpClientHandler();
            handler.ClientCertificates.Add(cert);
            handler.ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;

            using var client = new HttpClient(handler);
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

            HttpResponseMessage response = await client.PostAsync(endpoint, postfields);

            Console.WriteLine("Response: \n" + response.ToString());
            string content = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Content: \n" + content);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Error en la petición: {response.StatusCode}");
            return await response.Content.ReadAsStringAsync();

        }
    }

    public async Task RequestDavivienda()
    {
        try
        {
            string token = await GetAccess();
            if (string.IsNullOrEmpty(token))
                throw new InvalidOperationException("No se pudo obtener token válido");
            Console.WriteLine(token);
            //InfoRequest? info = JsonConvert.DeserializeObject<InfoRequest>(body) ?? throw new InvalidOperationException("Body JSON inválido");
            //info.customerInformation?.SetUtil(this);
            //info.builderInformation?.SetUtil(this);
            // TODO: Enviar POST
        }
        catch (Exception ex)
        {
            Logger.Log("Inte.Davivienda.RequestDavivienda" + "   " + ciudad + " - " + ex.Message + Environment.NewLine + body + Environment.NewLine + ex.StackTrace);
            throw;
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