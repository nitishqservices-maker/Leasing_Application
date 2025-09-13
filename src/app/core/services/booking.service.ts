import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking, BookingRequest } from '../../shared/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  // Check if user has already booked a product
  async hasUserBookedProduct(productId: string): Promise<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    const bookingsCollection = collection(this.firestore, 'bookings');
    const q = query(
      bookingsCollection,
      where('userId', '==', currentUser.uid),
      where('productId', '==', productId)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  // Create new booking
  async createBooking(bookingRequest: BookingRequest): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be authenticated to create a booking');
    }

    // Check if user has already booked this product
    const hasBooked = await this.hasUserBookedProduct(bookingRequest.productId);
    if (hasBooked) {
      throw new Error('You have already booked this property. Each property can only be booked once per user.');
    }

    const bookingsCollection = collection(this.firestore, 'bookings');
    const newBooking: Omit<Booking, 'id'> = {
      userId: currentUser.uid,
      productId: bookingRequest.productId,
      status: 'Pending',
      bookingDate: new Date(),
      notes: bookingRequest.notes || '',
      userEmail: currentUser.email,
      productName: '', // Will be populated when fetching
      productPrice: 0, // Will be populated when fetching
      message: bookingRequest.notes || 'Booking request'
    };

    await setDoc(doc(bookingsCollection), newBooking);
  }

  // Get user's bookings
  getUserBookings(): Observable<Booking[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    const bookingsCollection = collection(this.firestore, 'bookings');
    const q = query(
      bookingsCollection,
      where('userId', '==', currentUser.uid),
      orderBy('bookingDate', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          bookingDate: doc.data()['bookingDate']?.toDate() || new Date(),
          approvalDate: doc.data()['approvalDate']?.toDate(),
          completionDate: doc.data()['completionDate']?.toDate()
        })) as Booking[]
      )
    );
  }

  // Get all bookings (admin only)
  getAllBookings(): Observable<Booking[]> {
    if (!this.authService.isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    const bookingsCollection = collection(this.firestore, 'bookings');
    const q = query(bookingsCollection, orderBy('bookingDate', 'desc'));

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          bookingDate: doc.data()['bookingDate']?.toDate() || new Date(),
          approvalDate: doc.data()['approvalDate']?.toDate(),
          completionDate: doc.data()['completionDate']?.toDate()
        })) as Booking[]
      )
    );
  }

  // Get booking by ID
  getBooking(id: string): Observable<Booking | null> {
    const bookingDoc = doc(this.firestore, 'bookings', id);
    
    return from(getDoc(bookingDoc)).pipe(
      map(doc => {
        if (doc.exists()) {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            bookingDate: data['bookingDate']?.toDate() || new Date(),
            approvalDate: data['approvalDate']?.toDate(),
            completionDate: data['completionDate']?.toDate()
          } as Booking;
        }
        return null;
      })
    );
  }

  // Update booking status (admin only)
  async updateBookingStatus(id: string, status: Booking['status'], adminNotes?: string): Promise<void> {
    if (!this.authService.isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    const bookingDoc = doc(this.firestore, 'bookings', id);
    const updates: any = {
      status,
      updatedAt: new Date()
    };

    if (status === 'Approved') {
      updates.approvalDate = new Date();
    } else if (status === 'Completed') {
      updates.completionDate = new Date();
    }

    if (adminNotes) {
      updates.adminNotes = adminNotes;
    }

    await updateDoc(bookingDoc, updates);
  }

  // Get bookings by status
  getBookingsByStatus(status: Booking['status']): Observable<Booking[]> {
    const bookingsCollection = collection(this.firestore, 'bookings');
    const q = query(
      bookingsCollection,
      where('status', '==', status),
      orderBy('bookingDate', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          bookingDate: doc.data()['bookingDate']?.toDate() || new Date(),
          approvalDate: doc.data()['approvalDate']?.toDate(),
          completionDate: doc.data()['completionDate']?.toDate()
        })) as Booking[]
      )
    );
  }

  // Get pending bookings (admin only)
  getPendingBookings(): Observable<Booking[]> {
    return this.getBookingsByStatus('Pending');
  }

  // Get approved bookings (admin only)
  getApprovedBookings(): Observable<Booking[]> {
    return this.getBookingsByStatus('Approved');
  }

  // Cancel booking (user only)
  async cancelBooking(id: string): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    const booking = await this.getBooking(id).toPromise();
    if (!booking || booking.userId !== currentUser.uid) {
      throw new Error('Unauthorized: Cannot cancel this booking');
    }

    if (booking.status !== 'Pending') {
      throw new Error('Cannot cancel booking that is not pending');
    }

    const bookingDoc = doc(this.firestore, 'bookings', id);
    await updateDoc(bookingDoc, {
      status: 'Rejected',
      adminNotes: 'Cancelled by user',
      updatedAt: new Date()
    });
  }
}
