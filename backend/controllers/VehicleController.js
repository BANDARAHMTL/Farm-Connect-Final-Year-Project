/**
 * VehicleController - Handles all vehicle/equipment operations
 * Extends base Controller for CRUD + custom vehicle methods
 */

import Controller from './Controller.js';
import Vehicle from '../models/Vehicle.js';
import pool from '../config/db.js';

class VehicleController extends Controller {
  constructor() {
    super(Vehicle);
  }

  // ──────────── CUSTOM VEHICLE METHODS ──────────────────────────

  // Find by type
  findByType(vehicleType) {
    if (!vehicleType || vehicleType.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Vehicle type required'
      };
    }

    const vehicles = this.data.filter(
      v => v.vehicle_type && v.vehicle_type.toLowerCase() === vehicleType.toLowerCase()
    );

    if (vehicles.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No vehicles found of this type'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${vehicles.length} vehicle(s)`,
      data: vehicles
    };
  }

  // Find available vehicles
  getAvailableVehicles() {
    const available = this.data.filter(v => v.status === 'available');

    return {
      success: true,
      statusCode: 200,
      message: `Found ${available.length} available vehicle(s)`,
      data: available
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

    const vehicles = this.data.filter(
      v => v.location && v.location.toLowerCase().includes(location.toLowerCase())
    );

    if (vehicles.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No vehicles found in this location'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${vehicles.length} vehicle(s)`,
      data: vehicles
    };
  }

  // Find by price range
  findByPriceRange(minPrice, maxPrice) {
    const vehicles = this.data.filter(
      v => v.price_per_acre >= minPrice && v.price_per_acre <= maxPrice
    );

    if (vehicles.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No vehicles found in this price range'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${vehicles.length} vehicle(s)`,
      data: vehicles
    };
  }

  // Mark vehicle as booked
  markBooked(id) {
    const result = this.getById(id);
    if (!result.success) return result;

    const vehicle = result.data;
    vehicle.status = 'booked';

    return {
      success: true,
      statusCode: 200,
      message: 'Vehicle marked as booked',
      data: vehicle
    };
  }

  // Mark vehicle as available
  markAvailable(id) {
    const result = this.getById(id);
    if (!result.success) return result;

    const vehicle = result.data;
    vehicle.status = 'available';

    return {
      success: true,
      statusCode: 200,
      message: 'Vehicle marked as available',
      data: vehicle
    };
  }

  // Mark for maintenance
  markMaintenance(id) {
    const result = this.getById(id);
    if (!result.success) return result;

    const vehicle = result.data;
    vehicle.status = 'maintenance';

    return {
      success: true,
      statusCode: 200,
      message: 'Vehicle marked for maintenance',
      data: vehicle
    };
  }

  // Get top rated vehicles
  getTopRated(count = 5) {
    const sorted = this.data
      .slice()
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, count);

    return {
      success: true,
      statusCode: 200,
      message: `Retrieved top ${count} vehicles`,
      data: sorted
    };
  }

  // Get statistics
  getStatistics() {
    const total = this.getCount();
    const available = this.data.filter(v => v.status === 'available').length;
    const booked = this.data.filter(v => v.status === 'booked').length;
    const maintenance = this.data.filter(v => v.status === 'maintenance').length;

    const typeDistribution = {};
    this.data.forEach(v => {
      const type = v.vehicle_type || 'unknown';
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });

    const avgPrice = total === 0 ? 0 : 
      (this.data.reduce((sum, v) => sum + (v.price_per_acre || 0), 0) / total).toFixed(2);

    return {
      success: true,
      statusCode: 200,
      message: 'Statistics retrieved',
      data: {
        totalVehicles: total,
        availableCount: available,
        bookedCount: booked,
        maintenanceCount: maintenance,
        availabilityPercentage: total === 0 ? '0%' : `${((available / total) * 100).toFixed(2)}%`,
        typeDistribution,
        averagePricePerAcre: avgPrice
      }
    };
  }

  // Search by vehicle number or model
  search(searchTerm) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Search term required'
      };
    }

    const term = searchTerm.toLowerCase();
    const results = this.data.filter(v =>
      (v.vehicle_number && v.vehicle_number.toLowerCase().includes(term)) ||
      (v.model && v.model.toLowerCase().includes(term)) ||
      (v.vehicle_type && v.vehicle_type.toLowerCase().includes(term))
    );

    if (results.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: 'No vehicles found matching search'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: `Found ${results.length} vehicle(s)`,
      data: results
    };
  }
}

