/**
 * ═══════════════════════════════════════════════════════════════
 * BOOKING CONTROLLER
 * ═══════════════════════════════════════════════════════════════
 * 
 * Handles all booking-related operations.
 * Manages booking status transitions and duration calculations.
 */

import Controller from './Controller.js';
import Booking from '../models/Booking.js';
import pool from '../config/db.js';

class BookingController extends Controller {
  /**
   * Constructor - Initialize BookingController
   */
  constructor() {
    super(Booking);
  }

  // ═══════════════════════════════════════════════════════════
  // CUSTOM BUSINESS LOGIC METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * Get bookings by status
   * @param {String} status - Booking status
   * @returns {Object} Response object
   */
  getByStatus(status) {
    try {
      const bookings = this.data.filter(item => item.status === status);

      return {
        success: true,
        statusCode: 200,
        message: `Found ${bookings.length} ${status} bookings`,
        data: bookings,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving bookings by status',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get bookings by user
   * @param {Number} userId - User ID
   * @returns {Object} Response object
   */
  getByUser(userId) {
    try {
      const userBookings = this.data.filter(item => item.userId === parseInt(userId, 10));

      return {
        success: true,
        statusCode: 200,
        message: `Found ${userBookings.length} bookings for user ${userId}`,
        data: userBookings,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving user bookings',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get active bookings only
   * @returns {Object} Response object
   */
  getActiveBookings() {
    try {
      const activeBookings = this.data.filter(item =>
        item.status === 'pending' || item.status === 'confirmed'
      );

      return {
        success: true,
        statusCode: 200,
        message: `Found ${activeBookings.length} active bookings`,
        data: activeBookings,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving active bookings',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Confirm a booking (pending -> confirmed)
   * @param {Number} id - Booking ID
   * @returns {Object} Response object
   */
  confirmBooking(id) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      const booking = new Booking(response.data);

      // Confirm booking
      if (!booking.confirm()) {
        return {
          success: false,
          statusCode: 400,
          message: 'Cannot confirm booking',
          errors: booking.getErrors(),
          timestamp: new Date().toISOString()
        };
      }

      // Update in controller
      return this.update(id, booking.getData());
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error confirming booking',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Complete a booking (confirmed -> completed)
   * @param {Number} id - Booking ID
   * @returns {Object} Response object
   */
  completeBooking(id) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      const booking = new Booking(response.data);

      // Complete booking
      if (!booking.complete()) {
        return {
          success: false,
          statusCode: 400,
          message: 'Cannot complete booking',
          errors: booking.getErrors(),
          timestamp: new Date().toISOString()
        };
      }

      // Update in controller
      return this.update(id, booking.getData());
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error completing booking',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Cancel a booking
   * @param {Number} id - Booking ID
   * @returns {Object} Response object
   */
  cancelBooking(id) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      const booking = new Booking(response.data);

      // Cancel booking
      if (!booking.cancel()) {
        return {
          success: false,
          statusCode: 400,
          message: 'Cannot cancel booking',
          errors: booking.getErrors(),
          timestamp: new Date().toISOString()
        };
      }

      // Update in controller
      return this.update(id, booking.getData());
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error cancelling booking',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get bookings in a date range
   * @param {Date|String} startDate - Start date
   * @param {Date|String} endDate - End date
   * @returns {Object} Response object
   */
  getByDateRange(startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const bookings = this.data.filter(item => {
        const itemStart = new Date(item.startDate);
        return itemStart >= start && itemStart <= end;
      });

      return {
        success: true,
        statusCode: 200,
        message: `Found ${bookings.length} bookings between ${startDate} and ${endDate}`,
        data: bookings,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving bookings by date range',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get booking statistics
   * @returns {Object} Response object
   */
  getBookingStats() {
    try {
      const totalBookings = this.getCount();
      const pendingCount = this.data.filter(b => b.status === 'pending').length;
      const confirmedCount = this.data.filter(b => b.status === 'confirmed').length;
      const completedCount = this.data.filter(b => b.status === 'completed').length;
      const cancelledCount = this.data.filter(b => b.status === 'cancelled').length;

      const totalRevenue = this.data
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const averageBookingValue = totalBookings > 0
        ? (this.data.reduce((sum, b) => sum + b.totalPrice, 0) / totalBookings).toFixed(2)
        : 0;

      const stats = {
        totalBookings,
        pendingCount,
        confirmedCount,
        completedCount,
        cancelledCount,
        completionRate: totalBookings > 0 ? ((completedCount / totalBookings) * 100).toFixed(2) + '%' : '0%',
        totalRevenue: `Rs. ${totalRevenue}`,
        averageBookingValue: `Rs. ${averageBookingValue}`
      };

      return {
        success: true,
        statusCode: 200,
        message: 'Booking statistics retrieved',
        data: stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving booking statistics',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get booking details with summary
   * @param {Number} id - Booking ID
   * @returns {Object} Response object
   */
  getBookingDetails(id) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      // Create booking instance to get summary
      const bookingInstance = new Booking(response.data);

      return {
        success: true,
        statusCode: 200,
        message: 'Booking details retrieved',
        data: {
          ...response.data,
          durationDays: bookingInstance.getDurationDays(),
          summary: bookingInstance.getSummary()
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving booking details',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create instance for handler functions
const bookingController = new BookingController();

// Export handler functions for routes
export const getAllBookings = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [bookings] = await conn.query(`
      SELECT 
        b.*,
        v.vehicle_number,
        v.vehicle_type as vehicle_type_full,
        v.model,
        v.capacity,
        v.status as vehicle_status,
        v.owner_name,
        v.owner_mobile,
        v.reg_number,
        v.rating,
        v.reviews,
        v.location as vehicle_location,
        v.price_per_acre as vehicle_price_per_acre,
        v.image_url as vehicle_image_url
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.created_at DESC
    `);
    conn.release();
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${bookings.length} booking(s)`,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { vehicleId, vehicleTitle, vehicleType, pricePerAcre, farmerId, farmerName, farmerRefId, sessionIndex, sessionLabel, bookingDate, address, areaAcres, paymentMethod, totalPrice, status } = req.body;
    
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `INSERT INTO bookings (vehicle_id, vehicle_title, vehicle_type, price_per_acre, farmer_id, farmer_name, farmer_ref_id, session_index, session_label, booking_date, address, area_acres, payment_method, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [vehicleId, vehicleTitle, vehicleType, pricePerAcre, farmerId, farmerName, farmerRefId, sessionIndex, sessionLabel, bookingDate, address, areaAcres, paymentMethod, totalPrice, status || 'pending']
    );
    
    const [newBooking] = await conn.query(`
      SELECT 
        b.*,
        v.vehicle_number,
        v.vehicle_type as vehicle_type_full,
        v.model,
        v.capacity,
        v.status as vehicle_status,
        v.owner_name,
        v.owner_mobile,
        v.reg_number,
        v.rating,
        v.reviews,
        v.location as vehicle_location,
        v.price_per_acre as vehicle_price_per_acre,
        v.image_url as vehicle_image_url
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.id = ?
    `, [result.insertId]);
    conn.release();
    
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Booking created successfully',
      data: newBooking[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    const conn = await pool.getConnection();
    await conn.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    const [updatedBooking] = await conn.query(`
      SELECT 
        b.*,
        v.vehicle_number,
        v.vehicle_type as vehicle_type_full,
        v.model,
        v.capacity,
        v.status as vehicle_status,
        v.owner_name,
        v.owner_mobile,
        v.reg_number,
        v.rating,
        v.reviews,
        v.location as vehicle_location,
        v.price_per_acre as vehicle_price_per_acre,
        v.image_url as vehicle_image_url
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.id = ?
    `, [id]);
    conn.release();
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Booking status updated successfully',
      data: updatedBooking[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { sessionIndex, sessionLabel, bookingDate, address, areaAcres, paymentMethod, totalPrice, status } = req.body;
    
    const conn = await pool.getConnection();
    
    let updateFields = [];
    let updateValues = [];
    
    if (sessionIndex !== undefined) { updateFields.push('session_index = ?'); updateValues.push(sessionIndex); }
    if (sessionLabel) { updateFields.push('session_label = ?'); updateValues.push(sessionLabel); }
    if (bookingDate) { updateFields.push('booking_date = ?'); updateValues.push(bookingDate); }
    if (address) { updateFields.push('address = ?'); updateValues.push(address); }
    if (areaAcres) { updateFields.push('area_acres = ?'); updateValues.push(areaAcres); }
    if (paymentMethod) { updateFields.push('payment_method = ?'); updateValues.push(paymentMethod); }
    if (totalPrice !== undefined) { updateFields.push('total_price = ?'); updateValues.push(totalPrice); }
    if (status) { updateFields.push('status = ?'); updateValues.push(status); }
    
    if (updateFields.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'No fields to update'
      });
    }
    
    updateValues.push(id);
    const query = `UPDATE bookings SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await conn.query(query, updateValues);
    const [updatedBooking] = await conn.query(`
      SELECT 
        b.*,
        v.vehicle_number,
        v.vehicle_type as vehicle_type_full,
        v.model,
        v.capacity,
        v.status as vehicle_status,
        v.owner_name,
        v.owner_mobile,
        v.reg_number,
        v.rating,
        v.reviews,
        v.location as vehicle_location,
        v.price_per_acre as vehicle_price_per_acre,
        v.image_url as vehicle_image_url
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.id = ?
    `, [id]);
    conn.release();
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Booking updated successfully',
      data: updatedBooking[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM bookings WHERE id = ?', [id]);
    conn.release();
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    const conn = await pool.getConnection();
    const [bookings] = await conn.query(`
      SELECT 
        b.*,
        v.vehicle_number,
        v.vehicle_type as vehicle_type_full,
        v.model,
        v.capacity,
        v.status as vehicle_status,
        v.owner_name,
        v.owner_mobile,
        v.reg_number,
        v.rating,
        v.reviews,
        v.location as vehicle_location,
        v.price_per_acre as vehicle_price_per_acre,
        v.image_url as vehicle_image_url
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.farmer_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);
    conn.release();
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${bookings.length} booking(s) for user ${userId}`,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching user bookings',
      error: error.message
    });
  }
};

// Export controller class
export default BookingController;
