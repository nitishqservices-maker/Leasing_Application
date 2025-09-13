export interface Booking {
  id: string;
  userId: string;
  productId: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  bookingDate: Date;
  approvalDate?: Date;
  completionDate?: Date;
  notes?: string;
  adminNotes?: string;
  userEmail: string;
  productName: string;
  productPrice: number;
  message : string;
}

export interface BookingRequest {
  productId: string;
  notes?: string;
}
