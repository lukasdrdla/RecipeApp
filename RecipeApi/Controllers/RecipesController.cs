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

    // GET /api/recipes?page=1&limit=10
    [HttpGet]
    public async Task<ActionResult<object>> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var skip = (page - 1) * limit;
        var total = await _ctx.Recipes.CountDocumentsAsync(_ => true);
        var recipes = await _ctx.Recipes
            .Find(_ => true)
            .SortByDescending(r => r.Id)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync();

        return Ok(new
        {
            data = recipes,
            total = (int)total,
            page = page,
            limit = limit,
            totalPages = (int)Math.Ceiling(total / (double)limit)
        });
    }

    // GET /api/recipes/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Recipe>> GetById(string id)
    {
        var recipe = await _ctx.Recipes.Find(r => r.Id == id).FirstOrDefaultAsync();
        return recipe is null ? NotFound() : Ok(recipe);
    }

    // GET /api/recipes/search?q=term&page=1&limit=10
    [HttpGet("search")]
    public async Task<ActionResult<object>> Search([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(q)) 
        {
            return Ok(new { data = new List<Recipe>(), total = 0, page = page, limit = limit, totalPages = 0 });
        }
        
        var skip = (page - 1) * limit;
        
        // Create regex pattern for prefix search (case insensitive)
        var regexPattern = $"^{q}";
        var regex = new MongoDB.Bson.BsonRegularExpression(regexPattern, "i");
        
        // Search in both title and description
        var titleFilter = Builders<Recipe>.Filter.Regex(r => r.Title, regex);
        var descriptionFilter = Builders<Recipe>.Filter.Regex(r => r.Description, regex);
        var combinedFilter = Builders<Recipe>.Filter.Or(titleFilter, descriptionFilter);
        
        var total = await _ctx.Recipes.CountDocumentsAsync(combinedFilter);
        var items = await _ctx.Recipes
            .Find(combinedFilter)
            .SortByDescending(r => r.Id)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync();
        
        return Ok(new
        {
            data = items,
            total = (int)total,
            page = page,
            limit = limit,
            totalPages = (int)Math.Ceiling(total / (double)limit)
        });
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
                IngredientIds = input.IngredientIds ?? new List<string>(),
                Rating = input.Rating,
                ImageUrl = input.ImageUrl
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

    // PUT /api/recipes/{id}/rating
    [HttpPut("{id}/rating")]
    public async Task<ActionResult<Recipe>> UpdateRating(string id, [FromBody] double rating)
    {
        if (rating < 0 || rating > 5)
            return BadRequest("Rating must be between 0 and 5");

        var update = Builders<Recipe>.Update.Set(r => r.Rating, rating);
        var result = await _ctx.Recipes.UpdateOneAsync(r => r.Id == id, update);
        
        if (result.MatchedCount == 0) return NotFound();
        
        var recipe = await _ctx.Recipes.Find(r => r.Id == id).FirstOrDefaultAsync();
        return Ok(recipe);
    }
}
