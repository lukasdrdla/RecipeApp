import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Recipe {
  id?: string;
  title: string;
  description?: string;
  ingredientIds: string[];
  rating?: number;
  imageUrl?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
  getRecipes(page: number = 1, limit: number = 10) {
    return firstValueFrom(this.http.get<PaginatedResponse<Recipe>>(`${this.baseUrl}/recipes`, { params: { page, limit } }));
  }
  searchRecipes(q: string, page: number = 1, limit: number = 10) {
    return firstValueFrom(this.http.get<PaginatedResponse<Recipe>>(`${this.baseUrl}/recipes/search`, { params: { q, page, limit } }));
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
  updateRating(id: string, rating: number) {
    return firstValueFrom(this.http.put<Recipe>(`${this.baseUrl}/recipes/${id}/rating`, rating));
  }

  // Ingredients
  getIngredient(id: string) {
    return firstValueFrom(this.http.get<Ingredient>(`${this.baseUrl}/ingredients/${id}`));
  }
  getIngredients() {
    return firstValueFrom(this.http.get<Ingredient[]>(`${this.baseUrl}/ingredients`));
  }
  createIngredient(ingredient: Partial<Ingredient>) {
    return firstValueFrom(this.http.post<Ingredient>(`${this.baseUrl}/ingredients`, ingredient));
  }

  updateIngredient(id: string, ingredient: Partial<Ingredient>) {
    return firstValueFrom(this.http.put<Ingredient>(`${this.baseUrl}/ingredients/${id}`, ingredient));
  }

  deleteIngredient(id: string) {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/ingredients/${id}`));
  }
}
