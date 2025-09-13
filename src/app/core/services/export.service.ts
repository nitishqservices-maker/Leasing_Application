import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Booking, User, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  // Export bookings to Excel
  exportBookingsToExcel(bookings: Booking[], filename: string = 'bookings'): void {
    const worksheet = XLSX.utils.json_to_sheet(bookings.map(booking => ({
      'Booking ID': booking.id,
      'User Email': booking.userEmail,
      'Product Name': booking.productName,
      'Product Price': booking.productPrice,
      'Status': booking.status,
      'Booking Date': this.formatDate(booking.bookingDate),
      'Approval Date': booking.approvalDate ? this.formatDate(booking.approvalDate) : '',
      'Completion Date': booking.completionDate ? this.formatDate(booking.completionDate) : '',
      'User Notes': booking.notes || '',
      'Admin Notes': booking.adminNotes || ''
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  // Export bookings to CSV
  exportBookingsToCSV(bookings: Booking[], filename: string = 'bookings'): void {
    const headers = [
      'Booking ID',
      'User Email', 
      'Product Name',
      'Product Price',
      'Status',
      'Booking Date',
      'Approval Date',
      'Completion Date',
      'User Notes',
      'Admin Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...bookings.map(booking => [
        booking.id,
        `"${booking.userEmail}"`,
        `"${booking.productName}"`,
        booking.productPrice,
        booking.status,
        this.formatDate(booking.bookingDate),
        booking.approvalDate ? this.formatDate(booking.approvalDate) : '',
        booking.completionDate ? this.formatDate(booking.completionDate) : '',
        `"${booking.notes || ''}"`,
        `"${booking.adminNotes || ''}"`
      ].join(','))
    ].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // Export bookings to PDF
  exportBookingsToPDF(bookings: Booking[], filename: string = 'bookings'): void {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    // Title
    doc.setFontSize(18);
    doc.text('Bookings Report', margin, yPosition);
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${this.formatDate(new Date())}`, margin, yPosition);
    yPosition += 10;

    // Table headers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const headers = ['ID', 'User', 'Product', 'Price', 'Status', 'Date'];
    const colWidths = [25, 40, 50, 20, 25, 30];
    let xPosition = margin;

    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition);
      xPosition += colWidths[index];
    });
    yPosition += lineHeight;

    // Table data
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    bookings.forEach(booking => {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      const rowData = [
        booking.id.substring(0, 8) + '...',
        booking.userEmail.substring(0, 15) + '...',
        booking.productName.substring(0, 20) + '...',
        `$${booking.productPrice}`,
        booking.status,
        this.formatDate(booking.bookingDate)
      ];

      xPosition = margin;
      rowData.forEach((data, index) => {
        doc.text(data, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      yPosition += lineHeight;
    });

    doc.save(`${filename}.pdf`);
  }

  // Export users to Excel
  exportUsersToExcel(users: User[], filename: string = 'users'): void {
    const worksheet = XLSX.utils.json_to_sheet(users.map(user => ({
      'User ID': user.uid,
      'Email': user.email,
      'Display Name': user.displayName || '',
      'Role': user.role,
      'Created At': this.formatDate(user.createdAt),
      'Updated At': this.formatDate(user.updatedAt)
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  // Export users to CSV
  exportUsersToCSV(users: User[], filename: string = 'users'): void {
    const headers = [
      'User ID',
      'Email',
      'Display Name',
      'Role',
      'Created At',
      'Updated At'
    ];

    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.uid,
        `"${user.email}"`,
        `"${user.displayName || ''}"`,
        user.role,
        this.formatDate(user.createdAt),
        this.formatDate(user.updatedAt)
      ].join(','))
    ].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // Export users to PDF
  exportUsersToPDF(users: User[], filename: string = 'users'): void {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    // Title
    doc.setFontSize(18);
    doc.text('Users Report', margin, yPosition);
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${this.formatDate(new Date())}`, margin, yPosition);
    yPosition += 10;

    // Table headers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const headers = ['Email', 'Name', 'Role', 'Created'];
    const colWidths = [60, 50, 20, 40];
    let xPosition = margin;

    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition);
      xPosition += colWidths[index];
    });
    yPosition += lineHeight;

    // Table data
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    users.forEach(user => {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      const rowData = [
        user.email.substring(0, 25) + '...',
        (user.displayName || 'No Name').substring(0, 20) + '...',
        user.role,
        this.formatDate(user.createdAt)
      ];

      xPosition = margin;
      rowData.forEach((data, index) => {
        doc.text(data, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      yPosition += lineHeight;
    });

    doc.save(`${filename}.pdf`);
  }

  // Export products to Excel
  exportProductsToExcel(products: Product[], filename: string = 'products'): void {
    const worksheet = XLSX.utils.json_to_sheet(products.map(product => ({
      'Product ID': product.id,
      'Name': product.name,
      'Description': product.description,
      'Price': product.price,
      'Category': product.category,
      'Status': product.status,
      'Created At': this.formatDate(product.createdAt),
      'Updated At': this.formatDate(product.updatedAt)
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  // Export products to CSV
  exportProductsToCSV(products: Product[], filename: string = 'products'): void {
    const headers = [
      'Product ID',
      'Name',
      'Description',
      'Price',
      'Category',
      'Status',
      'Created At',
      'Updated At'
    ];

    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        product.id,
        `"${product.name}"`,
        `"${product.description}"`,
        product.price,
        product.category,
        product.status,
        this.formatDate(product.createdAt),
        this.formatDate(product.updatedAt)
      ].join(','))
    ].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // Export products to PDF
  exportProductsToPDF(products: Product[], filename: string = 'products'): void {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    // Title
    doc.setFontSize(18);
    doc.text('Products Report', margin, yPosition);
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${this.formatDate(new Date())}`, margin, yPosition);
    yPosition += 10;

    // Table headers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const headers = ['Name', 'Category', 'Price', 'Status'];
    const colWidths = [60, 40, 30, 30];
    let xPosition = margin;

    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition);
      xPosition += colWidths[index];
    });
    yPosition += lineHeight;

    // Table data
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    products.forEach(product => {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      const rowData = [
        product.name.substring(0, 25) + '...',
        product.category.substring(0, 15) + '...',
        `$${product.price}`,
        product.status
      ];

      xPosition = margin;
      rowData.forEach((data, index) => {
        doc.text(data, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      yPosition += lineHeight;
    });

    doc.save(`${filename}.pdf`);
  }

  // Helper method to format dates
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Helper method to download files
  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
