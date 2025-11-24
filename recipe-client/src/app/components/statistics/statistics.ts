import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../services/api.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-statistics',
  template: `
    <div class="statistics-container">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ totalRecipes }}</div>
          <div class="stat-label">Total Recipes</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ averageRating | number:'1.1-1' }}</div>
          <div class="stat-label">Average Rating</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ totalIngredients }}</div>
          <div class="stat-label">Total Ingredients</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ ratedRecipes }}</div>
          <div class="stat-label">Rated Recipes</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .statistics-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    :host-context(.dark) .stat-card {
      background: #1f2937;
      border-color: #374151;
    }

    :host-context(.dark) .stat-label {
      color: #9ca3af;
    }

    @media (max-width: 768px) {
      .statistics-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class StatisticsComponent {
  @Input() recipes: Recipe[] = [];

  get totalRecipes(): number {
    return this.recipes.length;
  }

  get averageRating(): number {
    const rated = this.recipes.filter(r => r.rating && r.rating > 0);
    if (rated.length === 0) return 0;
    const sum = rated.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / rated.length;
  }

  get totalIngredients(): number {
    const uniqueIngredients = new Set<string>();
    this.recipes.forEach(r => {
      r.ingredientIds?.forEach(id => uniqueIngredients.add(id));
    });
    return uniqueIngredients.size;
  }

  get ratedRecipes(): number {
    return this.recipes.filter(r => r.rating && r.rating > 0).length;
  }
}
