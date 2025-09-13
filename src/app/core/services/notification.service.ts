import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../../shared/components/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addNotification(notification: Omit<Notification, 'id'>): string {
    const id = this.generateId();
    const newNotification: Notification = {
      id,
      ...notification
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    return id;
  }

  success(title: string, message: string, options?: { duration?: number; action?: { label: string; callback: () => void } }): string {
    return this.addNotification({
      type: 'success',
      title,
      message,
      duration: options?.duration,
      action: options?.action
    });
  }

  error(title: string, message: string, options?: { duration?: number; action?: { label: string; callback: () => void } }): string {
    return this.addNotification({
      type: 'error',
      title,
      message,
      duration: options?.duration || 7000, // Errors stay longer
      action: options?.action
    });
  }

  warning(title: string, message: string, options?: { duration?: number; action?: { label: string; callback: () => void } }): string {
    return this.addNotification({
      type: 'warning',
      title,
      message,
      duration: options?.duration || 6000, // Warnings stay a bit longer
      action: options?.action
    });
  }

  info(title: string, message: string, options?: { duration?: number; action?: { label: string; callback: () => void } }): string {
    return this.addNotification({
      type: 'info',
      title,
      message,
      duration: options?.duration,
      action: options?.action
    });
  }

  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }

  // Convenience methods for common scenarios
  bookingSuccess(productName: string): string {
    return this.success(
      'Booking Submitted!',
      `Your booking request for ${productName} has been submitted successfully.`,
      {
        action: {
          label: 'View Bookings',
          callback: () => {
            // This would be handled by the component that uses this service
            console.log('Navigate to bookings');
          }
        }
      }
    );
  }

  bookingError(message: string): string {
    return this.error(
      'Booking Failed',
      message,
      {
        action: {
          label: 'Try Again',
          callback: () => {
            console.log('Retry booking');
          }
        }
      }
    );
  }

  loginSuccess(userName: string): string {
    return this.success(
      'Welcome Back!',
      `Successfully signed in as ${userName}.`,
      { duration: 3000 }
    );
  }

  loginError(message: string): string {
    return this.error(
      'Sign In Failed',
      message
    );
  }

  productAdded(productName: string): string {
    return this.success(
      'Product Added',
      `${productName} has been added to your catalog successfully.`,
      { duration: 4000 }
    );
  }

  productDeleted(productName: string): string {
    return this.success(
      'Product Deleted',
      `${productName} has been removed from your catalog.`,
      { duration: 4000 }
    );
  }

  bookingApproved(productName: string): string {
    return this.success(
      'Booking Approved',
      `The booking for ${productName} has been approved.`,
      { duration: 5000 }
    );
  }

  bookingRejected(productName: string): string {
    return this.warning(
      'Booking Rejected',
      `The booking for ${productName} has been rejected.`,
      { duration: 5000 }
    );
  }

  exportSuccess(format: string): string {
    return this.success(
      'Export Complete',
      `Your data has been exported to ${format} format successfully.`,
      { duration: 4000 }
    );
  }

  exportError(format: string): string {
    return this.error(
      'Export Failed',
      `Failed to export data to ${format} format. Please try again.`
    );
  }
}
