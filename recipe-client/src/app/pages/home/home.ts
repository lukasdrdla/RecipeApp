import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Recipe } from '../../services/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-home',
  template: `
  <div class="container">
    <header class="header">
      <h1 class="title">🍳 Recipe Collection</h1>
      <p class="subtitle">Discover and manage your favorite recipes</p>
    </header>

    <div class="search-section">
      <div class="search-container">
        <input 
          class="search-input" 
          placeholder="Search recipes..." 
          [(ngModel)]="q" 
          (input)="onSearchInput()"
          (keyup.enter)="onSearch()" 
        />
        <button class="search-btn" (click)="onSearch()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
      <button class="new-btn" (click)="onNew()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Recipe
      </button>
    </div>

    <div class="loading-state" *ngIf="isLoading">
      <div class="loading-spinner"></div>
      <p>Searching recipes...</p>
    </div>

    <div class="recipes-grid" *ngIf="recipes.length > 0 && !isLoading">
      <div *ngFor="let r of recipes" (click)="open(r)" class="recipe-card">
        <div class="recipe-header">
          <h3 class="recipe-title">{{ r.title }}</h3>
          <div class="ingredient-count">{{ r.ingredientIds?.length || 0 }} ingredients</div>
        </div>
        <p class="recipe-description">{{ r.description || 'No description available' }}</p>
        <div class="recipe-footer">
          <span class="view-recipe">View Recipe →</span>
        </div>
      </div>
    </div>

    <div class="empty-state" *ngIf="recipes.length === 0 && !isLoading">
      <div class="empty-icon">🍽️</div>
      <h3>No recipes found</h3>
      <p>Start by creating your first recipe or try a different search term.</p>
      <button class="new-btn primary" (click)="onNew()">Create First Recipe</button>
    </div>
  </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .title {
      font-size: 3rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #6b7280;
      margin: 0;
    }

    .search-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-container {
      flex: 1;
      min-width: 300px;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .search-btn {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 6px;
      transition: color 0.2s ease;
    }

    .search-btn:hover {
      color: #667eea;
    }

    .new-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .new-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    .new-btn.primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .new-btn.primary:hover {
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }

    .recipes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .recipe-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .recipe-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .recipe-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .recipe-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .recipe-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      flex: 1;
    }

    .ingredient-count {
      background: #f3f4f6;
      color: #6b7280;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .recipe-description {
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 1rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .recipe-footer {
      display: flex;
      justify-content: flex-end;
    }

    .view-recipe {
      color: #667eea;
      font-weight: 600;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .recipe-card:hover .view-recipe {
      color: #764ba2;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      margin: 0 0 2rem 0;
      font-size: 1.1rem;
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state p {
      margin: 0;
      font-size: 1.1rem;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .title {
        font-size: 2rem;
      }

      .search-section {
        flex-direction: column;
        align-items: stretch;
      }

      .search-container {
        min-width: auto;
      }

      .recipes-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  recipes: Recipe[] = [];
  q = '';
  isLoading = false;
  private searchTimeout: any;

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    this.recipes = await this.api.getRecipes();
  }

  onSearchInput() {
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Set new timeout for debounced search
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300); // 300ms delay
  }

  async onSearch() {
    // Clear timeout and search immediately
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    await this.performSearch();
  }

  private async performSearch() {
    this.isLoading = true;
    try {
      this.recipes = this.q.trim()
        ? await this.api.searchRecipes(this.q.trim())
        : await this.api.getRecipes();
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to all recipes on error
      this.recipes = await this.api.getRecipes();
    } finally {
      this.isLoading = false;
    }
  }

  onNew() {
    this.router.navigate(['/new']);
  }

  open(r: Recipe) {
    this.router.navigate(['/details', r.id]);
  }
}