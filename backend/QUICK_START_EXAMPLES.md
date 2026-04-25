# OOP Models & Controllers - Quick Start Guide

## 🚀 Quick Examples

### Example 1: Creating a User

```javascript
const User = require('./models/example/User');

// Create a new user
const user = new User({
  name: 'Ahmed Khan',
  email: 'ahmed@example.com',
  phone: '03001234567',
  location: 'Lahore',
  role: 'farmer'
});

// Set properties with validation
user.setName('Ahmed Khan');       // ✅ Valid
user.setEmail('invalid-email');   // ❌ Invalid format
user.setPhone('03001234567');     // ✅ Valid
user.setRole('admin');            // ❌ Invalid role
user.setRole('farmer');           // ✅ Valid

// Check if valid
if (user.validate()) {
  console.log('✅ User is valid');
  console.log(user.getData());
} else {
  console.log('❌ Errors:', user.getErrors());
}
```

---

### Example 2: Creating a Product

```javascript
const Product = require('./models/example/Product');

// Create product
const product = new Product({
  name: 'Basmati Rice',
  category: 'rice',
  price: 250,
  stock: 100,
  description: 'Premium basmati rice',
  rating: 4.5
});

// Get properties
console.log(product.getName());    // "Basmati Rice"
console.log(product.getPrice());   // 250
console.log(product.getStock());   // 100

// Manage stock
product.decreaseStock(10);         // Sell 10 units
console.log(product.getStock());   // 90

product.increaseStock(20);         // Restock 20 units
console.log(product.getStock());   // 110

// Get summary
console.log(product.getSummary());
```

---

### Example 3: Creating a Booking

```javascript
const Booking = require('./models/example/Booking');

// Create booking
const booking = new Booking({
  userId: 5,
  vehicleId: 12,
  startDate: new Date('2024-05-01'),
  endDate: new Date('2024-05-05'),
  pickupLocation: 'Lahore',
  dropoffLocation: 'Islamabad',
  totalPrice: 5000
});

// Check duration
console.log(booking.getDurationDays());  // 4 days

// Check status
console.log(booking.getStatus());        // "pending"
console.log(booking.isActive());         // true

// Status transition
booking.confirm();                        // pending → confirmed
console.log(booking.getStatus());        // "confirmed"

booking.complete();                       // confirmed → completed
console.log(booking.getStatus());        // "completed"
console.log(booking.isCompleted());      // true
```

---

### Example 4: Using User Controller

```javascript
const UserController = require('./controllers_oop/example/UserController');

// Create controller
const userController = new UserController();

// CREATE - Add new user
const createResult = userController.create({
  name: 'Ahmed Khan',
  email: 'ahmed@example.com',
  phone: '03001234567',
  location: 'Lahore',
  role: 'farmer'
});

console.log(createResult);
// {
//   success: true,
//   statusCode: 201,
//   message: 'Item created successfully',
//   data: { id: 1, name: 'Ahmed Khan', ... },
//   timestamp: '2024-04-25T...'
// }

// READ - Get all users
const allResult = userController.getAll();
console.log(allResult.data);  // Array of all users

// READ - Get specific user
const oneResult = userController.getById(1);
console.log(oneResult.data);  // User with ID 1

// UPDATE - Modify user
const updateResult = userController.update(1, {
  name: 'Ali Khan',
  location: 'Islamabad'
});
console.log(updateResult.success);  // true/false

// DELETE - Remove user
const deleteResult = userController.delete(1);
console.log(deleteResult.success);  // true/false

// CUSTOM - Find by email
const byEmail = userController.findByEmail('ahmed@example.com');
console.log(byEmail.data);  // User with that email

// CUSTOM - Find by role
const farmers = userController.findByRole('farmer');
console.log(farmers.data);  // All farmers

// CUSTOM - Get active users
const active = userController.getActiveUsers();
console.log(active.data);  // All active users

// CUSTOM - Get statistics
const stats = userController.getStatistics();
console.log(stats.data);
// {
//   totalUsers: 10,
//   activeUsers: 8,
//   inactiveUsers: 2,
//   activePercentage: '80%',
//   roleDistribution: { admin: 1, farmer: 5, buyer: 3, ... }
// }
```

