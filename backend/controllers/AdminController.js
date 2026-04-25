/**
 * AdminController - Handles all admin operations
 * Extends base Controller for CRUD + custom admin methods
 */

const Controller = require('./Controller');
const Admin = require('../models/Admin');

class AdminController extends Controller {
  constructor() {
    super(Admin);
  }

  // ──────────── CUSTOM ADMIN METHODS ─────────────────────────

  // Find by username
  findByUsername(username) {
    if (!username || username.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Username required'
      };
    }

    const admin = this.data.find(
      item => item.username && item.username.toLowerCase() === username.toLowerCase()
    );

    if (!admin) {
      return {
        success: false,
        statusCode: 404,
        message: 'Admin not found'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Admin found',
      data: admin
    };
  }

  // Find by email
  findByEmail(email) {
    if (!email || email.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Email required'
      };
    }

    const admin = this.data.find(
      item => item.email && item.email.toLowerCase() === email.toLowerCase()
    );

    if (!admin) {
      return {
        success: false,
        statusCode: 404,
        message: 'Admin not found'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Admin found',
      data: admin
    };
  }

  // Find by role
  findByRole(role) {
    if (!role || role.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Role required'
      };
    }

    const admins = this.data.filter(
      item => item.role && item.role.toLowerCase() === role.toLowerCase()
    );

    if (admins.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No admins found with this role'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${admins.length} admin(s)`,
      data: admins
    };
  }

  // Get active admins
  getActiveAdmins() {
    const active = this.data.filter(admin => admin.is_active !== false);
    return {
      success: true,
      statusCode: 200,
      message: `Found ${active.length} active admin(s)`,
      data: active
    };
  }

  // Get inactive admins
  getInactiveAdmins() {
    const inactive = this.data.filter(admin => admin.is_active === false);
    return {
      success: true,
      statusCode: 200,
      message: `Found ${inactive.length} inactive admin(s)`,
      data: inactive
    };
  }

  // Change admin role
  changeRole(id, newRole) {
    const result = this.getById(id);
    if (!result.success) {
      return result;
    }

    const admin = result.data;
    admin.role = newRole.toLowerCase();

    return {
      success: true,
      statusCode: 200,
      message: 'Admin role updated successfully',
      data: admin
    };
  }

  // Deactivate admin
  deactivateAdmin(id) {
    const result = this.getById(id);
    if (!result.success) {
      return result;
    }

    const admin = result.data;
    admin.is_active = false;

    return {
      success: true,
      statusCode: 200,
      message: 'Admin deactivated successfully',
      data: admin
    };
  }

  // Activate admin
  activateAdmin(id) {
    const result = this.getById(id);
    if (!result.success) {
      return result;
    }

    const admin = result.data;
    admin.is_active = true;

    return {
      success: true,
      statusCode: 200,
      message: 'Admin activated successfully',
      data: admin
    };
  }

  // Get admin statistics
  getStatistics() {
    const totalAdmins = this.getCount();
    const activeAdmins = this.data.filter(a => a.is_active !== false).length;
    const inactiveAdmins = totalAdmins - activeAdmins;

    const roleDistribution = {};
    this.data.forEach(admin => {
      const role = admin.role || 'unknown';
      roleDistribution[role] = (roleDistribution[role] || 0) + 1;
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Statistics retrieved',
      data: {
        totalAdmins,
        activeAdmins,
        inactiveAdmins,
        activePercentage: totalAdmins === 0 ? '0%' : `${((activeAdmins / totalAdmins) * 100).toFixed(2)}%`,
        roleDistribution
      }
    };
  }

  // Search by name
  searchByFullName(name) {
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Search term required'
      };
    }

    const results = this.data.filter(
      admin => admin.full_name && admin.full_name.toLowerCase().includes(name.toLowerCase())
    );

    if (results.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No admins found matching search'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${results.length} admin(s)`,
      data: results
    };
  }
}

module.exports = AdminController;
