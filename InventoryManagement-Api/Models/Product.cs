using Microsoft.AspNetCore.Mvc.ModelBinding;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CurrentQuantity { get; set; }

    [BindNever]  // Never trust client to set this on create/update
    public Guid ConcurrencyGuid { get; set; }
}