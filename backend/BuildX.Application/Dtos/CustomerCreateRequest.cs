namespace BuildX.Application.Dtos;

public class CustomerCreateRequest : CustomerRequestBase
{
    public string Document { get; set; } = string.Empty; // CPF or CNPJ
}
