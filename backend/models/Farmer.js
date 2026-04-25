/**
 * Farmer Model - Represents a farmer in the system
 * Extends base Model class with validation and farmer-specific methods
 */

const Model = require('../Model');

class Farmer extends Model {
  constructor(data = {}) {
    super(data);
  }

  // ──────────── GETTERS ────────────────────────────────────────
  
  getFarmerId() {
    return this.getProperty('farmer_id');
  }

  getName() {
    return this.getProperty('name');
  }

  getEmail() {
    return this.getProperty('email');
  }

  getMobile() {
    return this.getProperty('mobile');
  }

  getNIC() {
    return this.getProperty('nic');
  }

  getAddress() {
    return this.getProperty('address');
  }

  getLandNumber() {
    return this.getProperty('land_number');
  }

  getPassword() {
    return this.getProperty('password');
  }

  getCreatedAt() {
    return this.getProperty('created_at');
  }

  isActive() {
    return this.getProperty('is_active') !== false;
  }

  // ──────────── SETTERS WITH VALIDATION ─────────────────────────

  setName(name) {
    if (!name || name.trim().length < 2) {
      this.addError('name', 'Name must be at least 2 characters');
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      this.addError('name', 'Name can only contain letters and spaces');
      return false;
    }

    this.setProperty('name', name.trim());
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

  setMobile(mobile) {
    if (mobile && !/^\d{10,15}$/.test(mobile.replace(/\D/g, ''))) {
      this.addError('mobile', 'Please provide a valid phone number');
      return false;
    }

    this.setProperty('mobile', mobile || null);
    return true;
  }

  setPassword(password) {
    if (!password || password.length < 6) {
      this.addError('password', 'Password must be at least 6 characters');
      return false;
    }

    this.setProperty('password', password);
    return true;
  }

  setNIC(nic) {
    if (nic && !/^\d{13,15}$/.test(nic.replace(/\D/g, ''))) {
      this.addError('nic', 'Please provide a valid NIC number');
      return false;
    }

    this.setProperty('nic', nic || null);
    return true;
  }

  setAddress(address) {
    if (address && address.trim().length > 0) {
      if (address.trim().length < 5) {
        this.addError('address', 'Address must be at least 5 characters');
        return false;
      }
      this.setProperty('address', address.trim());
    }

    return true;
  }

  setLandNumber(landNumber) {
    if (landNumber && !/^\d+(\.\d{1,2})?$/.test(landNumber)) {
      this.addError('land_number', 'Land number must be a valid number');
      return false;
    }

    this.setProperty('land_number', landNumber ? parseFloat(landNumber) : null);
    return true;
  }

  setActive(isActive) {
    if (typeof isActive !== 'boolean') {
      this.addError('is_active', 'Must be true or false');
      return false;
    }

    this.setProperty('is_active', isActive);
    return true;
  }

  // ──────────── VALIDATION ─────────────────────────────────────

  validate() {
    this.clearErrors();

    if (!this.getName()) {
      this.addError('name', 'Name is required');
    }

    if (!this.getEmail()) {
      this.addError('email', 'Email is required');
    }

    if (!this.getPassword()) {
      this.addError('password', 'Password is required');
    }

    return this.isValid();
  }

  // ──────────── HELPER METHODS ─────────────────────────────────

  getSummary() {
    return {
      farmer_id: this.getFarmerId(),
      name: this.getName(),
      email: this.getEmail(),
      mobile: this.getMobile(),
      address: this.getAddress(),
      land_number: this.getLandNumber(),
      is_active: this.isActive(),
      created_at: this.getCreatedAt()
    };
  }

  // Calculate land area in hectares
  getLandHectares() {
    const acres = this.getLandNumber();
    if (!acres) return 0;
    return (acres * 0.404686).toFixed(2); // 1 acre = 0.404686 hectares
  }

  // Get farmer profile completeness
  getProfileCompleteness() {
    const fields = ['name', 'email', 'mobile', 'nic', 'address', 'land_number'];
    const filled = fields.filter(f => this.getProperty(f)).length;
    return Math.round((filled / fields.length) * 100);
  }
}

module.exports = Farmer;
