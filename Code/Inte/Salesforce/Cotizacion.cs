using Newtonsoft.Json.Linq;

namespace capital.Code.Inte.Salesforce;

public class Cotizacion
{
    public Cotizacion(JObject Jobj)
    {
        typeof(Cotizacion).GetProperties().ToList().ForEach(prop =>
        {
            var value = Jobj[prop.Name];
            if (value != null)
                prop.SetValue(this, value.ToObject(prop.PropertyType));
        });
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

    public string? apartmentSLId { get; set; }
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
    private decimal _grossPrice;
    public decimal grossPrice
    {
        get => _grossPrice;
        set
        {
            if (value <= 0)
                throw new ArgumentException("grossPrice es obligatorio y debe ser mayor que 0.");
            _grossPrice = value;
        }
    }
    private decimal _netPrice;
    public decimal netPrice
    {
        get => _netPrice;
        set
        {
            if (value <= 0)
                throw new ArgumentException("netPrice es obligatorio y debe ser mayor que 0.");
            _netPrice = value;
        }
    }
    private double? _discount;
    public double? discount
    {
        get => _discount;
        set
        {
            if (value.HasValue && value < 0)
                throw new ArgumentException("discount no puede ser negativo.");
            _discount = value;
        }
    }
    private decimal? _m2Value;
    public decimal? m2Value
    {
        get => _m2Value;
        set
        {
            if (value.HasValue && value <= 0)
                throw new ArgumentException("m2Value debe ser mayor que 0 si se provee.");
            _m2Value = value;
        }
    }

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
            _dismissCause = value;
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
}
