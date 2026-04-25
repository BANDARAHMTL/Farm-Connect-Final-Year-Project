# OOP Models & Controllers Architecture Guide

## 📚 Overview

This guide explains the **Object-Oriented Programming (OOP)** architecture for Models and Controllers in the FarmConnect application.

**What is OOP?** → A programming approach that uses "objects" (like real-world things) to organize code.

---

## 🏗️ Folder Structure

```
backend/
│
├── models/                          ← Data layer (What things ARE)
│   ├── Model.js                     ← Base class (parent for all models)
│   └── example/                     ← Example models
│       ├── User.js                  ← User model
│       ├── Product.js               ← Product model
│       └── Booking.js               ← Booking model
│
└── controllers_oop/                 ← Logic layer (What things DO)
    ├── Controller.js                ← Base class (parent for all controllers)
    └── example/                     ← Example controllers
        ├── UserController.js        ← User operations
        ├── ProductController.js     ← Product operations
        └── BookingController.js     ← Booking operations
```

---

## 🎓 OOP Concepts Explained

### 1. **Classes** (Templates for objects)

```javascript
// Class = Blueprint
// Object = Building made from blueprint

class Model {
  constructor(data) {
    this.data = data;
  }
}

const user = new Model({ name: 'Ahmed' }); // Creating an object
```

### 2. **Inheritance** (Parent-Child relationship)

```javascript
// Parent class (General)
class Model {
  validate() { /* ... */ }
}

// Child class (Specific)
class User extends Model {
  setEmail(email) { /* ... */ }
}

// User gets all methods from Model + its own methods
```

### 3. **Encapsulation** (Hiding internal details)

```javascript
class Model {
  #data = {};  // Private (only accessible inside class)
  
  getData() {  // Public (accessible from outside)
    return this.#data;
  }
}

// From outside:
model.getData();  // ✅ Works
model.#data;      // ❌ Not allowed!
```

### 4. **Abstraction** (Simplifying complex things)

```javascript
// Complex logic hidden inside method
class Product {
  sellProduct(id, quantity) {
    // Many operations hidden here
    // User just calls: sellProduct(5, 10)
  }
}

// User doesn't need to know the details
```

### 5. **Polymorphism** (Different behavior in child classes)

```javascript
class Controller {
  create(data) { /* General logic */ }
}

class UserController extends Controller {
  create(data) { /* User-specific logic */ }
}

// Same method name, different behavior
```

---

## 📦 Models Layer

### **What are Models?**
Models represent **real-world objects** with their **data and properties**.

Think of it as: **"What is a User? What properties does a User have?"**

### **Model Structure**

```
Model (Base Class)
├── Properties (Data)
│   ├── id
│   ├── email
│   ├── createdAt
│   └── ...
├── Getters (Read data)
│   ├── getName()
│   ├── getEmail()
│   └── ...
├── Setters (Validate & write data)
│   ├── setName(name)
│   ├── setEmail(email)
│   └── ...
└── Validation
    └── validate()
```

### **Model Example: User**

```javascript
class User extends Model {
  // Constructor
  constructor(data = {}) {
    super(data);
  }

  // Getter - Read property
  getName() {
    return this.getProperty('name');
  }

  // Setter - Set & validate property
  setName(name) {
    if (name.length < 2) {
      this.addError('name', 'Name too short');
      return false;
    }
    this.setProperty('name', name);
    return true;
  }

  // Validation
  validate() {
    if (!this.getName()) {
      this.addError('name', 'Name required');
    }
    return this.isValid();
  }
}
```

### **How to Use a Model**

```javascript
const User = require('./models/example/User');

// Create user object
const user = new User({
  name: 'Ahmed',
  email: 'ahmed@example.com',
  phone: '03001234567'
});

// Use getters
console.log(user.getName());      // "Ahmed"
console.log(user.getEmail());     // "ahmed@example.com"

// Use setters (with validation)
user.setName('Ali');              // ✅ Success
user.setName('A');                // ❌ Error: too short

// Validate entire user
if (user.validate()) {
  console.log('User is valid');
} else {
  console.log(user.getErrors());
}

// Get all data
console.log(user.getData());       // { name: 'Ali', email: '...', ... }
```

---

## 🎛️ Controllers Layer

### **What are Controllers?**
Controllers handle **business logic** and **CRUD operations**.

Think of it as: **"What can we DO with a User? Create, Read, Update, Delete operations"**

### **Controller Structure**

```
Controller (Base Class)
├── CRUD Operations
│   ├── create(data)      ← Create new item
│   ├── getAll()          ← Read all items
│   ├── getById(id)       ← Read one item
│   ├── update(id, data)  ← Update item
│   └── delete(id)        ← Delete item
└── Custom Logic
    ├── findByEmail()
    ├── findByRole()
    └── getStatistics()
```

