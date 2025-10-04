import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Recipe {
  id?: string;
  title: string;
  description?: string;
  ingredientIds: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:5123/api';

  constructor(private http: HttpClient) {}

  // Recipes
  getRecipes() {
    return firstValueFrom(this.http.get<Recipe[]>(`${this.baseUrl}/recipes`));
  }
  searchRecipes(q: string) {
    return firstValueFrom(this.http.get<Recipe[]>(`${this.baseUrl}/recipes/search`, { params: { q } }));
  }
  getRecipe(id: string) {
    return firstValueFrom(this.http.get<Recipe>(`${this.baseUrl}/recipes/${id}`));
  }
  createRecipe(recipe: Recipe) {
    return firstValueFrom(this.http.post<Recipe>(`${this.baseUrl}/recipes`, recipe));
  }
  updateRecipe(id: string, recipe: Recipe) {
    return firstValueFrom(this.http.put<Recipe>(`${this.baseUrl}/recipes/${id}`, recipe));
  }
  deleteRecipe(id: string) {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/recipes/${id}`));
  }

  // Ingredients
  getIngredient(id: string) {
    return firstValueFrom(this.http.get<Ingredient>(`${this.baseUrl}/ingredients/${id}`));
  }
  getIngredients() {
    return firstValueFrom(this.http.get<Ingredient[]>(`${this.baseUrl}/ingredients`));
  }
}
