namespace RecipeApi.Models;

public class CreateRecipeDto
{
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public List<string> IngredientIds { get; set; } = new();
    public double? Rating { get; set; }
    public string? ImageUrl { get; set; }
}
