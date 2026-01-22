using System.Text.RegularExpressions;

namespace capital.Code.Inte.Masiv;

public partial class Body
{
    private string? _Subject;
    public string? Subject
    {
        get => _Subject;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Subject es obligatorio.");
            _Subject = WebUt.SanitizeXss(value);
        }
    }
    private string? _From;
    public string? From
    {
        get => _From;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("From es obligatorio.");
            if (!EmailRegex().IsMatch(value))
                throw new ArgumentException("From debe ser email válido.");
            _From = WebUt.SanitizeXss(value);
        }
    }
    private Template? _Template;
    public Template? Template
    {
        get => _Template;
        set {
            if (value == null)
                throw new ArgumentException("Template es obligatorio.");
            _Template = value;
        }
    }
    private Parameter[]? _Parameters;
    public Parameter[]? Parameters
    {
        get => _Parameters;
        set => _Parameters = value;
    }
    private Recipient[]? _Recipients;
    public Recipient[]? Recipients
    {
        get => _Recipients;
        set => _Recipients = value;
    }

    [GeneratedRegex(@"[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})")]
    private static partial Regex EmailRegex();
}