/**
 * Rice (Marketplace Listing) Model - Represents a rice product listing in marketplace
 * Extends base Model class with validation and marketplace-specific methods
 */

const Model = require('../Model');

class Rice extends Model {
  constructor(data = {}) {
    super(data);
  }

  // ──────────── GETTERS ────────────────────────────────────────
  
  getMillId() {
    return this.getProperty('mill_id');
  }

  getRiceTypeId() {
    return this.getProperty('rice_type_id');
  }

  getTitle() {
    return this.getProperty('title');
  }

  getPricePerKg() {
    return this.getProperty('price_per_kg') || 0;
  }

  getAvailableKg() {
    return this.getProperty('available_kg') || 0;
  }

  getMinOrderKg() {
    return this.getProperty('min_order_kg') || 1;
  }

  getMaxOrderKg() {
    return this.getProperty('max_order_kg') || 1000;
  }

  getDescription() {
    return this.getProperty('description');
  }

  getImageUrl() {
    return this.getProperty('image_url');
  }

  getDeliveryTime() {
    return this.getProperty('delivery_time') || '3-5 days';
  }

  getStatus() {
    return this.getProperty('status') || 'active';
  }

  getCreatedAt() {
    return this.getProperty('created_at');
  }

  isAvailable() {
    return this.getStatus().toLowerCase() === 'active' && this.getAvailableKg() > 0;
  }

  // ──────────── SETTERS WITH VALIDATION ─────────────────────────

  setMillId(millId) {
    const id = parseInt(millId);
    if (isNaN(id) || id <= 0) {
      this.addError('mill_id', 'Invalid mill ID');
      return false;
    }

    this.setProperty('mill_id', id);
    return true;
  }

  setRiceTypeId(riceTypeId) {
    const id = parseInt(riceTypeId);
    if (isNaN(id) || id <= 0) {
      this.addError('rice_type_id', 'Invalid rice type ID');
      return false;
    }

    this.setProperty('rice_type_id', id);
    return true;
  }

  setTitle(title) {
    if (!title || title.trim().length < 3) {
      this.addError('title', 'Title must be at least 3 characters');
      return false;
    }

    this.setProperty('title', title.trim());
    return true;
  }

  setPricePerKg(price) {
    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) {
      this.addError('price_per_kg', 'Price must be a positive number');
      return false;
    }

    this.setProperty('price_per_kg', num);
    return true;
  }

  setAvailableKg(kg) {
    const num = parseFloat(kg);
    if (isNaN(num) || num < 0) {
      this.addError('available_kg', 'Available kg must be a non-negative number');
      return false;
    }

    this.setProperty('available_kg', num);
    return true;
  }

  setMinOrderKg(kg) {
    const num = parseFloat(kg);
    if (isNaN(num) || num <= 0) {
      this.addError('min_order_kg', 'Minimum order must be a positive number');
      return false;
    }

    this.setProperty('min_order_kg', num);
    return true;
  }

  setMaxOrderKg(kg) {
    const num = parseFloat(kg);
    if (isNaN(num) || num < this.getMinOrderKg()) {
      this.addError('max_order_kg', 'Maximum order must be greater than minimum order');
      return false;
    }

    this.setProperty('max_order_kg', num);
    return true;
  }

  setDescription(description) {
    if (description && description.trim().length > 0) {
      this.setProperty('description', description.trim());
    }

    return true;
  }

  setImageUrl(url) {
    if (url && url.trim().length > 0) {
      this.setProperty('image_url', url.trim());
    }

    return true;
  }

  setDeliveryTime(time) {
    if (time && time.trim().length > 0) {
      this.setProperty('delivery_time', time.trim());
    }

    return true;
  }

  setStatus(status) {
    const validStatuses = ['active', 'inactive', 'sold-out'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      this.addError('status', `Status must be one of: ${validStatuses.join(', ')}`);
      return false;
    }

    this.setProperty('status', status.toLowerCase());
    return true;
  }

  // ──────────── VALIDATION ─────────────────────────────────────

  validate() {
    this.clearErrors();

    if (!this.getMillId()) {
      this.addError('mill_id', 'Mill ID is required');
    }

    if (!this.getRiceTypeId()) {
      this.addError('rice_type_id', 'Rice type ID is required');
    }

    if (!this.getTitle()) {
      this.addError('title', 'Title is required');
    }

    if (!this.getPricePerKg() || this.getPricePerKg() <= 0) {
      this.addError('price_per_kg', 'Price per kg is required and must be positive');
    }

    if (this.getMinOrderKg() > this.getMaxOrderKg()) {
      this.addError('min_order_kg', 'Minimum order cannot be greater than maximum order');
    }

    return this.isValid();
  }

  // ──────────── HELPER METHODS ─────────────────────────────────

  getSummary() {
    return {
      mill_id: this.getMillId(),
      rice_type_id: this.getRiceTypeId(),
      title: this.getTitle(),
      price_per_kg: this.getPricePerKg(),
      available_kg: this.getAvailableKg(),
      min_order_kg: this.getMinOrderKg(),
      max_order_kg: this.getMaxOrderKg(),
      description: this.getDescription(),
      image_url: this.getImageUrl(),
      delivery_time: this.getDeliveryTime(),
      status: this.getStatus(),
      is_available: this.isAvailable(),
      created_at: this.getCreatedAt()
    };
  }

  // Calculate total price for order
  calculateOrderPrice(kg) {
    const quantity = parseFloat(kg);
    if (isNaN(quantity)) return 0;
    return (quantity * this.getPricePerKg()).toFixed(2);
  }

  // Decrease available stock when order is placed
  decreaseStock(kg) {
    const quantity = parseFloat(kg);
    if (isNaN(quantity) || quantity <= 0) {
      this.addError('available_kg', 'Quantity must be a positive number');
      return false;
    }

    const available = this.getAvailableKg();
    if (available < quantity) {
      this.addError('available_kg', `Insufficient stock. Available: ${available}kg, Requested: ${quantity}kg`);
      return false;
    }

    this.setProperty('available_kg', available - quantity);
    
    // Update status if stock is now zero
    if (this.getAvailableKg() <= 0) {
      this.setProperty('status', 'sold-out');
    }

    return true;
  }

  // Increase available stock
  increaseStock(kg) {
    const quantity = parseFloat(kg);
    if (isNaN(quantity) || quantity <= 0) {
      this.addError('available_kg', 'Quantity must be a positive number');
      return false;
    }

    this.setProperty('available_kg', this.getAvailableKg() + quantity);
    
    // Update status to active if was out of stock
    if (this.getStatus() === 'sold-out') {
      this.setProperty('status', 'active');
    }

    return true;
  }

  // Check if order quantity is valid
  isValidOrderQuantity(kg) {
    const quantity = parseFloat(kg);
    if (isNaN(quantity)) return false;
    return quantity >= this.getMinOrderKg() && 
           quantity <= this.getMaxOrderKg() && 
           quantity <= this.getAvailableKg();
  }
}

module.exports = Rice;
