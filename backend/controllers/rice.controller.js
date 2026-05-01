/**
 * Rice Controller - Handles rice marketplace listings and orders
 * Manages rice_marketplace and rice_orders table operations
 */

import pool from '../config/db.js';

// ═══════════════════════════════════════════════════════════════
// RICE MARKETPLACE LISTINGS
// ═══════════════════════════════════════════════════════════════

// Get all rice marketplace listings (public)
export const getRiceListings = async (req, res) => {
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

    // Convert to camelCase
    const convertedListings = listings.map(l => ({
      id: l.id,
      millId: l.mill_id,
      millName: l.mill_name,
      millLocation: l.mill_location,
      riceTypeId: l.rice_type_id,
      riceTypeName: l.type_name,
      pricePerKg: Number(l.rice_type_price),
      availableKg: Number(l.available_kg),
      imageUrl: l.image_url,
      status: l.status,
      createdAt: l.created_at
    }));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${convertedListings.length} rice listing(s)`,
      data: convertedListings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching rice listings',
      error: error.message
    });
  }
};

// Get selling prices for all rice types
export const getSellingPrices = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [prices] = await conn.query(`
      SELECT
        rt.id,
        rt.type_name,
        rt.price_per_kg,
        rm.mill_name,
        rm.id as mill_id
      FROM rice_types rt
      LEFT JOIN rice_mills rm ON rt.mill_id = rm.id
      WHERE rt.status = 'active'
      ORDER BY rt.type_name ASC
    `);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${prices.length} rice price(s)`,
      data: prices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching rice prices',
      error: error.message
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// RICE ORDERS
// ═══════════════════════════════════════════════════════════════

// Create new rice order
export const createRiceOrder = async (req, res) => {
  try {
    const {
      listingId,
      riceTypeName,
      millId,
      millName,
      customerName,
      mobileNumber,
      address,
      district,
      paymentMethod,
      deliveryOption,
      packageSize,
      quantity,
      pricePerKg,
      subtotal,
      deliveryFee,
      totalAmount
    } = req.body;

    // Validation
    if (!customerName || !mobileNumber || !address || !district || !paymentMethod || !riceTypeName || !totalAmount) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Missing required fields: customerName, mobileNumber, address, district, paymentMethod, riceTypeName, totalAmount'
      });
    }

    const conn = await pool.getConnection();

    // Verify marketplace listing exists (if provided)
    let marketplaceId = null;
    if (listingId) {
      const [listings] = await conn.query('SELECT id FROM rice_marketplace WHERE id = ?', [listingId]);
      if (listings.length > 0) {
        marketplaceId = listingId;
      }
    }

    // Verify rice mill exists (if provided)
    let millIdNum = null;
    if (millId) {
      const [mills] = await conn.query('SELECT id FROM rice_mills WHERE id = ?', [millId]);
      if (mills.length > 0) {
        millIdNum = millId;
      }
    }

    // Insert order
    const [result] = await conn.query(`
      INSERT INTO rice_orders (
        customer_name, mobile, address, rice_type, mill_id, mill_name,
        marketplace_id, weight_kg, quantity, total_price, payment_method,
        delivery_option, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      customerName,
      mobileNumber,
      address,
      riceTypeName,
      millIdNum,
      millName || 'Unknown',
      marketplaceId,
      packageSize || 5,
      quantity || 1,
      parseFloat(totalAmount),
      paymentMethod,
      deliveryOption || 'normal'
    ]);

    // Retrieve created order
    const [newOrder] = await conn.query(`
      SELECT 
        ro.*,
        rt.type_name,
        rm.mill_name,
        rm.location as mill_location
      FROM rice_orders ro
      LEFT JOIN rice_types rt ON ro.rice_type = rt.type_name
      LEFT JOIN rice_mills rm ON ro.mill_id = rm.id
      WHERE ro.id = ?
    `, [result.insertId]);

    conn.release();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Order created successfully',
      data: newOrder[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get all rice orders
export const getAllOrders = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [orders] = await conn.query(`
      SELECT 
        ro.id,
        ro.customer_name,
        ro.mobile,
        ro.address,
        ro.rice_type,
        ro.mill_id,
        ro.mill_name,
        ro.marketplace_id,
        ro.weight_kg,
        ro.quantity,
        ro.total_price,
        ro.payment_method,
        ro.delivery_option,
        ro.status,
        ro.created_at
      FROM rice_orders ro
      ORDER BY ro.created_at DESC
    `);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${orders.length} order(s)`,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Update rice order status
export const updateOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { 
      customerName, 
      mobile, 
      address, 
      riceType, 
      millId, 
      millName, 
      weightKg, 
      quantity, 
      totalPrice, 
      paymentMethod, 
      status 
    } = req.body;

    if (isNaN(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid order ID'
      });
    }

    const conn = await pool.getConnection();

    // Check if order exists
    const [existing] = await conn.query('SELECT id FROM rice_orders WHERE id = ?', [orderId]);
    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Order not found'
      });
    }

    // Build dynamic update query - only update provided fields
    const updates = [];
    const values = [];

    if (customerName !== undefined) { updates.push('customer_name = ?'); values.push(customerName); }
    if (mobile !== undefined) { updates.push('mobile = ?'); values.push(mobile); }
    if (address !== undefined) { updates.push('address = ?'); values.push(address); }
    if (riceType !== undefined) { updates.push('rice_type = ?'); values.push(riceType); }
    if (millId !== undefined) { updates.push('mill_id = ?'); values.push(millId); }
    if (millName !== undefined) { updates.push('mill_name = ?'); values.push(millName); }
    if (weightKg !== undefined) { updates.push('weight_kg = ?'); values.push(weightKg); }
    if (quantity !== undefined) { updates.push('quantity = ?'); values.push(quantity); }
    if (totalPrice !== undefined) { updates.push('total_price = ?'); values.push(totalPrice); }
    if (paymentMethod !== undefined) { updates.push('payment_method = ?'); values.push(paymentMethod); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }

    // Always update timestamp
    updates.push('updated_at = NOW()');

    values.push(orderId);

    if (updates.length === 1) {
      // Only updated_at, nothing to change
      conn.release();
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'No fields to update'
      });
    }

    // Update order
    await conn.query(`UPDATE rice_orders SET ${updates.join(', ')} WHERE id = ?`, values);

    // Retrieve updated order
    const [updatedOrder] = await conn.query(`
      SELECT 
        id,
        customer_name,
        mobile,
        address,
        rice_type,
        mill_id,
        mill_name,
        marketplace_id,
        weight_kg,
        quantity,
        total_price,
        payment_method,
        delivery_option,
        status,
        created_at,
        updated_at
      FROM rice_orders
      WHERE id = ?
    `, [orderId]);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Order updated successfully',
      data: updatedOrder[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// Delete rice order
export const deleteOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid order ID'
      });
    }

    const conn = await pool.getConnection();

    // Check if order exists
    const [existing] = await conn.query('SELECT id FROM rice_orders WHERE id = ?', [orderId]);
    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Order not found'
      });
    }

    // Delete order
    await conn.query('DELETE FROM rice_orders WHERE id = ?', [orderId]);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error deleting order',
      error: error.message
    });
  }
};
