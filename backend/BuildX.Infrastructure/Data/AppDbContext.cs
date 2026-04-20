using Microsoft.EntityFrameworkCore;
using BuildX.Domain.Entities;

namespace BuildX.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Document).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.Document).IsUnique();
            
            // Address as Owned Type (Value Object) to keep it in the same table for performance
            entity.OwnsOne(c => c.Address, a =>
            {
                a.Property(p => p.Street).HasMaxLength(255);
                a.Property(p => p.Neighborhood).HasMaxLength(100);
                a.Property(p => p.City).HasMaxLength(100);
                a.Property(p => p.State).HasMaxLength(2);
                a.Property(p => p.ZipCode).HasMaxLength(10);
            });
        });

        base.OnModelCreating(modelBuilder);
    }
}
