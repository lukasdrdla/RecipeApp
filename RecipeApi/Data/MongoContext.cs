using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RecipeApi.Models;

namespace RecipeApi.Data;

public class MongoSettings
{
    public string ConnectionString { get; set; } = default!;
    public string Database { get; set; } = default!;
    public string RecipesCollection { get; set; } = "recipes";
    public string IngredientsCollection { get; set; } = "ingredients";
}

public class MongoContext
{
    private readonly IMongoDatabase _db;
    public IMongoCollection<Recipe> Recipes { get; }
    public IMongoCollection<Ingredient> Ingredients { get; }

    public MongoContext(IOptions<MongoSettings> options)
    {
        var client = new MongoClient(options.Value.ConnectionString);
        _db = client.GetDatabase(options.Value.Database);
        Recipes     = _db.GetCollection<Recipe>(options.Value.RecipesCollection);
        Ingredients = _db.GetCollection<Ingredient>(options.Value.IngredientsCollection);

        // zajistí existenci text indexu při startu (idempotentní)
        var indexKeys = Builders<Recipe>.IndexKeys.Text(r => r.Title).Text(r => r.Description);
        var indexModel = new CreateIndexModel<Recipe>(indexKeys);
        Recipes.Indexes.CreateOne(indexModel);
    }
}
