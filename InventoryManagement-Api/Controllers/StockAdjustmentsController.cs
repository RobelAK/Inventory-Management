using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryManagement.Api.Data;
using InventoryManagement.Api.Models;

namespace InventoryManagement.Api.Controllers;
[Authorize(Roles = "Admin,InventoryManager")]
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
    public async Task<ActionResult> AddStock(int productId, [FromBody] StockAdjustmentModel model)
    {
        if (model.Quantity <= 0) return BadRequest("Quantity must be positive.");

        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound("Product not found.");

        // Manual concurrency check
        if (product.ConcurrencyGuid != model.OriginalConcurrencyGuid)
        {
            return Conflict("Concurrency conflict: The product was modified by another user. Please refresh.");
        }

        product.CurrentQuantity += model.Quantity;

        var transaction = new StockTransaction
        {
            ProductId = productId,
            DateTime = DateTime.Now,
            Type = TransactionType.Add,
            QuantityChanged = model.Quantity,
            NewTotal = product.CurrentQuantity
        };

        _context.StockTransactions.Add(transaction);
        await _context.SaveChangesAsync(); // Interceptor generates new GUID

        return Ok(new { NewQuantity = product.CurrentQuantity });
    }

    [HttpPost("remove/{productId}")]
    public async Task<ActionResult> RemoveStock(int productId, [FromBody] StockAdjustmentModel model)
    {
        if (model.Quantity <= 0) return BadRequest("Quantity must be positive.");

        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound("Product not found.");
        // Manual concurrency check
        if (product.ConcurrencyGuid != model.OriginalConcurrencyGuid)
        {
            return Conflict("Concurrency conflict: The product was modified by another user. Please refresh.");
        }

        if (product.CurrentQuantity < model.Quantity)
        {
            return BadRequest($"Insufficient stock. Current: {product.CurrentQuantity}, Requested removal: {model.Quantity}");
        }

        product.CurrentQuantity -= model.Quantity;

        var transaction = new StockTransaction
        {
            ProductId = productId,
            DateTime = DateTime.Now,
            Type = TransactionType.Remove,
            QuantityChanged = model.Quantity,
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