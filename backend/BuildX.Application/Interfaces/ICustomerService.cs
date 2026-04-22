using BuildX.Application.Dtos;

namespace BuildX.Application.Interfaces;

public interface ICustomerService
{
    Task<CustomerResponse> CreateCustomerAsync(CustomerCreateRequest request);
    Task<IEnumerable<CustomerResponse>> GetAllCustomersAsync();
    Task<PagedResponse<CustomerResponse>> GetPagedCustomersAsync(int pageNumber, int pageSize, string? searchTerm);
    Task<CustomerResponse?> GetCustomerByIdAsync(Guid id);
    Task UpdateCustomerAsync(Guid id, CustomerUpdateRequest request);
    Task DeleteCustomerAsync(Guid id);
}
