using Newtonsoft.Json.Linq;

namespace capital.Code.Inte.Salesforce;

public class Cotizacion : Salesforce<Cotizacion>
{
    public Cotizacion(string subtipo, string datos, string rootPath) : base(subtipo, datos, rootPath)
    {
        route = "/services/apexrest/v1/Capital/CustomersAndProjects/quoteApartment";
    }

    private static readonly string[] AllowedQuoteStates = ["Cotizado", "Opcionado", "Consignado", "Desistimiento", "Cierre"];

    private string? _quoteState;
    public string? quoteState
    {
        get => _quoteState;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("quoteState es obligatorio.");
            if (!AllowedQuoteStates.Contains(value))
                throw new ArgumentException($"quoteState no permitido. Valores válidos: {string.Join(", ", AllowedQuoteStates)}");
            _quoteState = value;
        }
    }

    private string? _apartmentZAId;
    public string? apartmentZAId
    {
        get => _apartmentZAId;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("apartmentZAId es obligatorio.");
            _apartmentZAId = value;
        }
    }
    private string? _apartmentSLId;
    public string? apartmentSLId
    {
        get => _apartmentSLId;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                _apartmentSLId = null;
        }
    }

    public string? apartment { get; set; }
    public int? tower { get; set; }
    public string? areas { get; set; }
    public string? agrupation { get; set; }
    private DateOnly? _deliveryDate;
    public DateOnly? deliveryDate { 
        get => _deliveryDate;
        set
        {
            if (value != null && (value < DateOnly.Parse("2000-01-01")))
                throw new ArgumentException("Fecha de entrega inválida");
            _deliveryDate = value;
        }
    }
    public string? view { get; set; }
    public string? _grossPrice
    {
        set
        {
            if (!string.IsNullOrWhiteSpace(value))
                grossPrice = long.Parse(value);
            else throw new ArgumentException("Precio Bruto inválido");
        }
    }
    public long grossPrice { get; set; }
    public string _netPrice
    {
        set
        {
            if (!string.IsNullOrWhiteSpace(value))
                netPrice = long.Parse(value);
            else throw new ArgumentException("Precio Neto inválido");
        }
    }
    public long netPrice { get; set; }
    public string? _discount
    {
        set
        {
            if (!string.IsNullOrWhiteSpace(value))
                discount = double.Parse(value);
            else discount = null;
        }
    }
    public double? discount { get; set; }
    public string? _m2Value
    {
        set
        {
            if (!string.IsNullOrWhiteSpace(value))
                m2Value = long.Parse(value);
            else m2Value = null;
        }
    }
    public long? m2Value { get; set; }

    public string? listPrice { get; set; }
    public string? financialBank { get; set; }
    private DateOnly? _optionDate;
    public DateOnly? optionDate { 
        get => _optionDate;
        set
        {
            if (value != null && (value < DateOnly.Parse("2000-01-01")))
                throw new ArgumentException("Fecha de opción inválida");
            _optionDate = value;
        }
    }
    private DateOnly? _vinculationDate;
    public DateOnly? vinculationDate { 
        get => _vinculationDate;
        set
        {
            if (value != null && (value < DateOnly.Parse("2000-01-01")))
                throw new ArgumentException("Fecha de vinculación inválida");
            _vinculationDate = value;
        }
    }
    public string? trusteeship { get; set; }
    private DateOnly? _closeDate;
    public DateOnly? closeDate { 
        get => _closeDate;
        set
        {
            if (value != null && (value < DateOnly.Parse("2000-01-01")))
                throw new ArgumentException("Fecha de cierre inválida");
            _closeDate = value;
        }
    }
    private DateOnly? _dismissDate;
    public DateOnly? dismissDate
    {
        get => _dismissDate;
        set
        {
            if (quoteState == "Desistimiento" && !value.HasValue)
                throw new ArgumentException("dismissDate es obligatorio si quoteState es 'Desistimiento'.");
            if (value != null && (value < DateOnly.Parse("2000-01-01")))
                throw new ArgumentException("Fecha de desistimiento inválida");
            _dismissDate = value;
        }
    }
    private string? _dismissCause;
    public string? dismissCause
    {
        get => _dismissCause;
        set
        {
            if (quoteState == "Desistimiento" && string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("dismissCause es obligatorio cuando quoteState es 'Desistimiento'.");
            _dismissCause = string.IsNullOrWhiteSpace(value) ? null : value;
        }
    }
    private string? _projectId;
    public string? projectId
    {
        get => _projectId;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("projectId es obligatorio.");
            _projectId = value;
        }
    }
    public string? clientSalesforceId { get; set; }

    protected override async Task UpdateData(JToken? jRes)
    {
        
    }
}
