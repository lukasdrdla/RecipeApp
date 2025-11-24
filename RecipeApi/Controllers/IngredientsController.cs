using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RecipeApi.Data;
using RecipeApi.Models;

namespace RecipeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IngredientsController : ControllerBase
{
    private readonly MongoContext _ctx;

    public IngredientsController(MongoContext ctx) => _ctx = ctx;

    // GET /api/ingredients/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Ingredient>> GetById(string id)
    {
        var ing = await _ctx.Ingredients.Find(i => i.Id == id).FirstOrDefaultAsync();
        return ing is null ? NotFound() : Ok(ing);
    }

    // (volitelně: GET /api/ingredients pro dropdowny)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ingredient>>> GetAll()
        => Ok(await _ctx.Ingredients.Find(_ => true).ToListAsync());

    // POST /api/ingredients
    [HttpPost]
    public async Task<ActionResult<Ingredient>> Create([FromBody] Ingredient input)
    {
        // basic validation
        if (string.IsNullOrWhiteSpace(input?.Name)) return BadRequest("Name is required");

        var ing = new Ingredient { Name = input.Name, Category = input.Category };
        await _ctx.Ingredients.InsertOneAsync(ing);
        return CreatedAtAction(nameof(GetById), new { id = ing.Id }, ing);
    }

    // PUT /api/ingredients/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<Ingredient>> Update(string id, [FromBody] Ingredient input)
    {
        var existing = await _ctx.Ingredients.Find(i => i.Id == id).FirstOrDefaultAsync();
        if (existing is null) return NotFound();

        var update = Builders<Ingredient>.Update
            .Set(i => i.Name, input.Name ?? existing.Name)
            .Set(i => i.Category, input.Category);

        await _ctx.Ingredients.UpdateOneAsync(i => i.Id == id, update);
        var updated = await _ctx.Ingredients.Find(i => i.Id == id).FirstOrDefaultAsync();
        return Ok(updated);
    }

    // DELETE /api/ingredients/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var res = await _ctx.Ingredients.DeleteOneAsync(i => i.Id == id);
        if (res.DeletedCount == 0) return NotFound();
        return NoContent();
    }
}
