/**
 * ═══════════════════════════════════════════════════════════════
 * BASE MODEL CLASS
 * ═══════════════════════════════════════════════════════════════
 * 
 * This is the parent class for all models.
 * It provides common functionality like validation and data management.
 * 
 * OOP CONCEPTS USED:
 * - Encapsulation: Private properties (#) and controlled access
 * - Abstraction: Complex logic hidden in methods
 * - Inheritance: Child classes extend this base class
 */

class Model {
  /**
   * Constructor - Initialize model with data
   * @param {Object} data - Initial data for the model
   */
  constructor(data = {}) {
    // Private properties (cannot be accessed directly from outside)
    this.#data = {};
    this.#errors = [];
    this.#isValid = true;

    // Set initial data
    if (data && typeof data === 'object') {
      this.setData(data);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PRIVATE PROPERTIES (# prefix) - Cannot be accessed from outside
  // ═══════════════════════════════════════════════════════════
  #data;
  #errors;
  #isValid;

  // ═══════════════════════════════════════════════════════════
  // PROTECTED METHODS - For child classes to use
  // ═══════════════════════════════════════════════════════════

  /**
   * Set property value with validation
   * @param {String} key - Property name
   * @param {Any} value - Property value
   */
  setProperty(key, value) {
    this.#data[key] = value;
  }

  /**
   * Get property value
   * @param {String} key - Property name
   * @returns {Any} Property value
   */
  getProperty(key) {
    return this.#data[key];
  }

  /**
   * Set all data at once
   * @param {Object} data - Object with properties
   */
  setData(data) {
    if (data && typeof data === 'object') {
      this.#data = { ...this.#data, ...data };
    }
  }

  /**
   * Get all data as object
   * @returns {Object} All properties
   */
  getData() {
    return { ...this.#data }; // Return copy to prevent direct modification
  }

  /**
   * Add validation error
   * @param {String} field - Field name
   * @param {String} message - Error message
   */
  addError(field, message) {
    this.#errors.push({ field, message });
    this.#isValid = false;
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.#errors = [];
    this.#isValid = true;
  }

  /**
   * Get all errors
   * @returns {Array} Array of error objects
   */
  getErrors() {
    return this.#errors;
  }

  /**
   * Check if model is valid
   * @returns {Boolean} Is valid status
   */
  isValid() {
    return this.#isValid;
  }

  /**
   * Convert model to JSON
   * @returns {Object} Model data as object
   */
  toJSON() {
    return this.getData();
  }

  /**
   * Convert model to string
   * @returns {String} String representation
   */
  toString() {
    return JSON.stringify(this.getData(), null, 2);
  }
}

// Export the base Model class
module.exports = Model;
