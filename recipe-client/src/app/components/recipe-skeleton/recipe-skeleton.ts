import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-recipe-skeleton',
  template: `
    <div class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-meta">
          <div class="skeleton-badge"></div>
          <div class="skeleton-badge"></div>
        </div>
        <div class="skeleton-description"></div>
        <div class="skeleton-description short"></div>
        <div class="skeleton-footer"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
      display: flex;
      flex-direction: column;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-image {
      width: 100%;
      height: 200px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .skeleton-title {
      height: 24px;
      width: 70%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-meta {
      display: flex;
      gap: 0.75rem;
    }

    .skeleton-badge {
      height: 24px;
      width: 100px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 12px;
    }

    .skeleton-description {
      height: 16px;
      width: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-description.short {
      width: 60%;
    }

    .skeleton-footer {
      height: 16px;
      width: 120px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      margin-left: auto;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    :host-context(.dark) .skeleton-card {
      background: #1f2937;
      border-color: #374151;
    }

    :host-context(.dark) .skeleton-image,
    :host-context(.dark) .skeleton-title,
    :host-context(.dark) .skeleton-badge,
    :host-context(.dark) .skeleton-description,
    :host-context(.dark) .skeleton-footer {
      background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
      background-size: 200% 100%;
    }
  `]
})
export class RecipeSkeletonComponent {}
