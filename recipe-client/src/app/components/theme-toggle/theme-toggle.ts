import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-theme-toggle',
  template: `
    <button class="theme-toggle" (click)="toggle()" [attr.aria-label]="label">
      <svg *ngIf="!themeService.isDarkMode()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <svg *ngIf="themeService.isDarkMode()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <span class="theme-label">{{ themeService.isDarkMode() ? 'Light' : 'Dark' }} Mode</span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--theme-toggle-bg, #f3f4f6);
      color: var(--theme-toggle-text, #374151);
      border: 2px solid var(--theme-toggle-border, #e5e7eb);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .theme-toggle:hover {
      background: var(--theme-toggle-hover-bg, #e5e7eb);
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .theme-label {
      font-size: 0.875rem;
    }

    :host-context(.dark) .theme-toggle {
      --theme-toggle-bg: #374151;
      --theme-toggle-text: #f9fafb;
      --theme-toggle-border: #4b5563;
      --theme-toggle-hover-bg: #4b5563;
    }
  `]
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  get label() {
    return this.themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode';
  }

  toggle() {
    this.themeService.toggleTheme();
  }
}
