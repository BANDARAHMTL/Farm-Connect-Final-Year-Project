/**
 * ═══════════════════════════════════════════════════════════════
 * PRODUCT CONTROLLER
 * ═══════════════════════════════════════════════════════════════
 * 
 * Handles all product-related operations.
 * Includes inventory management and price calculations.
 */

import Controller from './Controller.js';
import Product from '../models/Product.js';

class ProductController extends Controller {
  /**
   * Constructor - Initialize ProductController
   */
  constructor() {
    super(Product);
  }

  // ═══════════════════════════════════════════════════════════
  // CUSTOM BUSINESS LOGIC METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * Find products by category
   * @param {String} category - Product category
   * @returns {Object} Response object
   */
  findByCategory(category) {
    try {
      const products = this.data.filter(item => item.category === category);

      return {
        success: true,
        statusCode: 200,
        message: `Found ${products.length} products in ${category} category`,
        data: products,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error finding products by category',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get products in stock (available)
   * @returns {Object} Response object
   */
  getInStock() {
    try {
      const inStockProducts = this.data.filter(item => item.isAvailable === true);

      return {
        success: true,
        statusCode: 200,
        message: `Found ${inStockProducts.length} products in stock`,
        data: inStockProducts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving in-stock products',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get out of stock products
   * @returns {Object} Response object
   */
  getOutOfStock() {
    try {
      const outOfStockProducts = this.data.filter(item => item.isAvailable === false);

      return {
        success: true,
        statusCode: 200,
        message: `Found ${outOfStockProducts.length} out-of-stock products`,
        data: outOfStockProducts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving out-of-stock products',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Find products by price range
   * @param {Number} minPrice - Minimum price
   * @param {Number} maxPrice - Maximum price
   * @returns {Object} Response object
   */
  findByPriceRange(minPrice, maxPrice) {
    try {
      const products = this.data.filter(
        item => item.price >= minPrice && item.price <= maxPrice
      );

      return {
        success: true,
        statusCode: 200,
        message: `Found ${products.length} products between Rs.${minPrice} and Rs.${maxPrice}`,
        data: products,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error finding products by price range',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Update product stock after sale
   * @param {Number} id - Product ID
   * @param {Number} quantity - Quantity sold
   * @returns {Object} Response object
   */
  sellProduct(id, quantity) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      const product = new Product(response.data);

      // Decrease stock
      if (!product.decreaseStock(quantity)) {
        return {
          success: false,
          statusCode: 400,
          message: 'Cannot sell product',
          errors: product.getErrors(),
          timestamp: new Date().toISOString()
        };
      }

      // Update in controller
      return this.update(id, product.getData());
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error selling product',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Restock product
   * @param {Number} id - Product ID
   * @param {Number} quantity - Quantity to add
   * @returns {Object} Response object
   */
  restockProduct(id, quantity) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      const product = new Product(response.data);

      // Increase stock
      if (!product.increaseStock(quantity)) {
        return {
          success: false,
          statusCode: 400,
          message: 'Cannot restock product',
          errors: product.getErrors(),
          timestamp: new Date().toISOString()
        };
      }

      // Update in controller
      return this.update(id, product.getData());
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error restocking product',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Search products by name
   * @param {String} searchTerm - Name to search
   * @returns {Object} Response object
   */
  searchByName(searchTerm) {
    try {
      const results = this.data.filter(item =>
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        success: true,
        statusCode: 200,
        message: `Found ${results.length} products matching "${searchTerm}"`,
        data: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error searching products',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get top rated products
   * @param {Number} limit - Number of products to return
   * @returns {Object} Response object
   */
  getTopRated(limit = 5) {
    try {
      const topProducts = this.data
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);

      return {
        success: true,
        statusCode: 200,
        message: `Retrieved top ${limit} rated products`,
        data: topProducts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving top rated products',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get inventory statistics
   * @returns {Object} Response object
   */
  getInventoryStats() {
    try {
      const totalProducts = this.getCount();
      const inStockCount = this.data.filter(p => p.isAvailable).length;
      const outOfStockCount = totalProducts - inStockCount;
      const totalInventoryValue = this.data.reduce(
        (sum, p) => sum + (p.price * p.stock), 0
      );
      const averagePrice = totalProducts > 0
        ? (this.data.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(2)
        : 0;

      const stats = {
        totalProducts,
        inStockCount,
        outOfStockCount,
        totalInventoryValue: `Rs. ${totalInventoryValue}`,
        averagePrice: `Rs. ${averagePrice}`,
        availabilityPercentage: totalProducts > 0
          ? ((inStockCount / totalProducts) * 100).toFixed(2) + '%'
          : '0%'
      };

      return {
        success: true,
        statusCode: 200,
        message: 'Inventory statistics retrieved',
        data: stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving inventory statistics',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get product details with summary
   * @param {Number} id - Product ID
   * @returns {Object} Response object
   */
  getProductDetails(id) {
    try {
      const response = this.getById(id);

      if (!response.success) {
        return response;
      }

      // Create product instance to get summary
      const productInstance = new Product(response.data);

      return {
        success: true,
        statusCode: 200,
        message: 'Product details retrieved',
        data: {
          ...response.data,
          summary: productInstance.getSummary()
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error retrieving product details',
        errors: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create instance for handler functions
const productController = new ProductController();

// Export handler functions for routes
export const getProducts = (req, res) => {
  const result = productController.getAll();
  res.status(result.statusCode).json(result);
};

export const getProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const result = productController.getById(id);
  res.status(result.statusCode).json(result);
};

export const createProduct = (req, res) => {
  const result = productController.create(req.body);
  res.status(result.statusCode).json(result);
};

export const addProduct = (req, res) => {
  const result = productController.create(req.body);
  res.status(result.statusCode).json(result);
};

export const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const result = productController.update(id, req.body);
  res.status(result.statusCode).json(result);
};

export const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const result = productController.delete(id);
  res.status(result.statusCode).json(result);
};

// Export controller class
export default ProductController;
