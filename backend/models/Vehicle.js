/**
 * Vehicle Model - Represents a vehicle/equipment in the system
 * Extends base Model class with validation and vehicle-specific methods
 */

const Model = require('../Model');

class Vehicle extends Model {
  constructor(data = {}) {
    super(data);
  }

  // ──────────── GETTERS ────────────────────────────────────────
  
  getVehicleNumber() {
    return this.getProperty('vehicle_number');
  }

  getVehicleType() {
    return this.getProperty('vehicle_type');
  }

  getModel() {
    return this.getProperty('model');
  }

  getCapacity() {
    return this.getProperty('capacity') || 0;
  }

  getStatus() {
    return this.getProperty('status') || 'Available';
  }

  getOwnerName() {
    return this.getProperty('owner_name');
  }

  getOwnerMobile() {
    return this.getProperty('owner_mobile');
  }

  getRegNumber() {
    return this.getProperty('reg_number');
  }

  getRating() {
    return this.getProperty('rating') || 0;
  }

  getLocation() {
    return this.getProperty('location');
  }

  getPricePerAcre() {
    return this.getProperty('price_per_acre') || 0;
  }

  getImageUrl() {
    return this.getProperty('image_url');
  }

  getCreatedAt() {
    return this.getProperty('created_at');
  }

  isAvailable() {
    return this.getStatus().toLowerCase() === 'available';
  }

  // ──────────── SETTERS WITH VALIDATION ─────────────────────────

  setVehicleNumber(number) {
    if (!number || number.trim().length === 0) {
      this.addError('vehicle_number', 'Vehicle number is required');
      return false;
    }

    this.setProperty('vehicle_number', number.trim().toUpperCase());
    return true;
  }

  setVehicleType(type) {
    const validTypes = ['tractor', 'harvester', 'truck', 'van', 'car'];
    if (!type || !validTypes.includes(type.toLowerCase())) {
      this.addError('vehicle_type', `Type must be one of: ${validTypes.join(', ')}`);
      return false;
    }

    this.setProperty('vehicle_type', type.toLowerCase());
    return true;
  }

  setModel(model) {
    if (model && model.trim().length > 0) {
      this.setProperty('model', model.trim());
      return true;
    }

    this.setProperty('model', null);
    return true;
  }

  setCapacity(capacity) {
    const num = parseFloat(capacity);
    if (isNaN(num) || num <= 0) {
      this.addError('capacity', 'Capacity must be a positive number');
      return false;
    }

    this.setProperty('capacity', num);
    return true;
  }

  setStatus(status) {
    const validStatuses = ['available', 'booked', 'maintenance', 'inactive'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      this.addError('status', `Status must be one of: ${validStatuses.join(', ')}`);
      return false;
    }

    this.setProperty('status', status.toLowerCase());
    return true;
  }

  setOwnerName(name) {
    if (name && name.trim().length > 0) {
      if (!/^[a-zA-Z\s]+$/.test(name)) {
        this.addError('owner_name', 'Owner name can only contain letters and spaces');
        return false;
      }
      this.setProperty('owner_name', name.trim());
    }

    return true;
  }

  setOwnerMobile(mobile) {
    if (mobile && !/^\d{10,15}$/.test(mobile.replace(/\D/g, ''))) {
      this.addError('owner_mobile', 'Please provide a valid phone number');
      return false;
    }

    this.setProperty('owner_mobile', mobile || null);
    return true;
  }

  setRegNumber(regNumber) {
    if (regNumber && regNumber.trim().length > 0) {
      this.setProperty('reg_number', regNumber.trim().toUpperCase());
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

  setLocation(location) {
    if (location && location.trim().length > 0) {
      this.setProperty('location', location.trim());
    }

    return true;
  }

  setPricePerAcre(price) {
    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) {
      this.addError('price_per_acre', 'Price must be a positive number');
      return false;
    }

    this.setProperty('price_per_acre', num);
    return true;
  }

  setImageUrl(url) {
    if (url && url.trim().length > 0) {
      this.setProperty('image_url', url.trim());
    }

    return true;
  }

  // ──────────── VALIDATION ─────────────────────────────────────

  validate() {
    this.clearErrors();

    if (!this.getVehicleNumber()) {
      this.addError('vehicle_number', 'Vehicle number is required');
    }

    if (!this.getVehicleType()) {
      this.addError('vehicle_type', 'Vehicle type is required');
    }

    if (!this.getCapacity() || this.getCapacity() <= 0) {
      this.addError('capacity', 'Capacity is required and must be positive');
    }

    if (!this.getPricePerAcre() || this.getPricePerAcre() <= 0) {
      this.addError('price_per_acre', 'Price per acre is required and must be positive');
    }

    return this.isValid();
  }

  // ──────────── HELPER METHODS ─────────────────────────────────

  getSummary() {
    return {
      vehicle_number: this.getVehicleNumber(),
      vehicle_type: this.getVehicleType(),
      model: this.getModel(),
      capacity: this.getCapacity(),
      status: this.getStatus(),
      owner_name: this.getOwnerName(),
      owner_mobile: this.getOwnerMobile(),
      rating: this.getRating(),
      location: this.getLocation(),
      price_per_acre: this.getPricePerAcre(),
      image_url: this.getImageUrl()
    };
  }

  // Mark as booked
  markBooked() {
    this.setProperty('status', 'booked');
    return true;
  }

  // Mark as available
  markAvailable() {
    this.setProperty('status', 'available');
    return true;
  }

  // Mark for maintenance
  markMaintenance() {
    this.setProperty('status', 'maintenance');
    return true;
  }
}

module.exports = Vehicle;
