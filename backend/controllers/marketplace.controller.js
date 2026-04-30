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

// Convert snake_case database fields to camelCase
const convertSnakeToCamelCase = (obj) => {
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    converted[camelKey] = value;
  }
  return converted;
};

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

    // Convert to camelCase and rename specific fields
    const convertedListings = listings.map(l => {
      const converted = convertSnakeToCamelCase(l);
      // Rename joined fields for consistency
      if (converted.millName) converted.millName = l.mill_name;
      if (converted.typeName) converted.riceTypeName = l.type_name;
      if (converted.pricePerKg) converted.pricePerKg = Number(l.price_per_kg);
      if (converted.availableKg) converted.availableKg = Number(l.available_kg);
      return converted;
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${convertedListings.length} marketplace listing(s)`,
      data: convertedListings
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

    // Convert to camelCase and rename specific fields
    const convertedListings = listings.map(l => {
      const converted = convertSnakeToCamelCase(l);
      // Rename joined fields for consistency
      if (converted.millName) converted.millName = l.mill_name;
      if (converted.typeName) converted.riceTypeName = l.type_name;
      if (converted.pricePerKg) converted.pricePerKg = Number(l.price_per_kg);
      if (converted.availableKg) converted.availableKg = Number(l.available_kg);
      if (converted.minOrderKg) converted.minOrderKg = Number(l.min_order_kg);
      if (converted.maxOrderKg) converted.maxOrderKg = Number(l.max_order_kg);
      return converted;
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${convertedListings.length} marketplace listing(s)`,
      data: convertedListings
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

    // Convert to camelCase and rename specific fields
    const listing = listings[0];
    const converted = convertSnakeToCamelCase(listing);
    converted.millName = listing.mill_name;
    converted.riceTypeName = listing.type_name;
    converted.pricePerKg = Number(listing.price_per_kg);
    converted.availableKg = Number(listing.available_kg);
    converted.minOrderKg = Number(listing.min_order_kg);
    converted.maxOrderKg = Number(listing.max_order_kg);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Marketplace listing retrieved successfully',
      data: converted
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
    // Handle both camelCase and snake_case field names from frontend
    const {
      millId, mill_id,
      riceTypeId, rice_type_id,
      title,
      pricePerKg, price_per_kg,
      availableKg, available_kg,
      minOrderKg, min_order_kg,
      maxOrderKg, max_order_kg,
      description,
      deliveryTime, delivery_time
    } = req.body;

    // Use camelCase or snake_case whichever is provided
    const finalMillId = millId || mill_id;
    const finalRiceTypeId = riceTypeId || rice_type_id;
    const finalPrice = pricePerKg || price_per_kg;
    const finalAvailable = availableKg || available_kg;
    const finalMinOrder = minOrderKg || min_order_kg;
    const finalMaxOrder = maxOrderKg || max_order_kg;
    const finalDeliveryTime = deliveryTime || delivery_time;

    // Validate required fields
    if (!finalMillId || !finalRiceTypeId || !finalPrice || finalAvailable === undefined) {
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
    const [mills] = await conn.query('SELECT id FROM rice_mills WHERE id = ?', [finalMillId]);
    if (mills.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: 'Invalid mill ID'
      });
    }

    const [riceTypes] = await conn.query('SELECT id FROM rice_types WHERE id = ?', [finalRiceTypeId]);
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
      finalMillId, finalRiceTypeId, title || null, finalPrice, finalAvailable,
      finalMinOrder || 1, finalMaxOrder || 1000, description || null,
      image_url, finalDeliveryTime || '1-3 days'
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

    // Convert to camelCase
    const listing = newListing[0];
    const converted = convertSnakeToCamelCase(listing);
    converted.millName = listing.mill_name;
    converted.riceTypeName = listing.type_name;
    converted.pricePerKg = Number(listing.price_per_kg);
    converted.availableKg = Number(listing.available_kg);
    converted.minOrderKg = Number(listing.min_order_kg);
    converted.maxOrderKg = Number(listing.max_order_kg);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Marketplace listing created successfully',
      data: converted
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
      pricePerKg, price_per_kg,
      availableKg, available_kg,
      minOrderKg, min_order_kg,
      maxOrderKg, max_order_kg,
      description,
      status,
      deliveryTime, delivery_time
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

    // Build update query dynamically - handle both camelCase and snake_case
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    const finalPrice = pricePerKg || price_per_kg;
    if (finalPrice !== undefined) {
      updates.push('price_per_kg = ?');
      values.push(finalPrice);
    }
    const finalAvailable = availableKg || available_kg;
    if (finalAvailable !== undefined) {
      updates.push('available_kg = ?');
      values.push(finalAvailable);
    }
    const finalMinOrder = minOrderKg || min_order_kg;
    if (finalMinOrder !== undefined) {
      updates.push('min_order_kg = ?');
      values.push(finalMinOrder);
    }
    const finalMaxOrder = maxOrderKg || max_order_kg;
    if (finalMaxOrder !== undefined) {
      updates.push('max_order_kg = ?');
      values.push(finalMaxOrder);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    const finalDeliveryTime = deliveryTime || delivery_time;
    if (finalDeliveryTime !== undefined) {
      updates.push('delivery_time = ?');
      values.push(finalDeliveryTime);
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

    // Convert to camelCase
    const listing = updatedListing[0];
    const converted = convertSnakeToCamelCase(listing);
    converted.millName = listing.mill_name;
    converted.riceTypeName = listing.type_name;
    converted.pricePerKg = Number(listing.price_per_kg);
    converted.availableKg = Number(listing.available_kg);
    converted.minOrderKg = Number(listing.min_order_kg);
    converted.maxOrderKg = Number(listing.max_order_kg);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Marketplace listing updated successfully',
      data: converted
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