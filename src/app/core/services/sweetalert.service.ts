import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  // Success notifications
  success(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true,
      toast: false,
      position: 'top-end'
    });
  }

  // Error notifications
  error(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'OK',
      showConfirmButton: true,
      toast: false,
      position: 'top-end'
    });
  }

  // Warning notifications
  warning(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'OK',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: true,
      toast: false,
      position: 'top-end'
    });
  }

  // Info notifications
  info(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true,
      toast: false,
      position: 'top-end'
    });
  }

  // Toast notifications (smaller, less intrusive)
  toastSuccess(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#10b981',
      color: '#ffffff'
    });
  }

  toastError(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: '#ef4444',
      color: '#ffffff'
    });
  }

  toastWarning(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: '#f59e0b',
      color: '#ffffff'
    });
  }

  toastInfo(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#3b82f6',
      color: '#ffffff'
    });
  }

  // Confirmation dialogs
  confirm(title: string, text?: string, confirmText: string = 'Yes', cancelText: string = 'No'): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true
    });
  }

  // Delete confirmation
  confirmDelete(itemName: string): Promise<any> {
    return this.confirm(
      'Are you sure?',
      `You are about to delete "${itemName}". This action cannot be undone!`,
      'Yes, delete it!',
      'Cancel'
    );
  }

  // Loading states
  showLoading(title: string = 'Loading...', text?: string): void {
    Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  hideLoading(): void {
    Swal.close();
  }

  // Custom HTML content
  html(title: string, html: string): Promise<any> {
    return Swal.fire({
      title: title,
      html: html,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'OK'
    });
  }

  // Convenience methods for common scenarios
  bookingSuccess(productName: string): Promise<any> {
    return this.toastSuccess(
      'Booking Submitted!',
      `Your booking request for ${productName} has been submitted successfully.`
    );
  }

  bookingError(message: string): Promise<any> {
    return this.toastError(
      'Booking Failed',
      message
    );
  }

  loginSuccess(userName: string): Promise<any> {
    return this.toastSuccess(
      'Welcome Back!',
      `Successfully signed in as ${userName}.`
    );
  }

  loginError(message: string): Promise<any> {
    return this.toastError(
      'Sign In Failed',
      message
    );
  }

  productAdded(productName: string): Promise<any> {
    return this.toastSuccess(
      'Product Added',
      `${productName} has been added to your catalog successfully.`
    );
  }

  productDeleted(productName: string): Promise<any> {
    return this.toastSuccess(
      'Product Deleted',
      `${productName} has been removed from your catalog.`
    );
  }

  bookingApproved(productName: string): Promise<any> {
    return this.toastSuccess(
      'Booking Approved',
      `The booking for ${productName} has been approved.`
    );
  }

  bookingRejected(productName: string): Promise<any> {
    return this.toastWarning(
      'Booking Rejected',
      `The booking for ${productName} has been rejected.`
    );
  }

  exportSuccess(format: string): Promise<any> {
    return this.toastSuccess(
      'Export Complete',
      `Your data has been exported to ${format} format successfully.`
    );
  }

  exportError(format: string): Promise<any> {
    return this.toastError(
      'Export Failed',
      `Failed to export data to ${format} format. Please try again.`
    );
  }
}
