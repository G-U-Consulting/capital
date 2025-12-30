using System.Text.RegularExpressions;

namespace capital.Code.Inte.Davivienda;
public partial class BuilderInformation
{
    private Davivienda? util;
    private string? _adviserId;
    public string? adviserId
    {
        get => util?.Encrypt(_adviserId);
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("adviserId es obligatorio.");
            _adviserId = value;
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
            _projectId = WebUt.SanitizeXss(value);
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

    private DateOnly? _deliveryDate;
    public string? deliveryDate
    {
        get => _deliveryDate?.ToString("yyyy/MM/dd");
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("deliveryDate es obligatorio.");
            if (!DateOnly.TryParse(value, out DateOnly fecha))
                throw new ArgumentException("deliveryDate debe ser una fecha válida.");
            _deliveryDate = fecha;
        }
    }
    public void SetUtil(Davivienda util) => this.util = util;
    
    [GeneratedRegex(@"[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})")]
    private static partial Regex EmailRegex();
}