using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryManagement.Api.Data;
using InventoryManagement.Api.Models;

namespace InventoryManagement.Api.Controllers;
[Authorize(Roles = "Admin,InventoryManager")]
[Route("api/[controller]")]
[ApiController]
public class HistoricalStockController : ControllerBase
{
    private readonly WarehouseDbContext _context;

    public HistoricalStockController(WarehouseDbContext context)
    {
        _context = context;
    }

    [HttpGet("{productId}")]
    public async Task<ActionResult<int>> GetHistoricalStock(int productId, [FromQuery] DateTime asOf)
    {
        if (asOf == default)
            return BadRequest("'asOf' is required.");

        asOf = DateTime.SpecifyKind(asOf, DateTimeKind.Unspecified);

        var latestTransaction = await _context.StockTransactions
            .Where(t => t.ProductId == productId && t.DateTime <= asOf)
            .OrderByDescending(t => t.DateTime)  // Most recent first
            .FirstOrDefaultAsync();

        // If no transactions yet → stock = 0
        // If transactions exist → return the snapshot NewTotal
        return Ok(latestTransaction?.NewTotal ?? 0);
    }

}

//var transactions = await _context.StockTransactions
//            .Where(t => t.ProductId == productId && t.DateTime <= asOf)
//            .OrderBy(t => t.DateTime)
//            .ToListAsync();

//    int stockAtTime = transactions.Sum(t =>
//        t.Type == TransactionType.Add ? t.QuantityChanged : -t.QuantityChanged);

//        return Ok(stockAtTime);