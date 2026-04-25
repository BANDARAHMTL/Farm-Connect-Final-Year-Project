/**
 * FarmConnect - OOP Models & Controllers Implementation Example
 * 
 * This file demonstrates how to use the OOP Models and Controllers
 * in a real-world scenario. It shows:
 * - Creating models
 * - Using controllers for CRUD operations
 * - Handling validation errors
 * - Using custom business logic methods
 * - Getting statistics and reports
 */

// Import Models
const User = require('./models/example/User');
const Product = require('./models/example/Product');
const Booking = require('./models/example/Booking');

// Import Controllers
const UserController = require('./controllers_oop/example/UserController');
const ProductController = require('./controllers_oop/example/ProductController');
const BookingController = require('./controllers_oop/example/BookingController');

// ============================================
// 1. INITIALIZE CONTROLLERS
// ============================================
console.log('='.repeat(50));
console.log('FARMCONNECT - OOP IMPLEMENTATION EXAMPLE');
console.log('='.repeat(50));

const userController = new UserController();
const productController = new ProductController();
const bookingController = new BookingController();

// ============================================
// 2. CREATE SAMPLE USERS
// ============================================
console.log('\n📝 CREATING USERS...\n');

const users = [
  {
    name: 'Ahmed Khan',
    email: 'ahmed@farmconnect.com',
    phone: '03001234567',
    location: 'Lahore',
    role: 'farmer'
  },
  {
    name: 'Ali Shah',
    email: 'ali@farmconnect.com',
    phone: '03107654321',
    location: 'Islamabad',
    role: 'buyer'
  },
  {
    name: 'Fatima Ahmed',
    email: 'fatima@farmconnect.com',
    phone: '03001111111',
    location: 'Karachi',
    role: 'farmer'
  },
  {
    name: 'Hassan Khan',
    email: 'hassan@farmconnect.com',
    phone: '03002222222',
    location: 'Peshawar',
    role: 'mill-operator'
  }
];

// Create each user and display result
users.forEach((userData, index) => {
  const result = userController.create(userData);
  
  if (result.success) {
    console.log(`✅ User ${index + 1}: ${userData.name} created`);
    console.log(`   ID: ${result.data.id}, Email: ${result.data.email}`);
  } else {
    console.log(`❌ Failed to create user: ${userData.name}`);
    console.log(`   Errors: ${JSON.stringify(result.errors)}`);
  }
});

console.log(`\n📊 Total users: ${userController.getCount()}`);

// ============================================
// 3. DEMONSTRATE USER VALIDATION
// ============================================
console.log('\n' + '='.repeat(50));
console.log('VALIDATION TESTING');
console.log('='.repeat(50));

console.log('\n❌ Testing Invalid User Creation:\n');

const invalidResult = userController.create({
  name: 'A',  // Too short
  email: 'invalid-email',  // Invalid format
  phone: '123',  // Invalid format
  location: '',  // Empty
  role: 'invalid-role'  // Invalid role
});

console.log('Result:', invalidResult.success ? '✅ Valid' : '❌ Invalid');
if (!invalidResult.success) {
  console.log('Errors found:');
  invalidResult.errors.forEach(err => {
    console.log(`  • ${err.field}: ${err.message}`);
  });
}

// ============================================
// 4. CREATE SAMPLE PRODUCTS
// ============================================
console.log('\n' + '='.repeat(50));
console.log('PRODUCTS MANAGEMENT');
console.log('='.repeat(50));
console.log('\n📦 CREATING PRODUCTS...\n');

const products = [
  {
    name: 'Basmati Rice',
    category: 'rice',
    price: 250,
    stock: 100,
    description: 'Premium Pakistani basmati rice',
    rating: 4.8
  },
  {
    name: 'Wheat Flour',
    category: 'grains',
    price: 80,
    stock: 500,
    description: 'Whole wheat flour',
    rating: 4.5
  },
  {
    name: 'Organic Tomatoes',
    category: 'vegetables',
    price: 120,
    stock: 50,
    description: 'Fresh organic tomatoes',
    rating: 4.3
  },
  {
    name: 'Apple Grade A',
    category: 'fruits',
    price: 200,
    stock: 75,
    description: 'Red delicious apples',
    rating: 4.7
  },
  {
    name: 'Rice Bran Oil',
    category: 'other',
    price: 450,
    stock: 30,
    description: 'Pure rice bran cooking oil',
    rating: 4.6
  }
];

products.forEach((productData, index) => {
  const result = productController.create(productData);
  
  if (result.success) {
    console.log(`✅ Product ${index + 1}: ${productData.name}`);
    console.log(`   Price: Rs. ${productData.price}, Stock: ${productData.stock} units`);
  } else {
    console.log(`❌ Failed to create product: ${productData.name}`);
  }
});

console.log(`\n📊 Total products: ${productController.getCount()}`);

