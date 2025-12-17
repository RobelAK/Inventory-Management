using System;

namespace InventoryManagement.Api.Models;

public enum TransactionType
{
    Add,
    Remove
}

public class StockTransaction
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public DateTime DateTime { get; set; }
    public TransactionType Type { get; set; }
    public int QuantityChanged { get; set; } // Always positive number
    public int NewTotal { get; set; } // Snapshot of quantity after this transaction
}