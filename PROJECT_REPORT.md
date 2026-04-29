# 🌾 FarmConnect v4.0 - Comprehensive Project Report

**Version:** 4.0  
**Type:** Full-Stack Agricultural Services Platform  
**Date:** April 2026  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Database Schema](#database-schema)
5. [Features & Functionality](#features--functionality)
6. [User Roles & Access](#user-roles--access)
7. [API Endpoints](#api-endpoints)
8. [Installation & Setup](#installation--setup)
9. [Project Structure](#project-structure)
10. [Key Implementations](#key-implementations)
11. [Testing & Quality Assurance](#testing--quality-assurance)
12. [Performance & Scalability](#performance--scalability)
13. [Deployment Instructions](#deployment-instructions)

---

## Executive Summary

**FarmConnect v4.0** is a full-stack agricultural platform connecting farmers, equipment owners, and rice mills in a digital marketplace. The system enables farmers to:

- ✅ Book tractors and harvesters for agricultural work
- ✅ Sell paddy to rice mills
- ✅ Access real-time pricing information
- ✅ Manage their farming operations

Administrators can:
- ✅ Manage users, vehicles, and rice mills
- ✅ Monitor bookings and sales
- ✅ View system analytics
- ✅ Handle content management

**Technology Stack:**
- **Frontend:** React 18.2.0 + React Router DOM 6.20.0
- **Backend:** Node.js + Express 4.22.1
- **Database:** MySQL 8.0+
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer 1.4.5

---

## Project Overview

### Problem Statement
Rural farmers struggle to access:
1. Agricultural equipment (tractors, harvesters) for seasonal work
2. Fair market prices for their paddy harvest
3. Direct connections with rice mills
4. Streamlined booking and payment processes

### Solution
FarmConnect is a unified platform that:
- Connects farmers with equipment owners
- Links farmers with rice mills for paddy sales
- Provides transparent pricing and booking management
- Enables real-time communication and transactions

### Target Users
1. **Farmers** - Rent equipment and sell paddy
2. **Equipment Owners** - List and manage vehicle rentals
3. **Rice Mills** - Buy paddy and trade rice
4. **Administrators** - Oversee all platform operations

---

## Architecture & Technology Stack

### Frontend Architecture
```
React 18.2.0 + React Router DOM 6.20.0
├── Pages (User & Admin Interfaces)
├── Components (Reusable UI elements)
├── Services (API communication)
├── Contexts (Authentication & Theme)
├── Styles (CSS with Light Mode)
└── Assets (Images & Icons)
```

**Key Dependencies:**
- `axios` 1.6.0 - HTTP client for API calls
- `react-router-dom` 6.20.0 - Client-side routing
- `react-scripts` 5.0.1 - Create React App tooling

### Backend Architecture
```
Node.js + Express 4.22.1
├── Controllers (Business Logic)
├── Models (OOP Data Classes)
├── Routes (API Endpoints)
├── Middleware (Auth, Upload, Error handling)
├── Config (Database Connection)
└── Scripts (Setup & Testing Utilities)
```

**Key Dependencies:**
- `express` 4.22.1 - Web framework
- `mysql2` 3.16.0 - MySQL driver
- `jsonwebtoken` 9.0.3 - JWT authentication
- `bcrypt` 5.1.1 - Password hashing
- `multer` 1.4.5-lts.1 - File upload middleware
- `cors` 2.8.5 - Cross-origin resource sharing
- `dotenv` 16.6.1 - Environment variables

### Database Technology
- **Engine:** MySQL 8.0+
- **Charset:** utf8mb4 (Unicode support)
- **Collation:** utf8mb4_unicode_ci
- **Tables:** 8 main tables with relationships
- **Storage:** InnoDB (transactional)

---

## Database Schema

### Core Tables

#### 1. **ADMINS** - System Administrators
```sql
Columns:
- id (INT, PK)
- username (VARCHAR 50, UNIQUE)
- password (VARCHAR 255, hashed)
- full_name (VARCHAR 100)
- email (VARCHAR 100, UNIQUE)
- role (VARCHAR 20, default: 'admin')
- status (VARCHAR 20, default: 'active')
- created_at (TIMESTAMP)

Purpose: Admin user accounts for system access
Sample Data: 1 default admin
```

#### 2. **FARMERS** - Farmer Profiles
```sql
Columns:
- id (INT, PK)
- farmer_id (VARCHAR 30, UNIQUE) - Format: FRM-2026-0001
- name (VARCHAR 100)
- email (VARCHAR 100, UNIQUE)
- mobile (VARCHAR 20)
- nic (VARCHAR 20) - National ID
- address (TEXT)
- land_number (VARCHAR 50) - Land reference
- password (VARCHAR 255, hashed)
- created_at (TIMESTAMP)

Purpose: Farmer registration and profile management
Sample Data: 20+ farmers with realistic data
```

#### 3. **VEHICLES** - Equipment for Rent
```sql
Columns:
- id (INT, PK)
- vehicle_number (VARCHAR 50, UNIQUE) - WP-TRC-1001
- vehicle_type (VARCHAR 50) - 'Tractor' or 'Harvester'
- model (VARCHAR 100) - Kubota M7040
- capacity (INT) - Hectares/day
- status (VARCHAR 20) - Available/Booked/Maintenance
- owner_name (VARCHAR 100)
- owner_mobile (VARCHAR 20)
- reg_number (VARCHAR 50)
- rating (FLOAT) - 0-5 stars
- reviews (INT) - Total reviews
- location (VARCHAR 100) - District
- price_per_acre (DECIMAL 10,2) - Rental price (₨)
- image_url (VARCHAR 500) - /uploads/vehicles/...
- created_at (TIMESTAMP)

Purpose: Equipment listings and inventory management
Sample Data: 10 vehicles (5 tractors, 5 harvesters)
Relationships: Connected to bookings
```

#### 4. **BOOKINGS** - Vehicle Rental Reservations
```sql
Columns:
- id (INT, PK)
- vehicle_id (INT, FK → vehicles.id)
- farmer_name (VARCHAR 100)
- farmer_id (INT)
- booking_date (DATE)
- start_date (DATE)
- end_date (DATE)
- session (VARCHAR 50) - Morning/Afternoon/Full Day
- location (VARCHAR 100)
- status (VARCHAR 50) - pending/approved/rejected/completed
- duration (INT) - Number of days
- rate_per_day (DECIMAL 10,2)
- total_price (DECIMAL 10,2)
- notes (TEXT)
- payment_status (VARCHAR 20) - unpaid/paid
- created_at (TIMESTAMP)

Purpose: Track vehicle rental transactions
Sample Data: 15+ sample bookings
Relationships: Links farmers to vehicles
```

#### 5. **RICE MILLS** - Rice Processing Facilities
```sql
Columns:
- id (INT, PK)
- mill_name (VARCHAR 100)
- location (VARCHAR 100) - District
- address (VARCHAR 255)
- contact_number (VARCHAR 20)
- email (VARCHAR 100)
- description (TEXT)
- image_url (VARCHAR 500) - /uploads/ricemills/...
- rating (FLOAT) - 0-5 stars
- status (VARCHAR 20) - active/inactive
- created_at (TIMESTAMP)

Purpose: Rice mill business listings
Sample Data: 8 mills (Araliya, Nipuna, Lath, etc.)
Relationships: Connected to rice_types, rice_marketplace
```

#### 6. **RICE TYPES** - Rice Varieties at Mills
```sql
Columns:
- id (INT, PK)
- mill_id (INT, FK → rice_mills.id)
- type_name (VARCHAR 50) - Samba, Basmati, etc.
- buying_price_kg (DECIMAL 10,2) - Paddy price
- selling_price_kg (DECIMAL 10,2) - Rice price
- availability (INT) - Quantity in kg
- description (TEXT)
- created_at (TIMESTAMP)

Purpose: Rice varieties and pricing per mill
Relationships: Many rice_types per rice_mill
```

#### 7. **RICE_MARKETPLACE** - Rice for Sale
```sql
Columns:
- id (INT, PK)
- mill_id (INT, FK → rice_mills.id)
- rice_type_id (INT, FK → rice_types.id)
- quantity_kg (INT)
- price_per_kg (DECIMAL 10,2)
- description (TEXT)
- image_url (VARCHAR 500)
- status (VARCHAR 20) - available/sold
- created_at (TIMESTAMP)

Purpose: Active rice listings for purchase
Relationships: Links rice_mills and rice_types
```

#### 8. **PADDY_TYPES** - Paddy Classifications
```sql
Columns:
- id (INT, PK)
- type_name (VARCHAR 50)
- description (TEXT)
- created_at (TIMESTAMP)

Purpose: Paddy variety taxonomy
Sample Data: Common Sri Lankan paddy types
```

### Database Relationships
```
Farmers ─────┬────→ Bookings ────→ Vehicles
             │
             └────→ Rice Marketplace (selling)
                   ↓
              Rice Mills ────→ Rice Types
```

---

## Features & Functionality

### 🚜 **1. Vehicle Management System**

#### For Farmers:
- Browse available tractors and harvesters
- Search by type, location, and price range
- View vehicle details (model, capacity, owner info)
- Filter by availability status
- Check ratings and reviews

#### For Admins:
- Add new vehicles with image upload
- Edit vehicle details and pricing
- Delete vehicles from system
- Manage inventory status
- View vehicle performance metrics

**Implementation:**
- `VehicleController.js` - CRUD operations
- `vehicle.routes.js` - API endpoints
- Image upload to `/uploads/vehicles/`
- Real-time availability status

---

### 📅 **2. Booking Management System**

#### For Farmers:
- Select vehicle and date range
- Choose time session (Morning/Afternoon/Full Day)
- Fill booking details (location, notes)
- View booking status (pending/approved/rejected/completed)
- Automatic price calculation

#### For Admins:
- View all bookings dashboard
- Approve/reject booking requests
- Modify booking dates and status
- Track payment status
- Generate booking reports

**Data Flow:**
```
Farmer selects vehicle
    ↓
Creates booking request
    ↓
Admin reviews & approves
    ↓
Payment recorded
    ↓
Booking completed
```

**Smart Features:**
- Automatic date validation
- Price calculation based on duration
- Conflict detection (same vehicle, overlapping dates)
- Session-based booking (not all-day only)

---

### 🏭 **3. Rice Mill Management**

#### Features:
- Complete rice mill directory
- Mill contact and location information
- Rice variety listings per mill
- Buying price for paddy
- Selling price for processed rice
- Image uploads for mill photos
- Rating and review system

#### Implementation:
- `RiceMillController.js` - CRUD operations (newly created)
- `riceMill.routes.js` - API endpoints
- Image upload to `/uploads/ricemills/`
- Admin can add/edit/delete mills

---

### 💰 **4. Paddy Selling & Marketplace**

#### For Farmers:
- Check paddy buying prices across mills
- View rice mill locations and ratings
- Access market insights
- Compare offers from different mills
- Track selling history

#### For Admins:
- Manage rice mill listings
- Update rice varieties and pricing
- Monitor marketplace activity
- Generate sales reports

**Features:**
- Real-time price comparison
- Location-based mill finder
- Volume-based pricing tiers
- Transaction history tracking

---

### 👥 **5. User Management**

#### Admin Functions:
- View all registered farmers
- Edit farmer details
- Delete user accounts
- Search and filter users
- View user activity logs
- Manage user status

#### Farmer Functions:
- Create account (sign up)
- Edit profile information
- Update contact details
- Change password
- View account history

**Security:**
- Password hashing (bcrypt)
- JWT-based session management
- Role-based access control
- Email/Mobile verification (backend ready)

---

### 📊 **6. Admin Dashboard**

#### Features:
- Total users, vehicles, bookings overview
- Recent bookings list
- System statistics
- Quick action buttons
- Navigation sidebar
- Responsive design

#### Sections:
1. **Users Management** - Farmer accounts
2. **Vehicles Management** - Equipment inventory
3. **Bookings** - Rental transactions
4. **Rice Mills** - Mill directory
5. **Marketplace** - Rice sales
6. **Reports** - Analytics (ready for implementation)

---

### 🎨 **7. User Interface**

#### Frontend Features:
- Clean, modern design
- Green/agricultural color scheme
- Mobile-responsive layout
- Smooth navigation
- Form validation
- Error handling
- Loading states
- Modal dialogs

#### Light Mode (Currently Active):
- Primary: #0a2e1a (dark green)
- Accent: #f5c518 (golden)
- Background: #f4fbf6 (light green)
- Text: #0a2e1a (dark)

---

## User Roles & Access

### 1. **Farmer Role**
```
Access Level: Basic User
Permissions:
  ✅ View all available vehicles
  ✅ Create vehicle bookings
  ✅ View own bookings
  ✅ Edit own profile
  ✅ View rice mill listings
  ✅ Check paddy buying prices
  ✅ Sell paddy to mills (transactions)
  
Navigation:
  - Home Dashboard
  - Booking Page
  - Sell Paddy Section
  - Rice Marketplace
  - Account Settings
  
Login: http://localhost:3000
  Email: kamal@gmail.com
  Password: farmer123
```

### 2. **Admin Role**
```
Access Level: Full System Access
Permissions:
  ✅ Manage all users (create, read, update, delete)
  ✅ Manage vehicles (inventory)
  ✅ Manage rice mills
  ✅ Approve/reject bookings
  ✅ View system analytics
  ✅ Upload images & media
  ✅ System configuration
  
Navigation:
  - Admin Dashboard
  - Users Management
  - Vehicles Management
  - Bookings Management
  - Rice Mills Management
  - Marketplace Management
  - Reports & Analytics
  
Login: http://localhost:3000/login
  Username: admin
  Password: admin123
```

### 3. **Default Credentials**
```
ADMIN:
  Username: admin
  Password: admin123
  Email: admin@farmconnect.com
  
FARMER (Sample):
  Email: kamal@gmail.com
  Password: farmer123
  Farmer ID: FRM-2026-0001
```

---

## API Endpoints

### Authentication Endpoints
```
POST   /api/admin/login              → Admin login
POST   /api/farmers/register         → Farmer registration
POST   /api/farmers/login            → Farmer login
POST   /api/admin/logout             → Admin logout
```

### Vehicle Endpoints (CRUD)
```
GET    /api/vehicles                 → Get all vehicles
GET    /api/vehicles/:id             → Get vehicle by ID
POST   /api/vehicles                 → Add new vehicle (admin only)
PUT    /api/vehicles/:id             → Update vehicle (admin only)
DELETE /api/vehicles/:id             → Delete vehicle (admin only)

Headers Required (Upload):
  - Content-Type: multipart/form-data
  - Authorization: Bearer {adminToken}
```

### Booking Endpoints
```
GET    /api/bookings                 → Get all bookings (admin)
GET    /api/bookings/user/:id        → Get farmer's bookings
POST   /api/bookings                 → Create booking
PUT    /api/bookings/:id             → Update booking
PATCH  /api/bookings/:id/status      → Update booking status
DELETE /api/bookings/:id             → Delete booking (admin)
```

### Rice Mill Endpoints (CRUD)
```
GET    /api/rice-mills               → Get all rice mills (public)
GET    /api/rice-mills/:id           → Get mill by ID
POST   /api/rices                    → Add new rice mill (admin)
PUT    /api/rices/:id                → Update rice mill (admin)
DELETE /api/rices/:id                → Delete rice mill (admin)

Alias:
  /api/rices                         → Same as /api/rice-mills
```

### User Management Endpoints
```
GET    /api/users                    → Get all farmers (admin)
GET    /api/users/:id                → Get farmer by ID
PUT    /api/users/:id                → Update farmer (admin)
DELETE /api/users/:id                → Delete farmer (admin)
GET    /api/admin/farmers            → Get farmers list (admin)
```

### Response Format
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { /* object or array */ }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Details about the error"
}
```

---

## Installation & Setup

### Prerequisites
- Node.js v20.15.0+
- MySQL 8.0+
- npm or yarn
- Windows PowerShell / Terminal

### step 1: Database Setup

#### Option A: Fresh Installation
```powershell
# Create database and tables
mysql -u root -p < "C:\path\to\backend\COMPLETE_FIXED_DATABASE.sql"

# Load sample data
mysql -u root -p farmconnect < "C:\path\to\backend\sample_data.sql"
```

#### Option B: Use SQL Dump
```powershell
mysql -u root -p farmconnect < "C:\path\to\backend\COMPLETE_FIXED_DATABASE.sql"
```

### Step 2: Backend Setup

```powershell
# Navigate to backend directory
cd "C:\Users\THARINDU\Desktop\new fixed\backend"

# Install dependencies
npm install

# Create admin user
node scripts/createAdmin.js admin admin123 "Admin User" admin@farmconnect.com

# Create sample farmers (optional)
node scripts/createFarmers.js

# Start backend server
npm start

# Expected Output:
# ✅ FarmConnect API v4.0 — uploads at C:\...\backend/uploads
# 🚀 Server → http://localhost:8080
# 📸 Images → http://localhost:8080/uploads/
```

### Step 3: Frontend Setup

```powershell
# Open new terminal/PowerShell
# Navigate to frontend directory
cd "C:\Users\THARINDU\Desktop\new fixed\frontend"

# Install dependencies
npm install

# Start frontend development server
npm start

# Browser opens: http://localhost:3000
```

### Step 4: Verify Setup

#### Access Points:
```
🌐 Frontend:    http://localhost:3000
🔌 Backend API: http://localhost:8080
📝 Admin Login: http://localhost:3000/login
👨‍🌾 Farmer Area: http://localhost:3000 (Sign In)
```

#### Test Credentials:
```
Admin:
  URL: http://localhost:3000/login
  Username: admin
  Password: admin123

Farmer:
  URL: http://localhost:3000 → Sign In
  Email: kamal@gmail.com
  Password: farmer123
```

---

## Project Structure

### Backend Structure
```
backend/
├── config/
│   └── db.js                    ← MySQL connection pool
├── controllers/
│   ├── Controller.js            ← Base controller class
│   ├── AdminController.js       ← Admin operations
│   ├── FarmerController.js      ← Farmer registration
│   ├── UserController.js        ← User management
│   ├── VehicleController.js     ← Vehicle CRUD
│   ├── BookingController.js     ← Booking transactions
│   ├── RiceMillController.js    ← Rice mill management (NEW)
│   └── ProductController.js     ← Product operations
├── models/
│   ├── Model.js                 ← Base model class
│   ├── Admin.js                 ← Admin model
│   ├── Farmer.js                ← Farmer model
│   ├── User.js                  ← User model
│   ├── Vehicle.js               ← Vehicle model
│   ├── Booking.js               ← Booking model
│   ├── RiceMill.js              ← Rice mill model
│   ├── Rice.js, RiceMill.js, RiceType.js
│   └── Selling.js               ← Sales model
├── routes/
│   ├── admin.routes.js          ← Admin routes
│   ├── farmer.routes.js         ← Farmer routes
│   ├── vehicle.routes.js        ← Vehicle routes
│   ├── booking.routes.js        ← Booking routes
│   ├── riceMill.routes.js       ← Rice mill routes (FIXED)
│   └── [other routes]
├── middleware/
│   ├── adminAuth.js             ← Admin authentication
│   ├── farmerAuth.js            ← Farmer authentication
│   ├── upload.js                ← Multer file upload config
│   └── authMiddleware.js        ← Auth middleware
├── scripts/
│   ├── createAdmin.js           ← Create admin script
│   ├── createFarmers.js         ← Create sample farmers
│   ├── testLogin.js             ← Login testing
│   ├── testVehiclesAPI.js       ← Vehicle API testing
│   └── [other utility scripts]
├── uploads/
│   ├── vehicles/                ← Vehicle images
│   ├── ricemills/               ← Rice mill images
│   └── marketplace/             ← Marketplace images
├── server.js                    ← Express server entry point
├── package.json                 ← Dependencies
└── [Database & Documentation]
```

### Frontend Structure
```
frontend/
├── public/
│   ├── index.html               ← HTML entry point
│   └── [static files]
├── src/
│   ├── api/
│   │   └── api.js               ← Axios instance & interceptors
│   ├── components/
│   │   ├── NavBar.js            ← Top navigation
│   │   ├── AdminNavbar.js       ← Admin header
│   │   ├── ProtectedRoute.js    ← Route protection
│   │   └── [other components]
│   ├── contexts/
│   │   ├── ThemeContext.js      ← Theme management (removed dark mode)
│   │   └── FarmerAuthContext.js ← Farmer authentication
│   ├── pages/
│   │   ├── Home.js              ← Landing page
│   │   ├── BookingPage.js       ← Vehicle booking
│   │   ├── Selling.js           ← Paddy selling
│   │   ├── RiceMarketplace.js   ← Rice marketplace
│   │   ├── Account.js           ← Farmer account
│   │   ├── Account_sign_in.js   ← Login page
│   │   ├── Account_sign_up.js   ← Registration page
│   │   ├── AdminAreaRoutes.js   ← Admin routing
│   │   └── admin/
│   │       ├── Dashboard.js     ← Admin dashboard
│   │       ├── Vehicles.js      ← Vehicle management
│   │       ├── Bookings.js      ← Booking management
│   │       ├── RiceMills.js     ← Rice mill management
│   │       ├── Users.js         ← User management
│   │       ├── Marketplace.js   ← Marketplace management
│   │       └── [other admin pages]
│   ├── services/
│   │   ├── vehicleService.js
│   │   ├── riceMillService.js
│   │   └── [other services]
│   ├── data/
│   │   ├── riceMills.js         ← Static rice mill data
│   │   └── [other data]
│   ├── styles/
│   │   └── [styling files]
│   ├── App.js                   ← Main app component
│   ├── index.js                 ← React entry point
│   ├── lightMode.css            ← Light theme styles
│   ├── index.css                ← Global styles
│   └── constants.js             ← App constants
│
├── package.json                 ← Dependencies
└── .gitignore
```

---

## Key Implementations

### 1. **OOP Architecture**
- Base `Model.js` class with validation
- Specific model classes (Farmer, Vehicle, Booking, etc.)
- Controller inheritance pattern
- Reusable utility methods

### 2. **Authentication System**
```
JWT Token Flow:
Admin Login → Hash password check → Generate JWT
             ↓
            Token stored in localStorage
             ↓
            Every request includes Authorization header
             ↓
            adminAuth middleware validates token
             ↓
            Controller executes protected action
```

### 3. **Image Upload System**
```
Multer Configuration:
File Selected (Frontend)
    ↓
FormData object created
    ↓
POST to /api/{resource} with multipart/form-data
    ↓
Multer middleware intercepts file
    ↓
Validates: JPG/PNG/WEBP, < 10MB
    ↓
Saves to: backend/uploads/{type}/{sanitized}_timestamp.ext
    ↓
Returns: /uploads/{type}/filename (URL to be stored in DB)
    ↓
Frontend receives URL and saves to image_url column
```

### 4. **Booking System**
```
Vehicle Selection (Frontend)
    ↓
Date Range Selection
    ↓
Session Selection (Morning/Afternoon/Full Day)
    ↓
Auto-Calculate: days × rate_per_day = total_price
    ↓
Submit Booking Request
    ↓
Backend: Check vehicle availability (no overlaps)
    ↓
Create booking record with status = 'pending'
    ↓
Admin: Review and approve/reject
    ↓
Update booking status
    ↓
Farmer: Notified of status change
    ↓
Payment processed
    ↓
Booking marked 'completed'
```

### 5. **Database Relationships**
```sql
-- Vehicle → Booking
ALTER TABLE bookings
ADD CONSTRAINT fk_booking_vehicle
FOREIGN KEY (vehicle_id) REFERENCES vehicles(id);

-- Rice Mill → Rice Types
ALTER TABLE rice_types
ADD CONSTRAINT fk_ricetype_mill
FOREIGN KEY (mill_id) REFERENCES rice_mills(id);

-- Rice Type → Rice Marketplace
ALTER TABLE rice_marketplace
ADD CONSTRAINT fk_marketplace_ricetype
FOREIGN KEY (rice_type_id) REFERENCES rice_types(id);
```

### 6. **Error Handling**
```javascript
// Consistent error response format across all endpoints
try {
  // Business logic
} catch (error) {
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Operation failed',
    error: error.message
  });
}
```

### 7. **Input Validation**
- Frontend: React form validation
- Backend: Model class setter methods with validation rules
- Database: NOT NULL constraints, UNIQUE keys
- API: Request parameter validation

---

## Testing & Quality Assurance

### Backend Testing Scripts

#### 1. Login Testing
```bash
node scripts/testLogin.js
# Tests: Admin login, Farmer login, Token validation
```

#### 2. Vehicle API Testing
```bash
node scripts/testVehiclesAPI.js
# Tests: GET all, GET by ID, filtering by type/location
```

#### 3. Booking Testing
```bash
node scripts/testBookingsWithVehicles.js
# Tests: Create booking, update status, retrieve bookings with vehicle data
```

#### 4. Database Verification
```bash
node scripts/checkDatabase.js
# Tests: Database connection, table existence, sample data
```

### Manual Testing Checklist

#### Farmer Registration & Login
- [ ] Sign up with valid email
- [ ] Sign up with invalid email (should fail)
- [ ] Sign in with correct password
- [ ] Sign in with wrong password (should fail)
- [ ] View own profile

#### Vehicle Booking
- [ ] Search vehicles by type
- [ ] Search vehicles by location
- [ ] View vehicle details
- [ ] Create booking with valid dates
- [ ] Attempt overlapping dates (should fail)
- [ ] View booking status changes

#### Rice Mill Management (Admin)
- [ ] Add new rice mill with image
- [ ] Edit rice mill details
- [ ] Delete rice mill
- [ ] Upload image validation (size, format)

#### Admin Dashboard
- [ ] View user statistics
- [ ] View booking history
- [ ] Search and filter users
- [ ] Approve/reject bookings
- [ ] Edit user information

---

## Performance & Scalability

### Database Optimization
1. **Indexes:**
   - farmer_id, vehicle_id (Foreign keys)
   - email, username (Unique lookups)
   - status, location (Filtering)

2. **Query Optimization:**
   - LEFT JOIN for booking + vehicle data
   - Selective column selection
   - Pagination for large result sets

3. **Connection Pooling:**
   - MySQL2 connection pool (12-20 connections)
   - Automatic timeout handling
   - Connection reuse

### Frontend Optimization
1. **Code Splitting:**
   - Admin routes lazy loaded
   - Modal components lazy loaded
   - Asset optimization

2. **Network Optimization:**
   - Axios request/response interceptors
   - Error handling and retry logic
   - JWT token caching

3. **Image Optimization:**
   - Max 10 MB file size limit
   - Supported formats: JPG, PNG, WEBP
   - Compressed uploads recommended

### Scalability Considerations
1. **For Growth (100-1000 users):**
   - Add database indexes on frequently filtered columns
   - Implement caching (Redis) for vehicle listings
   - Add pagination to all list endpoints

2. **For Growth (1000-10000 users):**
   - Microservices architecture (Bookings, Payments, Notifications)
   - Message queue for async operations
   - CDN for image delivery
   - Database replication/sharding

3. **Infrastructure:**
   - Docker containerization
   - Kubernetes orchestration
   - Load balancing
   - Cloud deployment (AWS, Azure, GCP)

---

## Deployment Instructions

### Development vs. Production

#### Environment Variables (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=farmconnect
DB_PORT=3306

# Server Configuration
PORT=8080
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=7d
```

### Deployment Steps

#### 1. Prepare Production Database
```bash
# Create database user
CREATE USER 'farmconnect'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON farmconnect.* TO 'farmconnect'@'localhost';
FLUSH PRIVILEGES;

# Load schema
mysql -u farmconnect -p farmconnect < COMPLETE_FIXED_DATABASE.sql
```

#### 2. Deploy Backend
```bash
# Clone/copy project
cd backend

# Install dependencies
npm install --production

# Create .env file
# Update DB credentials for production

# Create admin user
node scripts/createAdmin.js admin secure_password "Admin" admin@company.com

# Start with process manager (PM2)
npm install -g pm2
pm2 start server.js --name "farmconnect-api"
pm2 save
pm2 startup
```

#### 3. Deploy Frontend
```bash
cd frontend

# Install dependencies
npm install --production

# Build optimized bundle
npm run build

# Resulting folder: frontend/build/
# Deploy to:
# - Nginx / Apache (serve static files)
# - AWS S3 + CloudFront
# - Vercel / Netlify (easier deployment)
```

#### 4. Configure Web Server (Nginx Example)
```nginx
server {
    listen 80;
    server_name farmconnect.com;

    # Frontend (React build)
    location / {
        root /var/www/farmconnect/frontend/build;
        index index.html;
        try_files $uri /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Image uploads
    location /uploads/ {
        alias /var/www/farmconnect/backend/uploads/;
        expires 30d;
    }
}
```

#### 5. SSL/HTTPS
```bash
# Use Let's Encrypt (free SSL)
sudo certbot certonly --standalone -d farmconnect.com

# Update Nginx config with SSL certificate paths
# Redirect HTTP to HTTPS
```

---

## Recent Fixes & Updates (v4.0)

### ✅ Fixes Implemented

1. **Dark Mode Removal**
   - Removed ThemeProvider from App.js
   - Deleted dark mode toggle buttons from NavBar & AdminNavbar
   - Removed darkMode.css import
   - Light mode enforced globally

2. **Rice Mill Routes Fixed**
   - Uncommented rice mill import in server.js
   - Created RiceMillController.js with full CRUD
   - Fixed route import from correct controller
   - Both `/api/rice-mills` and `/api/rices` endpoints working
   - Image upload to `/uploads/ricemills/` functional

3. **Vehicle Booking Data Enhancement**
   - Updated BookingController to LEFT JOIN with vehicles table
   - All 5 booking functions now return complete vehicle data
   - Vehicle details included in all responses
   - Tested and verified data accuracy

### 🚀 Current Status
- ✅ Backend: Fully functional
- ✅ Frontend: Production ready
- ✅ Database: All 8 tables operational
- ✅ Authentication: JWT + bcrypt implemented
- ✅ Image uploads: Multiple endpoints configured
- ✅ Admin panel: All CRUD operations working
- ✅ Farmer area: Booking and marketplace ready

---

## Support & Documentation

### Key Documentation Files
```
README.md                           ← Quick start guide
SCHEMA_REFERENCE.md                 ← Database schema details
DATABASE_SETUP_GUIDE.md             ← Database setup instructions
MODELS_CONTROLLERS_README.md        ← OOP architecture guide
INDEX_AND_NAVIGATION.md             ← Navigation structure
VEHICLE_BOOKING_FIX.md              ← Booking system updates
```

### Useful Commands

**Backend:**
```bash
npm start                           # Start server
npm run dev                         # Start with nodemon (dev mode)
node scripts/createAdmin.js         # Create admin user
node scripts/testLogin.js           # Test login endpoints
```

**Frontend:**
```bash
npm start                           # Start dev server (port 3000)
npm build                           # Create production build
npm test                            # Run tests
```

**Database:**
```bash
mysql -u root -p farmconnect        # Open MySQL prompt
SHOW TABLES;                        # List all tables
DESC vehicles;                      # Show vehicle table structure
SELECT COUNT(*) FROM vehicles;      # Count vehicles
```

---

## Contact & Support

**Project Information:**
- **Version:** 4.0
- **Last Updated:** April 2026
- **Status:** Production Ready
- **Platform:** Windows
- **Node Version:** v20.15.0+

**Key Contacts:**
- Admin Setup: `createAdmin.js` script
- Database Issues: Check MySQL connectivity
- Backend Errors: Check `npm start` console
- Frontend Issues: Check browser console (F12)

---

## Conclusion

**FarmConnect v4.0** is a comprehensive, production-ready agricultural platform that successfully connects farmers, equipment owners, and rice mills in a unified digital ecosystem. The platform is built on modern technologies with:

✅ Scalable architecture  
✅ Secure authentication  
✅ Intuitive user interface  
✅ Robust database design  
✅ Complete CRUD operations  
✅ Image management system  

**Ready for deployment and expansion into new markets!**

---

*Generated: April 28, 2026*  
*Repository: BANDARAHMTL/Farm-Connect-Final-Year-Project*  
*Current Branch: main*
