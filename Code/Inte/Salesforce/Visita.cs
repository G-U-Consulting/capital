using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;
using orca.Code.Logger;

namespace capital.Code.Inte.Salesforce;

public class Visita : Salesforce<Visita>
{
    public Visita(string subtipo, string datos, string rootPath) : base(subtipo, datos, rootPath)
    {
        route = "/services/apexrest/v1/Capital/CustomersAndProjects/customer";
    }
    private string? _email;
    private DateOnly? _birthDate;
    private DateOnly? _visitedDate;

    public string? firstName { get; set; }
    public string? lastName { get; set; }
    private string? _company;
    public string? company { 
        get => _company;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                _company = null;
            else _company = value;
        }
    }
    public string _document
    {
        set
        {
            var len = value.Length;
            if (len < 4 || len > 10)
                throw new ArgumentException("Número documento inválido");
            if (mobilePhone >= Math.Pow(2, 31))
                throw new ArgumentException("El número debe ser menor a 2147483648");
            document = long.Parse(value);
        }
    }
    public long document { get; private set; }
    public string? typeDoc { get; set; }
    public string? cityLead { get; set; }
    public string? countryExpedition { get; set; }
    public string? departmentExpedition { get; set; }
    private string? _cityExpedition;
    public string? cityExpedition { 
        get => _cityExpedition;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                _cityExpedition = null;
            else _cityExpedition = value;
        }
    }
    private string? _expeditionDate;
    public string? expeditionDate
    {
        get => _expeditionDate;
        set
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                DateOnly date = DateOnly.Parse(value);
                if (date > DateOnly.FromDateTime(DateTime.Now) || date < DateOnly.Parse("1900-01-01"))
                    throw new ArgumentException("Fecha de expedición inválida");
                _expeditionDate = value;
            }
            else _expeditionDate = null;
        }
    }
    public string? email
    {
        get => _email;
        set
        {
            if (!string.IsNullOrWhiteSpace(value) && !EmailRegex().IsMatch(value))
                throw new ArgumentException("Correo electrónico inválido");
            _email = value;
        }
    }
    public string? indicative { get; set; }
    public string? _mobilePhone
    {
        set
        {
            if (value != null)
            {
                var len = value.Length;
                if (len > 12)
                    throw new ArgumentException("Número de teléfono móvil inválido");
                mobilePhone = long.Parse(value);
            }
            else mobilePhone = null;
        }
    }
    public long? mobilePhone { get; private set; }
    public DateOnly? birthDate
    {
        get => _birthDate;
        set
        {
            if (value != null && (value > DateOnly.FromDateTime(DateTime.Now) || value < DateOnly.Parse("1900-01-01")))
                throw new ArgumentException("Fecha de nacimiento inválida");
            _birthDate = value;
        }
    }
    public string? cityOrigin { get; set; }
    public string? department { get; set; }
    public string? direction { get; set; }
    public string? countryResidence { get; set; }
    public string? _AuthorizeData
    {
        set
        {
            AuthorizeData = value == "1";
        }
    }
    public bool? AuthorizeData { get; private set; }
    public string? disposeToInvest { get; set; }
    public string? registerType { get; set; }
    public string? attentionReason { get; set; }
    public string? IdClient { get; set; }
    public string? reasonPurchase { get; set; }

    public string? _visitedSalesRoom
    {
        set
        {
            visitedSalesRoom = value == "1";
        }
    }
    public bool? visitedSalesRoom { get; private set; }
    public string? salesRoom { get; set; }
    public DateOnly? visitedDate
    {
        get => _visitedDate;
        set
        {
            if (value != null && (value > DateOnly.FromDateTime(DateTime.Now) || value < DateOnly.Parse("1900-01-01")))
                throw new ArgumentException("Fecha de visita inválida");
            _visitedDate = value;
        }
    }

    private static Regex? _EmailRegex = null;
    private static Regex EmailRegex()
    {
        if (_EmailRegex == null)
            return new(@"[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})", RegexOptions.IgnoreCase);
        else return _EmailRegex;
    }

    protected override async Task UpdateData(JToken? jRes)
    {
        if (jRes != null && jRes is JObject res)
        {
            string? id_salesforce = res["dataResponse"]?["idSalesforce"]?.ToString();
            if (string.IsNullOrWhiteSpace(id_salesforce))
                throw new Exception(res.ToString());
            JObject upd = [];
            upd["id_cliente"] = IdClient;
            upd["salesforce_id"] = id_salesforce;
            try {
                await Generic.ProcessRequest(null, null, "genericST", "integraciones/Upd_Cliente", JsonConvert.SerializeObject(upd), rootPath);
            }
            catch (Exception ex)
            {
                Logger.Log("Inte.Salesforce.LoadData" + "   " + subtipo + " - " + ex.Message + Environment.NewLine + datos + Environment.NewLine + ex.StackTrace);
            }
        }
    }
}