import { Injectable } from '@angular/core';
import { Recipe } from './api.service';

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportRecipes(recipes: Recipe[]): void {
    const dataStr = JSON.stringify(recipes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recipes-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importRecipes(file: File): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const recipes = JSON.parse(content) as Recipe[];
          
          // Validate structure
          if (!Array.isArray(recipes)) {
            reject(new Error('Invalid file format. Expected an array of recipes.'));
            return;
          }

          // Basic validation
          const validRecipes = recipes.filter(r => r.title && typeof r.title === 'string');
          
          if (validRecipes.length === 0) {
            reject(new Error('No valid recipes found in file.'));
            return;
          }

          resolve(validRecipes);
        } catch (error) {
          reject(new Error('Failed to parse JSON file.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  }
}
