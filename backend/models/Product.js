/**
 * ═══════════════════════════════════════════════════════════════
 * PRODUCT MODEL
 * ═══════════════════════════════════════════════════════════════
 * 
 * Represents a Product (e.g., Rice) in the marketplace.
 * Handles product data and price management.
 */

const Model = require('../Model');

class Product extends Model {
  /**
   * Constructor - Initialize Product
   * @param {Object} data - Product data object
   */
  constructor(data = {}) {
    super(data);
    this.setDefaults();
  }

  /**
   * Set default values
   */
  setDefaults() {
    if (!this.getProperty('id')) {
      this.setProperty('id', null);
    }
    if (!this.getProperty('createdAt')) {
      this.setProperty('createdAt', new Date());
    }
    if (!this.getProperty('stock')) {
      this.setProperty('stock', 0);
    }
    if (!this.getProperty('rating')) {
      this.setProperty('rating', 0);
    }
    if (!this.getProperty('isAvailable')) {
      this.setProperty('isAvailable', true);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════

  getId() {
    return this.getProperty('id');
  }

  getName() {
    return this.getProperty('name');
  }

  getDescription() {
    return this.getProperty('description');
  }

  getPrice() {
    return this.getProperty('price');
  }

  getCategory() {
    return this.getProperty('category');
  }

  getStock() {
    return this.getProperty('stock');
  }

  getRating() {
    return this.getProperty('rating');
  }

  isAvailable() {
    return this.getProperty('isAvailable');
  }

  getSupplier() {
    return this.getProperty('supplierId');
  }

  // ═══════════════════════════════════════════════════════════
  // SETTERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Set product name
   * @param {String} name - Product name
   * @returns {Boolean} Success status
   */
  setName(name) {
    this.clearErrors();

    if (!name || name.length < 3) {
      this.addError('name', 'Name must be at least 3 characters');
      return false;
    }

    if (name.length > 100) {
      this.addError('name', 'Name must be less than 100 characters');
      return false;
    }

    this.setProperty('name', name.trim());
    return true;
  }

  /**
   * Set product description
   * @param {String} description - Product description
   * @returns {Boolean} Success status
   */
  setDescription(description) {
    this.clearErrors();

    if (description && description.length > 1000) {
      this.addError('description', 'Description must be less than 1000 characters');
      return false;
    }

    this.setProperty('description', description ? description.trim() : '');
    return true;
  }

  /**
   * Set product price
   * @param {Number} price - Product price
   * @returns {Boolean} Success status
   */
  setPrice(price) {
    this.clearErrors();

    if (price === null || price === undefined) {
      this.addError('price', 'Price is required');
      return false;
    }

    const numPrice = parseFloat(price);

    if (isNaN(numPrice) || numPrice < 0) {
      this.addError('price', 'Price must be a positive number');
      return false;
    }

    if (numPrice > 999999) {
      this.addError('price', 'Price is too high');
      return false;
    }

    this.setProperty('price', numPrice);
    return true;
  }

  /**
   * Set product category
   * @param {String} category - Category type
   * @returns {Boolean} Success status
   */
  setCategory(category) {
    this.clearErrors();
    const validCategories = ['rice', 'vegetables', 'fruits', 'grains', 'other'];

    if (!validCategories.includes(category)) {
      this.addError('category', `Category must be one of: ${validCategories.join(', ')}`);
      return false;
    }

    this.setProperty('category', category);
    return true;
  }

  /**
   * Set stock quantity
   * @param {Number} stock - Stock quantity
   * @returns {Boolean} Success status
   */
  setStock(stock) {
    this.clearErrors();

    const numStock = parseInt(stock, 10);

    if (isNaN(numStock) || numStock < 0) {
      this.addError('stock', 'Stock must be a non-negative number');
      return false;
    }

    this.setProperty('stock', numStock);

    // Update availability based on stock
    this.setProperty('isAvailable', numStock > 0);

    return true;
  }

  /**
   * Decrease stock when product is sold
   * @param {Number} quantity - Quantity to decrease
   * @returns {Boolean} Success status
   */
  decreaseStock(quantity) {
    const currentStock = this.getStock();
    const quantityNum = parseInt(quantity, 10);

    if (quantityNum > currentStock) {
      this.addError('stock', 'Not enough stock available');
      return false;
    }

    this.setStock(currentStock - quantityNum);
    return true;
  }

  /**
   * Increase stock
   * @param {Number} quantity - Quantity to increase
   * @returns {Boolean} Success status
   */
  increaseStock(quantity) {
    const currentStock = this.getStock();
    const quantityNum = parseInt(quantity, 10);

    if (quantityNum < 0) {
      this.addError('stock', 'Quantity must be positive');
      return false;
    }

    this.setStock(currentStock + quantityNum);
    return true;
  }

  /**
   * Set product rating
   * @param {Number} rating - Rating (0-5)
   * @returns {Boolean} Success status
   */
  setRating(rating) {
    this.clearErrors();

    const numRating = parseFloat(rating);

    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      this.addError('rating', 'Rating must be between 0 and 5');
      return false;
    }

    this.setProperty('rating', numRating);
    return true;
  }

  // ═══════════════════════════════════════════════════════════
  // VALIDATION
  // ═══════════════════════════════════════════════════════════

  /**
   * Validate product
   * @returns {Boolean} Is valid
   */
  validate() {
    this.clearErrors();

    if (!this.getName()) {
      this.addError('name', 'Product name is required');
    }

    if (this.getPrice() === null || this.getPrice() === undefined) {
      this.addError('price', 'Price is required');
    }

    if (!this.getCategory()) {
      this.addError('category', 'Category is required');
    }

    return this.isValid();
  }

  /**
   * Get product summary
   * @returns {String} Product information
   */
  getSummary() {
    return `
      Product: ${this.getName()}
      Category: ${this.getCategory()}
      Price: Rs. ${this.getPrice()}
      Stock: ${this.getStock()} units
      Available: ${this.isAvailable() ? 'Yes' : 'No'}
      Rating: ${this.getRating()} / 5
    `;
  }
}

module.exports = Product;
