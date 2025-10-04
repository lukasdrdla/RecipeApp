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
}
