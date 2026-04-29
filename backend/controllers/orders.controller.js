/**
 * Marketplace Orders Controller - Handles rice marketplace orders
 * Manages rice_orders table operations
 */

import pool from '../config/db.js';

// Get all rice orders
export const getAllOrders = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [orders] = await conn.query(`
      SELECT 
        ro.*,
        rt.type_name,
        rm.mill_name,
        rm.location as mill_location
      FROM rice_orders ro
      LEFT JOIN rice_types rt ON ro.rice_type = rt.type_name
      LEFT JOIN rice_mills rm ON ro.mill_id = rm.id
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

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid order ID'
      });
    }

    const conn = await pool.getConnection();

    const [orders] = await conn.query(`
      SELECT 
        ro.*,
        rt.type_name,
        rm.mill_name,
        rm.location as mill_location
      FROM rice_orders ro
      LEFT JOIN rice_types rt ON ro.rice_type = rt.type_name
      LEFT JOIN rice_mills rm ON ro.mill_id = rm.id
      WHERE ro.id = ?
    `, [id]);

    conn.release();

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Order retrieved successfully',
      data: orders[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Create new rice order
export const createOrder = async (req, res) => {
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

// Update order status (admin only)
export const updateOrder = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid order ID'
      });
    }

    const { status } = req.body;

    // Validate status if provided
    const validStatuses = ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const conn = await pool.getConnection();

    // Check if order exists
    const [existing] = await conn.query('SELECT * FROM rice_orders WHERE id = ?', [id]);

    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Order not found'
      });
    }

    // Update status if provided
    if (status) {
      await conn.query('UPDATE rice_orders SET status = ? WHERE id = ?', [status.toLowerCase(), id]);
    }

    // Retrieve updated order
    const [updated] = await conn.query(`
      SELECT 
        ro.*,
        rt.type_name,
        rm.mill_name,
        rm.location as mill_location
      FROM rice_orders ro
      LEFT JOIN rice_types rt ON ro.rice_type = rt.type_name
      LEFT JOIN rice_mills rm ON ro.mill_id = rm.id
      WHERE ro.id = ?
    `, [id]);

    conn.release();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Order updated successfully',
      data: updated[0]
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

// Delete order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid order ID'
      });
    }

    const conn = await pool.getConnection();

    // Check if order exists
    const [existing] = await conn.query('SELECT * FROM rice_orders WHERE id = ?', [id]);

    if (existing.length === 0) {
      conn.release();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Order not found'
      });
    }

    // Delete the order
    await conn.query('DELETE FROM rice_orders WHERE id = ?', [id]);

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
