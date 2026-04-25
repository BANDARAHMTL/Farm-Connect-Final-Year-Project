/**
 * RiceType Model - Represents a type of rice offered by a mill
 * Extends base Model class with validation and rice type-specific methods
 */

const Model = require('../Model');

class RiceType extends Model {
  constructor(data = {}) {
    super(data);
  }

  // ──────────── GETTERS ────────────────────────────────────────
  
  getTypeName() {
    return this.getProperty('type_name');
  }

  getDescription() {
    return this.getProperty('description');
  }

  getMillId() {
    return this.getProperty('mill_id');
  }

  getPrice() {
    return this.getProperty('price') || 0;
  }

  getStock() {
    return this.getProperty('stock') || 0;
  }

  getCreatedAt() {
    return this.getProperty('created_at');
  }

  getCategory() {
    return this.getProperty('category') || 'regular';
  }

  isAvailable() {
    return this.getStock() > 0;
  }

  // ──────────── SETTERS WITH VALIDATION ─────────────────────────

  setTypeName(name) {
    if (!name || name.trim().length < 2) {
      this.addError('type_name', 'Rice type name must be at least 2 characters');
      return false;
    }

    this.setProperty('type_name', name.trim());
    return true;
  }

  setDescription(description) {
    if (description && description.trim().length > 0) {
      if (description.trim().length < 10) {
        this.addError('description', 'Description must be at least 10 characters');
        return false;
      }
      this.setProperty('description', description.trim());
    }

    return true;
  }

  setMillId(millId) {
    const id = parseInt(millId);
    if (isNaN(id) || id <= 0) {
      this.addError('mill_id', 'Invalid mill ID');
      return false;
    }

    this.setProperty('mill_id', id);
    return true;
  }

  setPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num) || num < 0) {
      this.addError('price', 'Price must be a positive number');
      return false;
    }

    this.setProperty('price', num);
    return true;
  }

  setStock(stock) {
    const num = parseInt(stock);
    if (isNaN(num) || num < 0) {
      this.addError('stock', 'Stock must be a non-negative number');
      return false;
    }

    this.setProperty('stock', num);
    return true;
  }

  setCategory(category) {
    const validCategories = ['regular', 'premium', 'basmati', 'parboiled', 'jasmine'];
    if (!category || !validCategories.includes(category.toLowerCase())) {
      this.addError('category', `Category must be one of: ${validCategories.join(', ')}`);
      return false;
    }

    this.setProperty('category', category.toLowerCase());
    return true;
  }

  // ──────────── VALIDATION ─────────────────────────────────────

  validate() {
    this.clearErrors();

    if (!this.getTypeName()) {
      this.addError('type_name', 'Rice type name is required');
    }

    if (!this.getMillId()) {
      this.addError('mill_id', 'Mill ID is required');
    }

    if (!this.getPrice() || this.getPrice() <= 0) {
      this.addError('price', 'Price is required and must be positive');
    }

    return this.isValid();
  }

  // ──────────── HELPER METHODS ─────────────────────────────────

  getSummary() {
    return {
      type_name: this.getTypeName(),
      description: this.getDescription(),
      mill_id: this.getMillId(),
      price: this.getPrice(),
      stock: this.getStock(),
      category: this.getCategory(),
      is_available: this.isAvailable(),
      created_at: this.getCreatedAt()
    };
  }

  // Decrease stock when selling
  decreaseStock(quantity) {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      this.addError('stock', 'Quantity must be a positive number');
      return false;
    }

    const currentStock = this.getStock();
    if (currentStock < qty) {
      this.addError('stock', `Insufficient stock. Available: ${currentStock}, Requested: ${qty}`);
      return false;
    }

    this.setProperty('stock', currentStock - qty);
    return true;
  }

  // Increase stock when restocking
  increaseStock(quantity) {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      this.addError('stock', 'Quantity must be a positive number');
      return false;
    }

    this.setProperty('stock', this.getStock() + qty);
    return true;
  }

  // Check stock status
  getStockStatus() {
    const stock = this.getStock();
    if (stock === 0) return 'OUT_OF_STOCK';
    if (stock < 100) return 'LOW_STOCK';
    if (stock < 500) return 'MEDIUM_STOCK';
    return 'GOOD_STOCK';
  }
}

module.exports = RiceType;