// Create instance for handler functions
const vehicleController = new VehicleController();

// Export handler functions for routes
export const listVehicles = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [vehicles] = await conn.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    conn.release();
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Found ${vehicles.length} vehicle(s)`,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const conn = await pool.getConnection();
    const [vehicles] = await conn.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    conn.release();
    
    if (vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Vehicle not found'
      });
    }
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Vehicle found',
      data: vehicles[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error fetching vehicle',
      error: error.message
    });
  }
};

export const addVehicle = async (req, res) => {
  try {
    const { vehicleNumber, vehicleType, model, capacity, status, ownerName, ownerMobile, regNumber, rating, reviews, location, pricePerAcre } = req.body;
    const imageUrl = req.file ? `/uploads/vehicles/${req.file.filename}` : null;
    
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `INSERT INTO vehicles (vehicle_number, vehicle_type, model, capacity, status, owner_name, owner_mobile, reg_number, rating, reviews, location, price_per_acre, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [vehicleNumber, vehicleType, model, capacity, status, ownerName, ownerMobile, regNumber, rating || 0, reviews || 0, location, pricePerAcre, imageUrl]
    );
    
    const [newVehicle] = await conn.query('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);
    conn.release();
    
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Vehicle added successfully',
      data: newVehicle[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error adding vehicle',
      error: error.message
    });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { vehicleNumber, vehicleType, model, capacity, status, ownerName, ownerMobile, regNumber, rating, reviews, location, pricePerAcre } = req.body;
    const imageUrl = req.file ? `/uploads/vehicles/${req.file.filename}` : undefined;
    
    const conn = await pool.getConnection();
    
    // Build update query
    let updateFields = [];
    let updateValues = [];
    
    if (vehicleNumber) { updateFields.push('vehicle_number = ?'); updateValues.push(vehicleNumber); }
    if (vehicleType) { updateFields.push('vehicle_type = ?'); updateValues.push(vehicleType); }
    if (model) { updateFields.push('model = ?'); updateValues.push(model); }
    if (capacity) { updateFields.push('capacity = ?'); updateValues.push(capacity); }
    if (status) { updateFields.push('status = ?'); updateValues.push(status); }
    if (ownerName) { updateFields.push('owner_name = ?'); updateValues.push(ownerName); }
    if (ownerMobile) { updateFields.push('owner_mobile = ?'); updateValues.push(ownerMobile); }
    if (regNumber) { updateFields.push('reg_number = ?'); updateValues.push(regNumber); }
    if (rating) { updateFields.push('rating = ?'); updateValues.push(rating); }
    if (reviews) { updateFields.push('reviews = ?'); updateValues.push(reviews); }
    if (location) { updateFields.push('location = ?'); updateValues.push(location); }
    if (pricePerAcre) { updateFields.push('price_per_acre = ?'); updateValues.push(pricePerAcre); }
    if (imageUrl) { updateFields.push('image_url = ?'); updateValues.push(imageUrl); }
    
    if (updateFields.length === 0) {
      conn.release();
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'No fields to update'
      });
    }
    
    updateValues.push(id);
    const query = `UPDATE vehicles SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await conn.query(query, updateValues);
    const [updatedVehicle] = await conn.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    conn.release();
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Vehicle updated successfully',
      data: updatedVehicle[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error updating vehicle',
      error: error.message
    });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM vehicles WHERE id = ?', [id]);
    conn.release();
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error deleting vehicle',
      error: error.message
    });
  }
};

// Export controller class
export default VehicleController;
