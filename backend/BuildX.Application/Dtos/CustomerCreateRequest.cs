namespace BuildX.Application.Dtos;

public class CustomerCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty; // CPF or CNPJ
    public string Phone { get; set; } = string.Empty;
    public AddressRequest Address { get; set; } = new AddressRequest();
}

public class AddressRequest
{
    public string Street { get; set; } = string.Empty;
    public string Neighborhood { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
}
