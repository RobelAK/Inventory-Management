using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using InventoryManagement.Api.Models;

public class ConcurrencyInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        UpdateConcurrencyTokens(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private static void UpdateConcurrencyTokens(DbContext? context)
    {
        if (context == null) return;

        var modifiedProducts = context.ChangeTracker
            .Entries<Product>()
            .Where(e => e.State == EntityState.Modified);

        foreach (var entry in modifiedProducts)
        {
            entry.Property(p => p.ConcurrencyGuid).CurrentValue = Guid.NewGuid();
        }
    }
}