### **Controller Example: UserController**

```javascript
class UserController extends Controller {
  // Constructor
  constructor() {
    super(User);  // Works with User model
  }

  // Find user by email (custom logic)
  findByEmail(email) {
    const user = this.data.find(
      item => item.email === email.toLowerCase()
    );
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    return { success: true, data: user };
  }

  // Get active users (custom logic)
  getActiveUsers() {
    return this.data.filter(user => user.isActive === true);
  }
}
```

### **How to Use a Controller**

```javascript
const UserController = require('./controllers_oop/example/UserController');

// Create controller instance
const userController = new UserController();

// Create new user
const result = userController.create({
  name: 'Ahmed',
  email: 'ahmed@example.com'
});
console.log(result.success);  // true/false
console.log(result.data);     // Created user data
console.log(result.message);  // Success/error message

// Read all users
const allUsers = userController.getAll();
console.log(allUsers.data);   // Array of all users

// Read one user by ID
const oneUser = userController.getById(1);
console.log(oneUser.data);    // User with ID 1

// Update user
const updated = userController.update(1, {
  name: 'Ali'
});
console.log(updated.success); // true/false

// Delete user
const deleted = userController.delete(1);
console.log(deleted.success); // true/false

// Custom logic
const active = userController.getActiveUsers();
console.log(active);          // All active users

const byEmail = userController.findByEmail('ahmed@example.com');
console.log(byEmail.data);    // User with that email

const stats = userController.getStatistics();
console.log(stats.data);      // User statistics
```

---

## 🔄 How Models & Controllers Work Together

```
User Request
   ↓
Controller receives request
   ↓
Controller creates Model instance
   ↓
Model validates data (setters)
   ↓
If valid: Controller stores in database/memory
If invalid: Return error to user
   ↓
Controller formats response
   ↓
Response sent to user
```

### **Real-World Example**

```javascript
// User submits form to create account
const userController = new UserController();

const result = userController.create({
  name: 'Ahmed Khan',
  email: 'ahmed@example.com',
  phone: '03001234567',
  location: 'Lahore'
});

// What happens behind the scenes:
// 1. Controller receives data
// 2. Creates User model: new User(data)
// 3. Model validates: user.validate()
//    - Checks if name >= 2 characters ✅
//    - Checks if email is valid ✅
//    - Checks if phone is valid ✅
//    - Checks if location exists ✅
// 4. All valid? Controller stores user
// 5. Returns: {
//      success: true,
//      message: 'User created',
//      data: { id: 1, name: 'Ahmed Khan', ... }
//    }
```

---

## ✅ Base Model Class Methods

### **Data Management**
```javascript
setProperty(key, value)    // Set one property
getProperty(key)           // Get one property
setData(data)              // Set multiple properties
getData()                  // Get all properties
```

### **Validation**
```javascript
addError(field, message)   // Add validation error
clearErrors()              // Clear all errors
getErrors()                // Get array of errors
isValid()                  // Check if valid
validate()                 // Validate (override in child)
```

### **Utility**
```javascript
toJSON()                   // Convert to JSON object
toString()                 // Convert to string
```

---

## ✅ Base Controller Methods (CRUD)

### **CREATE**
```javascript
create(data)  // Add new item, validate, return response
```

### **READ**
```javascript
getAll()      // Get all items
getById(id)   // Get one item by ID
```

### **UPDATE**
```javascript
update(id, data)  // Update item, validate, return response
```

### **DELETE**
```javascript
delete(id)    // Delete item by ID
```

### **Utility**
```javascript
getCount()    // Total number of items
exists(id)    // Check if item exists
clearAll()    // Reset (for testing)
getSummary()  // Get summary information
```

---

## 📋 Response Format

All controllers return consistent response format:

```javascript
{
  success: boolean,       // true/false
  statusCode: number,     // 200, 201, 400, 404, 500
  message: string,        // Human-readable message
  data: object|array,     // Requested data
  errors: array|null,     // Validation errors
  timestamp: string       // When response was created
}
```

### **Success Response**
```javascript
{
  success: true,
  statusCode: 200,
  message: 'User created successfully',
  data: { id: 1, name: 'Ahmed', ... },
  errors: null,
  timestamp: '2024-04-25T10:30:00Z'
}
```

### **Error Response**
```javascript
{
  success: false,
  statusCode: 400,
  message: 'Validation failed',
  data: null,
  errors: [
    { field: 'email', message: 'Invalid email address' },
    { field: 'name', message: 'Name too short' }
  ],
  timestamp: '2024-04-25T10:30:00Z'
}
```

---

## 🎯 Best Practices

