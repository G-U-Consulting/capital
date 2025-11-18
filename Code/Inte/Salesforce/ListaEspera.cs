using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace capital.Code.Inte.Salesforce;

public class ListaEspera
{
    public ListaEspera(JObject Jobj)
    {
        typeof(ListaEspera).GetProperties().ToList().ForEach(prop =>
        {
            var value = Jobj[prop.Name];
            if (value != null)
                prop.SetValue(this, value.ToObject(prop.PropertyType));
        });
        Validate();
    }

    private string? _clientSalesforceId;
    /// <summary>
    /// Obligatorio si docPotentialClient es null.
    /// </summary>
    public string? clientSalesforceId
    {
        get => _clientSalesforceId;
        set
        {
            if (!string.IsNullOrWhiteSpace(value))
                _clientSalesforceId = value;
            else
                _clientSalesforceId = null;
        }
    }

    private string? _docPotentialClient;
    /// <summary>
    /// Obligatorio si clientSalesforceId es null. Debe ser numérico.
    /// </summary>
    public string? docPotentialClient
    {
        get => _docPotentialClient;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                _docPotentialClient = null;
                return;
            }

            var trimmed = value.Trim();
            if (!DocRegex().IsMatch(trimmed))
                throw new ArgumentException("docPotentialClient debe contener solo dígitos (longitud entre 5 y 20).");

            _docPotentialClient = trimmed;
        }
    }

    private string? _idInterestedProyect;
    /// <summary>
    /// Id del proyecto interesado (Obligatorio).
    /// </summary>
    public string? idInterestedProyect
    {
        get => _idInterestedProyect;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("idInterestedProyect es obligatorio.");
            _idInterestedProyect = value;
        }
    }

    private string? _idApartment;
    /// <summary>
    /// Id del apartamento (opcional).
    /// </summary>
    public string? idApartment
    {
        get => _idApartment;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                _idApartment = null;
            else
                _idApartment = value;
        }
    }

    private DateOnly? _dateInterested;
    /// <summary>
    /// Fecha de interés (opcional). Si se provee debe ser posterior a 2000-01-01.
    /// </summary>
    public DateOnly? dateInterested
    {
        get => _dateInterested;
        set
        {
            if (value.HasValue && value.Value < DateOnly.Parse("2000-01-01"))
                throw new ArgumentException("dateInterested inválida.");
            _dateInterested = value;
        }
    }

    private void Validate()
    {
        if (string.IsNullOrWhiteSpace(clientSalesforceId) && string.IsNullOrWhiteSpace(docPotentialClient))
            throw new ArgumentException("Debe proveerse clientSalesforceId o docPotentialClient.");

        if (string.IsNullOrWhiteSpace(idInterestedProyect))
            throw new ArgumentException("idInterestedProyect es obligatorio.");
    }
    private static Regex? _DocRegex = null;
    private static Regex DocRegex()
    {
        if (_DocRegex == null)
            return new(@"^\d{5,20}$");
        else return _DocRegex;
    }
}