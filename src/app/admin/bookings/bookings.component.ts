import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../core/services/booking.service';
import { ExportService } from '../../core/services/export.service';
import { Booking } from '../../shared/models';
import { HeaderComponent } from '../../shared/components/header.component';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  template: `
    <!-- Header -->
    <app-header></app-header>

    <!-- Admin Booking Management Hero -->
    <div class="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Booking Management
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Review, approve, and manage all property booking requests from users
          </p>
        </div>
      </div>
    </div>

    <!-- Admin Booking Management Content -->
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-4">
        <!-- Filters Section -->
        <div class="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div class="flex items-center space-x-4">
              <h2 class="text-xl font-bold text-gray-900">Filter & Search</h2>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
                </svg>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div class="flex items-center space-x-3">
                <label for="status" class="text-sm font-medium text-gray-700">Status:</label>
                <select 
                  id="status" 
                  [(ngModel)]="selectedStatus" 
                  (change)="filterBookings()"
                  class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm min-w-[150px]"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div class="flex items-center space-x-3">
                <label for="search" class="text-sm font-medium text-gray-700">Search:</label>
                <input 
                  type="text" 
                  id="search" 
                  [(ngModel)]="searchTerm" 
                  (input)="filterBookings()"
                  placeholder="Search by user email or product name..."
                  class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm min-w-[250px]"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Export Button -->
        <div class="flex justify-end mb-6">
          <button 
            (click)="exportBookings()"
            class="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export Data
          </button>
        </div>

        <!-- Bookings List -->
        <div class="space-y-6" *ngIf="filteredBookings$ | async as bookings">
          <div *ngFor="let booking of bookings" class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <!-- Booking Header -->
            <div class="p-8 border-b border-gray-100">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                    <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold text-gray-900">{{ booking.productName }}</h3>
                    <p class="text-gray-600">{{ booking.userEmail }} • {{ booking.bookingDate | date:'medium' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
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
            </div>

            <!-- Booking Details -->
            <div class="p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <!-- Booking ID -->
                <div class="bg-gray-50 rounded-2xl p-6">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                      </svg>
                    </div>
                    <h4 class="font-semibold text-gray-900">Booking ID</h4>
                  </div>
                  <p class="text-gray-600 font-mono text-sm">{{ booking.id }}</p>
                </div>

                <!-- Approval Date -->
                <div class="bg-gray-50 rounded-2xl p-6" *ngIf="booking.approvalDate">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h4 class="font-semibold text-gray-900">Approval Date</h4>
                  </div>
                  <p class="text-gray-600">{{ booking.approvalDate | date:'medium' }}</p>
                </div>

                <!-- Completion Date -->
                <div class="bg-gray-50 rounded-2xl p-6" *ngIf="booking.completionDate">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h4 class="font-semibold text-gray-900">Completion Date</h4>
                  </div>
                  <p class="text-gray-600">{{ booking.completionDate | date:'medium' }}</p>
                </div>

                <!-- Price -->
                <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                    <h4 class="font-semibold text-gray-900">Monthly Price</h4>
                  </div>
                  <p class="text-2xl font-bold text-emerald-600">{{ booking.productPrice | currency:'USD':'symbol':'1.2-2' }}</p>
                </div>
              </div>

              <!-- Notes Section -->
              <div class="space-y-4" *ngIf="booking.notes || booking.adminNotes">
                <div *ngIf="booking.notes" class="bg-blue-50 rounded-2xl p-6">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </div>
                    <h4 class="font-semibold text-gray-900">User Notes</h4>
                  </div>
                  <p class="text-gray-700">{{ booking.notes }}</p>
                </div>

                <div *ngIf="booking.adminNotes" class="bg-gray-50 rounded-2xl p-6">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <h4 class="font-semibold text-gray-900">Admin Notes</h4>
                  </div>
                  <p class="text-gray-700">{{ booking.adminNotes }}</p>
                </div>
              </div>

              <!-- Admin Notes Section for Pending Bookings -->
              <div *ngIf="booking.status === 'Pending'" class="mt-8 bg-yellow-50 rounded-2xl p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Pending Vendor Approval</h4>
                    <p class="text-sm text-yellow-700">This booking is waiting for vendor approval. Review and take action below.</p>
                  </div>
                </div>
                <textarea 
                  [(ngModel)]="booking.adminNotes"
                  placeholder="Add notes for this booking..."
                  rows="3"
                  class="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="mt-8 flex flex-wrap gap-4">
                <div *ngIf="booking.status === 'Pending'" class="flex flex-wrap gap-4">
                  <button 
                    (click)="approveBooking(booking)"
                    class="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Approve Booking
                  </button>
                  <button 
                    (click)="rejectBooking(booking)"
                    class="inline-flex items-center bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Reject Booking
                  </button>
                </div>

                <div *ngIf="booking.status === 'Approved'">
                  <button 
                    (click)="completeBooking(booking)"
                    class="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Mark as Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="(filteredBookings$ | async)?.length === 0" class="text-center py-16">
          <div class="bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto">
            <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              <span *ngIf="selectedStatus">No {{ selectedStatus.toLowerCase() }} bookings found</span>
              <span *ngIf="!selectedStatus">No bookings found</span>
            </h3>
            <p class="text-gray-600 mb-6" *ngIf="selectedStatus">
              Try selecting a different status or clear the filter to see all bookings.
            </p>
            <p class="text-gray-600 mb-6" *ngIf="!selectedStatus">
              No bookings have been made yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Custom styles for enhanced animations */
    .transform {
      transition: all 0.3s ease;
    }
    
    .hover\\:shadow-xl:hover {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    .hover\\:-translate-y-1:hover {
      transform: translateY(-0.25rem);
    }
  `]
})
export class BookingsComponent implements OnInit {
  bookings$: Observable<Booking[]>;
  filteredBookings$: Observable<Booking[]>;
  selectedStatus = '';
  searchTerm = '';

