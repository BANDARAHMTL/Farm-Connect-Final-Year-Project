/**
 * RiceMill Model - Represents a rice mill in the system
 * Extends base Model class with validation and rice mill-specific methods
 */

const Model = require('../Model');

class RiceMill extends Model {
  constructor(data = {}) {
    super(data);
  }

  // ──────────── GETTERS ────────────────────────────────────────
  
  getMillName() {
    return this.getProperty('mill_name');
  }

  getLocation() {
    return this.getProperty('location');
  }

  getAddress() {
    return this.getProperty('address');
  }

  getContactNumber() {
    return this.getProperty('contact_number');
  }

  getEmail() {
    return this.getProperty('email');
  }

  getDescription() {
    return this.getProperty('description');
  }

  getImageUrl() {
    return this.getProperty('image_url');
  }

  getRating() {
    return this.getProperty('rating') || 0;
  }

  getStatus() {
    return this.getProperty('status') || 'active';
  }

  getCreatedAt() {
    return this.getProperty('created_at');
  }

  isActive() {
    return this.getStatus().toLowerCase() === 'active';
  }

  // ──────────── SETTERS WITH VALIDATION ─────────────────────────

  setMillName(name) {
    if (!name || name.trim().length < 3) {
      this.addError('mill_name', 'Mill name must be at least 3 characters');
      return false;
    }

    this.setProperty('mill_name', name.trim());
    return true;
  }

  setLocation(location) {
    if (!location || location.trim().length < 3) {
      this.addError('location', 'Location must be at least 3 characters');
      return false;
    }

    this.setProperty('location', location.trim());
    return true;
  }

  setAddress(address) {
    if (!address || address.trim().length < 5) {
      this.addError('address', 'Address must be at least 5 characters');
      return false;
    }

    this.setProperty('address', address.trim());
    return true;
  }

  setContactNumber(number) {
    if (!number || !/^\d{10,15}$/.test(number.replace(/\D/g, ''))) {
      this.addError('contact_number', 'Please provide a valid phone number');
      return false;
    }

    this.setProperty('contact_number', number);
    return true;
  }

  setEmail(email) {
    if (!email) {
      this.addError('email', 'Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.addError('email', 'Please provide a valid email address');
      return false;
    }

    this.setProperty('email', email.toLowerCase());
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

  setImageUrl(url) {
    if (url && url.trim().length > 0) {
      this.setProperty('image_url', url.trim());
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

  setStatus(status) {
    const validStatuses = ['active', 'inactive', 'suspended'];
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

    if (!this.getMillName()) {
      this.addError('mill_name', 'Mill name is required');
    }

    if (!this.getLocation()) {
      this.addError('location', 'Location is required');
    }

    if (!this.getAddress()) {
      this.addError('address', 'Address is required');
    }

    if (!this.getContactNumber()) {
      this.addError('contact_number', 'Contact number is required');
    }

    if (!this.getEmail()) {
      this.addError('email', 'Email is required');
    }

    return this.isValid();
  }

  // ──────────── HELPER METHODS ─────────────────────────────────

  getSummary() {
    return {
      mill_name: this.getMillName(),
      location: this.getLocation(),
      address: this.getAddress(),
      contact_number: this.getContactNumber(),
      email: this.getEmail(),
      description: this.getDescription(),
      rating: this.getRating(),
      status: this.getStatus(),
      image_url: this.getImageUrl(),
      created_at: this.getCreatedAt()
    };
  }

  // Activate mill
  activate() {
    this.setProperty('status', 'active');
    return true;
  }

  // Deactivate mill
  deactivate() {
    this.setProperty('status', 'inactive');
    return true;
  }

  // Suspend mill (for violations)
  suspend() {
    this.setProperty('status', 'suspended');
    return true;
  }

  // Update rating
  updateRating(newRating) {
    return this.setRating(newRating);
  }
}

module.exports = RiceMill;
