# Recipe App

A modern full-stack application for saving and managing your favorite dishes. Built with .NET 8 Web API, Angular 17, and MongoDB Atlas.

## Project Overview

This Recipe App allows users to:
- Save and organize favorite recipes
- Rate recipes with a 5-star rating system
- Upload recipe images
- Search and filter recipes
- Export/Import recipes as JSON
- View statistics dashboard
- Switch between light and dark mode

## Architecture

### Backend (.NET 8 Web API)
- **Framework**: .NET 8 Minimal API
- **Database**: MongoDB Atlas (NoSQL)
- **Models**: Recipe, Ingredient, CreateRecipeDto
- **API Endpoints**: 8 RESTful endpoints with pagination support
- **Features**: Full-text search, CRUD operations, rating system

### Frontend (Angular 17)
- **Framework**: Angular 17 with Standalone Components
- **Pages**: Home (list + search), Details (view/edit/create)
- **Features**: Dark mode, pagination, toast notifications, loading skeletons
- **UI/UX**: Modern, responsive design with smooth animations

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB instance)

### 1. MongoDB Setup

1. Create a cluster in MongoDB Atlas
2. Set up Database Access (username/password)
3. Configure Network Access (0.0.0.0/0 for development)
4. Copy your connection string

### 2. Backend Setup

```bash
cd RecipeApi
# Update connection string in appsettings.Development.json
dotnet restore
dotnet run
```

**API Endpoints:**
- API: http://localhost:5123
- Swagger UI: http://localhost:5123/swagger

### 3. Frontend Setup

```bash
cd recipe-client
npm install
ng serve
```

**Application:**
- Frontend: http://localhost:4200

### 4. Configuration

**Backend** (`RecipeApi/appsettings.Development.json`):
```json
{
  "MongoDb": {
    "ConnectionString": "mongodb+srv://username:password@cluster.mongodb.net/",
    "Database": "recipe_app",
    "RecipesCollection": "recipes",
    "IngredientsCollection": "ingredients"
  }
}
```

**Frontend** (`recipe-client/src/app/services/api.service.ts`):
- Update `baseUrl` if your backend runs on a different port

## API Endpoints

### Recipes
- `GET /api/recipes?page=1&limit=10` - Get all recipes (paginated)
- `GET /api/recipes/{id}` - Get recipe by ID
- `GET /api/recipes/search?q=term&page=1&limit=10` - Search recipes (paginated)
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/{id}` - Update recipe
- `DELETE /api/recipes/{id}` - Delete recipe
- `PUT /api/recipes/{id}/rating` - Update recipe rating

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/{id}` - Get ingredient by ID

## Features

### Core Functionality
- **Recipe Management**: Create, read, update, delete recipes
- **Ingredient Management**: Link ingredients to recipes
- **Full-Text Search**: Search recipes by title and description
- **Pagination**: Efficient loading with page-based navigation
- **Rating System**: Rate recipes with 1-5 stars
- **Image Upload**: Upload and display recipe images (base64)
- **Export/Import**: Export recipes to JSON and import from file
- **Statistics Dashboard**: View recipe statistics (total, average rating, etc.)

### UI/UX Features
- **Dark Mode**: Toggle between light and dark themes
- **Loading Skeletons**: Professional loading states
- **Toast Notifications**: Success/error feedback messages
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Modern transitions and hover effects
- **Multi-Select Component**: Professional ingredient selector with search

## Database Schema

### Recipes Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  ingredientIds: [ObjectId],
  rating: Number (0-5),
  imageUrl: String (base64)
}
```

### Ingredients Collection
```javascript
{
  _id: ObjectId,
  name: String,
  category: String
}
```

## Seed Data

For testing, you can use the following MongoDB commands:

```javascript
use recipe_app;

// Clear existing data
db.recipes.deleteMany({});
db.ingredients.deleteMany({});

// Insert ingredients
db.ingredients.insertMany([
  { name: "Flour", category: "Baking" },
  { name: "Eggs", category: "Dairy" },
  { name: "Milk", category: "Dairy" },
  { name: "Sugar", category: "Baking" },
  { name: "Banana", category: "Fruit" },
  { name: "Butter", category: "Dairy" },
  { name: "Vanilla", category: "Spices" },
  { name: "Baking Powder", category: "Baking" }
]);

// Get ingredient IDs
const ingredients = db.ingredients.find().toArray();

// Insert recipes
db.recipes.insertMany([
  { 
    title: "Pancakes", 
    description: "Fluffy pancakes with maple syrup", 
    ingredientIds: [ingredients[0]._id, ingredients[1]._id, ingredients[2]._id, ingredients[5]._id, ingredients[7]._id],
    rating: 4.5
  },
  { 
    title: "Banana Smoothie", 
    description: "Quick breakfast smoothie", 
    ingredientIds: [ingredients[4]._id, ingredients[2]._id],
    rating: 4.0
  },
  { 
    title: "French Toast", 
    description: "Golden and crispy", 
    ingredientIds: [ingredients[1]._id, ingredients[2]._id, ingredients[3]._id, ingredients[5]._id],
    rating: 4.8
  }
]);

// Create text index
db.recipes.createIndex({ title: "text", description: "text" });
```

## Technology Stack

### Backend
- **.NET 8** - Web API framework
- **MongoDB.Driver** - MongoDB client library
- **Swashbuckle.AspNetCore** - Swagger/OpenAPI documentation

### Frontend
- **Angular 17** - Frontend framework
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Styling

### Database
- **MongoDB Atlas** - Cloud NoSQL database

## 📱 Screenshots

### Home Page
- Recipe cards with images and ratings
- Search functionality with real-time filtering
- Statistics dashboard
- Pagination controls
- Dark mode toggle

### Details Page
- Recipe form with all fields
- Multi-select ingredient picker
- Image upload with preview
- Rating system (for existing recipes)
- Edit/Delete functionality

## Assignment Requirements Compliance

**MongoDB Collections:**
- 2 collections (recipes, ingredients)
- 3+ fields in each collection
- 5+ documents in each collection
- Common field linking collections (ingredientIds)
- Text index on recipes collection

**API Endpoints:**
- GET all documents from one collection
- GET one document by ID (two endpoints, one for each collection)
- GET all documents by search (using text index)
- POST - Add a document
- PUT - Edit a document
- DELETE - Delete a document

**Client Application:**
- **Home Screen**: Displays all recipes, search filtering, navigation to Details, "New" button
- **Details Screen**: Shows recipe info with linked ingredients, Edit/Delete/New buttons, navigation back to Home with refresh

## Additional Features

- **Pagination**: Efficient data loading with page-based navigation
- **Rating System**: Rate recipes from 1-5 stars
- **Image Upload**: Upload and display recipe images
- **Dark Mode**: Toggle between light and dark themes with persistence
- **Toast Notifications**: User feedback for all actions
- **Loading Skeletons**: Professional loading states
- **Statistics Dashboard**: View recipe statistics
- **Export/Import**: Save and load recipes from JSON files

