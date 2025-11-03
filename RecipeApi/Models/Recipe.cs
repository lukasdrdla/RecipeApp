using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecipeApi.Models;

public class Recipe
{
    [BsonId, BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = default!;

    [BsonElement("title")]
    public string Title { get; set; } = default!;

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("ingredientIds")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> IngredientIds { get; set; } = new();

    [BsonElement("rating")]
    public double? Rating { get; set; }

    [BsonElement("imageUrl")]
    public string? ImageUrl { get; set; }
}