// ============================================
// 5. PRODUCT OPERATIONS
// ============================================
console.log('\n' + '='.repeat(50));
console.log('PRODUCT OPERATIONS');
console.log('='.repeat(50));

console.log('\n🔍 PRODUCTS BY CATEGORY:\n');

const categories = ['rice', 'grains', 'vegetables', 'fruits'];
categories.forEach(category => {
  const result = productController.findByCategory(category);
  if (result.success && result.data.length > 0) {
    console.log(`${category.toUpperCase()}:`);
    result.data.forEach(product => {
      console.log(`  • ${product.name} - Rs. ${product.price}`);
    });
  }
});

console.log('\n📊 INVENTORY STATUS:\n');

const inStock = productController.getInStock();
const outOfStock = productController.getOutOfStock();

console.log(`In Stock: ${inStock.data.length} products`);
console.log(`Out of Stock: ${outOfStock.data.length} products`);

console.log('\n💰 PRICE RANGE (100-300):\n');

const priceRange = productController.findByPriceRange(100, 300);
priceRange.data.forEach(product => {
  console.log(`  • ${product.name}: Rs. ${product.price}`);
});

// ============================================
// 6. SELLING & RESTOCKING
// ============================================
console.log('\n' + '='.repeat(50));
console.log('SALES OPERATIONS');
console.log('='.repeat(50));

console.log('\n🛒 SELLING PRODUCTS:\n');

// Simulate sales
const salesResults = [
  { productId: 1, quantity: 20, productName: 'Basmati Rice' },
  { productId: 3, quantity: 15, productName: 'Organic Tomatoes' },
  { productId: 4, quantity: 10, productName: 'Apple Grade A' }
];

salesResults.forEach(sale => {
  const result = productController.sellProduct(sale.productId, sale.quantity);
  const product = productController.getById(sale.productId).data;
  
  console.log(`${sale.productName}:`);
  console.log(`  Sold: ${sale.quantity} units`);
  console.log(`  Remaining Stock: ${product.stock} units`);
});

console.log('\n📦 RESTOCKING PRODUCTS:\n');

const restockResults = [
  { productId: 3, quantity: 100, productName: 'Organic Tomatoes' },
  { productId: 5, quantity: 50, productName: 'Rice Bran Oil' }
];

restockResults.forEach(restock => {
  const result = productController.restockProduct(restock.productId, restock.quantity);
  const product = productController.getById(restock.productId).data;
  
  console.log(`${restock.productName}:`);
  console.log(`  Added: ${restock.quantity} units`);
  console.log(`  New Stock: ${product.stock} units`);
});

// ============================================
// 7. PRODUCT STATISTICS
// ============================================
console.log('\n' + '='.repeat(50));
console.log('INVENTORY STATISTICS');
console.log('='.repeat(50));

const stats = productController.getInventoryStats();
console.log('\n📊 Inventory Report\n');
console.log(`Total Products: ${stats.data.totalProducts}`);
console.log(`In Stock: ${stats.data.inStockCount}`);
console.log(`Out of Stock: ${stats.data.outOfStockCount}`);
console.log(`Total Value: ${stats.data.totalInventoryValue}`);
console.log(`Average Price: ${stats.data.averagePrice}`);
console.log(`Availability: ${stats.data.availabilityPercentage}`);

// ============================================
// 8. CREATE BOOKINGS
// ============================================
console.log('\n' + '='.repeat(50));
console.log('BOOKINGS MANAGEMENT');
console.log('='.repeat(50));
console.log('\n📅 CREATING BOOKINGS...\n');

const bookings = [
  {
    userId: 1,
    vehicleId: 101,
    startDate: '2024-05-01',
    endDate: '2024-05-05',
    pickupLocation: 'Lahore',
    dropoffLocation: 'Islamabad',
    totalPrice: 5000
  },
  {
    userId: 2,
    vehicleId: 102,
    startDate: '2024-05-02',
    endDate: '2024-05-07',
    pickupLocation: 'Islamabad',
    dropoffLocation: 'Rawalpindi',
    totalPrice: 8000
  },
  {
    userId: 3,
    vehicleId: 103,
    startDate: '2024-05-03',
    endDate: '2024-05-06',
    pickupLocation: 'Karachi',
    dropoffLocation: 'Hyderabad',
    totalPrice: 6000
  }
];

bookings.forEach((bookingData, index) => {
  const result = bookingController.create(bookingData);
  
  if (result.success) {
    console.log(`✅ Booking ${index + 1} created`);
    console.log(`   User: ${bookingData.userId}, Duration: ${result.data.durationDays} days`);
    console.log(`   Amount: Rs. ${bookingData.totalPrice}`);
  }
});

console.log(`\n📊 Total bookings: ${bookingController.getCount()}`);

