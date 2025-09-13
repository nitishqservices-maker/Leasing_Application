import { Routes } from '@angular/router';

export const userRoutes: Routes = [
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
    path: 'catalog',
    loadComponent: () => import('./catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'bookings',
    loadComponent: () => import('./bookings/bookings.component').then(m => m.BookingsComponent)
  }
];
