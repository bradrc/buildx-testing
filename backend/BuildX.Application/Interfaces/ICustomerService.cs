using BuildX.Application.Dtos;

namespace BuildX.Application.Interfaces;

public interface ICustomerService
{
    Task<CustomerResponse> CreateCustomerAsync(CustomerCreateRequest request);
    Task<IEnumerable<CustomerResponse>> GetAllCustomersAsync();
    Task<CustomerResponse?> GetCustomerByIdAsync(Guid id);
}
