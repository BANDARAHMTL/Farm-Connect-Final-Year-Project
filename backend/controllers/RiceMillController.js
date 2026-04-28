/**
 * RiceMillController - Handles all rice mill operations
 * Extends base Controller for CRUD + custom rice mill methods
 */

import Controller from './Controller.js';
import RiceMill from '../models/RiceMill.js';
import pool from '../config/db.js';

class RiceMillController extends Controller {
  constructor() {
    super(RiceMill);
  }

  // ──────────── CUSTOM RICE MILL METHODS ──────────────────────────

  // Find by location
  findByLocation(location) {
    if (!location || location.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Location required'
      };
    }

    const mills = this.data.filter(
      m => m.location && m.location.toLowerCase().includes(location.toLowerCase())
    );

    if (mills.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No rice mills found in this location'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${mills.length} rice mill(s)`,
      data: mills
    };
  }

  // Find active rice mills
  findActive() {
    const active = this.data.filter(m => m.status === 'active');

    return {
      success: true,
      statusCode: 200,
      message: `Found ${active.length} active rice mill(s)`,
      data: active
    };
  }
}

// ──────────── HANDLER FUNCTIONS FOR ROUTES ──────────────────────

export const getAllRiceMills = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [mills] = await conn.query('SELECT * FROM rice_mills WHERE status = "active" ORDER BY mill_name ASC');
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${mills.length} rice mill(s)`,
      data: mills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching rice mills',
      error: error.message
    });
  }
};

export const getAllRiceMillsAdmin = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [mills] = await conn.query('SELECT * FROM rice_mills ORDER BY mill_name ASC');
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${mills.length} rice mill(s)`,
      data: mills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching rice mills',
      error: error.message
    });
  }
};

export const getRiceMillById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid rice mill ID'
      });
    }

    const conn = await pool.getConnection();
    const [mills] = await conn.query('SELECT * FROM rice_mills WHERE id = ?', [id]);
    conn.release();

    if (mills.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Rice mill not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Rice mill found',
      data: mills[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching rice mill',
      error: error.message
    });
  }
};

export const addRiceMill = async (req, res) => {
  try {
    const { millName, location, address, contactNumber, email, description, rating, status } = req.body;
    const imageUrl = req.file ? `/uploads/ricemills/${req.file.filename}` : null;

    // Validation
    if (!millName || !location || !address || !contactNumber || !email) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Missing required fields: millName, location, address, contactNumber, email'
      });
    }

    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `INSERT INTO rice_mills (mill_name, location, address, contact_number, email, description, rating, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [millName, location, address, contactNumber, email, description || '', rating || 0, status || 'active', imageUrl]
    );

    const [newMill] = await conn.query('SELECT * FROM rice_mills WHERE id = ?', [result.insertId]);
    conn.release();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Rice mill added successfully',
      data: newMill[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error adding rice mill',
      error: error.message
    });
  }
};

export const updateRiceMill = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid rice mill ID'
      });
    }

    const { millName, location, address, contactNumber, email, description, rating, status } = req.body;
    const imageUrl = req.file ? `/uploads/ricemills/${req.file.filename}` : undefined;

    const conn = await pool.getConnection();

    // Check if rice mill exists
    const [existing] = await conn.query('SELECT * FROM rice_mills WHERE id = ?', [id]);

    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Rice mill not found'
      });
    }

    // Build update query
    let updateQuery = 'UPDATE rice_mills SET ';
    const updateValues = [];
    const updateFields = [];

    if (millName !== undefined) {
      updateFields.push('mill_name = ?');
      updateValues.push(millName);
    }
    if (location !== undefined) {
      updateFields.push('location = ?');
      updateValues.push(location);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (contactNumber !== undefined) {
      updateFields.push('contact_number = ?');
      updateValues.push(contactNumber);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (rating !== undefined) {
      updateFields.push('rating = ?');
      updateValues.push(rating);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (imageUrl !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(imageUrl);
    }

    if (updateFields.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'No fields to update'
      });
    }

    updateQuery += updateFields.join(', ') + ' WHERE id = ?';
    updateValues.push(id);

    await conn.query(updateQuery, updateValues);

    const [updatedMill] = await conn.query('SELECT * FROM rice_mills WHERE id = ?', [id]);
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Rice mill updated successfully',
      data: updatedMill[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating rice mill',
      error: error.message
    });
  }
};

export const deleteRiceMill = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid rice mill ID'
      });
    }

    const conn = await pool.getConnection();

    // Check if rice mill exists
    const [existing] = await conn.query('SELECT * FROM rice_mills WHERE id = ?', [id]);

    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Rice mill not found'
      });
    }

    await conn.query('DELETE FROM rice_mills WHERE id = ?', [id]);
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Rice mill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error deleting rice mill',
      error: error.message
    });
  }
};

// Export controller class
export default RiceMillController;
