import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { GuestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/catalog',
    pathMatch: 'full'
  },
  {
    path: 'catalog',
    loadComponent: () => import('./public/catalog/catalog.component').then(m => m.PublicCatalogComponent)
  },
  {
    path: 'auth',
    canActivate: [GuestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user/user.routes').then(m => m.userRoutes)
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '**',
    redirectTo: '/user/dashboard'
  }
];
