/**
 * ═══════════════════════════════════════════════════════════════
 * USER CONTROLLER
 * ═══════════════════════════════════════════════════════════════
 * 
 * Handles all user-related operations.
 * Extends the base Controller class with user-specific logic.
 * 
 * Responsibilities:
 * - User CRUD operations
 * - User authentication
 * - User search and filtering
 */

const Controller = require('./Controller');
const User = require('../models/User');

class UserController extends Controller {
  /**
   * Constructor - Initialize UserController
   */
  constructor() {
    super(User);
  }

  // ═══════════════════════════════════════════════════════════
  // CUSTOM BUSINESS LOGIC METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * Find user by email
   * @param {String} email - User email
   * @returns {Object} Response object
   */
  findByEmail(email) {
    try {
      const user = this.data.find(
        item => item.email && item.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        return {
          success: false,
          statusCode: 404,
          message: `User with email ${email} not found`,
          data: null,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'User found',
        data: user,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error finding user',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Find users by role
   * @param {String} role - User role
   * @returns {Object} Response object
   */
  findByRole(role) {
    try {
      const users = this.data.filter(item => item.role === role);

      if (users.length === 0) {
        return {
          success: true,
          statusCode: 200,
          message: `No users found with role ${role}`,
          data: [],
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: `Found ${users.length} users with role ${role}`,
        data: users,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error finding users',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get active users only
   * @returns {Object} Response object
   */
  getActiveUsers() {
    try {
      const activeUsers = this.data.filter(item => item.isActive === true);

      return {
        success: true,
        statusCode: 200,
        message: `Retrieved ${activeUsers.length} active users`,
        data: activeUsers,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving active users',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Deactivate user
   * @param {Number} id - User ID
   * @returns {Object} Response object
   */
  deactivateUser(id) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      // Update user to inactive
      return this.update(id, { isActive: false });
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error deactivating user',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Activate user
   * @param {Number} id - User ID
   * @returns {Object} Response object
   */
  activateUser(id) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      // Update user to active
      return this.update(id, { isActive: true });
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error activating user',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Change user role
   * @param {Number} id - User ID
   * @param {String} newRole - New role
   * @returns {Object} Response object
   */
  changeRole(id, newRole) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      return this.update(id, { role: newRole });
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error changing user role',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Search users by name
   * @param {String} searchTerm - Name to search
   * @returns {Object} Response object
   */
  searchByName(searchTerm) {
    try {
      const results = this.data.filter(item =>
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        success: true,
        statusCode: 200,
        message: `Found ${results.length} users matching "${searchTerm}"`,
        data: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error searching users',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get user statistics
   * @returns {Object} Response object
   */
  getStatistics() {
    try {
      const totalUsers = this.getCount();
      const activeUsers = this.data.filter(u => u.isActive).length;
      const inactiveUsers = totalUsers - activeUsers;

      // Count by role
      const roleCount = {};
      const validRoles = ['admin', 'farmer', 'buyer', 'mill-operator'];
      validRoles.forEach(role => {
        roleCount[role] = this.data.filter(u => u.role === role).length;
      });

      const stats = {
        totalUsers,
        activeUsers,
        inactiveUsers,
        activePercentage: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) + '%' : '0%',
        roleDistribution: roleCount
      };

      return {
        success: true,
        statusCode: 200,
        message: 'User statistics retrieved',
        data: stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving statistics',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get user details with summary
   * @param {Number} id - User ID
   * @returns {Object} Response object
   */
  getUserDetails(id) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      // Create user instance to get summary
      const userInstance = new User(response.data);

      return {
        success: true,
        statusCode: 200,
        message: 'User details retrieved',
        data: {
          ...response.data,
          summary: userInstance.getSummary()
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving user details',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = UserController;
