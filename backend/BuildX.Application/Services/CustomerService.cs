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

    public async Task<CustomerResponse?> GetCustomerByIdAsync(Guid id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null) return null;
        return MapToResponse(customer);
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
