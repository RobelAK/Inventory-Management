using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryManagement.Api.Data;
using InventoryManagement.Api.Models;

namespace InventoryManagement.Api.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class StockAdjustmentsController : ControllerBase
{
    private readonly WarehouseDbContext _context;

    public StockAdjustmentsController(WarehouseDbContext context)
    {
        _context = context;
    }

    [HttpPost("add/{productId}")]
    public async Task<ActionResult> AddStock(int productId, [FromBody] int quantity)
    {
        if (quantity <= 0) return BadRequest("Quantity must be greater than zero.");

        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound("Product not found.");

        product.CurrentQuantity += quantity;

        var transaction = new StockTransaction
        {
            ProductId = productId,
            DateTime = DateTime.Now,
            Type = TransactionType.Add,
            QuantityChanged = quantity,
            NewTotal = product.CurrentQuantity
        };

        _context.StockTransactions.Add(transaction);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict("Concurrency conflict: Another operation modified the product simultaneously.");
        }

        return Ok(new { NewQuantity = product.CurrentQuantity });
    }

    [HttpPost("remove/{productId}")]
    public async Task<ActionResult> RemoveStock(int productId, [FromBody] int quantity)
    {
        if (quantity <= 0) return BadRequest("Quantity must be greater than zero.");

        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound("Product not found.");

        if (product.CurrentQuantity < quantity)
        {
            return BadRequest($"Insufficient stock. Current: {product.CurrentQuantity}, Requested removal: {quantity}");
        }

        product.CurrentQuantity -= quantity;

        var transaction = new StockTransaction
        {
            ProductId = productId,
            DateTime = DateTime.Now,
            Type = TransactionType.Remove,
            QuantityChanged = quantity,
            NewTotal = product.CurrentQuantity
        };

        _context.StockTransactions.Add(transaction);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict("Concurrency conflict: Only one removal succeeded in a race condition.");
        }

        return Ok(new { NewQuantity = product.CurrentQuantity });
    }
}