import { Injectable, inject, NgZone } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { User as AppUser } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);

  constructor() {
    // Listen to auth state changes within Angular zone
    onAuthStateChanged(this.auth, (user) => {
      this.ngZone.run(() => {
        if (user) {
          this.loadUserData(user.uid);
        } else {
          this.currentUserSubject.next(null);
        }
      });
    });
    
    // Add error handling for Firebase connection issues
    this.setupFirebaseErrorHandling();
    
    // Seed admin user on first run
    this.seedAdminUser();
  }

  private setupFirebaseErrorHandling() {
    // Override console.error to filter Firebase connection warnings
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      // Filter out non-critical Firebase connection errors
      if (
        message.includes('WebChannelConnection RPC') ||
        message.includes('transport errored') ||
        message.includes('400 (Bad Request)') ||
        message.includes('firestore.googleapis.com')
      ) {
        // Log as warning instead of error
        console.warn('Firebase connection warning (non-critical):', ...args);
        return;
      }
      
      // Log all other errors normally
      originalError.apply(console, args);
    };
  }

  async signUp(email: string, password: string, displayName?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ngZone.runOutsideAngular(async () => {
        try {
          const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
          const user = userCredential.user;
          
          // Create user document in Firestore
          const userData: AppUser = {
            uid: user.uid,
            email: user.email!,
            role: user.email === 'admin@leasing.com' ? 'admin' : 'user', // Admin for specific email
            displayName: displayName || '',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          await setDoc(doc(this.firestore, 'users', user.uid), userData);
          
          // Run in Angular zone to update UI
          this.ngZone.run(() => {
            this.currentUserSubject.next(userData);
            resolve();
          });
        } catch (error) {
          this.ngZone.run(() => {
            console.error('Sign up error:', error);
            reject(error);
          });
        }
      });
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ngZone.runOutsideAngular(async () => {
        try {
          await signInWithEmailAndPassword(this.auth, email, password);
          this.ngZone.run(() => resolve());
        } catch (error) {
          this.ngZone.run(() => {
            console.error('Sign in error:', error);
            reject(error);
          });
        }
      });
    });
  }

  async signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ngZone.runOutsideAngular(async () => {
        try {
          await signOut(this.auth);
          this.ngZone.run(() => {
            this.currentUserSubject.next(null);
            resolve();
          });
        } catch (error) {
          this.ngZone.run(() => {
            console.error('Sign out error:', error);
            reject(error);
          });
        }
      });
    });
  }

  private async loadUserData(uid: string): Promise<void> {
    this.ngZone.runOutsideAngular(async () => {
      try {
        const userDoc = await getDoc(doc(this.firestore, 'users', uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as AppUser;
          this.ngZone.run(() => {
            this.currentUserSubject.next(userData);
          });
        }
      } catch (error : any) {
        this.ngZone.run(() => {
          console.error('Error loading user data:', error);
          // Handle specific Firebase errors
          if (error.code === 'permission-denied') {
            console.warn('Permission denied: Check Firestore security rules');
          } else if (error.code === 'unavailable') {
            console.warn('Firestore temporarily unavailable');
          }
        });
      }
    });
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'admin';
  }

  isUser(): boolean {
    return this.getCurrentUserRole() === 'user';
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get all users (admin only)
  getAllUsers(): Observable<AppUser[]> {
    if (!this.isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    const usersCollection = collection(this.firestore, 'users');
    return from(getDocs(usersCollection)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()['updatedAt']?.toDate() || new Date()
        })) as AppUser[]
      ),
      tap(() => {
        // Ensure this runs in Angular zone
        this.ngZone.run(() => {});
      })
    );
  }

  // Update user role (admin only)
  async updateUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    return new Promise((resolve, reject) => {
      this.ngZone.runOutsideAngular(async () => {
        try {
          await setDoc(doc(this.firestore, 'users', uid), {
            role,
            updatedAt: new Date()
          }, { merge: true });
          this.ngZone.run(() => resolve());
        } catch (error) {
          this.ngZone.run(() => {
            console.error('Error updating user role:', error);
            reject(error);
          });
        }
      });
    });
  }

  private async seedAdminUser(): Promise<void> {
    try {
      const adminEmail = 'admin@leasing.com';
      
      // Try to create admin user directly
      try {
        const userCredential = await createUserWithEmailAndPassword(
          this.auth, 
          adminEmail, 
          'Admin@123'
        );
        
        const user = userCredential.user;
        
        // Create admin user document
        const adminUserData: AppUser = {
          uid: user.uid,
          email: adminEmail,
          role: 'admin',
          displayName: 'Admin',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(doc(this.firestore, 'users', user.uid), adminUserData);
        
        console.log('✅ Admin user seeded successfully:', adminEmail);
        
        // Sign out the seeded user so they can login normally
        await signOut(this.auth);
        
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          // console.log('✅ Admin user already exists:', adminEmail);
        } else {
          console.error('❌ Error seeding admin user:', error);
          console.log('💡 Please create admin user manually via registration page');
        }
      }
      
    } catch (error) {
      console.error('❌ Error in seedAdminUser:', error);
    }
  }
}
