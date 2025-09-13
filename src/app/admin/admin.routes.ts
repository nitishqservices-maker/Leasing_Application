import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'bookings',
    loadComponent: () => import('./bookings/bookings.component').then(m => m.BookingsComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent)
  }
];
