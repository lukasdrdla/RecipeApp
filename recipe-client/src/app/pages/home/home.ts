import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Recipe } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle';
import { ThemeService } from '../../services/theme.service';
import { RecipeSkeletonComponent } from '../../components/recipe-skeleton/recipe-skeleton';
import { StatisticsComponent } from '../../components/statistics/statistics';
import { ExportService } from '../../services/export.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent, RecipeSkeletonComponent, StatisticsComponent],
  selector: 'app-home',
  template: `
  <div class="container">
    <header class="header">
      <div class="header-top">
        <div>
          <h1 class="title">Recipe Collection</h1>
          <p class="subtitle">Discover and manage your favorite recipes</p>
        </div>
        <app-theme-toggle></app-theme-toggle>
      </div>
    </header>

    <app-statistics [recipes]="recipes"></app-statistics>

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
      <div class="action-buttons">
        <button class="action-btn" (click)="onExport()" title="Export all recipes">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export
        </button>
        <button class="action-btn" (click)="onImport()" title="Import recipes from file">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Import
        </button>
        <button class="new-btn" (click)="onNew()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Recipe
        </button>
        <button class="action-btn" (click)="onIngredients()" title="Manage ingredients">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v6"></path>
            <path d="M5 11h14"></path>
            <path d="M6 22h12"></path>
          </svg>
          Ingredients
        </button>
      </div>
    </div>
    <input type="file" accept=".json" style="display: none;" #fileInput (change)="onFileSelected($event)" />

    <div class="loading-state" *ngIf="isLoading">
      <div class="recipes-grid skeleton-grid">
        <app-recipe-skeleton *ngFor="let i of [1,2,3,4,5,6]"></app-recipe-skeleton>
      </div>
    </div>

    <div class="recipes-grid" *ngIf="recipes && recipes.length > 0 && !isLoading">
      <div *ngFor="let r of recipes" (click)="open(r)" class="recipe-card">
        <div class="recipe-image" *ngIf="r.imageUrl">
          <img [src]="r.imageUrl" [alt]="r.title" />
        </div>
        <div class="recipe-image-placeholder" *ngIf="!r.imageUrl">
          <span>🍳</span>
        </div>
        <div class="recipe-content">
          <div class="recipe-header">
            <h3 class="recipe-title">{{ r.title }}</h3>
            <div class="recipe-meta">
              <div class="ingredient-count">{{ r.ingredientIds?.length || 0 }} ingredients</div>
              <div class="recipe-rating" *ngIf="r.rating">
                <span class="rating-stars">
                  <span *ngFor="let i of [1,2,3,4,5]" [class.filled]="i <= (r.rating || 0)">★</span>
                </span>
                <span class="rating-value">({{ r.rating | number:'1.1-1' }})</span>
              </div>
            </div>
          </div>
          <p class="recipe-description">{{ r.description || 'No description available' }}</p>
          <div class="recipe-footer">
            <span class="view-recipe">View Recipe →</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination" *ngIf="totalPages > 1 && !isLoading">
      <button
        class="pagination-btn"
        [disabled]="currentPage === 1"
        (click)="onPageChange(currentPage - 1)"
      >
        ← Previous
      </button>
      <div class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }} ({{ total }} recipes)
      </div>
      <button
        class="pagination-btn"
        [disabled]="currentPage === totalPages"
        (click)="onPageChange(currentPage + 1)"
      >
        Next →
      </button>
    </div>

    <div class="empty-state" *ngIf="(!recipes || recipes.length === 0) && !isLoading">
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
      margin-bottom: 3rem;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .header-top > div {
      flex: 1;
      text-align: center;
      min-width: 250px;
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

    .action-buttons {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      color: #374151;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-size: 0.9375rem;
    }

    .action-btn:hover {
      background: #f9fafb;
      border-color: #d1d5db;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    :host-context(.dark) .action-btn {
      background: #1f2937;
      border-color: #374151;
      color: #e5e7eb;
    }

    :host-context(.dark) .action-btn:hover {
      background: #374151;
      border-color: #4b5563;
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

    .skeleton-grid {
      width: 100%;
    }

    .recipe-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .recipe-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 1;
    }

    .recipe-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .recipe-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .recipe-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .recipe-image-placeholder {
      width: 100%;
      height: 200px;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
    }

    .recipe-content {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .recipe-header {
      margin-bottom: 1rem;
    }

    .recipe-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
    }

    .recipe-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
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

    .recipe-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .rating-stars {
      color: #e5e7eb;
      font-size: 1rem;
      display: inline-flex;
      gap: 0.125rem;
    }

    .rating-stars .filled {
      color: #fbbf24;
    }

    .rating-value {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
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

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      margin: 3rem 0;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      flex-wrap: wrap;
    }

    .pagination-btn {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-info {
      color: #6b7280;
      font-size: 0.9375rem;
      font-weight: 500;
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
  currentPage = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  private searchTimeout: any;

  @ViewChild('fileInput') fileInput!: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private toast: ToastService,
    private theme: ThemeService,
    private exportService: ExportService
  ) {}

  async ngOnInit() {
    await this.loadRecipes();
  }

  async loadRecipes(page: number = 1) {
    this.isLoading = true;
    this.currentPage = page;
    try {
      const response = this.q.trim()
        ? await this.api.searchRecipes(this.q.trim(), page, this.limit)
        : await this.api.getRecipes(page, this.limit);
      
      // Safety check for response
      // Handle both paginated response (new) and direct array (old format)
      if (Array.isArray(response)) {
        // Old format: direct array
        this.recipes = response;
        this.total = response.length;
        this.totalPages = 1;
      } else if (response && response.data) {
        // New format: paginated response
        this.recipes = response.data;
        this.total = response.total || 0;
        this.totalPages = response.totalPages || 0;
      } else {
        this.recipes = [];
        this.total = 0;
        this.totalPages = 0;
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      this.toast.error('Failed to load recipes');
      this.recipes = [];
      this.total = 0;
      this.totalPages = 0;
    } finally {
      this.isLoading = false;
    }
  }

  onSearchInput() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }

  async onSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    await this.performSearch();
  }

  private async performSearch() {
    this.currentPage = 1;
    await this.loadRecipes(1);
  }

  async onPageChange(page: number) {
    await this.loadRecipes(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onNew() {
    this.router.navigate(['/new']);
  }

  onIngredients() {
    this.router.navigate(['/ingredients']);
  }

  open(r: Recipe) {
    this.router.navigate(['/details', r.id]);
  }

  onExport() {
    // Get all recipes (not just current page)
    this.api.getRecipes(1, 1000).then(response => {
      const allRecipes = Array.isArray(response) ? response : response.data;
      this.exportService.exportRecipes(allRecipes);
      this.toast.success(`Exported ${allRecipes.length} recipes!`);
    }).catch(() => {
      // Fallback: export current page
      this.exportService.exportRecipes(this.recipes);
      this.toast.success(`Exported ${this.recipes.length} recipes!`);
    });
  }

  onImport() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const recipes = await this.exportService.importRecipes(file);
      
      // Import each recipe
      let successCount = 0;
      let errorCount = 0;
      
      for (const recipe of recipes) {
        try {
          await this.api.createRecipe({
            title: recipe.title,
            description: recipe.description,
            ingredientIds: recipe.ingredientIds || [],
            rating: recipe.rating,
            imageUrl: recipe.imageUrl
          });
          successCount++;
        } catch {
          errorCount++;
        }
      }

      if (successCount > 0) {
        this.toast.success(`Imported ${successCount} recipes successfully!`);
        await this.loadRecipes(this.currentPage);
      }
      
      if (errorCount > 0) {
        this.toast.warning(`${errorCount} recipes failed to import.`);
      }
      
      // Reset file input
      input.value = '';
    } catch (error: any) {
      this.toast.error(error.message || 'Failed to import recipes.');
    }
  }
}