---

### Example 5: Using Product Controller

```javascript
const ProductController = require('./controllers_oop/example/ProductController');

// Create controller
const productController = new ProductController();

// CREATE
const created = productController.create({
  name: 'Basmati Rice',
  category: 'rice',
  price: 250,
  stock: 100,
  description: 'Premium rice'
});

// GET ALL
const allProducts = productController.getAll();

// GET BY CATEGORY
const riceProducts = productController.findByCategory('rice');
console.log(riceProducts.data);  // All rice products

// GET IN STOCK
const available = productController.getInStock();
console.log(available.data);  // Products in stock

// GET OUT OF STOCK
const outOfStock = productController.getOutOfStock();
console.log(outOfStock.data);  // Out of stock products

// FIND BY PRICE RANGE
const byPrice = productController.findByPriceRange(100, 500);
console.log(byPrice.data);  // Products between 100-500

// SELL PRODUCT
const sold = productController.sellProduct(1, 10);  // Sell 10 units of product 1
console.log(sold.success);  // true/false

// RESTOCK PRODUCT
const restocked = productController.restockProduct(1, 50);  // Add 50 units
console.log(restocked.success);  // true/false

// SEARCH BY NAME
const search = productController.searchByName('rice');
console.log(search.data);  // Products matching "rice"

// GET TOP RATED
const topRated = productController.getTopRated(5);  // Top 5 products
console.log(topRated.data);

// GET INVENTORY STATS
const stats = productController.getInventoryStats();
console.log(stats.data);
// {
//   totalProducts: 15,
//   inStockCount: 12,
//   outOfStockCount: 3,
//   totalInventoryValue: 'Rs. 50000',
//   averagePrice: 'Rs. 250',
//   availabilityPercentage: '80%'
// }
```

---

### Example 6: Using Booking Controller

```javascript
const BookingController = require('./controllers_oop/example/BookingController');

// Create controller
const bookingController = new BookingController();

// CREATE
const created = bookingController.create({
  userId: 1,
  vehicleId: 5,
  startDate: '2024-05-01',
  endDate: '2024-05-05',
  pickupLocation: 'Lahore',
  dropoffLocation: 'Islamabad',
  totalPrice: 5000
});

// GET BY STATUS
const pending = bookingController.getByStatus('pending');
console.log(pending.data);  // All pending bookings

// GET BY USER
const userBookings = bookingController.getByUser(1);
console.log(userBookings.data);  // All bookings of user 1

// GET ACTIVE BOOKINGS
const active = bookingController.getActiveBookings();
console.log(active.data);  // Pending + confirmed

// CONFIRM BOOKING
const confirmed = bookingController.confirmBooking(1);  // Confirm booking 1
console.log(confirmed.success);  // true/false

// COMPLETE BOOKING
const completed = bookingController.completeBooking(1);
console.log(completed.success);  // true/false

// CANCEL BOOKING
const cancelled = bookingController.cancelBooking(1);
console.log(cancelled.success);  // true/false

// GET BY DATE RANGE
const range = bookingController.getByDateRange('2024-05-01', '2024-05-31');
console.log(range.data);  // Bookings in May

// GET STATS
const stats = bookingController.getBookingStats();
console.log(stats.data);
// {
//   totalBookings: 20,
//   pendingCount: 5,
//   confirmedCount: 10,
//   completedCount: 4,
//   cancelledCount: 1,
//   completionRate: '20%',
//   totalRevenue: 'Rs. 100000',
//   averageBookingValue: 'Rs. 5000'
// }
```

---

## 🔄 Error Handling Examples

### Model Validation Errors

