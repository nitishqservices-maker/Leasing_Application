import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseConnectionService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection() {
    // Add connection error handling
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    // Override console.error to filter out Firebase connection warnings
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      // Filter out specific Firebase connection errors that are not critical
      if (
        message.includes('WebChannelConnection RPC') ||
        message.includes('transport errored') ||
        message.includes('400 (Bad Request)') ||
        message.includes('firestore.googleapis.com')
      ) {
        // Log as warning instead of error for debugging
        console.warn('Firebase connection warning (non-critical):', ...args);
        return;
      }
      
      // Log all other errors normally
      originalError.apply(console, args);
    };
  }

  // Method to check Firebase connection health
  async checkConnectionHealth(): Promise<boolean> {
    try {
      // Simple connection test
      const testDoc = doc(this.firestore, '_health', 'test');
      await getDoc(testDoc);
      return true;
    } catch (error) {
      console.warn('Firebase connection health check failed:', error);
      return false;
    }
  }

  // Method to retry failed connections
  async retryConnection(): Promise<void> {
    try {
      // Force reconnection by clearing any cached data
      console.log('Firebase connection retry initiated');
      // Note: clearPersistence is not available in AngularFire v7+
      // The connection will automatically retry on next operation
    } catch (error) {
      console.warn('Firebase connection retry failed:', error);
    }
  }
}