### **DO ✅**
- Use models to validate data
- Use controllers for business logic only
- Keep models simple and focused
- Use descriptive method names
- Return consistent response format
- Handle errors gracefully

### **DON'T ❌**
- Mix data validation with business logic
- Access private properties directly
- Create models without validation
- Return inconsistent response formats
- Ignore error handling
- Create overly complex methods

---

## 📝 Creating Your Own Model

### **Step 1: Create the Class**
```javascript
const Model = require('../Model');

class Farmer extends Model {
  constructor(data = {}) {
    super(data);
    this.setDefaults();
  }

  setDefaults() {
    if (!this.getProperty('role')) {
      this.setProperty('role', 'farmer');
    }
  }
}
```

### **Step 2: Add Getters**
```javascript
getFarmSize() {
  return this.getProperty('farmSize');
}

getCrops() {
  return this.getProperty('crops');
}
```

### **Step 3: Add Setters with Validation**
```javascript
setFarmSize(size) {
  const numSize = parseFloat(size);
  if (isNaN(numSize) || numSize <= 0) {
    this.addError('farmSize', 'Invalid farm size');
    return false;
  }
  this.setProperty('farmSize', numSize);
  return true;
}
```

### **Step 4: Add Validation**
```javascript
validate() {
  this.clearErrors();
  if (!this.getFarmSize()) {
    this.addError('farmSize', 'Farm size required');
  }
  return this.isValid();
}
```

### **Step 5: Export**
```javascript
module.exports = Farmer;
```

---

## 📝 Creating Your Own Controller

### **Step 1: Create the Class**
```javascript
const Controller = require('../Controller');
const Farmer = require('../../models/example/Farmer');

class FarmerController extends Controller {
  constructor() {
    super(Farmer);
  }
}
```

### **Step 2: Add Custom Methods**
```javascript
getFarmersByRegion(region) {
  const farmers = this.data.filter(
    f => f.region === region
  );
  return {
    success: true,
    data: farmers,
    message: `Found ${farmers.length} farmers`
  };
}

getCropStats() {
  // Custom business logic
  // ...
}
```

### **Step 3: Export**
```javascript
module.exports = FarmerController;
```

---

## 🧪 Testing Your Models & Controllers

```javascript
// Test the models and controllers
const User = require('./models/example/User');
const UserController = require('./controllers_oop/example/UserController');

// Test Model
console.log('=== TESTING USER MODEL ===');
const user = new User();
user.setName('Ahmed');
user.setEmail('ahmed@example.com');
user.setPhone('03001234567');
user.setLocation('Lahore');

if (user.validate()) {
  console.log('✅ User is valid');
  console.log(user.getData());
} else {
  console.log('❌ User has errors:', user.getErrors());
}

// Test Controller
console.log('\n=== TESTING USER CONTROLLER ===');
const controller = new UserController();

// Create user
const created = controller.create({
  name: 'Ahmed Khan',
  email: 'ahmed@example.com',
  phone: '03001234567',
  location: 'Lahore'
});
console.log('Create:', created);

// Get all users
const all = controller.getAll();
console.log('Get All:', all);

// Get by ID
const one = controller.getById(1);
console.log('Get By ID:', one);

// Update
const updated = controller.update(1, { name: 'Ali Khan' });
console.log('Update:', updated);

// Get statistics
const stats = controller.getStatistics();
console.log('Statistics:', stats);

// Delete
const deleted = controller.delete(1);
console.log('Delete:', deleted);
```

---

## 📚 File Structure Summary

| File | Purpose | Type |
|------|---------|------|
| `Model.js` | Base model class | Parent class |
| `User.js` | User model | Child class |
| `Product.js` | Product model | Child class |
| `Booking.js` | Booking model | Child class |
| `Controller.js` | Base controller class | Parent class |
| `UserController.js` | User operations | Child class |
| `ProductController.js` | Product operations | Child class |
| `BookingController.js` | Booking operations | Child class |

---

## 🎓 Key Takeaways

1. **Models** = Data + Validation (What things ARE)
2. **Controllers** = Logic + CRUD (What things DO)
3. **Inheritance** = Child classes extend parent classes
4. **Encapsulation** = Hide private details behind public methods
5. **Abstraction** = Hide complex logic behind simple methods
6. **Consistency** = Use same patterns everywhere

---

## 🔗 Next Steps

1. **Explore Examples** → Check `example/` folders
2. **Create Your Own** → Follow the patterns shown
3. **Test Functionality** → Run test scripts
4. **Connect to Database** → Extend base Controller with DB methods
5. **Add Validation** → Enhance setters with business rules
6. **Add More Methods** → Extend controllers with custom logic

---

**Happy Coding! 🚀**
