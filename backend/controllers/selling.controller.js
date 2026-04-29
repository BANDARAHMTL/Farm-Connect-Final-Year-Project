/**
 * Selling Controller - Handles paddy selling requests
 * Manages selling_requests table operations
 */

import pool from '../config/db.js';

// Get all selling requests
export const getAllSellings = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [sellings] = await conn.query(`
      SELECT 
        sr.*,
        f.name as farmer_name,
        f.mobile as farmer_mobile,
        rm.mill_name,
        rm.location as mill_location
      FROM selling_requests sr
      LEFT JOIN farmers f ON sr.farmer_id = f.id
      LEFT JOIN rice_mills rm ON sr.mill_id = rm.id
      ORDER BY sr.created_at DESC
    `);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${sellings.length} selling request(s)`,
      data: sellings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching selling requests',
      error: error.message
    });
  }
};

// Get selling request by ID
export const getSellingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid selling request ID'
      });
    }

    const conn = await pool.getConnection();

    const [sellings] = await conn.query(`
      SELECT 
        sr.*,
        f.name as farmer_name,
        f.mobile as farmer_mobile,
        rm.mill_name,
        rm.location as mill_location
      FROM selling_requests sr
      LEFT JOIN farmers f ON sr.farmer_id = f.id
      LEFT JOIN rice_mills rm ON sr.mill_id = rm.id
      WHERE sr.id = ?
    `, [id]);

    conn.release();

    if (sellings.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Selling request not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Selling request retrieved successfully',
      data: sellings[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching selling request',
      error: error.message
    });
  }
};

// Add new selling request
export const addSelling = async (req, res) => {
  try {
    const { farmerId, millId, riceType, stockKg, pricePerKg } = req.body;

    // Validation
    if (!farmerId || !millId || !riceType || !stockKg || pricePerKg === undefined) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Missing required fields: farmerId, millId, riceType, stockKg, pricePerKg'
      });
    }

    const stockKgNum = parseFloat(stockKg);
    const pricePerKgNum = parseFloat(pricePerKg);
    const totalPrice = stockKgNum * pricePerKgNum;

    const conn = await pool.getConnection();

    // Verify farmer exists
    const [farmers] = await conn.query('SELECT id FROM farmers WHERE id = ?', [farmerId]);
    if (farmers.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Farmer not found'
      });
    }

    // Verify mill exists
    const [mills] = await conn.query('SELECT id FROM rice_mills WHERE id = ?', [millId]);
    if (mills.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Rice mill not found'
      });
    }

    // Insert selling request
    const [result] = await conn.query(`
      INSERT INTO selling_requests (farmer_id, mill_id, rice_type, stock_kg, price_per_kg, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
    `, [farmerId, millId, riceType, stockKgNum, pricePerKgNum, totalPrice]);

    // Retrieve the created record
    const [newSelling] = await conn.query(`
      SELECT 
        sr.*,
        f.name as farmer_name,
        f.mobile as farmer_mobile,
        rm.mill_name,
        rm.location as mill_location
      FROM selling_requests sr
      LEFT JOIN farmers f ON sr.farmer_id = f.id
      LEFT JOIN rice_mills rm ON sr.mill_id = rm.id
      WHERE sr.id = ?
    `, [result.insertId]);

    conn.release();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Selling request created successfully',
      data: newSelling[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error creating selling request',
      error: error.message
    });
  }
};

// Update selling request (admin only - typically for status changes)
export const updateSelling = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid selling request ID'
      });
    }

    const { status } = req.body;

    // Validate status if provided
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (status && !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const conn = await pool.getConnection();

    // Check if selling request exists
    const [existing] = await conn.query('SELECT * FROM selling_requests WHERE id = ?', [id]);

    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Selling request not found'
      });
    }

    // Build update query
    let updateQuery = 'UPDATE selling_requests SET ';
    const updateValues = [];
    const updateFields = [];

    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status.toUpperCase());
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

    // Retrieve updated record
    const [updated] = await conn.query(`
      SELECT 
        sr.*,
        f.name as farmer_name,
        f.mobile as farmer_mobile,
        rm.mill_name,
        rm.location as mill_location
      FROM selling_requests sr
      LEFT JOIN farmers f ON sr.farmer_id = f.id
      LEFT JOIN rice_mills rm ON sr.mill_id = rm.id
      WHERE sr.id = ?
    `, [id]);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Selling request updated successfully',
      data: updated[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating selling request',
      error: error.message
    });
  }
};

// Delete selling request (admin only)
export const deleteSelling = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid selling request ID'
      });
    }

    const conn = await pool.getConnection();

    // Check if selling request exists
    const [existing] = await conn.query('SELECT * FROM selling_requests WHERE id = ?', [id]);

    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Selling request not found'
      });
    }

    // Delete the selling request
    await conn.query('DELETE FROM selling_requests WHERE id = ?', [id]);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Selling request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error deleting selling request',
      error: error.message
    });
  }
};
