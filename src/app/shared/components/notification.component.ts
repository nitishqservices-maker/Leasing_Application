import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full"
      [@slideIn]
    >
      <div 
        *ngFor="let notification of notifications; trackBy: trackByFn"
        class="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-105"
        [@notificationSlide]
      >
        <!-- Notification Header -->
        <div class="flex items-start p-4">
          <!-- Icon -->
          <div class="flex-shrink-0 mr-4">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              [ngClass]="{
                'bg-green-100': notification.type === 'success',
                'bg-red-100': notification.type === 'error',
                'bg-yellow-100': notification.type === 'warning',
                'bg-blue-100': notification.type === 'info'
              }"
            >
              <svg 
                class="w-5 h-5"
                [ngClass]="{
                  'text-green-600': notification.type === 'success',
                  'text-red-600': notification.type === 'error',
                  'text-yellow-600': notification.type === 'warning',
                  'text-blue-600': notification.type === 'info'
                }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <!-- Success Icon -->
                <path 
                  *ngIf="notification.type === 'success'"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
                
                <!-- Error Icon -->
                <path 
                  *ngIf="notification.type === 'error'"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
                
                <!-- Warning Icon -->
                <path 
                  *ngIf="notification.type === 'warning'"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
                
                <!-- Info Icon -->
                <path 
                  *ngIf="notification.type === 'info'"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-gray-900 mb-1">
              {{ notification.title }}
            </h4>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ notification.message }}
            </p>
            
            <!-- Action Button -->
            <button 
              *ngIf="notification.action"
              (click)="notification.action.callback()"
              class="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
            >
              {{ notification.action.label }}
            </button>
          </div>

          <!-- Close Button -->
          <button 
            (click)="removeNotification(notification.id)"
            class="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="h-1 bg-gray-200">
          <div 
            class="h-full transition-all duration-100 ease-linear"
            [ngClass]="{
              'bg-green-500': notification.type === 'success',
              'bg-red-500': notification.type === 'error',
              'bg-yellow-500': notification.type === 'warning',
              'bg-blue-500': notification.type === 'info'
            }"
            [style.width.%]="progressWidth[notification.id]"
          ></div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('notificationSlide', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ],
  styles: [`
    .notification-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      max-width: 24rem;
      width: 100%;
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() notifications: Notification[] = [];
  
  progressWidth: { [key: string]: number } = {};
  private timers: { [key: string]: any } = {};

  ngOnInit() {
    this.notifications.forEach(notification => {
      this.startProgress(notification);
    });
  }

  ngOnDestroy() {
    Object.values(this.timers).forEach(timer => clearInterval(timer));
  }

  trackByFn(index: number, notification: Notification): string {
    return notification.id;
  }

  removeNotification(id: string) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.clearTimer(id);
      delete this.progressWidth[id];
    }
  }

  private startProgress(notification: Notification) {
    const duration = notification.duration || 5000; // Default 5 seconds
    const interval = 50; // Update every 50ms
    const totalSteps = duration / interval;
    let currentStep = 0;

    this.progressWidth[notification.id] = 100;

    this.timers[notification.id] = setInterval(() => {
      currentStep++;
      this.progressWidth[notification.id] = Math.max(0, 100 - (currentStep / totalSteps) * 100);
      
      if (currentStep >= totalSteps) {
        this.removeNotification(notification.id);
      }
    }, interval);
  }

  private clearTimer(id: string) {
    if (this.timers[id]) {
      clearInterval(this.timers[id]);
      delete this.timers[id];
    }
  }
}
