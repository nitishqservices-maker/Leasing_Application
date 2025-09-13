import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { Product } from '../../shared/models';
import { HeaderComponent } from '../../shared/components/header.component';
import { SweetAlertService } from '../../core/services/sweetalert.service';

@Component({
  selector: 'app-public-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class PublicCatalogComponent implements OnInit {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  searchTerm = '';
  selectedCategory = '';
  selectedPriceRange = '';
  showBookingModal = false;
  selectedProduct: Product | null = null;
  isLoggedIn = false;
  bookedProducts: Set<string> = new Set();
  bookingStatuses: Map<string, string> = new Map(); // productId -> booking status
  pendingBookings: any[] = [];
  showMainCart = false;
  allBookings: any[] = []; // All bookings to check if products are booked

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private bookingService: BookingService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {
    this.products$ = this.productService.getProducts();
    this.filteredProducts$ = this.products$;
  }

  ngOnInit() {
    // Check if user is logged in
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.loadBookedProducts();
      } else {
        this.bookedProducts.clear();
      }
    });
  }

  // Load booked products for the current user
  async loadBookedProducts() {
    if (!this.isLoggedIn) {
      this.bookedProducts.clear();
      this.bookingStatuses.clear();
      this.pendingBookings = [];
      this.allBookings = [];
      return;
    }

    try {
      // Load user's bookings
      const userBookings = await this.bookingService.getUserBookings().toPromise();
      this.bookedProducts.clear();
      this.bookingStatuses.clear();
      this.pendingBookings = [];
      
      userBookings?.forEach(booking => {
        this.bookedProducts.add(booking.productId);
        this.bookingStatuses.set(booking.productId, booking.status);
        
        // Add to pending bookings if status is Pending
        if (booking.status === 'Pending') {
          this.pendingBookings.push(booking);
        }
      });

      // Load all bookings to check which products are booked
      const allBookings = await this.bookingService.getAllBookings().toPromise();
      this.allBookings = allBookings || [];
    } catch (error) {
      console.error('Error loading booked products:', error);
      this.bookedProducts.clear();
      this.bookingStatuses.clear();
      this.pendingBookings = [];
      this.allBookings = [];
    }
  }

  // Check if user has booked a specific product
  isProductBooked(productId: string): boolean {
    return this.bookedProducts.has(productId);
  }

  // Get booking status for a product
  getBookingStatus(productId: string): string | null {
    return this.bookingStatuses.get(productId) || null;
  }

  // Toggle main cart visibility
  toggleMainCart() {
    this.showMainCart = !this.showMainCart;
  }

  // Navigate to bookings page
  goToBookings() {
    this.router.navigate(['/user/bookings']);
  }

  // Get product name by ID
  getProductName(productId: string): string {
    // This would need to be implemented to get product name from productId
    // For now, return a placeholder - in a real implementation, you'd look up the product
    return 'Property';
  }

  // Check if a product is booked by any user (synchronous version)
  isProductBookedByAnyone(productId: string): boolean {
    return this.allBookings.some(booking => booking.productId === productId);
  }

  filterProducts() {
    this.filteredProducts$ = this.products$.pipe(
      map(products => {
        let filtered = products;

        // Filter by search term
        if (this.searchTerm) {
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }

        // Filter by category
        if (this.selectedCategory) {
          filtered = filtered.filter(product =>
            product.category.toLowerCase() === this.selectedCategory.toLowerCase()
          );
        }

        // Filter by price range
        if (this.selectedPriceRange) {
          filtered = filtered.filter(product => {
            const price = product.price;
            switch (this.selectedPriceRange) {
              case '0-500':
                return price >= 0 && price <= 500;
              case '500-1000':
                return price > 500 && price <= 1000;
              case '1000-2000':
                return price > 1000 && price <= 2000;
              case '2000+':
                return price > 2000;
              default:
                return true;
            }
          });
        }

        // Filter out products that are not available or booked by others
        filtered = filtered.filter(product => {
          // Only show available products
          if (product.status !== 'Available') {
            return false;
          }
          
          // If user is logged in and has booked this product, show it
          if (this.isLoggedIn && this.isProductBooked(product.id!)) {
            return true;
          }
          
          // If user is not logged in, show all available products
          if (!this.isLoggedIn) {
            return true;
          }
          
          // If user is logged in but hasn't booked this product,
          // check if it's booked by anyone else
          if (this.isProductBookedByAnyone(product.id!)) {
            return false; // Hide products booked by others
          }
          
          return true; // Show available products not booked by anyone
        });

        return filtered;
      })
    );
  }

  bookProduct(product: Product) {
    this.selectedProduct = product;
    this.showBookingModal = true;
  }

  closeBookingModal() {
    this.showBookingModal = false;
    this.selectedProduct = null;
  }

  goToRegister() {
    this.closeBookingModal();
    // Navigate to register page using Angular routing
    this.router.navigate(['/auth/register']);
  }

  goToLogin() {
    this.closeBookingModal();
    // Navigate to login page using Angular routing
    this.router.navigate(['/auth/login']);
  }

  async proceedToBooking() {
    if (!this.selectedProduct) return;

    try {
      await this.bookingService.createBooking({
        productId: this.selectedProduct.id!,
        notes: 'Booking request from public catalog'
      });

      this.sweetAlertService.bookingSuccess(this.selectedProduct.name);
      this.closeBookingModal();
      
      // Refresh booked products list
      await this.loadBookedProducts();
      
      // Navigate to user bookings page using Angular routing
      this.router.navigate(['/user/bookings']);
    } catch (error: any) {
      this.sweetAlertService.bookingError(error.message || 'Failed to create booking');
    }
  }

  scrollToProperties() {
    const element = document.getElementById('properties-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedPriceRange = '';
    this.filterProducts();
  }
}