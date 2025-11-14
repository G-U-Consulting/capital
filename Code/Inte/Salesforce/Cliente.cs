using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;

public partial class Cliente
{
    public Cliente(JObject Jobj)
    {
        typeof(Cliente).GetProperties().ToList().ForEach(prop =>
        {
            var value = Jobj[prop.Name];
            if (value != null)
                prop.SetValue(this, value.ToObject(prop.PropertyType));
        });
    }

    public string? firstName { get; set; }
    public string? lastName { get; set; }
    private long? _document;
    private string? _typeDoc;
    private string? _expeditionDate;
    private string? _email;
    private int? _mobilePhone;
    private DateOnly? _birthDate;
    private string? _registerType;
    private string? _attentionReason;
    private string? _reasonPurchase;
    private DateOnly? _visitedDate;

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
            string[] allowed = ["Cedula de Ciudadania", "Cedula de Extranjeria", "Pasaporte" ];
            if (value != null && !allowed.Contains(value))
                throw new ArgumentException("Tipo de documento inválido");
            _typeDoc = value;
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
            if (!string.IsNullOrEmpty(value))
            {
                DateOnly date = DateOnly.Parse(value);
                if (date > DateOnly.FromDateTime(DateTime.Now) || date < DateOnly.Parse("1900-01-01"))
                    throw new ArgumentException("Fecha de expedición inválida");
            }
            _expeditionDate = value;
        }
    }
    public string? indicative { get; set; }
    public string? email
    {
        get => _email;
        set
        {
            if (!string.IsNullOrEmpty(value) && !EmailRegex().IsMatch(value))
                throw new ArgumentException("Correo electrónico inválido");
            _email = value;
        }
    }
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
    public string? cityResidence { get; set; }
    public string? department { get; set; }
    public string? direction { get; set; }
    public string? countryResidence { get; set; }
    public bool? AuthorizeData { get; set; }
    public string? disposeToInvest { get; set; }
    public string? registerType
    {
        get => _registerType;
        set
        {
            string[] allowed = ["Presencial", "Telefónico", "Whatsapp", "Email", "Videollamada"];
            if (value != null && !allowed.Contains(value))
                throw new ArgumentException("Tipo de registro inválido");
            _registerType = value;
        }
    }
    public string? attentionReason
    {
        get => _attentionReason;
        set
        {
            string[] allowed = ["Atención rápida", "Info Comercial de Proyecto", "Cierre de negocio", "trámites"];
            if (value != null && !allowed.Contains(value))
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
            string[] allowed = ["Primera vivienda", "Segunda vivienda", "Cierre de negocio", "Inversión"];
            if (value != null && !allowed.Contains(value))
                throw new ArgumentException("Motivo de compra inválido");
            _reasonPurchase = value;
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

    [GeneratedRegex(@"[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})", RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();
}