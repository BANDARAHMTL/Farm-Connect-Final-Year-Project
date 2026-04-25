/**
 * ═══════════════════════════════════════════════════════════════
 * BOOKING MODEL
 * ═══════════════════════════════════════════════════════════════
 * 
 * Represents a Booking (e.g., Equipment rental).
 * Handles booking status and date management.
 */

const Model = require('../Model');

class Booking extends Model {
  /**
   * Constructor - Initialize Booking
   * @param {Object} data - Booking data object
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
    if (!this.getProperty('status')) {
      this.setProperty('status', 'pending'); // pending, confirmed, completed, cancelled
    }
    if (!this.getProperty('createdAt')) {
      this.setProperty('createdAt', new Date());
    }
    if (!this.getProperty('totalPrice')) {
      this.setProperty('totalPrice', 0);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════

  getId() {
    return this.getProperty('id');
  }

  getUserId() {
    return this.getProperty('userId');
  }

  getVehicleId() {
    return this.getProperty('vehicleId');
  }

  getStartDate() {
    return this.getProperty('startDate');
  }

  getEndDate() {
    return this.getProperty('endDate');
  }

  getStatus() {
    return this.getProperty('status');
  }

  getTotalPrice() {
    return this.getProperty('totalPrice');
  }

  getPickupLocation() {
    return this.getProperty('pickupLocation');
  }

  getDropoffLocation() {
    return this.getProperty('dropoffLocation');
  }

  // ═══════════════════════════════════════════════════════════
  // SETTERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Set booking user ID
   * @param {Number} userId - User ID
   * @returns {Boolean} Success status
   */
  setUserId(userId) {
    this.clearErrors();

    if (!userId || userId <= 0) {
      this.addError('userId', 'Valid user ID is required');
      return false;
    }

    this.setProperty('userId', userId);
    return true;
  }

  /**
   * Set vehicle/product ID
   * @param {Number} vehicleId - Vehicle/Product ID
   * @returns {Boolean} Success status
   */
  setVehicleId(vehicleId) {
    this.clearErrors();

    if (!vehicleId || vehicleId <= 0) {
      this.addError('vehicleId', 'Valid vehicle ID is required');
      return false;
    }

    this.setProperty('vehicleId', vehicleId);
    return true;
  }

  /**
   * Set booking start date
   * @param {Date|String} date - Start date
   * @returns {Boolean} Success status
   */
  setStartDate(date) {
    this.clearErrors();

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      this.addError('startDate', 'Invalid start date');
      return false;
    }

    const now = new Date();
    if (dateObj < now) {
      this.addError('startDate', 'Start date must be in the future');
      return false;
    }

