import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../core/services/product.service';
import { BookingService } from '../../core/services/booking.service';
import { Product } from '../../shared/models';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="catalog-container">
      <header class="catalog-header">
        <div class="header-content">
          <h1>Product Catalog</h1>
          <div class="header-actions">
            <a routerLink="/user/dashboard" class="btn btn-outline">← Back to Dashboard</a>
          </div>
        </div>
      </header>

      <nav class="catalog-nav">
        <a routerLink="/user/dashboard" routerLinkActive="active" class="nav-link">
          <i class="icon">🏠</i> Dashboard
        </a>
        <a routerLink="/user/catalog" routerLinkActive="active" class="nav-link">
          <i class="icon">📦</i> Product Catalog
        </a>
        <a routerLink="/user/bookings" routerLinkActive="active" class="nav-link">
          <i class="icon">📋</i> My Bookings
        </a>
      </nav>

      <main class="catalog-main">
        <div class="filters">
          <div class="filter-group">
            <label for="category">Category:</label>
            <select id="category" [(ngModel)]="selectedCategory" (change)="filterProducts()">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label for="search">Search:</label>
            <input 
              type="text" 
              id="search" 
              [(ngModel)]="searchTerm" 
              (input)="filterProducts()"
              placeholder="Search products..."
            >
          </div>
        </div>

        <div class="products-grid" *ngIf="filteredProducts$ | async as products">
          <div *ngFor="let product of products" class="product-card">
            <div class="product-image">
              <img 
                [src]="product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'" 
                [alt]="product.name"
                (error)="$event.target.src='https://via.placeholder.com/300x200?text=No+Image'"
              >
              <div class="product-status" [ngClass]="'status-' + product.status.toLowerCase()">
                {{ product.status }}
              </div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-details">
                <span class="product-category">{{ product.category }}</span>
                <span class="product-price">200</span>
              </div>
              <button 
                class="btn btn-primary"
                [disabled]="product.status !== 'Available'"
                (click)="bookProduct(product)"
              >
                {{ product.status === 'Available' ? 'Book Now' : product.status }}
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="(filteredProducts$ | async)?.length === 0" class="empty-state">
          <h3>No products found</h3>
          <p>Try adjusting your search criteria or check back later for new products.</p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .catalog-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .catalog-header {
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

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
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

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .catalog-nav {
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

    .catalog-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .filters {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 500;
      color: #333;
    }

    .filter-group select,
    .filter-group input {
      padding: 0.5rem;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 1rem;
    }

    .filter-group select:focus,
    .filter-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .product-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-status {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-available {
      background: #d4edda;
      color: #155724;
    }

    .status-booked {
      background: #fff3cd;
      color: #856404;
    }

    .status-sold {
      background: #f8d7da;
      color: #721c24;
    }

    .status-leased {
      background: #d1ecf1;
      color: #0c5460;
    }

    .product-info {
      padding: 1.5rem;
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.2rem;
    }

    .product-description {
      color: #666;
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    .product-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .product-category {
      background: #f8f9fa;
      color: #666;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
    }

    .product-price {
      font-size: 1.2rem;
      font-weight: 600;
      color: #667eea;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
        gap: 1rem;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CatalogComponent implements OnInit {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  categories: any[] = [];
  selectedCategory = '';
  searchTerm = '';

  constructor(
    private productService: ProductService,
    private bookingService: BookingService,
    private toastr: ToastrService
  ) {
    this.products$ = this.productService.getAvailableProducts();
    this.filteredProducts$ = this.products$;
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  filterProducts() {
    this.filteredProducts$ = this.products$.pipe(
      map(products => {
        let filtered = products;

        if (this.selectedCategory) {
          filtered = filtered.filter(product => product.category === this.selectedCategory);
        }

        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
          );
        }

        return filtered;
      })
    );
  }

  async bookProduct(product: Product) {
    if (product.status !== 'Available') {
      this.toastr.warning('This product is not available for booking');
      return;
    }

    try {
      await this.bookingService.createBooking({
        productId: product.id,
        notes: ''
      });

      this.toastr.success(`Successfully booked ${product.name}!`);
    } catch (error: any) {
      this.toastr.error(error.message || 'Failed to book product');
    }
  }
}
