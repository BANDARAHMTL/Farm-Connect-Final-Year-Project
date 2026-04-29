/**
 * PaddyTypeController - Handles paddy type operations
 * Paddy types represent the different rice varieties farmers can sell
 */

import pool from '../config/db.js';

// Get all active paddy types (alias for farmers)
export const getActivePaddyTypes = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [types] = await conn.query(`
      SELECT id, type_name, price_per_kg, description, status, created_at
      FROM paddy_types
      WHERE status = 'active'
      ORDER BY type_name ASC
    `);
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${types.length} active paddy type(s)`,
      data: types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching paddy types',
      error: error.message
    });
  }
};

// Get all active paddy types
export const getPaddyTypes = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [types] = await conn.query(`
      SELECT id, type_name, price_per_kg, description, status, created_at
      FROM paddy_types
      WHERE status = 'active'
      ORDER BY type_name ASC
    `);
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${types.length} active paddy type(s)`,
      data: types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching paddy types',
      error: error.message
    });
  }
};

// Get all paddy types (including inactive) - for admin
export const getAllPaddyTypes = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [types] = await conn.query(`
      SELECT id, type_name, price_per_kg, description, status, created_at
      FROM paddy_types
      ORDER BY type_name ASC
    `);
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${types.length} paddy type(s)`,
      data: types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching paddy types',
      error: error.message
    });
  }
};

// Get single paddy type by ID
export const getPaddyTypeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid paddy type ID'
      });
    }

    const conn = await pool.getConnection();
    const [types] = await conn.query(
      'SELECT id, type_name, price_per_kg, description, status, created_at FROM paddy_types WHERE id = ?',
      [id]
    );
    conn.release();

    if (types.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paddy type not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Paddy type retrieved successfully',
      data: types[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching paddy type',
      error: error.message
    });
  }
};

// Create paddy type (admin only)
export const addPaddyType = async (req, res) => {
  try {
    const { type_name, price_per_kg, description } = req.body;

    // Validate required fields
    if (!type_name || price_per_kg === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Type name and price per kg are required'
      });
    }

    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `INSERT INTO paddy_types (type_name, price_per_kg, description, status)
       VALUES (?, ?, ?, 'active')`,
      [type_name, price_per_kg, description || null]
    );

    // Get created type
    const [newType] = await conn.query(
      'SELECT id, type_name, price_per_kg, description, status, created_at FROM paddy_types WHERE id = ?',
      [result.insertId]
    );
    conn.release();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Paddy type created successfully',
      data: newType[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error creating paddy type',
      error: error.message
    });
  }
};

// Update paddy type (admin only)
export const updatePaddyType = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { type_name, price_per_kg, description, status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid paddy type ID'
      });
    }

    const conn = await pool.getConnection();

    // Check if exists
    const [existing] = await conn.query('SELECT id FROM paddy_types WHERE id = ?', [id]);
    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        message: 'Paddy type not found'
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (type_name !== undefined) {
      updates.push('type_name = ?');
      values.push(type_name);
    }
    if (price_per_kg !== undefined) {
      updates.push('price_per_kg = ?');
      values.push(price_per_kg);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    await conn.query(
      `UPDATE paddy_types SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      [...values, id]
    );

    // Get updated type
    const [updatedType] = await conn.query(
      'SELECT id, type_name, price_per_kg, description, status, created_at FROM paddy_types WHERE id = ?',
      [id]
    );
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Paddy type updated successfully',
      data: updatedType[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating paddy type',
      error: error.message
    });
  }
};

// Delete paddy type (admin only)
export const deletePaddyType = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid paddy type ID'
      });
    }

    const conn = await pool.getConnection();

    // Check if exists
    const [existing] = await conn.query('SELECT id FROM paddy_types WHERE id = ?', [id]);
    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        message: 'Paddy type not found'
      });
    }

    // Delete
    await conn.query('DELETE FROM paddy_types WHERE id = ?', [id]);
    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Paddy type deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error deleting paddy type',
      error: error.message
    });
  }
};

