/**
 * VehicleController - Handles all vehicle/equipment operations
 * Extends base Controller for CRUD + custom vehicle methods
 */

const Controller = require('./Controller');
const Vehicle = require('../models/Vehicle');

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

module.exports = VehicleController;
