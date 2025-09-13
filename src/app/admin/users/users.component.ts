import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ExportService } from '../../core/services/export.service';
import { User } from '../../shared/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-users-container">
      <header class="admin-header">
        <div class="header-content">
          <h1>User Management</h1>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="exportUsers()">Export Users</button>
            <a routerLink="/admin/dashboard" class="btn btn-outline">← Back to Dashboard</a>
          </div>
        </div>
      </header>

      <nav class="admin-nav">
        <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
          <i class="icon">📊</i> Dashboard
        </a>
        <a routerLink="/admin/users" routerLinkActive="active" class="nav-link">
          <i class="icon">👥</i> Users
        </a>
        <a routerLink="/admin/bookings" routerLinkActive="active" class="nav-link">
          <i class="icon">📋</i> Bookings
        </a>
        <a routerLink="/admin/products" routerLinkActive="active" class="nav-link">
          <i class="icon">📦</i> Products
        </a>
      </nav>

      <main class="admin-main">
        <div class="users-filters">
          <div class="filter-group">
            <label for="role">Filter by Role:</label>
            <select id="role" [(ngModel)]="selectedRole" (change)="filterUsers()">
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="search">Search:</label>
            <input 
              type="text" 
              id="search" 
              [(ngModel)]="searchTerm" 
              (input)="filterUsers()"
              placeholder="Search by email or name..."
            >
          </div>
          <div class="filter-group">
            <button class="btn btn-add" (click)="openAddUserModal()">
              <span class="btn-icon">+</span> Add User
            </button>
          </div>
        </div>

        <div class="users-list" *ngIf="filteredUsers$ | async as users">
          <div *ngFor="let user of users" class="user-card">
            <div class="user-header">
              <div class="user-info">
                <h3>{{ user.displayName || 'No Name' }}</h3>
                <p>{{ user.email }}</p>
              </div>
              <span class="role-badge" [ngClass]="'role-' + user.role">
                {{ user.role | titlecase }}
              </span>
            </div>
            
            <div class="user-details">
              <div class="detail-row">
                <span class="label">User ID:</span>
                <span class="value">{{ user.uid }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Created:</span>
                <span class="value">{{ user.createdAt | date:'medium' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Last Updated:</span>
                <span class="value">{{ user.updatedAt | date:'medium' }}</span>
              </div>
            </div>

            <div class="user-actions">
              <button 
                *ngIf="user.role === 'user'"
                class="btn btn-warning"
                (click)="promoteToAdmin(user)"
              >
                Promote to Admin
              </button>
              <button 
                *ngIf="user.role === 'admin' && user.uid !== currentUser?.uid"
                class="btn btn-secondary"
                (click)="demoteToUser(user)"
              >
                Demote to User
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="(filteredUsers$ | async)?.length === 0" class="empty-state">
          <h3>No users found</h3>
          <p *ngIf="selectedRole">No users with role "{{ selectedRole }}" found.</p>
          <p *ngIf="!selectedRole">No users have been registered yet.</p>
        </div>
      </main>

      <!-- Add User Modal -->
      <div *ngIf="showAddUserModal" class="modal-overlay" (click)="closeAddUserModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Add New User</h3>
            <button class="close-btn" (click)="closeAddUserModal()">&times;</button>
          </div>
          
          <form (ngSubmit)="createUser()" #addUserForm="ngForm">
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="newUser.email"
                required
                email
                class="form-control"
                placeholder="Enter email address"
              >
            </div>
            
            <div class="form-group">
              <label for="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="newUser.password"
                required
                minlength="6"
                class="form-control"
                placeholder="Enter password (min 6 characters)"
              >
            </div>
            
            <div class="form-group">
              <label for="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                [(ngModel)]="newUser.displayName"
                class="form-control"
                placeholder="Enter display name"
              >
            </div>
            
            <div class="form-group">
              <label for="role">Role *</label>
              <select
                id="role"
                name="role"
                [(ngModel)]="newUser.role"
                required
                class="form-control"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" (click)="closeAddUserModal()">
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-success" 
                [disabled]="addUserForm.invalid || isCreatingUser"
              >
                {{ isCreatingUser ? 'Creating...' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-users-container {
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
      gap: 1rem;
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

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
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

    .btn-warning {
      background: #ffc107;
      color: #212529;
    }

    .btn-warning:hover {
      background: #e0a800;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
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

    .users-filters {
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

    .btn-add {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: fit-content;
      margin-top: 1.5rem;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }

    .btn-icon {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .users-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .user-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }

    .user-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f3f4;
    }

    .user-info h3 {
      margin: 0;
      color: #333;
      font-size: 1.2rem;
    }

    .user-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .role-user {
      background: #d1ecf1;
      color: #0c5460;
    }

    .role-admin {
      background: #d4edda;
      color: #155724;
    }

    .user-details {
      margin-bottom: 1rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .detail-row:last-child {
      margin-bottom: 0;
    }

    .label {
      font-weight: 500;
      color: #666;
      min-width: 100px;
    }

    .value {
      color: #333;
      text-align: right;
      flex: 1;
      font-size: 0.9rem;
    }

    .user-actions {
      display: flex;
      gap: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .users-filters {
        flex-direction: column;
        gap: 1rem;
      }

      .users-list {
        grid-template-columns: 1fr;
      }

      .user-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }

      .value {
        text-align: left;
      }

      .user-actions {
        flex-direction: column;
      }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 0;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e1e5e9;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #333;
    }

    .modal-content form {
      padding: 20px;
    }

    .modal-content .form-group {
      margin-bottom: 20px;
    }

    .modal-content .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #555;
      font-weight: 500;
    }

    .modal-content .form-control {
      width: 100%;
      padding: 10px;
      border: 2px solid #e1e5e9;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    .modal-content .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .btn-success {
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .btn-success:hover:not(:disabled) {
      background: #218838;
    }

    .btn-success:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
  `]
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  filteredUsers$: Observable<User[]>;
  currentUser: User | null = null;
  selectedRole = '';
  searchTerm = '';
  
  // Add User Modal properties
  showAddUserModal = false;
  isCreatingUser = false;
  newUser = {
    email: '',
    password: '',
    displayName: '',
    role: 'user'
  };

  constructor(
    private authService: AuthService,
    private exportService: ExportService,
    private toastr: ToastrService
  ) {
    this.users$ = this.authService.getAllUsers();
    this.filteredUsers$ = this.users$;
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  filterUsers() {
    this.filteredUsers$ = this.users$.pipe(
      map(users => {
        let filtered = users;

        if (this.selectedRole) {
          filtered = filtered.filter(user => user.role === this.selectedRole);
        }

        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          filtered = filtered.filter(user => 
            user.email.toLowerCase().includes(term) ||
            (user.displayName && user.displayName.toLowerCase().includes(term))
          );
        }

        return filtered;
      })
    );
  }

  async promoteToAdmin(user: User) {
    if (confirm(`Are you sure you want to promote ${user.email} to admin?`)) {
      try {
        await this.authService.updateUserRole(user.uid, 'admin');
        this.toastr.success('User promoted to admin successfully');
      } catch (error: any) {
        this.toastr.error(error.message || 'Failed to promote user');
      }
    }
  }

  async demoteToUser(user: User) {
    if (confirm(`Are you sure you want to demote ${user.email} to user?`)) {
      try {
        await this.authService.updateUserRole(user.uid, 'user');
        this.toastr.success('User demoted to user successfully');
      } catch (error: any) {
        this.toastr.error(error.message || 'Failed to demote user');
      }
    }
  }

  exportUsers() {
    this.users$.pipe(
      map(users => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `users-${timestamp}`;
        
        // Show export options
        const exportType = prompt('Choose export format:\n1. Excel (.xlsx)\n2. CSV (.csv)\n3. PDF (.pdf)\n\nEnter 1, 2, or 3:');
        
        switch(exportType) {
          case '1':
            this.exportService.exportUsersToExcel(users, filename);
            this.toastr.success('Users exported to Excel successfully');
            break;
          case '2':
            this.exportService.exportUsersToCSV(users, filename);
            this.toastr.success('Users exported to CSV successfully');
            break;
          case '3':
            this.exportService.exportUsersToPDF(users, filename);
            this.toastr.success('Users exported to PDF successfully');
            break;
          default:
            this.toastr.info('Export cancelled');
        }
      })
    ).subscribe();
  }

  // Add User Modal Methods
  openAddUserModal() {
    this.showAddUserModal = true;
    this.resetNewUser();
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
    this.resetNewUser();
  }

  resetNewUser() {
    this.newUser = {
      email: '',
      password: '',
      displayName: '',
      role: 'user'
    };
    this.isCreatingUser = false;
  }

  async createUser() {
    if (!this.newUser.email || !this.newUser.password) {
      this.toastr.error('Email and password are required');
      return;
    }

    this.isCreatingUser = true;
    
    try {
      await this.authService.signUp(
        this.newUser.email,
        this.newUser.password,
        this.newUser.displayName
      );

      // If role is admin, update the user role
      if (this.newUser.role === 'admin') {
        // Get the current user (the one we just created)
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          await this.authService.updateUserRole(currentUser.uid, 'admin');
        }
      }

      this.toastr.success('User created successfully!');
      this.closeAddUserModal();
      
      // Refresh the users list
      this.users$ = this.authService.getAllUsers();
      this.filteredUsers$ = this.users$;
      
    } catch (error: any) {
      this.toastr.error(error.message || 'Failed to create user');
    } finally {
      this.isCreatingUser = false;
    }
  }
}
