import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductCategory } from '../../shared/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  // Get all products
  getProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products');
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()['updatedAt']?.toDate() || new Date()
        })) as Product[]
      )
    );
  }

  // Get available products only
  getAvailableProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products');
    const q = query(
      productsCollection, 
      where('status', '==', 'Available'),
      orderBy('createdAt', 'desc')
    );
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()['updatedAt']?.toDate() || new Date()
        })) as Product[]
      )
    );
  }

  // Get product by ID
  getProduct(id: string): Observable<Product | null> {
    const productDoc = doc(this.firestore, 'products', id);
    
    return from(getDoc(productDoc)).pipe(
      map(doc => {
        if (doc.exists()) {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date()
          } as Product;
        }
        return null;
      })
    );
  }

  // Create new product (admin only)
  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!this.authService.isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    const productsCollection = collection(this.firestore, 'products');
    const newProduct = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(productsCollection), newProduct);
  }

  // Update product (admin only)
  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    if (!this.authService.isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    const productDoc = doc(this.firestore, 'products', id);
    await updateDoc(productDoc, {
      ...updates,
      updatedAt: new Date()
    });
  }

  // Delete product (admin only)
  async deleteProduct(id: string): Promise<void> {
    if (!this.authService.isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    const productDoc = doc(this.firestore, 'products', id);
    await deleteDoc(productDoc);
  }

  // Update product status (admin only)
  async updateProductStatus(id: string, status: Product['status']): Promise<void> {
    if (!this.authService.isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    await this.updateProduct(id, { status });
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products');
    const q = query(
      productsCollection,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()['updatedAt']?.toDate() || new Date()
        })) as Product[]
      )
    );
  }

  // Get product categories
  getCategories(): Observable<ProductCategory[]> {
    const categoriesCollection = collection(this.firestore, 'categories');
    const q = query(categoriesCollection, orderBy('name'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ProductCategory[]
      )
    );
  }
}
