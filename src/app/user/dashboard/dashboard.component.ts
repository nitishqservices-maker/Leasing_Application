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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <!-- Header -->
    <app-header></app-header>

    <!-- Dashboard Hero -->
    <div class="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Welcome back, 
            <span class="text-emerald-600">{{ currentUser?.displayName || currentUser?.email }}</span>
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your property bookings and explore new opportunities
          </p>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-4">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-gray-900">{{ totalBookings }}</div>
                <div class="text-sm text-gray-500">Total Bookings</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-gray-900">{{ pendingBookings }}</div>
                <div class="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-gray-900">{{ approvedBookings }}</div>
                <div class="text-sm text-gray-500">Approved</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="flex items-center justify-between mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-gray-900">{{ availableProducts }}</div>
                <div class="text-sm text-gray-500">Available Properties</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Bookings Section -->
        <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div class="p-8 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">Recent Bookings</h2>
              <a routerLink="/user/bookings" class="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center">
                View All
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>

          <div class="p-8" *ngIf="recentBookings$ | async as bookings">
            <div *ngFor="let booking of bookings.slice(0, 5)" class="flex items-center justify-between p-6 bg-gray-50 rounded-2xl mb-4 hover:bg-gray-100 transition-colors duration-200">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ booking.productName }}</h4>
                  <p class="text-sm text-gray-600">{{ booking.bookingDate | date:'medium' }}</p>
                </div>
              </div>
              <div>
                <span class="px-4 py-2 rounded-full text-sm font-semibold"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': booking.status === 'Pending',
                        'bg-green-100 text-green-800': booking.status === 'Approved',
                        'bg-red-100 text-red-800': booking.status === 'Rejected',
                        'bg-blue-100 text-blue-800': booking.status === 'Completed'
                      }">
                  {{ booking.status === 'Pending' ? 'Awaiting Vendor Approval' : booking.status }}
                </span>
              </div>
            </div>
            
            <div *ngIf="bookings.length === 0" class="text-center py-12">
              <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
              <p class="text-gray-600 mb-6">Start exploring properties and make your first booking!</p>
              <a routerLink="/catalog" class="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Browse Properties
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .dashboard-header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem 0;
    }

    .header-content {
      max-width: 1200px;
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

    .user-info {
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

    .dashboard-nav {
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

    .dashboard-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
      font-size: 2rem;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .recent-section h2 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .bookings-list {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .booking-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f3f4;
    }

    .booking-item:last-child {
      border-bottom: none;
    }

    .booking-info h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
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

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: #666;
    }

    .empty-state a {
      color: #667eea;
      text-decoration: none;
    }

    .empty-state a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
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
  totalBookings = 0;
  pendingBookings = 0;
  approvedBookings = 0;
  availableProducts = 0;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private productService: ProductService
  ) {
    this.recentBookings$ = this.bookingService.getUserBookings();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.recentBookings$.subscribe(bookings => {
      this.totalBookings = bookings.length;
      this.pendingBookings = bookings.filter(b => b.status === 'Pending').length;
      this.approvedBookings = bookings.filter(b => b.status === 'Approved').length;
    });

    this.productService.getAvailableProducts().subscribe(products => {
      this.availableProducts = products.length;
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
