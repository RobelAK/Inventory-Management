using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using InventoryManagement.Api.Models;

namespace InventoryManagement.Api.Data;

public class WarehouseDbContext : IdentityDbContext<AppUser>
{
    public WarehouseDbContext(DbContextOptions<WarehouseDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<StockTransaction> StockTransactions => Set<StockTransaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.SKU).IsRequired().HasMaxLength(100);
            entity.HasIndex(p => p.SKU).IsUnique();
            entity.Property(p => p.Price).HasColumnType("decimal(18,2)");

            // GUID concurrency token
            entity.Property(p => p.ConcurrencyGuid)
                  .IsConcurrencyToken()
                  .ValueGeneratedOnAdd()  // Generate on insert
                  .HasDefaultValueSql("gen_random_uuid()");  // PostgreSQL generates random UUID
        });

        modelBuilder.Entity<StockTransaction>(entity =>
        {
            entity.HasKey(st => st.Id);
            entity.Property(st => st.DateTime)
                  .HasColumnType("timestamp without time zone")
                  .IsRequired();
            entity.Property(st => st.Type).HasConversion<string>();
            entity.Property(st => st.QuantityChanged).IsRequired();
            entity.Property(st => st.NewTotal).IsRequired();

            // Foreign key to Product with cascade delete
            entity.HasOne<Product>()
                  .WithMany()
                  .HasForeignKey(st => st.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}