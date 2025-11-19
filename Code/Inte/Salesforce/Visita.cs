using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;

namespace capital.Code.Inte.Salesforce;

public class Visita : Salesforce<Visita>
{
    public Visita(string tipo, string subtipo, string datos) : base(tipo, subtipo, datos)
    {
        route = "/services/apexrest/v1/Capital/CustomersAndProjects/customer";
    }
    private long? _document;
    private string? _typeDoc;
    private string? _cityLead;
    private string? _expeditionDate;
    private string? _email;
    private int? _mobilePhone;
    private DateOnly? _birthDate;
    private string? _registerType;
    private string? _disposeToInvest;
    private string? _attentionReason;
    private string? _reasonPurchase;
    private DateOnly? _visitedDate;

    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? company { get; set; }
    public long? document
    {
        get => _document;
        set
        {
            if (value != null && value < 0)
                throw new ArgumentException("Número documento inválido");
            _document = value;
        }
    }
    public string? typeDoc
    {
        get => _typeDoc;
        set
        {
            string[] allowed = ["cédula de ciudadanía", "cédula de extranjería", "pasaporte" ];
            if (!string.IsNullOrWhiteSpace(value) && !allowed.Contains(value.ToLower()))
                throw new ArgumentException("Tipo de documento inválido");
            _typeDoc = value;
        }
    }
    public string? cityLead
    {
        get => _cityLead;
        set
        {
            string[] allowed = ["bogotá", "medellín" ];
            if (!string.IsNullOrWhiteSpace(value) && !allowed.Contains(value.ToLower()))
                throw new ArgumentException("Ciudad (lead) inválida");
            _cityLead = value;
        }
    }
    public string? countryExpedition { get; set; }
    public string? departmentExpedition { get; set; }
    public string? cityExpedition { get; set; }
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
            }
            _expeditionDate = value;
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
    public int? mobilePhone
    {
        get => _mobilePhone;
        set
        {
            if (value != null)
            {
                var len = value.Value.ToString().Length;
                if (len < 7 || len > 10)
                    throw new ArgumentException("Número de teléfono móvil inválido");
            }
            _mobilePhone = value;
        }
    }
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
    public bool? AuthorizeData { get; set; }
    public string? disposeToInvest 
    {
        set
        {
            string[] allowed = ["menos de $ 2.400.000", "$ 2.400.001 a $ 4.800.000", "$ 4.800.001 a $ 7.200.000",
            "$ 7.200.001 a $ 10.400.000", "$ 10.400.001 a $ 12.000.000", "más de $ 12.000.000" ];
            if (!string.IsNullOrWhiteSpace(value) && !allowed.Contains(value.ToLower()))
                throw new ArgumentException("Disposición a invertir inválida");
            _disposeToInvest = value;
        }
    }
    public string? registerType
    {
        get => _registerType;
        set
        {
            string[] allowed = ["presencial", "telefónico", "whatsapp", "email", "videollamada"];
            if (!string.IsNullOrWhiteSpace(value) && !allowed.Contains(value.ToLower()))
                throw new ArgumentException("Tipo de registro inválido");
            _registerType = value;
        }
    }
    public string? attentionReason
    {
        get => _attentionReason;
        set
        {
            string[] allowed = ["atención rápida", "info Comercial de Proyecto", "cierre de negocio", "trámites"];
            if (!string.IsNullOrWhiteSpace(value) && !allowed.Contains(value.ToLower()))
                throw new ArgumentException("Motivo de atención inválido");
            _attentionReason = value;
        }
    }
    public string? IdClient { get; set; }
    public string? reasonPurchase
    {
        get => _reasonPurchase;
        set
        {
            string[] allowed = ["primera vivienda", "segunda vivienda", "cierre de negocio", "inversión"];
            if (!string.IsNullOrWhiteSpace(value) && !allowed.Contains(value.ToLower()))
                throw new ArgumentException("Motivo de compra inválido");
            _reasonPurchase = value;
        }
    }

    public string? _visitedSalesRoom
    {
        set
        {
            visitedSalesRoom = value == "1";
        }
    }
    public bool? visitedSalesRoom { get; set; }
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

}