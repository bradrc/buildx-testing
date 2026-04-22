using BuildX.Application.Dtos;
using BuildX.Application.Interfaces;
using BuildX.Domain.Entities;
using BuildX.Domain.Interfaces;

namespace BuildX.Application.Services;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;

    public CustomerService(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<CustomerResponse> CreateCustomerAsync(CustomerCreateRequest request)
    {
        var existingCustomer = await _customerRepository.GetByDocumentAsync(request.Document);
        if (existingCustomer != null)
        {
            throw new Exception("Customer with this document already exists.");
        }

        var customer = new Customer
        {
            Name = request.Name,
            Email = request.Email,
            Document = request.Document,
            Phone = request.Phone,
            Address = new Address
            {
                Street = request.Address.Street,
                Neighborhood = request.Address.Neighborhood,
                City = request.Address.City,
                State = request.Address.State,
                ZipCode = request.Address.ZipCode
            }
        };

        await _customerRepository.AddAsync(customer);

        return MapToResponse(customer);
    }

    public async Task<IEnumerable<CustomerResponse>> GetAllCustomersAsync()
    {
        var customers = await _customerRepository.GetAllAsync();
        return customers.Select(MapToResponse);
    }

    public async Task<PagedResponse<CustomerResponse>> GetPagedCustomersAsync(int pageNumber, int pageSize, string? searchTerm)
    {
        // Note: Since ICustomerRepository.GetAllAsync() returns IEnumerable, 
        // we might need to update the repository to support IQueryable or 
        // handle pagination in memory for now if the dataset is small.
        // For a professional implementation, we should update the repository.
        
        var customers = await _customerRepository.GetAllAsync();
        var query = customers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(c => 
                c.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) || 
                c.Document.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
        }

        var totalCount = query.Count();
        var items = query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(MapToResponse)
            .ToList();

        return new PagedResponse<CustomerResponse>(items, totalCount, pageNumber, pageSize);
    }

    public async Task<CustomerResponse?> GetCustomerByIdAsync(Guid id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null) return null;
        return MapToResponse(customer);
    }

    public async Task UpdateCustomerAsync(Guid id, CustomerUpdateRequest request)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null)
        {
            throw new Exception("Customer not found.");
        }

        customer.Name = request.Name;
        customer.Email = request.Email;
        customer.Phone = request.Phone;
        
        if (customer.Address != null)
        {
            customer.Address.Street = request.Address.Street;
            customer.Address.Neighborhood = request.Address.Neighborhood;
            customer.Address.City = request.Address.City;
            customer.Address.State = request.Address.State;
            customer.Address.ZipCode = request.Address.ZipCode;
        }
        else
        {
            customer.Address = new Address
            {
                Street = request.Address.Street,
                Neighborhood = request.Address.Neighborhood,
                City = request.Address.City,
                State = request.Address.State,
                ZipCode = request.Address.ZipCode
            };
        }

        await _customerRepository.UpdateAsync(customer);
    }

    public async Task DeleteCustomerAsync(Guid id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null)
        {
            throw new Exception("Customer not found.");
        }

        await _customerRepository.DeleteAsync(id);
    }

    private CustomerResponse MapToResponse(Customer customer)
    {
        return new CustomerResponse
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Document = customer.Document,
            Phone = customer.Phone,
            Address = new AddressResponse
            {
                Street = customer.Address.Street,
                Neighborhood = customer.Address.Neighborhood,
                City = customer.Address.City,
                State = customer.Address.State,
                ZipCode = customer.Address.ZipCode
            }
        };
    }
}
