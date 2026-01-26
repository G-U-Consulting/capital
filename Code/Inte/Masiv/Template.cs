namespace capital.Code.Inte.Masiv;

public class Template
{
    private string _Type = "text/html";
    public string Type
    {
        get => _Type;
        set => _Type = string.IsNullOrWhiteSpace(value) ? "text/html" : WebUt.SanitizeXss(value);
    }
    private string? _Value;
    public string? Value
    {
        get => _Value;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Template.Value es obligatorio.");
            _Value = value;
        }
    }
    private EmbedImage[]? _EmbedImages;
    public EmbedImage[]? EmbedImages
    {
        get => _EmbedImages;
        set => _EmbedImages = value;
    }
}