    this.setProperty('startDate', dateObj);
    return true;
  }

  /**
   * Set booking end date
   * @param {Date|String} date - End date
   * @returns {Boolean} Success status
   */
  setEndDate(date) {
    this.clearErrors();

    const dateObj = new Date(date);
    const startDate = this.getStartDate();

    if (isNaN(dateObj.getTime())) {
      this.addError('endDate', 'Invalid end date');
      return false;
    }

    if (startDate && dateObj <= startDate) {
      this.addError('endDate', 'End date must be after start date');
      return false;
    }

    this.setProperty('endDate', dateObj);
    return true;
  }

  /**
   * Set booking status
   * @param {String} status - Booking status
   * @returns {Boolean} Success status
   */
  setStatus(status) {
    this.clearErrors();
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      this.addError('status', `Status must be one of: ${validStatuses.join(', ')}`);
      return false;
    }

    this.setProperty('status', status);
    return true;
  }

  /**
   * Set total price
   * @param {Number} price - Total booking price
   * @returns {Boolean} Success status
   */
  setTotalPrice(price) {
    this.clearErrors();

    const numPrice = parseFloat(price);

    if (isNaN(numPrice) || numPrice < 0) {
      this.addError('totalPrice', 'Price must be a non-negative number');
      return false;
    }

    this.setProperty('totalPrice', numPrice);
    return true;
  }

  /**
   * Set pickup location
   * @param {String} location - Pickup location
   * @returns {Boolean} Success status
   */
  setPickupLocation(location) {
    this.clearErrors();

    if (!location || location.trim().length === 0) {
      this.addError('pickupLocation', 'Pickup location is required');
      return false;
    }

    this.setProperty('pickupLocation', location.trim());
    return true;
  }

  /**
   * Set dropoff location
   * @param {String} location - Dropoff location
   * @returns {Boolean} Success status
   */
  setDropoffLocation(location) {
    this.clearErrors();

    if (!location || location.trim().length === 0) {
      this.addError('dropoffLocation', 'Dropoff location is required');
      return false;
    }

    this.setProperty('dropoffLocation', location.trim());
    return true;
  }

  // ═══════════════════════════════════════════════════════════
  // BUSINESS LOGIC METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * Calculate booking duration in days
   * @returns {Number} Number of days
   */
  getDurationDays() {
    const start = this.getStartDate();
    const end = this.getEndDate();

    if (!start || !end) return 0;

    const difference = end - start;
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return days;
  }

  /**
   * Check if booking is active
   * @returns {Boolean} Is active
   */
  isActive() {
    return this.getStatus() === 'confirmed' || this.getStatus() === 'pending';
  }

  /**
   * Check if booking is completed
   * @returns {Boolean} Is completed
   */
  isCompleted() {
    return this.getStatus() === 'completed';
  }

  /**
   * Check if booking is cancelled
   * @returns {Boolean} Is cancelled
   */
  isCancelled() {
    return this.getStatus() === 'cancelled';
  }

  /**
   * Cancel the booking
   * @returns {Boolean} Success status
   */
  cancel() {
    if (this.isActive()) {
      this.setStatus('cancelled');
      return true;
    }

    this.addError('status', 'Can only cancel active bookings');
    return false;
  }

  /**
   * Confirm the booking
   * @returns {Boolean} Success status
   */
  confirm() {
    if (this.getStatus() === 'pending') {
      this.setStatus('confirmed');
      return true;
    }

    this.addError('status', 'Can only confirm pending bookings');
    return false;
  }

  /**
   * Complete the booking
   * @returns {Boolean} Success status
   */
  complete() {
    if (this.getStatus() === 'confirmed') {
      this.setStatus('completed');
      return true;
    }

    this.addError('status', 'Can only complete confirmed bookings');
    return false;
  }

  // ═══════════════════════════════════════════════════════════
  // VALIDATION
  // ═══════════════════════════════════════════════════════════

  /**
   * Validate entire booking
   * @returns {Boolean} Is valid
   */
  validate() {
    this.clearErrors();

    if (!this.getUserId()) {
      this.addError('userId', 'User ID is required');
    }

    if (!this.getVehicleId()) {
      this.addError('vehicleId', 'Vehicle ID is required');
    }

    if (!this.getStartDate()) {
      this.addError('startDate', 'Start date is required');
    }

    if (!this.getEndDate()) {
      this.addError('endDate', 'End date is required');
    }

    if (!this.getPickupLocation()) {
      this.addError('pickupLocation', 'Pickup location is required');
    }

    if (!this.getDropoffLocation()) {
      this.addError('dropoffLocation', 'Dropoff location is required');
    }

    if (this.getTotalPrice() <= 0) {
      this.addError('totalPrice', 'Total price must be greater than 0');
    }

    return this.isValid();
  }

  /**
   * Get booking summary
   * @returns {String} Booking information
   */
  getSummary() {
    return `
      Booking ID: ${this.getId()}
      User ID: ${this.getUserId()}
      Vehicle ID: ${this.getVehicleId()}
      Status: ${this.getStatus()}
      Duration: ${this.getDurationDays()} days
      From: ${this.getPickupLocation()}
      To: ${this.getDropoffLocation()}
      Total Price: Rs. ${this.getTotalPrice()}
    `;
  }
}

module.exports = Booking;
