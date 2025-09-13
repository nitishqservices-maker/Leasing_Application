import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { ProductService } from '../../core/services/product.service';
import { User, Booking, Product } from '../../shared/models';
import { HeaderComponent } from '../../shared/components/header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <!-- Header -->
    <app-header></app-header>

    <!-- Admin Dashboard Hero -->
    <div class="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome back, <span class="text-emerald-600">{{ currentUser?.displayName || currentUser?.email }}</span>. 
            Manage your leasing platform with powerful insights and controls.
          </p>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard Content -->
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-4">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16">
          <div class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">{{ totalUsers }}</div>
            <div class="text-sm text-gray-500">Total Users</div>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">{{ totalBookings }}</div>
            <div class="text-sm text-gray-500">Total Bookings</div>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">{{ pendingBookings }}</div>
            <div class="text-sm text-gray-500">Pending Approvals</div>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">{{ totalProducts }}</div>
            <div class="text-sm text-gray-500">Total Properties</div>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">{{ availableProducts }}</div>
            <div class="text-sm text-gray-500">Available Properties</div>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">{{ totalRevenue | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="text-sm text-gray-500">Total Revenue</div>
          </div>
        </div>

        <!-- Dashboard Sections -->
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Recent Bookings -->
          <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div class="p-8 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900">Recent Bookings</h2>
                <a routerLink="/admin/bookings" class="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center">
                  Manage All
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div class="p-8" *ngIf="recentBookings$ | async as bookings">
              <div *ngFor="let booking of bookings.slice(0, 5)" class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-3 hover:bg-gray-100 transition-colors duration-200">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 text-sm">{{ booking.productName }}</h4>
                    <p class="text-xs text-gray-600">{{ booking.userEmail }} • {{ booking.bookingDate | date:'short' }}</p>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': booking.status === 'Pending',
                        'bg-green-100 text-green-800': booking.status === 'Approved',
                        'bg-red-100 text-red-800': booking.status === 'Rejected',
                        'bg-blue-100 text-blue-800': booking.status === 'Completed'
                      }">
                  {{ booking.status === 'Pending' ? 'Awaiting Approval' : booking.status }}
                </span>
              </div>
              
              <div *ngIf="bookings.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <p class="text-gray-600">No bookings yet</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div class="p-8 border-b border-gray-100">
              <h2 class="text-2xl font-bold text-gray-900">Quick Actions</h2>
            </div>

            <div class="p-8 space-y-4">
              <a routerLink="/admin/bookings" class="flex items-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 group">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Manage Bookings</h4>
                  <p class="text-sm text-gray-600">Review and approve pending bookings</p>
                </div>
              </a>

              <a routerLink="/admin/users" class="flex items-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl hover:from-blue-100 hover:to-purple-100 transition-all duration-200 group">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Manage Users</h4>
                  <p class="text-sm text-gray-600">View and manage user accounts</p>
                </div>
              </a>

              <a routerLink="/admin/products" class="flex items-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 group">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Manage Properties</h4>
                  <p class="text-sm text-gray-600">Add, edit, and manage properties</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .admin-header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem 0;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .admin-info {
      color: #666;
      font-size: 0.9rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid #667eea;
      color: #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .admin-nav {
      background: white;
      border-bottom: 1px solid #e1e5e9;
      padding: 0 2rem;
    }

    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      text-decoration: none;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .admin-main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 1.8rem;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .dashboard-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .section {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }

    .section h2 {
      color: #333;
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .booking-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #f1f3f4;
      border-radius: 8px;
    }

    .booking-info h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
      font-size: 1rem;
    }

    .booking-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-approved {
      background: #d4edda;
      color: #155724;
    }

    .status-rejected {
      background: #f8d7da;
      color: #721c24;
    }

    .status-completed {
      background: #d1ecf1;
      color: #0c5460;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #f1f3f4;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    .action-icon {
      font-size: 1.5rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .action-content h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
      font-size: 1rem;
    }

    .action-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .dashboard-sections {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .booking-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentBookings$: Observable<Booking[]>;
  totalUsers = 0;
  totalBookings = 0;
  pendingBookings = 0;
  totalProducts = 0;
  availableProducts = 0;
  totalRevenue = 0;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private productService: ProductService
  ) {
    this.recentBookings$ = this.bookingService.getAllBookings();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.recentBookings$.subscribe(bookings => {
      this.totalBookings = bookings.length;
      this.pendingBookings = bookings.filter(b => b.status === 'Pending').length;
      this.totalRevenue = bookings
        .filter(b => b.status === 'Approved' || b.status === 'Completed')
        .reduce((sum, b) => sum + b.productPrice, 0);
    });

    this.authService.getAllUsers().subscribe(users => {
      this.totalUsers = users.length;
    });

    this.productService.getProducts().subscribe(products => {
      this.totalProducts = products.length;
      this.availableProducts = products.filter(p => p.status === 'Available').length;
    });
  }

  async signOut() {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}

