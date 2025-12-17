using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryManagement.Api.Data;
using InventoryManagement.Api.Models;
using Npgsql;

namespace InventoryManagement.Api.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly WarehouseDbContext _context;

    public ProductsController(WarehouseDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return product;
    }
    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        // Force initial quantity to 0
        product.CurrentQuantity = 0;

        _context.Products.Add(product);

        try
        {
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pgEx)
        {
            if (pgEx.SqlState == "23505") // PostgreSQL unique violation code
            {
                return Conflict("A product with this SKU already exists. SKU must be unique.");
            }

            return StatusCode(500, "An error occurred while saving the product.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest();
        }

        // Prevent direct modification of CurrentQuantity
        var existing = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        if (existing == null)
        {
            return NotFound();
        }
        product.CurrentQuantity = existing.CurrentQuantity;
        Console.WriteLine("this is product");
        Console.WriteLine(product);

        _context.Entry(product).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }

            return Conflict("The product was modified by another user. Please reload and try again.");
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProductExists(int id)
    {
        return _context.Products.Any(e => e.Id == id);
    }
}