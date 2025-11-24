import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Ingredient } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-ingredients',
  template: `
  <div class="container">
    <div class="header">
      <button class="back-btn" (click)="back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
        Back to Recipes
      </button>
      <div class="header-content">
        <h1 class="title">Ingredients</h1>
        <p class="subtitle">Manage your ingredient collection</p>
      </div>
    </div>

    <div class="layout">
      <div class="list-section">
        <div class="list-header">
          <div class="search-container">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              class="search-input" 
              placeholder="Search ingredients..." 
              [(ngModel)]="filter" 
              (input)="applyFilter()" 
            />
          </div>
          <button class="new-btn" (click)="startCreate()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Ingredient
          </button>
        </div>

        <div *ngIf="ingredients.length === 0" class="empty-state">
          <div class="empty-icon">🥬</div>
          <h3>No ingredients yet</h3>
          <p>Start by creating your first ingredient</p>
          <button class="create-first-btn" (click)="startCreate()">Create First Ingredient</button>
        </div>

        <div class="items" *ngIf="ingredients.length > 0">
          <div *ngFor="let ing of visibleIngredients" class="item-card">
            <div class="item-content">
              <div class="item-icon">🥗</div>
              <div class="item-info">
                <div class="item-name">{{ ing.name }}</div>
                <div class="item-category" *ngIf="ing.category">
                  <span class="category-badge">{{ ing.category }}</span>
                </div>
              </div>
            </div>
            <div class="item-actions">
              <button class="edit-btn" (click)="edit(ing)" title="Edit ingredient">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="delete-btn" (click)="remove(ing)" title="Delete ingredient">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="visibleIngredients.length === 0 && ingredients.length > 0" class="no-results">
          <div class="no-results-icon">🔍</div>
          <p>No ingredients match your search</p>
        </div>
      </div>

      <div class="editor-section">
        <div class="editor-card">
          <div class="editor-header">
            <h2 class="editor-title">
              <span *ngIf="!isEditing">✨ Create New Ingredient</span>
              <span *ngIf="isEditing">✏️ Edit Ingredient</span>
            </h2>
          </div>
          <form (ngSubmit)="save()" class="editor-form">
            <div class="form-group">
              <label class="form-label">Ingredient Name</label>
              <input 
                class="form-input" 
                required 
                [(ngModel)]="model.name" 
                name="name" 
                placeholder="e.g., Tomato, Onion, Garlic..."
              />
            </div>

            <div class="form-group">
              <label class="form-label">Category</label>
              <input 
                class="form-input" 
                [(ngModel)]="model.category" 
                name="category" 
                placeholder="e.g., Vegetable, Spice, Dairy..."
              />
            </div>

            <div class="editor-actions">
              <button type="submit" class="save-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17,21 17,13 7,13 7,21"></polyline>
                  <polyline points="7,3 7,8 15,8"></polyline>
                </svg>
                {{ isEditing ? 'Update' : 'Create' }} Ingredient
              </button>
              <button type="button" class="cancel-btn" (click)="cancel()" *ngIf="isEditing">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
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
      font-weight: 500;
    }

    .back-btn:hover {
      border-color: #667eea;
      color: #667eea;
      transform: translateX(-2px);
    }

    .header-content {
      text-align: center;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #6b7280;
      margin: 0;
    }

    .layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      .layout {
        grid-template-columns: 2fr 1fr;
      }
    }

    .list-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
    }

    .list-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .search-container {
      flex: 1;
      min-width: 250px;
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
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

    .items {
      display: grid;
      gap: 0.75rem;
    }

    .item-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
      border: 2px solid #f3f4f6;
      border-radius: 12px;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .item-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    .item-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .item-icon {
      font-size: 2rem;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-radius: 12px;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .item-name {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .item-category {
      display: flex;
      gap: 0.5rem;
    }

    .category-badge {
      font-size: 0.75rem;
      color: #667eea;
      background: #eff6ff;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 500;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
    }

    .edit-btn,
    .delete-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .edit-btn {
      background: #eff6ff;
      color: #667eea;
    }

    .edit-btn:hover {
      background: #dbeafe;
      transform: scale(1.1);
    }

    .delete-btn {
      background: #fef2f2;
      color: #ef4444;
    }

    .delete-btn:hover {
      background: #fee2e2;
      transform: scale(1.1);
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
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
      margin: 0 0 1.5rem 0;
      font-size: 1rem;
    }

    .create-first-btn {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
    }

    .create-first-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
    }

    .no-results-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .no-results p {
      margin: 0;
      font-style: italic;
    }

    .editor-section {
      position: sticky;
      top: 2rem;
      height: fit-content;
    }

    .editor-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
    }

    .editor-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f3f4f6;
    }

    .editor-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .editor-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input::placeholder {
      color: #9ca3af;
      font-style: italic;
    }

    .editor-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .save-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
    }

    .save-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }

    .cancel-btn {
      padding: 0.75rem 1.5rem;
      background: #f3f4f6;
      color: #6b7280;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
    }

    .cancel-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    @media (max-width: 1023px) {
      .editor-section {
        position: relative;
        top: 0;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .title {
        font-size: 2rem;
      }

      .list-section {
        padding: 1rem;
      }

      .editor-card {
        padding: 1.5rem;
      }

      .item-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .item-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class IngredientsComponent implements OnInit {
  ingredients: Ingredient[] = [];
  visibleIngredients: Ingredient[] = [];
  filter = '';

  model: Partial<Ingredient> = { name: '', category: '' };
  isEditing = false;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private toast: ToastService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    try {
      this.ingredients = await this.api.getIngredients();
      this.applyFilter();
    } catch (err) {
      console.error('Failed to load ingredients', err);
      this.toast.error('Failed to load ingredients');
    }
  }

  applyFilter() {
    const f = this.filter.trim().toLowerCase();
    this.visibleIngredients = f ? this.ingredients.filter(i => (i.name || '').toLowerCase().includes(f) || (i.category || '').toLowerCase().includes(f)) : [...this.ingredients];
  }

  startCreate() {
    this.isEditing = false;
    this.model = { name: '', category: '' };
  }

  edit(ing: Ingredient) {
    this.isEditing = true;
    this.model = { id: ing.id, name: ing.name, category: ing.category } as Partial<Ingredient>;
  }

  async save() {
    try {
      if (!this.model.name || !this.model.name.trim()) {
        this.toast.error('Name is required');
        return;
      }

      if (this.isEditing && this.model.id) {
        await this.api.updateIngredient(this.model.id, this.model);
        this.toast.success('Ingredient updated');
      } else {
        await this.api.createIngredient(this.model);
        this.toast.success('Ingredient created');
      }
      await this.load();
      this.startCreate();
    } catch (err) {
      console.error('Save failed', err);
      this.toast.error('Failed to save ingredient');
    }
  }

  async remove(ing: Ingredient) {
    if (!confirm(`Delete ingredient "${ing.name}"?`)) return;
    try {
      await this.api.deleteIngredient(ing.id);
      this.toast.success('Ingredient deleted');
      await this.load();
    } catch (err) {
      console.error('Delete failed', err);
      this.toast.error('Failed to delete ingredient');
    }
  }

  cancel() {
    this.startCreate();
  }

  back() {
    this.router.navigate(['/']);
  }
}
