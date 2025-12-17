using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryManagement.Api.Data;
using InventoryManagement.Api.Models;

namespace InventoryManagement.Api.Controllers;
[Authorize]
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
    public async Task<ActionResult<int>> GetHistoricalStock(
    int productId,
    [FromQuery] DateTime asOf)
    {
        if (asOf == default)
            return BadRequest("'asOf' is required.");

        Console.WriteLine($"asOf (LOCAL): {asOf:yyyy-MM-dd HH:mm:ss}");
        Console.WriteLine($"Kind        : {asOf.Kind}");

        asOf = DateTime.SpecifyKind(asOf, DateTimeKind.Unspecified);

        var transactions = await _context.StockTransactions
            .Where(t =>
                t.ProductId == productId &&
                t.DateTime <= asOf)
            .OrderBy(t => t.DateTime)
            .ToListAsync();

        int stockAtTime = transactions.Sum(t =>
            t.Type == TransactionType.Add
                ? t.QuantityChanged
                : -t.QuantityChanged);

        return Ok(stockAtTime);
    }

}

//var transactions = await _context.StockTransactions
//            .Where(t => t.ProductId == productId && t.DateTime <= asOf)
//            .OrderBy(t => t.DateTime)
//            .ToListAsync();

//    int stockAtTime = transactions.Sum(t =>
//        t.Type == TransactionType.Add ? t.QuantityChanged : -t.QuantityChanged);

//        return Ok(stockAtTime);