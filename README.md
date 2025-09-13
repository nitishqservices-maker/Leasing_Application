# Leasing Web Application

A comprehensive leasing management system built with Angular and Firebase, supporting both User and Admin roles with distinct permissions and functionality.

## 🚀 Features

### 🔐 Authentication & Role Management
- **Sign Up / Sign In** with email and password using Firebase Authentication
- **Role-based access control** (User/Admin)
- **Route guards** to protect admin and user routes
- **User profile management**

### 📦 Product Catalog & Booking
- **Product catalog** with search and filtering
- **Booking system** for available products
- **Real-time status updates** (Available → Booked → Sold/Leased)
- **Booking history** for users

### 🛠️ Admin Dashboard
- **User management** - view all users, promote/demote roles
- **Booking management** - approve/reject bookings, add admin notes
- **Product management** - add, edit, delete products
- **Analytics dashboard** with key metrics

### 📊 Data Export
- **Export to PDF** using jsPDF
- **Export to Excel** using xlsx
- **Export to CSV** using papaparse
- **Available for**: Users, Bookings, Products

## 🧱 Tech Stack

- **Frontend**: Angular 20
- **Backend**: Firebase (Authentication + Firestore)
- **UI Libraries**: 
  - ngx-toastr for notifications
  - Custom CSS with modern design
- **Export Libraries**:
  - xlsx for Excel export
  - jsPDF for PDF export
  - papaparse for CSV export

## 🔥 Firebase Configuration

The app is configured to use the following Firebase project:
- **Project ID**: leasingapplication-c79b4
- **Authentication**: Email/Password
- **Database**: Firestore
- **Storage**: Firebase Storage (optional)

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/               → Login, Register components
│   ├── core/               → Guards, Services, Models
│   │   ├── guards/         → Auth, Admin, Guest guards
│   │   ├── services/       → Auth, Product, Booking, Export services
│   │   └── models/         → TypeScript interfaces
│   ├── admin/              → Admin dashboard and management
│   │   ├── dashboard/      → Admin overview
│   │   ├── users/          → User management
│   │   ├── bookings/       → Booking management
│   │   └── products/       → Product management
│   ├── user/               → User dashboard and features
│   │   ├── dashboard/      → User overview
│   │   ├── catalog/        → Product catalog
│   │   └── bookings/       → User bookings
│   └── shared/             → Shared models and interfaces
├── environments/           → Environment configuration
└── styles.css             → Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leasing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `src/environments/environment.ts`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🔧 Configuration

### Environment Variables
Update `src/environments/environment.ts` with your Firebase configuration:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  }
};
```

### Firestore Collections
The app uses the following Firestore collections:
- `users` - User profiles and roles
- `products` - Product catalog
- `bookings` - Booking records
- `categories` - Product categories (optional)

## 👥 User Roles

### User Role
- View product catalog
- Book available products
- View own booking history
- Cancel pending bookings

### Admin Role
- All user permissions
- Manage all users (view, promote/demote)
- Manage all bookings (approve/reject, add notes)
- Manage products (add, edit, delete)
- Export data (PDF, Excel, CSV)
- View analytics dashboard

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 UI/UX Features

- **Modern design** with gradient backgrounds and smooth animations
- **Intuitive navigation** with role-based menus
- **Real-time notifications** using Toastr
- **Loading states** and error handling
- **Form validation** with user-friendly error messages
- **Status badges** with color coding
- **Search and filtering** capabilities

## 🔒 Security Features

- **Route guards** prevent unauthorized access
- **Role-based permissions** throughout the application
- **Firebase security rules** (configure in Firebase Console)
- **Input validation** and sanitization
- **Secure authentication** with Firebase Auth

## 📊 Export Features

### Available Export Formats
- **PDF**: Formatted reports with tables and headers
- **Excel**: Spreadsheet format with multiple sheets
- **CSV**: Comma-separated values for data analysis

### Exportable Data
- **Users**: User profiles, roles, creation dates
- **Bookings**: Complete booking history with status
- **Products**: Product catalog with pricing and status

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📝 API Documentation

### Services

#### AuthService
- `signUp(email, password, displayName)` - Register new user
- `signIn(email, password)` - Sign in user
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get current user data
- `isAdmin()` - Check if user is admin
- `getAllUsers()` - Get all users (admin only)

#### ProductService
- `getProducts()` - Get all products
- `getAvailableProducts()` - Get available products only
- `getProduct(id)` - Get product by ID
- `createProduct(product)` - Create new product (admin only)
- `updateProduct(id, updates)` - Update product (admin only)
- `deleteProduct(id)` - Delete product (admin only)

#### BookingService
- `createBooking(bookingRequest)` - Create new booking
- `getUserBookings()` - Get user's bookings
- `getAllBookings()` - Get all bookings (admin only)
- `updateBookingStatus(id, status, notes)` - Update booking status (admin only)
- `cancelBooking(id)` - Cancel booking (user only)

#### ExportService
- `exportBookingsToExcel(bookings, filename)` - Export bookings to Excel
- `exportBookingsToCSV(bookings, filename)` - Export bookings to CSV
- `exportBookingsToPDF(bookings, filename)` - Export bookings to PDF
- Similar methods for users and products

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] Email notifications for booking status changes
- [ ] Advanced analytics and reporting
- [ ] Product image upload with Firebase Storage
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] API rate limiting and caching
- [ ] Advanced search with filters
- [ ] Booking calendar view
- [ ] Payment integration
- [ ] Inventory management

---

**Built with ❤️ using Angular and Firebase**