```javascript
const user = new User();

// Try invalid name
user.setName('A');  // Too short
console.log(user.getErrors());
// [{ field: 'name', message: 'Name must be at least 2 characters' }]

// Try invalid email
user.setEmail('not-an-email');
console.log(user.getErrors());
// [{ field: 'email', message: 'Please provide a valid email address' }]

// Clear errors
user.clearErrors();
console.log(user.isValid());  // true
```

### Controller Error Responses

```javascript
const userController = new UserController();

// Try invalid data
const result = userController.create({
  name: 'A',  // Too short
  email: 'invalid-email',  // Invalid format
  phone: '123'  // Invalid phone
});

console.log(result);
// {
//   success: false,
//   statusCode: 400,
//   message: 'Validation failed',
//   errors: [
//     { field: 'name', message: 'Name must be at least 2 characters' },
//     { field: 'email', message: 'Please provide a valid email address' },
//     { field: 'phone', message: 'Please provide a valid phone number' }
//   ]
// }

// Try to get non-existent user
const notFound = userController.getById(999);
console.log(notFound);
// {
//   success: false,
//   statusCode: 404,
//   message: 'Item with ID 999 not found'
// }
```

---

## 🎯 Complete Workflow Example

```javascript
const UserController = require('./controllers_oop/example/UserController');
const ProductController = require('./controllers_oop/example/ProductController');
const BookingController = require('./controllers_oop/example/BookingController');

// 1. Create controllers
const users = new UserController();
const products = new ProductController();
const bookings = new BookingController();

// 2. Add some users
const user1 = users.create({
  name: 'Ahmed Khan',
  email: 'ahmed@example.com',
  phone: '03001234567',
  location: 'Lahore',
  role: 'farmer'
});

const user2 = users.create({
  name: 'Ali Shah',
  email: 'ali@example.com',
  phone: '03007654321',
  location: 'Islamabad',
  role: 'buyer'
});

console.log('Users created:', users.getCount());

// 3. Add some products
products.create({
  name: 'Basmati Rice',
  category: 'rice',
  price: 250,
  stock: 100
});

products.create({
  name: 'Wheat',
  category: 'grains',
  price: 80,
  stock: 500
});

console.log('Products added:', products.getCount());

// 4. Create booking
const booking = bookings.create({
  userId: 1,
  vehicleId: 5,
  startDate: '2024-05-01',
  endDate: '2024-05-05',
  pickupLocation: 'Lahore',
  dropoffLocation: 'Islamabad',
  totalPrice: 5000
});

// 5. Update booking status
bookings.confirmBooking(1);
bookings.completeBooking(1);

// 6. Get statistics
console.log('User Stats:', users.getStatistics().data);
console.log('Inventory Stats:', products.getInventoryStats().data);
console.log('Booking Stats:', bookings.getBookingStats().data);
```

---

## 📊 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET, UPDATE success |
| 201 | Created | CREATE success |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Item doesn't exist |
| 500 | Server Error | Unexpected error |

---

## 💡 Tips & Tricks

### Tip 1: Always Validate Before Saving
```javascript
user.setEmail('invalid');  // Returns false if invalid
// OR
user.validate();           // Check entire object
```

### Tip 2: Check Response Success
```javascript
const result = controller.create(data);
if (result.success) {
  console.log('Created:', result.data);
} else {
  console.log('Error:', result.errors);
}
```

### Tip 3: Use Custom Filters
```javascript
const active = controller.data.filter(item => item.isActive);
const expensive = products.data.filter(p => p.price > 1000);
```

### Tip 4: Chain Operations
```javascript
// Create, then get stats
const controller = new UserController();
controller.create({ /* ... */ });
controller.create({ /* ... */ });
console.log(controller.getStatistics());
```

---

## 🧪 Testing Checklist

- [ ] Model validates correct data
- [ ] Model rejects invalid data
- [ ] Controller creates items
- [ ] Controller retrieves all items
- [ ] Controller retrieves one item
- [ ] Controller updates items
- [ ] Controller deletes items
- [ ] Error messages are clear
- [ ] Response format is consistent
- [ ] Custom methods work correctly

---

**Practice these examples to master OOP Models & Controllers! 🎓**
