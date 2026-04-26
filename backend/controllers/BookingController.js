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
export const getAllBookings = (req, res) => {
  const result = bookingController.getAll();
  res.status(result.statusCode).json(result);
};

export const createBooking = (req, res) => {
  const result = bookingController.create(req.body);
  res.status(result.statusCode).json(result);
};

export const updateBookingStatus = (req, res) => {
  const id = parseInt(req.params.id);
  const result = bookingController.update(id, req.body);
  res.status(result.statusCode).json(result);
};

export const updateBooking = (req, res) => {
  const id = parseInt(req.params.id);
  const result = bookingController.update(id, req.body);
  res.status(result.statusCode).json(result);
};

export const deleteBooking = (req, res) => {
  const id = parseInt(req.params.id);
  const result = bookingController.delete(id);
  res.status(result.statusCode).json(result);
};

export const getUserBookings = (req, res) => {
  const result = bookingController.getAll();
  res.status(result.statusCode).json(result);
};

// Export controller class
export default BookingController;
