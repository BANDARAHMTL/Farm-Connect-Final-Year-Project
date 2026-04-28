/**
 * AdminController - Handles all admin operations
 * Extends base Controller for CRUD + custom admin methods
 */

import Controller from './Controller.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

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

// Create instance for handler functions
const adminController = new AdminController();

// Export handler functions for routes
export const registerAdmin = async (req, res) => {
  try {
    const { username, password, full_name, email, role } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert into database
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        `INSERT INTO admins (username, password, full_name, email, role) 
         VALUES (?, ?, ?, ?, ?)`,
        [username, hashedPassword, full_name || '', email || '', role || 'admin']
      );
      
      // Return the created admin
      const [newAdmin] = await conn.query(
        'SELECT * FROM admins WHERE id = ?',
        [result.insertId]
      );
      
      conn.release();
      
      const { password: _, ...adminData } = newAdmin[0];
      res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: adminData
      });
    } catch (dbError) {
      conn.release();
      
      // Handle duplicate username/email
      if (dbError.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Username or email already exists'
        });
      }
      throw dbError;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration error',
      error: error.message
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password required'
      });
    }

    // Query database for admin
    const conn = await pool.getConnection();
    const [admins] = await conn.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    conn.release();

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const admin = admins[0];

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin.id,
        username: admin.username,
        role: admin.role || 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return token and admin data (excluding password)
    const { password: _, ...adminData } = admin;
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: adminData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
};

export const listFarmers = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [farmers] = await conn.query('SELECT id, farmer_id, name, email, mobile, nic, address, land_number, created_at FROM farmers ORDER BY created_at DESC');
    conn.release();
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${farmers.length} farmer(s)`,
      data: farmers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching farmers',
      error: error.message
    });
  }
};

export const updateFarmer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, mobile, nic, address, land_number } = req.body;
    
    const conn = await pool.getConnection();
    await conn.query(
      'UPDATE farmers SET name = ?, email = ?, mobile = ?, nic = ?, address = ?, land_number = ? WHERE id = ?',
      [name, email, mobile, nic, address, land_number, id]
    );
    
    const [updatedFarmers] = await conn.query('SELECT id, farmer_id, name, email, mobile, nic, address, land_number, created_at FROM farmers WHERE id = ?', [id]);
    conn.release();
    
    if (updatedFarmers.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Farmer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Farmer updated successfully',
      data: updatedFarmers[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating farmer',
      error: error.message
    });
  }
};

export const deleteFarmer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const conn = await pool.getConnection();
    const [deletedResult] = await conn.query('DELETE FROM farmers WHERE id = ?', [id]);
    conn.release();
    
    if (deletedResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Farmer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Farmer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error deleting farmer',
      error: error.message
    });
  }
};

// Export controller class
export default AdminController;
