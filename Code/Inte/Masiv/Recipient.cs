using System.Text.RegularExpressions;
namespace capital.Code.Inte.Masiv;

public partial class Recipient
{
    private string? _To;
    public string? To
    {
        get => _To;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Recipient.To es obligatorio.");
            if (!EmailRegex().IsMatch(value))
                throw new ArgumentException("Recipient.To debe ser email válido.");
            _To = WebUt.SanitizeXss(value);
        }
    }

    private Parameter[]? _Parameters;
    public Parameter[]? Parameters
    {
        get {
            return _Parameters;
        }
        set => _Parameters = value;
    }
    private Attachment[]? _Attachments;
    public Attachment[]? Attachments
    {
        get => _Attachments;
        set => _Attachments = value;
    }
    private string[]? _CC;
    public string[]? CC
    {
        get => _CC;
        set => _CC = value;
    }
    private string[]? _Bcc;
    public string[]? Bcc
    {
        get => _Bcc;
        set => _Bcc = value;
    }

    [GeneratedRegex(@"[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})")]
    private static partial Regex EmailRegex();
}