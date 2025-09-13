export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'Available' | 'Booked' | 'Sold' | 'Leased';
  imageUrl?: string;
  specifications?: { [key: string]: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}
