/**
 * Admin Model - Represents an admin user in the system
 * Extends base Model class with validation and admin-specific methods
 */

const Model = require('../Model');

class Admin extends Model {
  constructor(data = {}) {
    super(data);
  }

  // ──────────── GETTERS ────────────────────────────────────────
  
  getUsername() {
    return this.getProperty('username');
  }

  getPassword() {
    return this.getProperty('password');
  }

  getFullName() {
    return this.getProperty('full_name');
  }

  getEmail() {
    return this.getProperty('email');
  }

  getRole() {
    return this.getProperty('role') || 'admin';
  }

  getCreatedAt() {
    return this.getProperty('created_at');
  }

  isActive() {
    return this.getProperty('is_active') !== false;
  }

  // ──────────── SETTERS WITH VALIDATION ─────────────────────────

  setUsername(username) {
    if (!username || username.trim().length < 3) {
      this.addError('username', 'Username must be at least 3 characters');
      return false;
    }

    // Check for valid characters (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      this.addError('username', 'Username can only contain letters, numbers, and underscores');
      return false;
    }

    this.setProperty('username', username.trim().toLowerCase());
    return true;
  }

  setPassword(password) {
    if (!password || password.length < 6) {
      this.addError('password', 'Password must be at least 6 characters');
      return false;
    }

    // Password strength (at least one uppercase, one lowercase, one number)
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      this.addError('password', 'Password must contain uppercase, lowercase, and numbers');
      return false;
    }

    this.setProperty('password', password);
    return true;
  }

  setFullName(fullName) {
    if (!fullName || fullName.trim().length < 2) {
      this.addError('full_name', 'Full name must be at least 2 characters');
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      this.addError('full_name', 'Full name can only contain letters and spaces');
      return false;
    }

    this.setProperty('full_name', fullName.trim());
    return true;
  }

  setEmail(email) {
    if (!email) {
      this.addError('email', 'Email is required');
      return false;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.addError('email', 'Please provide a valid email address');
      return false;
    }

    this.setProperty('email', email.toLowerCase());
    return true;
  }

  setRole(role) {
    const validRoles = ['admin', 'super-admin', 'moderator'];
    if (!role || !validRoles.includes(role.toLowerCase())) {
      this.addError('role', `Role must be one of: ${validRoles.join(', ')}`);
      return false;
    }

    this.setProperty('role', role.toLowerCase());
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

    if (!this.getUsername()) {
      this.addError('username', 'Username is required');
    }

    if (!this.getPassword()) {
      this.addError('password', 'Password is required');
    }

    if (!this.getFullName()) {
      this.addError('full_name', 'Full name is required');
    }

    if (!this.getEmail()) {
      this.addError('email', 'Email is required');
    }

    return this.isValid();
  }

  // ──────────── HELPER METHODS ─────────────────────────────────

  getSummary() {
    return {
      username: this.getUsername(),
      full_name: this.getFullName(),
      email: this.getEmail(),
      role: this.getRole(),
      is_active: this.isActive(),
      created_at: this.getCreatedAt()
    };
  }

  // Check if admin has permission
  hasPermission(permission) {
    const permissionMap = {
      'super-admin': ['all'],
      'admin': ['users', 'content', 'reports'],
      'moderator': ['content']
    };

    const role = this.getRole();
    const permissions = permissionMap[role] || [];
    
    return permissions.includes('all') || permissions.includes(permission);
  }
}

module.exports = Admin;
