using BuildX.Domain.Entities;
using BuildX.Domain.Interfaces;
using BuildX.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BuildX.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly AppDbContext _context;

    public CustomerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Customer?> GetByIdAsync(Guid id)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
    }

    public async Task<IEnumerable<Customer>> GetAllAsync()
    {
        return await _context.Customers
            .Where(c => !c.IsDeleted)
            .ToListAsync();
    }

    public async Task<Customer?> GetByDocumentAsync(string document)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.Document == document && !c.IsDeleted);
    }

    public async Task AddAsync(Customer customer)
    {
        await _context.Customers.AddAsync(customer);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Customer customer)
    {
        _context.Customers.Update(customer);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var customer = await GetByIdAsync(id);
        if (customer != null)
        {
            customer.IsDeleted = true;
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();
        }
    }
}
