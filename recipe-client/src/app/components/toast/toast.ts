import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-toast',
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toasts"
        class="toast"
        [class.success]="toast.type === 'success'"
        [class.error]="toast.type === 'error'"
        [class.info]="toast.type === 'info'"
        [class.warning]="toast.type === 'warning'"
        (click)="remove(toast.id)"
      >
        <div class="toast-icon">
          <span *ngIf="toast.type === 'success'">✓</span>
          <span *ngIf="toast.type === 'error'">✕</span>
          <span *ngIf="toast.type === 'info'">ℹ</span>
          <span *ngIf="toast.type === 'warning'">⚠</span>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" (click)="remove(toast.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      width: 100%;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      background: white;
      border-left: 4px solid;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast.success {
      border-left-color: #10b981;
      background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
    }

    .toast.error {
      border-left-color: #ef4444;
      background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
    }

    .toast.info {
      border-left-color: #3b82f6;
      background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
    }

    .toast.warning {
      border-left-color: #f59e0b;
      background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
    }

    .toast-icon {
      font-size: 1.5rem;
      font-weight: bold;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .toast.success .toast-icon {
      background: #10b981;
      color: white;
    }

    .toast.error .toast-icon {
      background: #ef4444;
      color: white;
    }

    .toast.info .toast-icon {
      background: #3b82f6;
      color: white;
    }

    .toast.warning .toast-icon {
      background: #f59e0b;
      color: white;
    }

    .toast-message {
      flex: 1;
      font-size: 0.9375rem;
      color: #374151;
      font-weight: 500;
    }

    .toast-close {
      background: none;
      border: none;
      color: #6b7280;
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .toast-close:hover {
      background: rgba(0, 0, 0, 0.1);
      color: #374151;
    }

    @media (max-width: 768px) {
      .toast-container {
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  get toasts() {
    return this.toastService.getToasts();
  }

  remove(id: string) {
    this.toastService.remove(id);
  }
}