  constructor(
    private bookingService: BookingService,
    private exportService: ExportService,
    private toastr: ToastrService
  ) {
    this.bookings$ = this.bookingService.getAllBookings();
    this.filteredBookings$ = this.bookings$;
  }

  ngOnInit() {
    // Component initialized
  }

  filterBookings() {
    this.filteredBookings$ = this.bookings$.pipe(
      map(bookings => {
        let filtered = bookings;

        if (this.selectedStatus) {
          filtered = filtered.filter(booking => booking.status === this.selectedStatus);
        }

        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          filtered = filtered.filter(booking => 
            booking.userEmail.toLowerCase().includes(term) ||
            booking.productName.toLowerCase().includes(term)
          );
        }

        return filtered;
      })
    );
  }

  async approveBooking(booking: Booking) {
    try {
      await this.bookingService.updateBookingStatus(booking.id, 'Approved', booking.adminNotes);
      this.toastr.success('Booking approved successfully');
    } catch (error: any) {
      this.toastr.error(error.message || 'Failed to approve booking');
    }
  }

  async rejectBooking(booking: Booking) {
    try {
      await this.bookingService.updateBookingStatus(booking.id, 'Rejected', booking.adminNotes);
      this.toastr.success('Booking rejected');
    } catch (error: any) {
      this.toastr.error(error.message || 'Failed to reject booking');
    }
  }

  async completeBooking(booking: Booking) {
    try {
      await this.bookingService.updateBookingStatus(booking.id, 'Completed', booking.adminNotes);
      this.toastr.success('Booking marked as completed');
    } catch (error: any) {
      this.toastr.error(error.message || 'Failed to complete booking');
    }
  }

  exportBookings() {
    this.bookings$.pipe(
      map(bookings => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `bookings-${timestamp}`;
        
        // Show export options
        const exportType = prompt('Choose export format:\n1. Excel (.xlsx)\n2. CSV (.csv)\n3. PDF (.pdf)\n\nEnter 1, 2, or 3:');
        
        switch(exportType) {
          case '1':
            this.exportService.exportBookingsToExcel(bookings, filename);
            this.toastr.success('Bookings exported to Excel successfully');
            break;
          case '2':
            this.exportService.exportBookingsToCSV(bookings, filename);
            this.toastr.success('Bookings exported to CSV successfully');
            break;
          case '3':
            this.exportService.exportBookingsToPDF(bookings, filename);
            this.toastr.success('Bookings exported to PDF successfully');
            break;
          default:
            this.toastr.info('Export cancelled');
        }
      })
    ).subscribe();
  }
}
