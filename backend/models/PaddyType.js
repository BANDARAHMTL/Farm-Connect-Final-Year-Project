/**
 * PaddyType Model - Represents a type of paddy/raw rice
 * Extends base Model class with validation and paddy-specific methods
 */

import Model from './Model.js';

class PaddyType extends Model {
  constructor(data = {}) {
    super(data);
  }

  // ──────────── GETTERS ────────────────────────────────────────
  
  getTypeName() {
    return this.getProperty('type_name');
  }

  getDescription() {
    return this.getProperty('description');
  }

  getPrice() {
    return this.getProperty('price') || 0;
  }

  getCategory() {
    return this.getProperty('category') || 'regular';
  }

  getVariety() {
    return this.getProperty('variety') || 'unknown';
  }

  getCreatedAt() {
    return this.getProperty('created_at');
  }

  // Paddy-specific
  getMoistureContent() {
    return this.getProperty('moisture_content') || 'unknown';
  }

  getYieldPerAcre() {
    return this.getProperty('yield_per_acre') || 0;
  }

  getHarvestSeason() {
    return this.getProperty('harvest_season') || 'kharif';
  }

  // ──────────── SETTERS WITH VALIDATION ─────────────────────────

  setTypeName(name) {
    if (!name || name.trim().length < 2) {
      this.addError('type_name', 'Paddy type name must be at least 2 characters');
      return false;
    }

    this.setProperty('type_name', name.trim());
    return true;
  }

  setDescription(description) {
    if (description && description.trim().length > 0) {
      if (description.trim().length < 10) {
        this.addError('description', 'Description must be at least 10 characters');
        return false;
      }
      this.setProperty('description', description.trim());
    }

    return true;
  }

  setPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num) || num < 0) {
      this.addError('price', 'Price must be a positive number');
      return false;
    }

    this.setProperty('price', num);
    return true;
  }

  setCategory(category) {
    const validCategories = ['short-grain', 'long-grain', 'medium-grain', 'aromatic', 'glutinous'];
    if (!category || !validCategories.includes(category.toLowerCase())) {
      this.addError('category', `Category must be one of: ${validCategories.join(', ')}`);
      return false;
    }

    this.setProperty('category', category.toLowerCase());
    return true;
  }

  setVariety(variety) {
    const validVarieties = ['basmati', 'basmati-370', 'basmati-385', 'jasmine', 'arborio', 'bomba', 'carnaroli', 'other'];
    if (!variety || !validVarieties.includes(variety.toLowerCase())) {
      this.addError('variety', `Variety must be one of: ${validVarieties.join(', ')}`);
      return false;
    }

    this.setProperty('variety', variety.toLowerCase());
    return true;
  }

  setMoistureContent(moisture) {
    if (moisture && !/^\d+(\.\d{1,2})?%?$/.test(moisture)) {
      this.addError('moisture_content', 'Invalid moisture content format');
      return false;
    }

    this.setProperty('moisture_content', moisture);
    return true;
  }

  setYieldPerAcre(yield_) {
    const num = parseFloat(yield_);
    if (isNaN(num) || num < 0) {
      this.addError('yield_per_acre', 'Yield must be a non-negative number');
      return false;
    }

    this.setProperty('yield_per_acre', num);
    return true;
  }

  setHarvestSeason(season) {
    const validSeasons = ['kharif', 'rabi', 'summer', 'year-round'];
    if (!season || !validSeasons.includes(season.toLowerCase())) {
      this.addError('harvest_season', `Season must be one of: ${validSeasons.join(', ')}`);
      return false;
    }

    this.setProperty('harvest_season', season.toLowerCase());
    return true;
  }

  // ──────────── VALIDATION ─────────────────────────────────────

  validate() {
    this.clearErrors();

    if (!this.getTypeName()) {
      this.addError('type_name', 'Paddy type name is required');
    }

    if (!this.getCategory()) {
      this.addError('category', 'Category is required');
    }

    if (!this.getVariety()) {
      this.addError('variety', 'Variety is required');
    }

    return this.isValid();
  }

  // ──────────── HELPER METHODS ─────────────────────────────────

  getSummary() {
    return {
      type_name: this.getTypeName(),
      description: this.getDescription(),
      price: this.getPrice(),
      category: this.getCategory(),
      variety: this.getVariety(),
      moisture_content: this.getMoistureContent(),
      yield_per_acre: this.getYieldPerAcre(),
      harvest_season: this.getHarvestSeason(),
      created_at: this.getCreatedAt()
    };
  }

  // Get paddy quality grade
  getQualityGrade() {
    const moisture = parseFloat(this.getMoistureContent());
    if (isNaN(moisture)) return 'UNKNOWN';
    if (moisture < 12) return 'PREMIUM';
    if (moisture < 15) return 'GOOD';
    if (moisture < 18) return 'FAIR';
    return 'POOR';
  }

  // Estimate milling output (approximate)
  estimateMillingOutput(paddyQuantity) {
    // Typical milling output is 65-70% of paddy weight
    const qty = parseFloat(paddyQuantity);
    if (isNaN(qty)) return 0;
    return (qty * 0.67).toFixed(2); // 67% average
  }

  // Get suitable for variety
  getSuitableVariety() {
    return this.getVariety();
  }
}

export default PaddyType;
