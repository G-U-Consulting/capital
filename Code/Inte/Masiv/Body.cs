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
            _Subject = value;
        }
    }
    public string From = "protecciondedatos@constructoracapital.com";
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
    private Attachment[]? _Attachments;
    public Attachment[]? Attachments
    {
        get => _Attachments;
        set => _Attachments = value;
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