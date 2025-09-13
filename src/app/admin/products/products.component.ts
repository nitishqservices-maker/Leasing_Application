import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertService } from '../../core/services/sweetalert.service';
import { ProductService } from '../../core/services/product.service';
import { ExportService } from '../../core/services/export.service';
import { Product } from '../../shared/models';
import { HeaderComponent } from '../../shared/components/header.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  template: `
    <!-- Header -->
    <app-header></app-header>

    <!-- Admin Product Management Hero -->
    <div class="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Product Management
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your property portfolio, add new listings, and track product status
          </p>
        </div>
      </div>
    </div>

    <!-- Admin Product Management Content -->
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-4">
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <button 
            (click)="showAddProduct = true"
            class="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add New Product
          </button>
          <button 
            (click)="exportProducts()"
            class="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export Products
          </button>
        </div>

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
                  (change)="filterProducts()"
                  class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm min-w-[150px]"
                >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Sold">Sold</option>
              <option value="Leased">Leased</option>
            </select>
          </div>
              
              <div class="flex items-center space-x-3">
                <label for="search" class="text-sm font-medium text-gray-700">Search:</label>
            <input 
              type="text" 
              id="search" 
              [(ngModel)]="searchTerm" 
              (input)="filterProducts()"
              placeholder="Search products..."
                  class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm min-w-[250px]"
            >
              </div>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" *ngIf="filteredProducts$ | async as products">
          <div *ngFor="let product of products" class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <!-- Product Image -->
            <div class="relative h-64 overflow-hidden">
              <img 
                [src]="product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'" 
                [alt]="product.name"
                (error)="$event.target.src='https://via.placeholder.com/400x300?text=No+Image'"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              >
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span 
                  class="px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm"
                  [ngClass]="{
                    'bg-green-500 text-white': product.status === 'Available',
                    'bg-yellow-500 text-white': product.status === 'Booked',
                    'bg-red-500 text-white': product.status === 'Sold',
                    'bg-blue-500 text-white': product.status === 'Leased'
                  }"
                >
                {{ product.status }}
                </span>
              </div>

              <!-- Category Badge -->
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-white bg-opacity-90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                  {{ product.category }}
                </span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-8">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                  {{ product.name }}
                </h3>
                <div class="text-right">
                  <div class="text-2xl font-bold text-emerald-600">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</div>
                  <div class="text-sm text-gray-500">per month</div>
                </div>
              </div>
              
              <p class="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{{ product.description }}</p>
              
              <!-- Action Buttons -->
              <div class="flex gap-3">
                <button 
                  (click)="editProduct(product)"
                  class="flex-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 py-3 px-4 rounded-xl font-semibold hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 border border-blue-200"
                >
                  <span class="flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  Edit
                  </span>
                </button>
                <button 
                  (click)="deleteProduct(product)"
                  class="flex-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 py-3 px-4 rounded-xl font-semibold hover:from-red-200 hover:to-pink-200 transition-all duration-200 border border-red-200"
                >
                  <span class="flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  Delete
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="(filteredProducts$ | async)?.length === 0" class="text-center py-16">
          <div class="bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto">
            <div class="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              <span *ngIf="selectedStatus">No {{ selectedStatus.toLowerCase() }} products found</span>
              <span *ngIf="!selectedStatus">No products found</span>
            </h3>
            <p class="text-gray-600 mb-6" *ngIf="selectedStatus">
              Try selecting a different status or clear the filter to see all products.
            </p>
            <p class="text-gray-600 mb-6" *ngIf="!selectedStatus">
              No products have been added yet.
            </p>
            <button 
              (click)="showAddProduct = true"
              class="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Your First Product
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" *ngIf="showAddProduct" (click)="closeModal()">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="p-8 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Add New Product</h2>
                <p class="text-gray-600">Create a new property listing</p>
              </div>
            </div>
            <button 
              (click)="closeModal()"
              class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Form -->
        <form *ngIf="productForm" [formGroup]="productForm" (ngSubmit)="addProduct()" class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Product Name -->
            <div class="md:col-span-2">
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                [class.border-red-300]="productForm.get('name')?.invalid && productForm.get('name')?.touched"
                placeholder="Enter product name"
              >
              <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" class="text-red-600 text-sm mt-1">
                Product name is required (min 2 characters)
              </div>
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea 
                id="description" 
                formControlName="description" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                [class.border-red-300]="productForm.get('description')?.invalid && productForm.get('description')?.touched"
                rows="3"
                placeholder="Enter product description"
              ></textarea>
              <div *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.touched" class="text-red-600 text-sm mt-1">
                Description is required (min 10 characters)
              </div>
            </div>

            <!-- Price -->
            <div>
              <label for="price" class="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
              <input 
                type="number" 
                id="price" 
                formControlName="price" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                [class.border-red-300]="productForm.get('price')?.invalid && productForm.get('price')?.touched"
                step="0.01"
                placeholder="Enter price"
              >
              <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" class="text-red-600 text-sm mt-1">
                Price is required (must be greater than 0)
              </div>
            </div>

            <!-- Category -->
            <div>
              <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <input 
                type="text" 
                id="category" 
                formControlName="category" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                [class.border-red-300]="productForm.get('category')?.invalid && productForm.get('category')?.touched"
                placeholder="Enter category"
              >
              <div *ngIf="productForm.get('category')?.invalid && productForm.get('category')?.touched" class="text-red-600 text-sm mt-1">
                Category is required
              </div>
            </div>

            <!-- Image URL -->
            <div class="md:col-span-2">
              <label for="imageUrl" class="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
              <input 
                type="url" 
                id="imageUrl" 
                formControlName="imageUrl" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter image URL (optional)"
              >
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-4 mt-8">
            <button 
              type="button" 
              (click)="closeModal()"
              class="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="!productForm || productForm.invalid || isAdding"
              class="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="flex items-center justify-center">
                <svg *ngIf="isAdding" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isAdding ? 'Adding Product...' : 'Add Product' }}
              </span>
            </button>
          </div>
        </form>
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
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  selectedStatus = '';
  searchTerm = '';
  showAddProduct = false;
  isAdding = false;
  productForm!: FormGroup;

  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private sweetAlertService: SweetAlertService,
    private fb: FormBuilder
  ) {
    this.products$ = this.productService.getProducts();
    this.filteredProducts$ = this.products$;
    this.initializeForm();
  }

  ngOnInit() {
    // Component initialized
  }

  initializeForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      imageUrl: ['']
    });
  }

  filterProducts() {
    this.filteredProducts$ = this.products$.pipe(
      map(products => {
        let filtered = products;

        if (this.selectedStatus) {
          filtered = filtered.filter(product => product.status === this.selectedStatus);
        }

        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
          );
        }

        return filtered;
      })
    );
  }

  async addProduct() {
    if (this.productForm && this.productForm.valid) {
      this.isAdding = true;
      try {
        const formValue = this.productForm.value;
        await this.productService.createProduct({
          name: formValue.name,
          description: formValue.description,
          price: formValue.price,
          category: formValue.category,
          status: 'Available',
          imageUrl: formValue.imageUrl || undefined
        });

        this.sweetAlertService.productAdded(formValue.name);
        this.closeModal();
        this.initializeForm();
        
        // Refresh the products list
        this.products$ = this.productService.getProducts();
        this.filteredProducts$ = this.products$;
      } catch (error: any) {
        this.sweetAlertService.error('Failed to Add Product', error.message || 'Failed to add product');
      } finally {
        this.isAdding = false;
      }
    } else {
      this.sweetAlertService.error('Validation Error', 'Please fill in all required fields correctly');
      // Mark all fields as touched to show validation errors
      if (this.productForm) {
        this.productForm.markAllAsTouched();
      }
    }
  }

  editProduct(product: Product) {
    // This would open an edit modal or navigate to an edit page
    this.sweetAlertService.info('Coming Soon', 'Edit functionality will be implemented in the next update');
  }

  async deleteProduct(product: Product) {
    const result = await this.sweetAlertService.confirmDelete(product.name);
    if (result.isConfirmed) {
      try {
        await this.productService.deleteProduct(product.id);
        this.sweetAlertService.productDeleted(product.name);
      } catch (error: any) {
        this.sweetAlertService.error('Failed to Delete Product', error.message || 'Failed to delete product');
      }
    }
  }

  closeModal() {
    this.showAddProduct = false;
    this.initializeForm();
  }

  exportProducts() {
    this.products$.pipe(
      map(products => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `products-${timestamp}`;
        
        // Show export options
        const exportType = prompt('Choose export format:\n1. Excel (.xlsx)\n2. CSV (.csv)\n3. PDF (.pdf)\n\nEnter 1, 2, or 3:');
        
        switch(exportType) {
          case '1':
            this.exportService.exportProductsToExcel(products, filename);
            this.sweetAlertService.exportSuccess('Excel');
            break;
          case '2':
            this.exportService.exportProductsToCSV(products, filename);
            this.sweetAlertService.exportSuccess('CSV');
            break;
          case '3':
            this.exportService.exportProductsToPDF(products, filename);
            this.sweetAlertService.exportSuccess('PDF');
            break;
          default:
            this.sweetAlertService.info('Export Cancelled', 'Export operation was cancelled');
        }
      })
    ).subscribe();
  }
}
