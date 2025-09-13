import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Sign Up</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="displayName">Full Name</label>
            <input
              type="text"
              id="displayName"
              formControlName="displayName"
              class="form-control"
              [class.error]="registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched"
              placeholder="Enter your full name"
            />
            <div *ngIf="registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched" class="error-message">
              Full name is required
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              placeholder="Enter your email"
            />
            <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-message">
              Please enter a valid email
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              placeholder="Enter your password"
            />
            <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-message">
              Password must be at least 6 characters
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              class="form-control"
              [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
              placeholder="Confirm your password"
            />
            <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" class="error-message">
              Passwords do not match
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="registerForm.invalid || isLoading"
          >
            {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #555;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-control.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }

    .btn {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 20px;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      try {
        const { displayName, email, password } = this.registerForm.value;
        await this.authService.signUp(email, password, displayName);
        
        this.toastr.success('Account created successfully!');
        this.router.navigate(['/user/dashboard']);
      } catch (error: any) {
        this.toastr.error(error.message || 'Registration failed');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
