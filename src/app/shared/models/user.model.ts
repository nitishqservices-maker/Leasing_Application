export interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  address?: string;
}
