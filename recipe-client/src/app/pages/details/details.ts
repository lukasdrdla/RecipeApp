import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Recipe, Ingredient } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-details',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container">
    <div class="header">
      <button class="back-btn" (click)="back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
        Back to Recipes
      </button>
      <h1 class="title">{{ isNew ? 'Create New Recipe' : 'Edit Recipe' }}</h1>
    </div>

    <div class="form-container">
      <form (ngSubmit)="save()" class="recipe-form">
        <div class="form-group">
          <label class="form-label">Recipe Title</label>
          <input 
            class="form-input" 
            [(ngModel)]="model.title" 
            name="title" 
            required 
            placeholder="Enter recipe title..."
          />
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea 
            class="form-textarea" 
            [(ngModel)]="model.description" 
            name="description"
            placeholder="Describe your recipe..."
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Ingredients</label>
          <div class="ingredients-container">
            <div class="multi-select">
              <div class="multi-select-input" (click)="toggleDropdown()">
                <div class="selected-items">
                  <span *ngIf="selectedIngredients.length === 0" class="placeholder">
                    Select ingredients...
                  </span>
                  <div *ngFor="let ing of selectedIngredients" class="selected-item">
                    {{ ing.name }}
                    <button type="button" (click)="removeIngredient(ing.id)" class="remove-btn">×</button>
                  </div>
                </div>
                <div class="dropdown-arrow" [class.open]="isDropdownOpen">▼</div>
              </div>
              
              <div class="dropdown" [class.open]="isDropdownOpen">
                <div class="search-container">
                  <input 
                    type="text" 
                    placeholder="Search ingredients..." 
                    [(ngModel)]="ingredientSearch"
                    (input)="filterIngredients()"
                    name="ingredientSearch"
                    class="search-input"
                  />
                </div>
                <div class="options">
                  <div 
                    *ngFor="let ing of filteredIngredients" 
                    (click)="toggleIngredient(ing)"
                    class="option"
                    [class.selected]="isIngredientSelected(ing.id)"
                  >
                    <div class="option-content">
                      <span class="ingredient-name">{{ ing.name }}</span>
                      <span class="ingredient-category">{{ ing.category }}</span>
                    </div>
                    <div class="checkmark" *ngIf="isIngredientSelected(ing.id)">✓</div>
                  </div>
                  <div *ngIf="filteredIngredients.length === 0" class="no-results">
                    No ingredients found
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="save-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17,21 17,13 7,13 7,21"></polyline>
              <polyline points="7,3 7,8 15,8"></polyline>
            </svg>
            {{ isNew ? 'Create Recipe' : 'Save Changes' }}
          </button>
          
          <button *ngIf="!isNew" type="button" class="delete-btn" (click)="remove()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
            Delete Recipe
          </button>
        </div>
      </form>

      <div *ngIf="!isNew && linkedIngredients.length > 0" class="ingredients-preview">
        <h3 class="preview-title">Selected Ingredients</h3>
        <div class="ingredients-grid">
          <div *ngFor="let ing of linkedIngredients" class="ingredient-tag">
            <span class="ingredient-name">{{ ing.name }}</span>
            <span class="ingredient-category">{{ ing.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .header {
      margin-bottom: 2rem;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: 2px solid #e5e7eb;
      color: #6b7280;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 1rem;
    }

    .back-btn:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    .form-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      .form-container {
        grid-template-columns: 2fr 1fr;
      }
    }

    .recipe-form {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
      box-sizing: border-box;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .ingredients-container {
      position: relative;
    }

    .multi-select {
      position: relative;
      width: 100%;
    }

    .multi-select-input {
      min-height: 48px;
      padding: 0.5rem 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .multi-select-input:hover {
      border-color: #d1d5db;
    }

    .multi-select-input:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .selected-items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      flex: 1;
      align-items: center;
    }

    .placeholder {
      color: #9ca3af;
      font-style: italic;
    }

    .selected-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .remove-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
      padding: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    }

    .remove-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .dropdown-arrow {
      color: #6b7280;
      font-size: 0.75rem;
      transition: transform 0.2s ease;
    }

    .dropdown-arrow.open {
      transform: rotate(180deg);
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 2px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 300px;
      overflow: hidden;
      display: none;
    }

    .dropdown.open {
      display: block;
    }

    .search-container {
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .search-input:focus {
      border-color: #667eea;
    }

    .options {
      max-height: 200px;
      overflow-y: auto;
    }

    .option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border-bottom: 1px solid #f3f4f6;
    }

    .option:hover {
      background-color: #f9fafb;
    }

    .option.selected {
      background-color: #eff6ff;
    }

    .option-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .ingredient-name {
      font-weight: 500;
      color: #374151;
    }

    .ingredient-category {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .checkmark {
      color: #667eea;
      font-weight: bold;
      font-size: 1rem;
    }

    .no-results {
      padding: 1rem;
      text-align: center;
      color: #6b7280;
      font-style: italic;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .save-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .save-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }

    .delete-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .delete-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
    }

    .ingredients-preview {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
      height: fit-content;
    }

    .preview-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 1rem 0;
    }

    .ingredients-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .ingredient-tag {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .ingredient-name {
      font-weight: 600;
      color: #374151;
    }

    .ingredient-category {
      font-size: 0.875rem;
      color: #6b7280;
      background: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .title {
        font-size: 2rem;
      }

      .recipe-form {
        padding: 1.5rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .save-btn,
      .delete-btn {
        justify-content: center;
      }
    }
  `]
})
export class DetailsComponent implements OnInit {
  isNew = false;
  id?: string;
  model: Recipe = { title: '', description: '', ingredientIds: [] };
  allIngredients: Ingredient[] = [];
  linkedIngredients: Ingredient[] = [];
  
  // Multi-select properties
  selectedIngredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  ingredientSearch = '';
  isDropdownOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  async ngOnInit() {
    this.allIngredients = await this.api.getIngredients();
    this.filteredIngredients = [...this.allIngredients];
    this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isNew = !this.id;

    if (!this.isNew && this.id) {
      this.model = await this.api.getRecipe(this.id);
      await this.loadLinked();
      this.updateSelectedIngredients();
    }
  }

  async loadLinked() {
    this.linkedIngredients = [];
    console.log('Loading linked ingredients for IDs:', this.model.ingredientIds);
    
    for (const ingId of this.model.ingredientIds || []) {
      try {
        console.log('Fetching ingredient with ID:', ingId);
        const ing = await this.api.getIngredient(ingId);
        console.log('Found ingredient:', ing);
        this.linkedIngredients.push(ing);
      } catch (error) {
        console.error('Error loading ingredient:', ingId, error);
      }
    }
    
    console.log('Final linked ingredients:', this.linkedIngredients);
  }

  async save() {
    console.log('Saving recipe with model:', this.model);
    console.log('Model ingredientIds:', this.model.ingredientIds);
    
    try {
      if (this.isNew) {
        // For new recipes, don't send ID
        const createModel = {
          title: this.model.title,
          description: this.model.description,
          ingredientIds: this.model.ingredientIds
        };
        console.log('Creating recipe with:', createModel);
        await this.api.createRecipe(createModel);
      } else if (this.id) {
        await this.api.updateRecipe(this.id, this.model);
      }
      this.back(true);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error saving recipe. Check console for details.');
    }
  }

  async remove() {
    if (!this.id) return;
    if (confirm('Delete this recipe?')) {
      await this.api.deleteRecipe(this.id);
      this.back(true);
    }
  }

  back(refresh = false) {
    // návrat na Home; Angular router sám zachová/obnoví, případně můžeš řešit state
    this.router.navigate(['/']);
  }

  // Multi-select methods
  updateSelectedIngredients() {
    console.log('Updating selected ingredients...');
    console.log('All ingredients:', this.allIngredients);
    console.log('Model ingredient IDs:', this.model.ingredientIds);
    
    this.selectedIngredients = this.allIngredients.filter(ing => 
      this.model.ingredientIds?.includes(ing.id)
    );
    
    console.log('Selected ingredients:', this.selectedIngredients);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.ingredientSearch = '';
      this.filterIngredients();
    }
  }

  filterIngredients() {
    if (!this.ingredientSearch.trim()) {
      this.filteredIngredients = [...this.allIngredients];
    } else {
      this.filteredIngredients = this.allIngredients.filter(ing =>
        ing.name.toLowerCase().includes(this.ingredientSearch.toLowerCase()) ||
        ing.category?.toLowerCase().includes(this.ingredientSearch.toLowerCase())
      );
    }
  }

  toggleIngredient(ingredient: Ingredient) {
    if (this.isIngredientSelected(ingredient.id)) {
      this.removeIngredient(ingredient.id);
    } else {
      this.addIngredient(ingredient);
    }
  }

  addIngredient(ingredient: Ingredient) {
    if (!this.isIngredientSelected(ingredient.id)) {
      this.selectedIngredients.push(ingredient);
      this.model.ingredientIds = this.selectedIngredients.map(ing => ing.id);
    }
  }

  removeIngredient(ingredientId: string) {
    this.selectedIngredients = this.selectedIngredients.filter(ing => ing.id !== ingredientId);
    this.model.ingredientIds = this.selectedIngredients.map(ing => ing.id);
  }

  isIngredientSelected(ingredientId: string): boolean {
    return this.selectedIngredients.some(ing => ing.id === ingredientId);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select')) {
      this.isDropdownOpen = false;
    }
  }
}