namespace capital.Code.Inte.Masiv;

public class Attachment
{
    private string? _Path;
    public string? Path
    {
        get => _Path;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Attachment.Path es obligatorio.");
            _Path = WebUt.SanitizeXss(value);
        }
    }

    private string _Option = "generate-pdf";
    public string Option
    {
        get => _Option;
        set => _Option = string.IsNullOrWhiteSpace(value) ? "generate-pdf" : WebUt.SanitizeXss(value);
    }

    private string? _Password;
    public string? Password
    {
        get => _Password;
        set => _Password = !string.IsNullOrWhiteSpace(value) ? WebUt.SanitizeXss(value) : null;
    }

    private string? _Filename;
    public string? Filename
    {
        get => _Filename;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Attachment.Filename es obligatorio.");
            _Filename = WebUt.SanitizeXss(value);
        }
    }
}