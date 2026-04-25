/**
 * ═══════════════════════════════════════════════════════════════
 * BASE CONTROLLER CLASS
 * ═══════════════════════════════════════════════════════════════
 * 
 * This is the parent class for all controllers.
 * It provides common CRUD operations and response formatting.
 * 
 * RESPONSIBILITIES:
 * - Handle HTTP requests and responses
 * - Manage business logic
 * - Format API responses
 * - Handle errors consistently
 * 
 * OOP CONCEPTS:
 * - Abstraction: Common CRUD logic in base class
 * - Encapsulation: Private helper methods
 * - Inheritance: Child controllers extend this class
 */

class Controller {
  /**
   * Constructor - Initialize controller with model
   * @param {Model} Model - The model class to work with
   */
  constructor(Model) {
    this.Model = Model;
    this.data = []; // In-memory storage (in production, use database)
  }

  // ═══════════════════════════════════════════════════════════
  // PRIVATE HELPER METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * Find item by ID
   * @param {Number} id - Item ID
   * @returns {Object|null} Found item or null
   */
  #findById(id) {
    return this.data.find(item => item.id === id);
  }

  /**
   * Generate unique ID
   * @returns {Number} New unique ID
   */
  #generateId() {
    return this.data.length > 0 ? Math.max(...this.data.map(item => item.id)) + 1 : 1;
  }

  /**
   * Format success response
   * @param {Any} data - Response data
   * @param {String} message - Success message
   * @param {Number} statusCode - HTTP status code
   * @returns {Object} Formatted response
   */
  #formatSuccess(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format error response
   * @param {String} message - Error message
   * @param {Any} errors - Error details
   * @param {Number} statusCode - HTTP status code
   * @returns {Object} Formatted response
   */
  #formatError(message = 'Error', errors = null, statusCode = 400) {
    return {
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString()
    };
  }

  // ═══════════════════════════════════════════════════════════
  // PUBLIC CRUD METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * CREATE - Add new item
   * @param {Object} data - Item data
   * @returns {Object} Response object
   */
  create(data) {
    try {
      // Create instance of model
      const instance = new this.Model(data);

      // Validate data
      if (!instance.validate()) {
        return this.#formatError(
          'Validation failed',
          instance.getErrors(),
          400
        );
      }

      // Set ID and add to storage
      instance.setProperty('id', this.#generateId());
      const itemData = instance.toJSON();
      this.data.push(itemData);

      return this.#formatSuccess(
        itemData,
        'Item created successfully',
        201
      );
    } catch (error) {
      return this.#formatError(
        'Error creating item',
        error.message,
        500
      );
    }
  }

  /**
   * READ - Get all items
   * @returns {Object} Response object
   */
  getAll() {
    try {
      if (this.data.length === 0) {
        return this.#formatSuccess(
          [],
          'No items found',
          200
        );
      }

      return this.#formatSuccess(
        this.data,
        `Retrieved ${this.data.length} items`,
        200
      );
    } catch (error) {
      return this.#formatError(
        'Error retrieving items',
        error.message,
        500
      );
    }
  }

  /**
   * READ - Get single item by ID
   * @param {Number} id - Item ID
   * @returns {Object} Response object
   */
  getById(id) {
    try {
      const item = this.#findById(parseInt(id, 10));

      if (!item) {
        return this.#formatError(
          `Item with ID ${id} not found`,
          null,
          404
        );
      }

      return this.#formatSuccess(
        item,
        'Item retrieved successfully',
        200
      );
    } catch (error) {
      return this.#formatError(
        'Error retrieving item',
        error.message,
        500
      );
    }
  }

  /**
   * UPDATE - Update item by ID
   * @param {Number} id - Item ID
   * @param {Object} data - Updated data
   * @returns {Object} Response object
   */
  update(id, data) {
    try {
      const index = this.data.findIndex(item => item.id === parseInt(id, 10));

      if (index === -1) {
        return this.#formatError(
          `Item with ID ${id} not found`,
          null,
          404
        );
      }

      // Create instance with merged data
      const mergedData = { ...this.data[index], ...data };
      const instance = new this.Model(mergedData);

      // Validate updated data
      if (!instance.validate()) {
        return this.#formatError(
          'Validation failed',
          instance.getErrors(),
          400
        );
      }

      // Update in storage
      const updatedData = instance.toJSON();
      this.data[index] = updatedData;

      return this.#formatSuccess(
        updatedData,
        'Item updated successfully',
        200
      );
    } catch (error) {
      return this.#formatError(
        'Error updating item',
        error.message,
        500
      );
    }
  }

  /**
   * DELETE - Remove item by ID
   * @param {Number} id - Item ID
   * @returns {Object} Response object
   */
  delete(id) {
    try {
      const index = this.data.findIndex(item => item.id === parseInt(id, 10));

      if (index === -1) {
        return this.#formatError(
          `Item with ID ${id} not found`,
          null,
          404
        );
      }

      const deletedItem = this.data.splice(index, 1)[0];

      return this.#formatSuccess(
        deletedItem,
        'Item deleted successfully',
        200
      );
    } catch (error) {
      return this.#formatError(
        'Error deleting item',
        error.message,
        500
      );
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PUBLIC UTILITY METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * Get total count of items
   * @returns {Number} Total count
   */
  getCount() {
    return this.data.length;
  }

  /**
   * Check if item exists
   * @param {Number} id - Item ID
   * @returns {Boolean} Exists or not
   */
  exists(id) {
    return this.#findById(parseInt(id, 10)) !== undefined;
  }

  /**
   * Clear all data (for testing/resetting)
   */
  clearAll() {
    this.data = [];
  }

  /**
   * Get data summary
   * @returns {String} Summary information
   */
  getSummary() {
    return `
      Controller for: ${this.Model.name}
      Total items: ${this.getCount()}
      Storage type: In-memory
    `;
  }
}

module.exports = Controller;
