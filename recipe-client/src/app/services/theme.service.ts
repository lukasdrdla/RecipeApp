import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'recipe-app-theme';
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Load theme from localStorage or default to light mode
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    // Default to light mode, only use saved theme if it exists
    const initialTheme = savedTheme ? savedTheme === 'dark' : false;
    
    this.isDarkMode.set(initialTheme);
    this.applyTheme(initialTheme);
  }

  toggleTheme() {
    const newTheme = !this.isDarkMode();
    this.isDarkMode.set(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem(this.THEME_KEY, newTheme ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
