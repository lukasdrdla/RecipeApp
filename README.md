# Recipe App

Kompletní aplikace pro správu receptů s MongoDB, .NET 8 Web API a Angular frontendem.

## Architektura

### Backend (.NET 8 Web API)
- **Modely**: Recipe, Ingredient
- **Databáze**: MongoDB Atlas
- **API**: 7+ endpointů pro CRUD operace a vyhledávání

### Frontend (Angular)
- **Stránky**: Home (seznam + vyhledávání), Details (detail + editace)
- **Routing**: Standalone komponenty
- **Styling**: SCSS

## Spuštění

### 1. MongoDB Setup
1. Vytvořte cluster v MongoDB Atlas
2. Nastavte Database Access (uživatel/heslo)
3. Nastavte Network Access (0.0.0.0/0 pro vývoj)
4. Zkopírujte connection string

### 2. Backend (.NET API)
```bash
cd RecipeApi
# Aktualizujte connection string v appsettings.Development.json
dotnet run
# API bude dostupné na: http://localhost:5000
# Swagger UI: http://localhost:5000/swagger
```

### 3. Frontend (Angular)
```bash
cd recipe-client
npm install
ng serve
# Aplikace bude dostupná na: http://localhost:4200
```

## API Endpointy

- `GET /api/recipes` - všechny recepty
- `GET /api/recipes/{id}` - recept dle ID
- `GET /api/ingredients/{id}` - ingredience dle ID
- `GET /api/recipes/search?q=term` - full-text vyhledávání
- `POST /api/recipes` - přidání receptu
- `PUT /api/recipes/{id}` - úprava receptu
- `DELETE /api/recipes/{id}` - smazání receptu

## Seed Data

Pro testování můžete použít následující MongoDB příkazy:

```javascript
use recipe_app;

// Ingredients
db.ingredients.insertMany([
  { name: "Flour", category: "Baking" },
  { name: "Eggs", category: "Dairy" },
  { name: "Milk", category: "Dairy" },
  { name: "Sugar", category: "Baking" },
  { name: "Banana", category: "Fruit" }
]);

const ing = db.ingredients.find().toArray();

// Recipes
db.recipes.insertMany([
  { title: "Pancakes", description: "Fluffy pancakes with maple syrup", ingredientIds: [ing[0]._id, ing[1]._id, ing[2]._id] },
  { title: "Banana Smoothie", description: "Quick breakfast smoothie", ingredientIds: [ing[4]._id, ing[2]._id] },
  { title: "French Toast", description: "Golden and crispy", ingredientIds: [ing[1]._id, ing[2]._id, ing[3]._id] },
  { title: "Crepes", description: "Thin pancakes for sweet or savory", ingredientIds: [ing[0]._id, ing[1]._id, ing[2]._id] },
  { title: "Cake Base", description: "Basic sponge cake base", ingredientIds: [ing[0]._id, ing[1]._id, ing[3]._id] }
]);

// Text index
db.recipes.createIndex({ title: "text", description: "text" });
```

## Funkce

- ✅ Seznam všech receptů
- ✅ Vyhledávání receptů (full-text)
- ✅ Detail receptu s ingrediencemi
- ✅ Přidání nového receptu
- ✅ Editace existujícího receptu
- ✅ Smazání receptu
- ✅ Propojení receptů s ingrediencemi
- ✅ Responsive design
