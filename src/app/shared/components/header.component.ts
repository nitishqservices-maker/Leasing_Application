import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../shared/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/catalog" class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <span class="text-2xl font-bold text-gray-900">LeasingApp</span>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a routerLink="/catalog" routerLinkActive="text-emerald-600" class="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Browse Properties
            </a>
            <ng-container *ngIf="currentUser$ | async as user">
              <a routerLink="/user/dashboard" routerLinkActive="text-emerald-600" class="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Dashboard
              </a>
              <a routerLink="/user/bookings" routerLinkActive="text-emerald-600" class="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                My Bookings
              </a>
              <a *ngIf="user.role === 'admin'" routerLink="/admin/dashboard" routerLinkActive="text-emerald-600" class="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Admin Panel
              </a>
            </ng-container>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <div *ngIf="currentUser$ | async as user; else guestActions" class="flex items-center space-x-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold text-sm">{{ (user.displayName || user.email).charAt(0).toUpperCase() }}</span>
                </div>
                <span class="text-gray-700 font-medium">{{ user.displayName || user.email }}</span>
              </div>
              <button 
                (click)="logout()"
                class="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            </div>
            
            <ng-template #guestActions>
              <a 
                routerLink="/auth/login"
                class="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Sign In
              </a>
              <a 
                routerLink="/auth/register"
                class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                Get Started
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.signOut();
  }
}
