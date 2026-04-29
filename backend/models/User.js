
/**
 * ═══════════════════════════════════════════════════════════════
 * USER MODEL
 * ═══════════════════════════════════════════════════════════════
 * 
 * Represents a User in the system.
 * Handles user-specific data and validation.
 * 
 * OOP CONCEPTS DEMONSTRATED:
 * - Inheritance: Extends the base Model class
 * - Encapsulation: Private properties and controlled getters/setters
 * - Abstraction: Complex validation hidden in methods
 */

import Model from './Model.js';

class User extends Model {
  /**
   * Constructor - Initialize User with data
   * @param {Object} data - User data object
   */
  constructor(data = {}) {
    super(data);

    // Set default values if not provided
    this.setDefaults();
  }

  // ═══════════════════════════════════════════════════════════
  // PRIVATE METHOD
  // ═══════════════════════════════════════════════════════════

  /**
   * Set default values for new users
   */
  setDefaults() {
    if (!this.getProperty('id')) {
      this.setProperty('id', null); // Will be set by database
    }
    if (!this.getProperty('createdAt')) {
      this.setProperty('createdAt', new Date());
    }
    if (!this.getProperty('role')) {
      this.setProperty('role', 'farmer'); // Default role
    }
    if (!this.getProperty('isActive')) {
      this.setProperty('isActive', true);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // GETTERS - Read-only access to properties
  // ═══════════════════════════════════════════════════════════

  /**
   * Get user ID
   * @returns {Number} User ID
   */
  getId() {
    return this.getProperty('id');
  }

  /**
   * Get user name
   * @returns {String} User full name
   */
  getName() {
    return this.getProperty('name');
  }

  /**
   * Get user email
   * @returns {String} Email address
   */
  getEmail() {
    return this.getProperty('email');
  }

  /**
   * Get user phone
   * @returns {String} Phone number
   */
  getPhone() {
    return this.getProperty('phone');
  }

  /**
   * Get user role
   * @returns {String} User role (admin, farmer, etc.)
   */
  getRole() {
    return this.getProperty('role');
  }

  /**
   * Get user location
   * @returns {String} Location/address
   */
  getLocation() {
    return this.getProperty('location');
  }

  /**
   * Get active status
   * @returns {Boolean} Is active
   */
  isActive() {
    return this.getProperty('isActive');
  }

  // ═══════════════════════════════════════════════════════════
  // SETTERS - Set and validate properties
  // ═══════════════════════════════════════════════════════════

  /**
   * Set user name with validation
   * @param {String} name - User's full name
   * @returns {Boolean} Success status
   */
  setName(name) {
    this.clearErrors();

    // Validation
    if (!name || typeof name !== 'string') {
      this.addError('name', 'Name must be a non-empty string');
      return false;
    }

    if (name.length < 2) {
      this.addError('name', 'Name must be at least 2 characters');
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
   * Set user email with validation
   * @param {String} email - Email address
   * @returns {Boolean} Success status
   */
  setEmail(email) {
    this.clearErrors();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      this.addError('email', 'Please provide a valid email address');
      return false;
    }

    this.setProperty('email', email.toLowerCase());
    return true;
  }

  /**
   * Set user phone with validation
   * @param {String} phone - Phone number
   * @returns {Boolean} Success status
   */
  setPhone(phone) {
    this.clearErrors();

    // Simple phone validation (10-15 digits)
    const phoneRegex = /^\d{10,15}$/;

    if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
      this.addError('phone', 'Please provide a valid phone number');
      return false;
    }

    this.setProperty('phone', phone);
    return true;
  }

  /**
   * Set user role with validation
   * @param {String} role - User role
   * @returns {Boolean} Success status
   */
  setRole(role) {
    this.clearErrors();
    const validRoles = ['admin', 'farmer', 'buyer', 'mill-operator'];

    if (!validRoles.includes(role)) {
      this.addError('role', `Role must be one of: ${validRoles.join(', ')}`);
      return false;
    }

    this.setProperty('role', role);
    return true;
  }

  /**
   * Set user location
   * @param {String} location - Address/location
   * @returns {Boolean} Success status
   */
  setLocation(location) {
    this.clearErrors();

    if (!location || typeof location !== 'string') {
      this.addError('location', 'Location must be a non-empty string');
      return false;
    }

    this.setProperty('location', location.trim());
    return true;
  }

  /**
   * Set active status
   * @param {Boolean} isActive - Active status
   */
  setActive(isActive) {
    this.setProperty('isActive', isActive === true);
  }

  // ═══════════════════════════════════════════════════════════
  // VALIDATION METHOD
  // ═══════════════════════════════════════════════════════════

  /**
   * Validate entire user object
   * @returns {Boolean} Is valid
   */
  validate() {
    this.clearErrors();

    // Check required fields
    if (!this.getName()) {
      this.addError('name', 'Name is required');
    }

    if (!this.getEmail()) {
      this.addError('email', 'Email is required');
    }

    if (!this.getPhone()) {
      this.addError('phone', 'Phone is required');
    }

    if (!this.getLocation()) {
      this.addError('location', 'Location is required');
    }

    return this.isValid();
  }

  /**
   * Get user summary
   * @returns {String} User information summary
   */
  getSummary() {
    return `
      User: ${this.getName()}
      Email: ${this.getEmail()}
      Phone: ${this.getPhone()}
      Role: ${this.getRole()}
      Location: ${this.getLocation()}
      Active: ${this.isActive() ? 'Yes' : 'No'}
    `;
  }
}

export default User;
