/**/**


































































































































































































































































































module.exports = Marketplace;}  }    return this.setRating(newRating);  updateRating(newRating) {  // Update seller rating  }    return this.getQuantity() > 0 && this.isActive();  isInStock() {  // Check if in stock  }    return true;    }      this.setProperty('status', 'active');    if (this.getStatus() === 'sold' && this.getQuantity() > 0) {    // Update status to active if was sold        this.setProperty('quantity', this.getQuantity() + qty);    }      return false;      this.addError('quantity', 'Quantity must be a positive number');    if (isNaN(qty) || qty <= 0) {    const qty = parseInt(quantity);  addStock(quantity) {  // Add more stock  }    return true;    }      this.setProperty('status', 'sold');    if (this.getQuantity() === 0) {    // Update status if sold out        this.setProperty('quantity', current - qty);    }      return false;      this.addError('quantity', `Insufficient quantity. Available: ${current}, Requested: ${qty}`);    if (current < qty) {    const current = this.getQuantity();    }      return false;      this.addError('quantity', 'Quantity must be a positive number');    if (isNaN(qty) || qty <= 0) {    const qty = parseInt(quantity);  sellUnits(quantity) {  // Sell units  }    return (this.getPrice() * this.getQuantity()).toFixed(2);  getTotalValue() {  // Calculate total value  }    };      created_at: this.getCreatedAt()      is_active: this.isActive(),      rating: this.getRating(),      location: this.getLocation(),      status: this.getStatus(),      image_url: this.getImageUrl(),      seller_name: this.getSellerName(),      seller_id: this.getSellerId(),      quantity: this.getQuantity(),      price: this.getPrice(),      category: this.getCategory(),      description: this.getDescription(),      title: this.getTitle(),    return {  getSummary() {  // ──────────── HELPER METHODS ─────────────────────────────────  }    return this.isValid();    }      this.addError('price', 'Price cannot be negative');    if (this.getPrice() < 0) {    }      this.addError('seller_id', 'Seller ID is required');    if (!this.getSellerId()) {    }      this.addError('category', 'Category is required');    if (!this.getCategory()) {    }      this.addError('description', 'Description is required');    if (!this.getDescription()) {    }      this.addError('title', 'Title is required');    if (!this.getTitle()) {    this.clearErrors();  validate() {  // ──────────── VALIDATION ─────────────────────────────────────  }    return true;    this.setProperty('rating', num);    }      return false;      this.addError('rating', 'Rating must be between 0 and 5');    if (isNaN(num) || num < 0 || num > 5) {    const num = parseFloat(rating);  setRating(rating) {  }    return true;    }      this.setProperty('location', location.trim());    if (location && location.trim().length > 0) {  setLocation(location) {  }    return true;    this.setProperty('status', status.toLowerCase());    }      return false;      this.addError('status', `Status must be one of: ${validStatuses.join(', ')}`);    if (!status || !validStatuses.includes(status.toLowerCase())) {    const validStatuses = ['active', 'sold', 'pending', 'inactive'];  setStatus(status) {  }    return true;    }      this.setProperty('image_url', url.trim());    if (url && url.trim().length > 0) {  setImageUrl(url) {  }    return true;    }      this.setProperty('seller_name', name.trim());    if (name && name.trim().length > 0) {  setSellerName(name) {  }    return true;    this.setProperty('seller_id', id);    }      return false;      this.addError('seller_id', 'Invalid seller ID');    if (isNaN(id) || id <= 0) {    const id = parseInt(sellerId);  setSellerId(sellerId) {  }    return true;    this.setProperty('quantity', num);    }      return false;      this.addError('quantity', 'Quantity must be a non-negative number');    if (isNaN(num) || num < 0) {    const num = parseInt(quantity);  setQuantity(quantity) {  }    return true;    this.setProperty('price', num);    }      return false;      this.addError('price', 'Price must be a non-negative number');    if (isNaN(num) || num < 0) {    const num = parseFloat(price);  setPrice(price) {  }    return true;    this.setProperty('category', category.toLowerCase());    }      return false;      this.addError('category', `Category must be one of: ${validCategories.join(', ')}`);    if (!category || !validCategories.includes(category.toLowerCase())) {    const validCategories = ['general', 'seeds', 'tools', 'equipment', 'organic', 'dairy', 'vegetables', 'fruits', 'grains'];  setCategory(category) {  }    return true;    this.setProperty('description', description.trim());    }      return false;      this.addError('description', 'Description must be at least 10 characters');    if (!description || description.trim().length < 10) {  setDescription(description) {  }    return true;    this.setProperty('title', title.trim());    }      return false;      this.addError('title', 'Title cannot exceed 200 characters');    if (title.trim().length > 200) {    }      return false;      this.addError('title', 'Title must be at least 3 characters');    if (!title || title.trim().length < 3) {  setTitle(title) {  // ──────────── SETTERS WITH VALIDATION ─────────────────────────  }    return this.getStatus().toLowerCase() === 'active';  isActive() {  }    return this.getProperty('rating') || 0;  getRating() {  }    return this.getProperty('created_at');  getCreatedAt() {  }    return this.getProperty('location');  getLocation() {  }    return this.getProperty('status') || 'active';  getStatus() {  }    return this.getProperty('image_url');  getImageUrl() {  }    return this.getProperty('seller_name');  getSellerName() {  }    return this.getProperty('seller_id');  getSellerId() {  }    return this.getProperty('quantity') || 0;  getQuantity() {  }    return this.getProperty('price') || 0;  getPrice() {  }    return this.getProperty('category') || 'general';  getCategory() {  }    return this.getProperty('description');  getDescription() {  }    return this.getProperty('title');  getTitle() {    // ──────────── GETTERS ────────────────────────────────────────  }    super(data);  constructor(data = {}) {class Marketplace extends Model {const Model = require('../Model'); */ * Extends base Model class with validation and marketplace-specific methods * Marketplace Model - Represents a general marketplace listing * Marketplace Model - Represents a marketplace item/listing
 * Extends base Model class with general marketplace functionality
 */

const Model = require('../Model');

class Marketplace extends Model {
  constructor(data = {}) {
    super(data);
  }

  // ──────────── GETTERS ────────────────────────────────────────
  
  getTitle() {
    return this.getProperty('title');
  }

  getDescription() {
    return this.getProperty('description');
  }

  getCategory() {
    return this.getProperty('category');
  }

  getPrice() {
    return this.getProperty('price') || 0;
  }

  getSellerId() {
    return this.getProperty('seller_id');
  }

  getSellerName() {
    return this.getProperty('seller_name');
  }

  getStatus() {
    return this.getProperty('status') || 'active';
  }

  getImageUrl() {
    return this.getProperty('image_url');
  }

  getLocation() {
    return this.getProperty('location');
  }

  getRating() {
    return this.getProperty('rating') || 0;
  }

  getReviews() {
    return this.getProperty('reviews') || 0;
  }

  getCreatedAt() {
    return this.getProperty('created_at');
  }

  isActive() {
    return this.getStatus().toLowerCase() === 'active';
  }

  // ──────────── SETTERS WITH VALIDATION ─────────────────────────

  setTitle(title) {
    if (!title || title.trim().length < 3) {
      this.addError('title', 'Title must be at least 3 characters');
      return false;
    }

    this.setProperty('title', title.trim());
    return true;
  }

  setDescription(description) {
    if (!description || description.trim().length < 10) {
      this.addError('description', 'Description must be at least 10 characters');
      return false;
    }

    this.setProperty('description', description.trim());
    return true;
  }

  setCategory(category) {
    if (!category || category.trim().length === 0) {
      this.addError('category', 'Category is required');
      return false;
    }

    this.setProperty('category', category.trim().toLowerCase());
    return true;
  }

  setPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num) || num < 0) {
      this.addError('price', 'Price must be a non-negative number');
      return false;
    }

    if (num === 0) {
      this.addError('price', 'Price cannot be zero');
      return false;
    }

    this.setProperty('price', num);
    return true;
  }

  setSellerId(sellerId) {
    const id = parseInt(sellerId);
    if (isNaN(id) || id <= 0) {
      this.addError('seller_id', 'Invalid seller ID');
      return false;
    }

    this.setProperty('seller_id', id);
    return true;
  }

  setSellerName(name) {
    if (!name || name.trim().length < 2) {
      this.addError('seller_name', 'Seller name must be at least 2 characters');
      return false;
    }

    this.setProperty('seller_name', name.trim());
    return true;
  }

  setStatus(status) {
    const validStatuses = ['active', 'inactive', 'sold', 'pending'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      this.addError('status', `Status must be one of: ${validStatuses.join(', ')}`);
      return false;
    }

    this.setProperty('status', status.toLowerCase());
    return true;
  }

  setImageUrl(url) {
    if (url && url.trim().length > 0) {
      this.setProperty('image_url', url.trim());
    }

    return true;
  }

  setLocation(location) {
    if (location && location.trim().length > 0) {
      this.setProperty('location', location.trim());
    }

    return true;
  }

  setRating(rating) {
    const num = parseFloat(rating);
    if (isNaN(num) || num < 0 || num > 5) {
      this.addError('rating', 'Rating must be between 0 and 5');
      return false;
    }

    this.setProperty('rating', num);
    return true;
  }

  setReviews(reviews) {
    const num = parseInt(reviews);
    if (isNaN(num) || num < 0) {
      this.addError('reviews', 'Reviews count must be non-negative');
      return false;
    }

    this.setProperty('reviews', num);
    return true;
  }

  // ──────────── VALIDATION ─────────────────────────────────────

  validate() {
    this.clearErrors();

    if (!this.getTitle()) {
      this.addError('title', 'Title is required');
    }

    if (!this.getDescription()) {
      this.addError('description', 'Description is required');
    }

    if (!this.getCategory()) {
      this.addError('category', 'Category is required');
    }

    if (!this.getPrice() || this.getPrice() <= 0) {
      this.addError('price', 'Price is required and must be positive');
    }

    if (!this.getSellerId()) {
      this.addError('seller_id', 'Seller ID is required');
    }

    return this.isValid();
  }

  // ──────────── HELPER METHODS ─────────────────────────────────

  getSummary() {
    return {
      title: this.getTitle(),
      description: this.getDescription(),
      category: this.getCategory(),
      price: this.getPrice(),
      seller_id: this.getSellerId(),
      seller_name: this.getSellerName(),
      status: this.getStatus(),
      image_url: this.getImageUrl(),
      location: this.getLocation(),
      rating: this.getRating(),
      reviews: this.getReviews(),
      is_active: this.isActive(),
      created_at: this.getCreatedAt()
    };
  }

  // Mark as sold
  markSold() {
    this.setProperty('status', 'sold');
    return true;
  }

  // Mark as pending approval
  markPending() {
    this.setProperty('status', 'pending');
    return true;
  }

  // Activate item
  activate() {
    this.setProperty('status', 'active');
    return true;
  }

  // Deactivate item
  deactivate() {
    this.setProperty('status', 'inactive');
    return true;
  }

  // Add review/rating
  addReview(rating, count = 1) {
    const currentRating = this.getRating();
    const currentReviews = this.getReviews();
    
    // Calculate weighted average
    const newRating = ((currentRating * currentReviews) + rating) / (currentReviews + count);
    
    this.setProperty('rating', parseFloat(newRating.toFixed(2)));
    this.setProperty('reviews', currentReviews + count);
    
    return true;
  }

  // Get seller profile
  getSellerInfo() {
    return {
      seller_id: this.getSellerId(),
      seller_name: this.getSellerName(),
      rating: this.getRating(),
      reviews: this.getReviews(),
      location: this.getLocation()
    };
  }
}

module.exports = Marketplace;
