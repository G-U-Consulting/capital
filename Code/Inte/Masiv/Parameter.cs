public class Parameter
{
    private string? _Name;
    public string? Name
    {
        get => _Name;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Parameters.Name es obligatorio.");
            _Name = WebUt.SanitizeXss(value);
        }
    }

    private string _Type = "Text";
    public string Type
    {
        get => _Type;
        set => _Type = string.IsNullOrWhiteSpace(value) ? "Text" : WebUt.SanitizeXss(value);
    }

    private string? _Value;
    public string? Value
    {
        get => _Value;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Parameters.Value es obligatorio.");
            _Value = WebUt.SanitizeXss(value);
        }
    }
}