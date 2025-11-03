import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];

  getToasts(): Toast[] {
    return this.toasts;
  }

  show(message: string, type: ToastType = 'info', duration: number = 3000) {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };
    this.toasts.push(toast);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  }

  success(message: string, duration: number = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 4000) {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration: number = 3000) {
    return this.show(message, 'info', duration);
  }

  warning(message: string, duration: number = 3000) {
    return this.show(message, 'warning', duration);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  clear() {
    this.toasts = [];
  }
}
