// riceMillService.js — fetch real prices from backend
import api from "../api/api";

export async function getMills() {
  const res = await api.get("/rice-mills");
  return Array.isArray(res.data.data) ? res.data.data : [];
}

export async function getMillById(id) {
  const res = await api.get(`/rice-mills/${id}`);
  return res.data.data || res.data;
}

// Get real prices for a specific paddy type from database
// Fetches from rice_types table filtered by type_name
export async function getSellingPrices(paddyType) {
  try {
    // Get all rice types and filter by type_name
    const res = await api.get(`/rice-types`);
    const types = Array.isArray(res.data.data) ? res.data.data : [];
    
    // Filter by matching type name (case-insensitive)
    const matching = types.filter(t => 
      t.type_name && t.type_name.toLowerCase() === paddyType.toLowerCase()
    );
    
    // Map to compatible format
    return matching.map(t => ({
      millId: t.mill_id,
      millName: t.mill_name,
      location: t.location || "Unknown",
      contactNumber: t.contact_number || "",
      imageUrl: t.image_url || null,
      rating: t.rating || 0,
      pricePerKg: parseFloat(t.price_per_kg),
      stockKg: parseFloat(t.stock_kg),
    }));
  } catch {
    return [];
  }
}

// Build offers list using REAL prices from rice_types table
export async function getOffers(paddyType, stockKg) {
  const n = Number(stockKg) || 0;
  const prices = await getSellingPrices(paddyType);
  return {
    paddyType,
    stockKg: n,
    mills: prices.map(p => ({
      id:         p.millId,
      millId:     p.millId,
      name:       p.millName,
      millName:   p.millName,
      location:   p.location,
      contact:    p.contactNumber,
      imageUrl:   p.imageUrl,
      rating:     p.rating || 0,
      pricePerKg: p.pricePerKg,
      totalValue: Math.round(p.pricePerKg * n),
      stockKg:    p.stockKg,
    })),
  };
}

const riceMillService = { getMills, getMillById, getOffers, getSellingPrices };
export default riceMillService;
