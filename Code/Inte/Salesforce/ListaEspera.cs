using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace capital.Code.Inte.Salesforce;

public class ListaEspera : Salesforce<ListaEspera>
{
    public ListaEspera(string subtipo, string datos) : base(subtipo, datos)
    {
        route = "/services/apexrest/v1/Capital/CustomersAndProjects/waitingList";
    }

    private string? _clientSalesforceId;
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
    }
    private static Regex? _DocRegex = null;
    private static Regex DocRegex()
    {
        if (_DocRegex == null)
            return new(@"^\d{5,20}$");
        else return _DocRegex;
    }
}