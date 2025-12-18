
namespace capital.Code.Inte.Davivienda;
public class InfoRequest
{
    private int _propertyPrice;
    public int propertyPrice
    {
        get => _propertyPrice;
        set
        {
            if (value <= 0)
                throw new ArgumentException("propertyPrice debe ser mayor que 0.");
            _propertyPrice = value;
        }
    }

    private int _amount;
    public int amount
    {
        get => _amount;
        set
        {
            if (value <= 0)
                throw new ArgumentException("amount debe ser mayor que 0.");
            _amount = value;
        }
    }

    private int _instalments;
    public int instalments
    {
        get => _instalments;
        set
        {
            if (value <= 0)
                throw new ArgumentException("instalments debe ser mayor que 0.");
            _instalments = value;
        }
    }

    private CustomerInformation? _customerInformation;
    public CustomerInformation? customerInformation
    {
        get => _customerInformation;
        set
        {
            if (value == null)
                throw new ArgumentException("customerInformation es obligatorio.");
            _customerInformation = value;
        }
    }

    private BuilderInformation? _builderInformartion;
    public BuilderInformation? builderInformartion
    {
        get => _builderInformartion;
        set
        {
            if (value == null)
                throw new ArgumentException("builderInformartion es obligatorio.");
            _builderInformartion = value;
        }
    }
}
