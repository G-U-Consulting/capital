
using System.Text.RegularExpressions;

namespace capital.Code.Inte.Davivienda;
public partial class CustomerInformation
{
    private Davivienda? util;
    private string? _documentType;
    public string? documentType
    {
        get => _documentType;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("documentType es obligatorio.");
            _documentType = value;
        }
    }

    private string? _documentNumber;
    public string? documentNumber
    {
        get => util?.Encrypt(_documentNumber);
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("documentNumber es obligatorio.");
            _documentNumber = WebUt.SanitizeXss(value);
        }
    }

    private string? _names;
    public string? names
    {
        get => util?.Encrypt(_names);
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("names es obligatorio.");
            _names = WebUt.SanitizeXss(value);
        }
    }

    private string? _firstLastname;
    public string? firstLastname
    {
        get => util?.Encrypt(_firstLastname);
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("firstLastname es obligatorio.");
            _firstLastname = WebUt.SanitizeXss(value);
        }
    }

    private string? _secondLastName;
    public string? secondLastName
    {
        get => util?.Encrypt(_secondLastName);
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("secondLastName es obligatorio.");
            _secondLastName = WebUt.SanitizeXss(value);
        }
    }

    private int _monthlyIncome;
    public int monthlyIncome
    {
        get => _monthlyIncome;
        set
        {
            if (value <= 0)
                throw new ArgumentException("monthlyIncome debe ser mayor que 0.");
            _monthlyIncome = value;
        }
    }

    private string? _workActivity;
    public string? workActivity
    {
        get => _workActivity;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("workActivity es obligatorio.");
            _workActivity = WebUt.SanitizeXss(value);
        }
    }

    private DateOnly? _birthdate;
    public string? birthdate
    {
        get => _birthdate?.ToString("yyyy/MM/dd");
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("birthdate es obligatorio.");
            if (!DateOnly.TryParse(value, out DateOnly fecha))
                throw new ArgumentException("birthdate debe ser una fecha válida.");
            _birthdate = fecha;
        }
    }

    private string? _mobileNumber;
    public string? mobileNumber
    {
        get => util?.Encrypt(_mobileNumber);
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("mobileNumber es obligatorio.");
            if (!Regex.IsMatch(value, @"^\d{7,15}$"))
                throw new ArgumentException("mobileNumber debe contener entre 7 y 15 dígitos.");
            _mobileNumber = WebUt.SanitizeXss(value);
        }
    }

    private string? _email;
    public string? email
    {
        get => util?.Encrypt(_email);
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("email es obligatorio.");
            if (!EmailRegex().IsMatch(value))
                throw new ArgumentException("email debe ser válido.");
            _email = WebUt.SanitizeXss(value);
        }
    }

    private string? _redirectionURL;
    public string? redirectionURL
    {
        get => util?.Encrypt(_redirectionURL);
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("redirectionURL es obligatorio.");
            if (!Uri.TryCreate(value, UriKind.Absolute, out _))
                throw new ArgumentException("redirectionURL debe ser una URL válida.");
            _redirectionURL = WebUt.SanitizeXss(value);
        }
    }
    public void SetUtil(Davivienda util) => this.util = util;

    [GeneratedRegex(@"[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})")]
    private static partial Regex EmailRegex();
}
