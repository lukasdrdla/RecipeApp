using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using RecipeApi.Data;
using RecipeApi.Models;

namespace RecipeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    private readonly MongoContext _ctx;

    public RecipesController(MongoContext ctx)
    {
        _ctx = ctx;
    }

    // GET /api/recipes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetAll()
        => Ok(await _ctx.Recipes.Find(_ => true).ToListAsync());

    // GET /api/recipes/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Recipe>> GetById(string id)
    {
        var recipe = await _ctx.Recipes.Find(r => r.Id == id).FirstOrDefaultAsync();
        return recipe is null ? NotFound() : Ok(recipe);
    }

    // GET /api/recipes/search?q=term
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Recipe>>> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q)) return Ok(new List<Recipe>());
        
        // Create regex pattern for prefix search (case insensitive)
        var regexPattern = $"^{q}";
        var regex = new MongoDB.Bson.BsonRegularExpression(regexPattern, "i");
        
        // Search in both title and description
        var titleFilter = Builders<Recipe>.Filter.Regex(r => r.Title, regex);
        var descriptionFilter = Builders<Recipe>.Filter.Regex(r => r.Description, regex);
        var combinedFilter = Builders<Recipe>.Filter.Or(titleFilter, descriptionFilter);
        
        var items = await _ctx.Recipes.Find(combinedFilter).ToListAsync();
        return Ok(items);
    }

    // POST /api/recipes
    [HttpPost]
    public async Task<ActionResult<Recipe>> Create([FromBody] CreateRecipeDto input)
    {
        try
        {
            var recipe = new Recipe
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = input.Title ?? "",
                Description = input.Description,
                IngredientIds = input.IngredientIds ?? new List<string>()
            };

            Console.WriteLine($"Creating recipe: {recipe.Title}, IngredientIds: {string.Join(", ", recipe.IngredientIds)}");
            await _ctx.Recipes.InsertOneAsync(recipe);
            return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating recipe: {ex.Message}");
            return BadRequest($"Error creating recipe: {ex.Message}");
        }
    }

    // PUT /api/recipes/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<Recipe>> Update(string id, [FromBody] Recipe update)
    {
        update.Id = id;
        var result = await _ctx.Recipes.ReplaceOneAsync(r => r.Id == id, update);
        if (result.MatchedCount == 0) return NotFound();
        return Ok(update);
    }

    // DELETE /api/recipes/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _ctx.Recipes.DeleteOneAsync(r => r.Id == id);
        return result.DeletedCount == 0 ? NotFound() : NoContent();
    }
}
