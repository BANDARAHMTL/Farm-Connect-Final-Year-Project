/**
 * FarmerController - Handles all farmer operations
 * Extends base Controller for CRUD + custom farmer methods
 */

import Controller from './Controller.js';
import Farmer from '../models/Farmer.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

class FarmerController extends Controller {
  constructor() {
    super(Farmer);
  }

  // ──────────── CUSTOM FARMER METHODS ─────────────────────────

  // Find by email
  findByEmail(email) {
    if (!email || email.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Email required'
      };
    }

    const farmer = this.data.find(
      item => item.email && item.email.toLowerCase() === email.toLowerCase()
    );

    if (!farmer) {
      return {
        success: false,
        statusCode: 404,
        message: 'Farmer not found'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Farmer found',
      data: farmer
    };
  }

  // Find by farmer ID
  findByFarmerId(farmerId) {
    if (!farmerId) {
      return {
        success: false,
        statusCode: 400,
        message: 'Farmer ID required'
      };
    }

    const farmer = this.data.find(f => f.farmer_id === farmerId);

    if (!farmer) {
      return {
        success: false,
        statusCode: 404,
        message: 'Farmer not found'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Farmer found',
      data: farmer
    };
  }

  // Find by location
  findByLocation(location) {
    if (!location || location.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Location required'
      };
    }

    const farmers = this.data.filter(
      f => f.address && f.address.toLowerCase().includes(location.toLowerCase())
    );

    if (farmers.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No farmers found in this location'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${farmers.length} farmer(s)`,
      data: farmers
    };
  }

  // Get active farmers
  getActiveFarmers() {
    const active = this.data.filter(f => f.is_active !== false);
    return {
      success: true,
      statusCode: 200,
      message: `Found ${active.length} active farmer(s)`,
      data: active
    };
  }

  // Deactivate farmer
  deactivateFarmer(id) {
    const result = this.getById(id);
    if (!result.success) return result;

    const farmer = result.data;
    farmer.is_active = false;

    return {
      success: true,
      statusCode: 200,
      message: 'Farmer deactivated',
      data: farmer
    };
  }

  // Activate farmer
  activateFarmer(id) {
    const result = this.getById(id);
    if (!result.success) return result;

    const farmer = result.data;
    farmer.is_active = true;

    return {
      success: true,
      statusCode: 200,
      message: 'Farmer activated',
      data: farmer
    };
  }

  // Get farmers by land size range
  findByLandSize(minAcres, maxAcres) {
    const farmers = this.data.filter(f => {
      const land = f.land_number || 0;
      return land >= minAcres && land <= maxAcres;
    });

    if (farmers.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No farmers found in this land size range'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${farmers.length} farmer(s)`,
      data: farmers
    };
  }

  // Search by name
  searchByName(name) {
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Search term required'
      };
    }

    const results = this.data.filter(
      f => f.name && f.name.toLowerCase().includes(name.toLowerCase())
    );

    if (results.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No farmers found matching search'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${results.length} farmer(s)`,
      data: results
    };
  }

  // Get farmer statistics
  getStatistics() {
    const total = this.getCount();
    const active = this.data.filter(f => f.is_active !== false).length;
    const inactive = total - active;

    const totalLand = this.data.reduce((sum, f) => sum + (f.land_number || 0), 0);
    const avgLand = total === 0 ? 0 : (totalLand / total).toFixed(2);

    return {
      success: true,
      statusCode: 200,
      message: 'Statistics retrieved',
      data: {
        totalFarmers: total,
        activeFarmers: active,
        inactiveFarmers: inactive,
        activePercentage: total === 0 ? '0%' : `${((active / total) * 100).toFixed(2)}%`,
        totalLandAcres: totalLand.toFixed(2),
        averageLandAcres: avgLand,
        totalLandHectares: (totalLand * 0.404686).toFixed(2)
      }
    };
  }

  // Get profile completeness report
  getProfileCompletenessReport() {
    const completeness = this.data.map(farmer => {
      const fields = ['name', 'email', 'mobile', 'nic', 'address', 'land_number'];
      const filled = fields.filter(f => farmer[f]).length;
      const percentage = Math.round((filled / fields.length) * 100);

      return {
        id: farmer.id,
        farmer_id: farmer.farmer_id,
        name: farmer.name,
        completeness: percentage
      };
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Profile completeness report',
      data: completeness
    };
  }
}

// Create instance for handler functions
const farmerController = new FarmerController();

// Export handler functions for routes
export const registerFarmer = async (req, res) => {
  try {
    const { name, email, password, mobile, nic, address, land_number } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert into database
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        `INSERT INTO farmers (name, email, password, mobile, nic, address, land_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name || '', email, hashedPassword, mobile || null, nic || null, address || null, land_number || null]
      );
      
      // Return the created farmer
      const [newFarmer] = await conn.query(
        'SELECT * FROM farmers WHERE id = ?',
        [result.insertId]
      );
      
      conn.release();
      
      const { password: _, ...farmerData } = newFarmer[0];
      res.status(201).json({
        success: true,
        message: 'Farmer registered successfully',
        data: farmerData
      });
    } catch (dbError) {
      conn.release();
      
      // Handle duplicate email
      if (dbError.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
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

export const farmerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    // Query database for farmer
    const conn = await pool.getConnection();
    const [farmers] = await conn.query(
      'SELECT * FROM farmers WHERE email = ?',
      [email]
    );
    conn.release();

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const farmer = farmers[0];

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, farmer.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        farmerId: farmer.id,
        email: farmer.email,
        role: 'farmer'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return token and farmer data (excluding password)
    const { password: _, ...farmerData } = farmer;
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      farmer: farmerData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
};

export const getFarmerProfile = (req, res) => {
  const id = req.farmer?.id || parseInt(req.params.id);
  const result = farmerController.getById(id);
  res.status(result.statusCode).json(result);
};

export const getFarmerById = (req, res) => {
  const id = parseInt(req.params.id);
  const result = farmerController.getById(id);
  res.status(result.statusCode).json(result);
};

// Export controller class
export default FarmerController;
