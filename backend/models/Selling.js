/**
 * Selling Model - Represents a selling transaction in the system
 * Extends base Model class with validation and selling-specific methods
 */

const Model = require('../Model');

class Selling extends Model {
  constructor(data = {}) {
    super(data);
  }

  // ──────────── GETTERS ────────────────────────────────────────
  
  getSellerId() {
    return this.getProperty('seller_id');
  }

  getBuyerId() {
    return this.getProperty('buyer_id');
  }

  getProductId() {
    return this.getProperty('product_id');
  }

  getProductName() {
    return this.getProperty('product_name');
  }

  getQuantity() {
    return this.getProperty('quantity') || 0;
  }

  getPricePerUnit() {
    return this.getProperty('price_per_unit') || 0;
  }

  getTotalAmount() {
    return this.getQuantity() * this.getPricePerUnit();
  }

  getStatus() {
    return this.getProperty('status') || 'pending';
  }

  getPaymentStatus() {
    return this.getProperty('payment_status') || 'unpaid';
  }

  getDeliveryDate() {
    return this.getProperty('delivery_date');
  }

  getDeliveryLocation() {
    return this.getProperty('delivery_location');
  }

  getDescription() {
    return this.getProperty('description');
  }

  getCreatedAt() {
    return this.getProperty('created_at');
  }

  getUpdatedAt() {
    return this.getProperty('updated_at');
  }

  isPending() {
    return this.getStatus().toLowerCase() === 'pending';
  }

  isConfirmed() {
    return this.getStatus().toLowerCase() === 'confirmed';
  }

  isCompleted() {
    return this.getStatus().toLowerCase() === 'completed';
  }

  isCancelled() {
    return this.getStatus().toLowerCase() === 'cancelled';
  }

  // ──────────── SETTERS WITH VALIDATION ─────────────────────────

  setSellerId(sellerId) {
    const id = parseInt(sellerId);
    if (isNaN(id) || id <= 0) {
      this.addError('seller_id', 'Invalid seller ID');
      return false;
    }

    this.setProperty('seller_id', id);
    return true;
  }

  setBuyerId(buyerId) {
    const id = parseInt(buyerId);
    if (isNaN(id) || id <= 0) {
      this.addError('buyer_id', 'Invalid buyer ID');
      return false;
    }

    this.setProperty('buyer_id', id);
    return true;
  }

  setProductId(productId) {
    const id = parseInt(productId);
    if (isNaN(id) || id <= 0) {
      this.addError('product_id', 'Invalid product ID');
      return false;
    }

    this.setProperty('product_id', id);
    return true;
  }

  setProductName(name) {
    if (!name || name.trim().length < 2) {
      this.addError('product_name', 'Product name must be at least 2 characters');
      return false;
    }

    this.setProperty('product_name', name.trim());
    return true;
  }

  setQuantity(quantity) {
    const num = parseFloat(quantity);
    if (isNaN(num) || num <= 0) {
      this.addError('quantity', 'Quantity must be a positive number');
      return false;
    }

    this.setProperty('quantity', num);
    return true;
  }

  setPricePerUnit(price) {
    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) {
      this.addError('price_per_unit', 'Price must be a positive number');
      return false;
    }

    this.setProperty('price_per_unit', num);
    return true;
  }

  setStatus(status) {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      this.addError('status', `Status must be one of: ${validStatuses.join(', ')}`);
      return false;
    }

    this.setProperty('status', status.toLowerCase());
    return true;
  }

  setPaymentStatus(status) {
    const validStatuses = ['unpaid', 'partial', 'paid', 'refunded'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      this.addError('payment_status', `Payment status must be one of: ${validStatuses.join(', ')}`);
      return false;
    }

    this.setProperty('payment_status', status.toLowerCase());
    return true;
  }

  setDeliveryDate(date) {
    if (!date) {
      this.addError('delivery_date', 'Delivery date is required');
      return false;
    }

    const deliveryDate = new Date(date);
    if (isNaN(deliveryDate.getTime())) {
      this.addError('delivery_date', 'Invalid delivery date format');
      return false;
    }

    this.setProperty('delivery_date', deliveryDate.toISOString());
    return true;
  }

  setDeliveryLocation(location) {
    if (!location || location.trim().length < 3) {
      this.addError('delivery_location', 'Delivery location must be at least 3 characters');
      return false;
    }

    this.setProperty('delivery_location', location.trim());
    return true;
  }

  setDescription(description) {
    if (description && description.trim().length > 0) {
      this.setProperty('description', description.trim());
    }

    return true;
  }

  // ──────────── VALIDATION ─────────────────────────────────────

  validate() {
    this.clearErrors();

    if (!this.getSellerId()) {
      this.addError('seller_id', 'Seller ID is required');
    }

    if (!this.getBuyerId()) {
      this.addError('buyer_id', 'Buyer ID is required');
    }

    if (!this.getProductId()) {
      this.addError('product_id', 'Product ID is required');
    }

    if (!this.getProductName()) {
      this.addError('product_name', 'Product name is required');
    }

    if (!this.getQuantity() || this.getQuantity() <= 0) {
      this.addError('quantity', 'Quantity is required and must be positive');
    }

    if (!this.getPricePerUnit() || this.getPricePerUnit() <= 0) {
      this.addError('price_per_unit', 'Price per unit is required and must be positive');
    }

    if (!this.getDeliveryLocation()) {
      this.addError('delivery_location', 'Delivery location is required');
    }

    return this.isValid();
  }

  // ──────────── HELPER METHODS ─────────────────────────────────

  getSummary() {
    return {
      seller_id: this.getSellerId(),
      buyer_id: this.getBuyerId(),
      product_id: this.getProductId(),
      product_name: this.getProductName(),
      quantity: this.getQuantity(),
      price_per_unit: this.getPricePerUnit(),
      total_amount: this.getTotalAmount(),
      status: this.getStatus(),
      payment_status: this.getPaymentStatus(),
      delivery_date: this.getDeliveryDate(),
      delivery_location: this.getDeliveryLocation(),
      description: this.getDescription(),
      created_at: this.getCreatedAt()
    };
  }

  // Confirm the order
  confirm() {
    if (!this.isPending()) {
      this.addError('status', 'Order must be pending to confirm');
      return false;
    }

    this.setProperty('status', 'confirmed');
    return true;
  }

  // Complete the order
  complete() {
    if (!this.isConfirmed()) {
      this.addError('status', 'Order must be confirmed to complete');
      return false;
    }

    this.setProperty('status', 'completed');
    return true;
  }

  // Cancel the order
  cancel() {
    if (this.isCompleted()) {
      this.addError('status', 'Cannot cancel a completed order');
      return false;
    }

    this.setProperty('status', 'cancelled');
    return true;
  }

  // Mark as paid
  markAsPaid() {
    this.setProperty('payment_status', 'paid');
    return true;
  }

  // Mark as partial paid
  markAsPartialPaid() {
    this.setProperty('payment_status', 'partial');
    return true;
  }

  // Refund
  refund() {
    this.setProperty('payment_status', 'refunded');
    return true;
  }

  // Get delivery days remaining
  getDaysUntilDelivery() {
    const deliveryDate = new Date(this.getDeliveryDate());
    const today = new Date();
    const diffTime = deliveryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Check if order is overdue
  isOverdue() {
    return this.getDaysUntilDelivery() < 0 && this.isPending();
  }

  // Get transaction ID (useful for reference)
  getTransactionId() {
    const id = this.getProperty('id');
    const sellerId = this.getSellerId();
    return `TXN-${sellerId}-${id}`;
  }
}

module.exports = Selling;