// ============================================
// 9. BOOKING STATUS UPDATES
// ============================================
console.log('\n' + '='.repeat(50));
console.log('BOOKING STATUS MANAGEMENT');
console.log('='.repeat(50));

console.log('\n✅ CONFIRMING BOOKINGS:\n');

[1, 2].forEach(bookingId => {
  const result = bookingController.confirmBooking(bookingId);
  const booking = bookingController.getById(bookingId).data;
  
  if (result.success) {
    console.log(`Booking ${bookingId}: ${booking.status} ✓`);
  }
});

console.log('\n🏁 COMPLETING BOOKINGS:\n');

const completed = bookingController.completeBooking(1);
if (completed.success) {
  const booking = bookingController.getById(1).data;
  console.log(`Booking 1: ${booking.status} ✓`);
}

console.log('\n❌ CANCELLING BOOKING:\n');

const cancelled = bookingController.cancelBooking(3);
if (cancelled.success) {
  const booking = bookingController.getById(3).data;
  console.log(`Booking 3: ${booking.status} ✓`);
}

// ============================================
// 10. BOOKING STATISTICS
// ============================================
console.log('\n' + '='.repeat(50));
console.log('BOOKING STATISTICS');
console.log('='.repeat(50));

const bookingStats = bookingController.getBookingStats();
console.log('\n📊 Booking Report\n');
console.log(`Total Bookings: ${bookingStats.data.totalBookings}`);
console.log(`Pending: ${bookingStats.data.pendingCount}`);
console.log(`Confirmed: ${bookingStats.data.confirmedCount}`);
console.log(`Completed: ${bookingStats.data.completedCount}`);
console.log(`Cancelled: ${bookingStats.data.cancelledCount}`);
console.log(`Completion Rate: ${bookingStats.data.completionRate}`);
console.log(`Total Revenue: ${bookingStats.data.totalRevenue}`);
console.log(`Average Booking: ${bookingStats.data.averageBookingValue}`);

// ============================================
// 11. USER STATISTICS
// ============================================
console.log('\n' + '='.repeat(50));
console.log('USER STATISTICS');
console.log('='.repeat(50));

const userStats = userController.getStatistics();
console.log('\n👥 User Report\n');
console.log(`Total Users: ${userStats.data.totalUsers}`);
console.log(`Active: ${userStats.data.activeUsers}`);
console.log(`Inactive: ${userStats.data.inactiveUsers}`);
console.log(`Active Rate: ${userStats.data.activePercentage}`);
console.log('\nRole Distribution:');
Object.entries(userStats.data.roleDistribution).forEach(([role, count]) => {
  console.log(`  • ${role}: ${count} user(s)`);
});

// ============================================
// 12. SEARCH OPERATIONS
// ============================================
console.log('\n' + '='.repeat(50));
console.log('SEARCH OPERATIONS');
console.log('='.repeat(50));

console.log('\n🔍 USER SEARCH:\n');

const searchUser = userController.searchByName('Khan');
if (searchUser.data.length > 0) {
  console.log('Users matching "Khan":');
  searchUser.data.forEach(user => {
    console.log(`  • ${user.name} (${user.role})`);
  });
}

console.log('\n🔍 PRODUCT SEARCH:\n');

const searchProduct = productController.searchByName('rice');
if (searchProduct.data.length > 0) {
  console.log('Products matching "rice":');
  searchProduct.data.forEach(product => {
    console.log(`  • ${product.name} - Rs. ${product.price}`);
  });
}

// ============================================
// 13. TOP RATED PRODUCTS
// ============================================
console.log('\n' + '='.repeat(50));
console.log('TOP RATED PRODUCTS');
console.log('='.repeat(50));

const topRated = productController.getTopRated(3);
console.log('\n⭐ Top 3 Rated Products\n');
topRated.data.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}`);
  console.log(`   Rating: ${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}`);
  console.log(`   Price: Rs. ${product.price}`);
});

// ============================================
// 14. SUMMARY
// ============================================
console.log('\n' + '='.repeat(50));
console.log('SYSTEM SUMMARY');
console.log('='.repeat(50));
console.log('\n📊 Final Statistics:\n');

console.log(`👥 Users: ${userController.getCount()}`);
console.log(`📦 Products: ${productController.getCount()}`);
console.log(`📅 Bookings: ${bookingController.getCount()}`);

console.log('\n✅ All OOP Models & Controllers are working correctly!');
console.log('\n🎓 Next Steps:');
console.log('   1. Review the OOP_MODELS_CONTROLLERS_GUIDE.md for detailed explanations');
console.log('   2. Check QUICK_START_EXAMPLES.md for more code examples');
console.log('   3. Study the Model.js and Controller.js base classes');
console.log('   4. Explore the example models and controllers');
console.log('   5. Create your own models and controllers following the patterns');

console.log('\n' + '='.repeat(50));
