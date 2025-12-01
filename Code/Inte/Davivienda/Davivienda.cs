using System;
using IniParser;
using IniParser.Model;
using Newtonsoft.Json.Linq;

namespace capital.Code.Inte.Davivienda;

public class Davivienda
{
    public Davivienda(string ciudad, string rootPath)
    {
        this.ciudad = ciudad;
        this.rootPath = rootPath;
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

        getApiCredentials();
    }
    public string ciudad;      // ['bogota', 'medellin']
    public string entorno;    // ['aws', 'local']
    public string conexion;  // ['pdn', 'lab']
    public string rootPath;

    public JObject getApiCredentials()
    {
        JObject credentials = [];
        string pathBase = Path.Combine(rootPath, "llaves", "Davivienda", ciudad),
            p_ini = Path.Combine(pathBase, $"{conexion}.ini"),
            p_crt = Path.Combine(pathBase, $"{conexion}.crt"),
            p_pem = Path.Combine(pathBase, $"{conexion}.pem");

            FileIniDataParser parser = new();
            IniData data = parser.ReadFile(p_ini);

            credentials["url"] = data[$"--------{conexion.ToUpper()}"]["davivienda_url"];
            credentials["clientId"] = data[$"--------{conexion.ToUpper()}"]["davivienda_client_id"];
            credentials["clientSecret"] = data[$"--------{conexion.ToUpper()}"]["davivienda_client_secret"];

            Console.WriteLine(credentials.ToString());

        return credentials;
    }
}