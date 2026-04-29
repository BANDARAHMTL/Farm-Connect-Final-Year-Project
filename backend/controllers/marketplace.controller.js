/**
 * MarketplaceController - Handles all marketplace operations
 * Database operations for rice marketplace listings
 */

import pool from '../config/db.js';

class MarketplaceController {
  constructor() {
    // Controller for marketplace operations
  }
}

// Export handler functions for routes

// Get all active marketplace listings (public)
export const getListings = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [listings] = await conn.query(`
      SELECT
        mp.*,
        rm.mill_name,
        rm.location as mill_location,
        rt.type_name,
        rt.price_per_kg as rice_type_price
      FROM rice_marketplace mp
      JOIN rice_mills rm ON mp.mill_id = rm.id
      JOIN rice_types rt ON mp.rice_type_id = rt.id
      WHERE mp.status = 'active'
      ORDER BY mp.created_at DESC
    `);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${listings.length} marketplace listing(s)`,
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching marketplace listings',
      error: error.message
    });
  }
};

// Get all marketplace listings for admin (including inactive)
export const getAllListingsAdmin = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [listings] = await conn.query(`
      SELECT
        mp.*,
        rm.mill_name,
        rm.location as mill_location,
        rt.type_name,
        rt.price_per_kg as rice_type_price
      FROM rice_marketplace mp
      JOIN rice_mills rm ON mp.mill_id = rm.id
      JOIN rice_types rt ON mp.rice_type_id = rt.id
      ORDER BY mp.created_at DESC
    `);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${listings.length} marketplace listing(s)`,
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching marketplace listings',
      error: error.message
    });
  }
};

// Get single marketplace listing by ID
export const getListingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID'
      });
    }

    const conn = await pool.getConnection();

    const [listings] = await conn.query(`
      SELECT
        mp.*,
        rm.mill_name,
        rm.location as mill_location,
        rm.contact_number,
        rm.email,
        rt.type_name,
        rt.price_per_kg as rice_type_price,
        rt.description as rice_description
      FROM rice_marketplace mp
      JOIN rice_mills rm ON mp.mill_id = rm.id
      JOIN rice_types rt ON mp.rice_type_id = rt.id
      WHERE mp.id = ?
    `, [id]);

    conn.release();

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace listing not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Marketplace listing retrieved successfully',
      data: listings[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching marketplace listing',
      error: error.message
    });
  }
};

// Add new marketplace listing (admin only)
export const addListing = async (req, res) => {
  try {
    const {
      mill_id,
      rice_type_id,
      title,
      price_per_kg,
      available_kg,
      min_order_kg,
      max_order_kg,
      description,
      delivery_time
    } = req.body;

    // Validate required fields
    if (!mill_id || !rice_type_id || !price_per_kg || !available_kg) {
      return res.status(400).json({
        success: false,
        message: 'Mill ID, rice type ID, price per kg, and available kg are required'
      });
    }

    // Handle file upload
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/marketplace/${req.file.filename}`;
    }

    const conn = await pool.getConnection();

    // Verify mill and rice type exist
    const [mills] = await conn.query('SELECT id FROM rice_mills WHERE id = ?', [mill_id]);
    if (mills.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: 'Invalid mill ID'
      });
    }

    const [riceTypes] = await conn.query('SELECT id FROM rice_types WHERE id = ?', [rice_type_id]);
    if (riceTypes.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: 'Invalid rice type ID'
      });
    }

    // Insert new listing
    const [result] = await conn.query(`
      INSERT INTO rice_marketplace (
        mill_id, rice_type_id, title, price_per_kg, available_kg,
        min_order_kg, max_order_kg, description, image_url, delivery_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      mill_id, rice_type_id, title || null, price_per_kg, available_kg,
      min_order_kg || 1, max_order_kg || 1000, description || null,
      image_url, delivery_time || '1-3 days'
    ]);

    // Get the created listing
    const [newListing] = await conn.query(`
      SELECT
        mp.*,
        rm.mill_name,
        rm.location as mill_location,
        rt.type_name
      FROM rice_marketplace mp
      JOIN rice_mills rm ON mp.mill_id = rm.id
      JOIN rice_types rt ON mp.rice_type_id = rt.id
      WHERE mp.id = ?
    `, [result.insertId]);

    conn.release();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Marketplace listing created successfully',
      data: newListing[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error creating marketplace listing',
      error: error.message
    });
  }
};

// Update marketplace listing (admin only)
export const updateListing = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title,
      price_per_kg,
      available_kg,
      min_order_kg,
      max_order_kg,
      description,
      status,
      delivery_time
    } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID'
      });
    }

    const conn = await pool.getConnection();

    // Check if listing exists
    const [existing] = await conn.query('SELECT id FROM rice_marketplace WHERE id = ?', [id]);
    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        message: 'Marketplace listing not found'
      });
    }

    // Handle file upload
    let image_url = undefined;
    if (req.file) {
      image_url = `/uploads/marketplace/${req.file.filename}`;
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (price_per_kg !== undefined) {
      updates.push('price_per_kg = ?');
      values.push(price_per_kg);
    }
    if (available_kg !== undefined) {
      updates.push('available_kg = ?');
      values.push(available_kg);
    }
    if (min_order_kg !== undefined) {
      updates.push('min_order_kg = ?');
      values.push(min_order_kg);
    }
    if (max_order_kg !== undefined) {
      updates.push('max_order_kg = ?');
      values.push(max_order_kg);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (delivery_time !== undefined) {
      updates.push('delivery_time = ?');
      values.push(delivery_time);
    }
    if (image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(image_url);
    }

    if (updates.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    // Execute update
    await conn.query(
      `UPDATE rice_marketplace SET ${updates.join(', ')} WHERE id = ?`,
      [...values, id]
    );

    // Get updated listing
    const [updatedListing] = await conn.query(`
      SELECT
        mp.*,
        rm.mill_name,
        rm.location as mill_location,
        rt.type_name
      FROM rice_marketplace mp
      JOIN rice_mills rm ON mp.mill_id = rm.id
      JOIN rice_types rt ON mp.rice_type_id = rt.id
      WHERE mp.id = ?
    `, [id]);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Marketplace listing updated successfully',
      data: updatedListing[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating marketplace listing',
      error: error.message
    });
  }
};

// Delete marketplace listing (admin only)
export const deleteListing = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID'
      });
    }

    const conn = await pool.getConnection();

    // Check if listing exists
    const [existing] = await conn.query('SELECT id FROM rice_marketplace WHERE id = ?', [id]);
    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        message: 'Marketplace listing not found'
      });
    }

    // Delete the listing
    await conn.query('DELETE FROM rice_marketplace WHERE id = ?', [id]);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Marketplace listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error deleting marketplace listing',
      error: error.message
    });
  }
};