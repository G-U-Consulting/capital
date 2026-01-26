namespace capital.Code.Inte.Masiv;

public class EmbedImage
{
    private string? _Path;
    public string? Path
    {
        get => _Path;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("EmbedImage.Path es obligatorio.");
            _Path = WebUt.SanitizeXss(value);
        }
    }
    private string? _ImageName;
    public string? ImageName
    {
        get => _ImageName;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("EmbedImage.ImageName es obligatorio.");
            _ImageName = WebUt.SanitizeXss(value);
        }
    }
    private string? _ImageType;
    public string? ImageType
    {
        get => _ImageType;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("EmbedImage.ImageType es obligatorio.");
            _ImageType = WebUt.SanitizeXss(value);
        }
    }
    private string? _ContentId;
    public string? ContentId
    {
        get => _ContentId;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("EmbedImage.ContentId es obligatorio.");
            _ContentId = WebUt.SanitizeXss(value);
        }
    }
}