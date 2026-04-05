// riceMillService.js — pure API, NO static fallback
import api from "../api/api";

export async function getMills() {
  const res = await api.get("/rices");
  return Array.isArray(res.data) ? res.data : [];
}

export async function getMillById(id) {
  const res = await api.get(`/rices/${id}`);
  return res.data;
}

// Get real prices for a specific paddy type from database
// Returns array of { millId, millName, location, typeName, pricePerKg, stockKg }
export async function getSellingPrices(paddyType) {
  try {
    const res = await api.get(`/rice/selling-prices?type=${encodeURIComponent(paddyType)}`);
    return Array.isArray(res.data) ? res.data : [];
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
      contact:    p.contactNumber || "",
      imageUrl:   p.imageUrl || null,
      rating:     p.rating || 0,
      pricePerKg: p.pricePerKg,
      totalValue: Math.round(p.pricePerKg * n),
      stockKg:    p.stockKg,
    })),
  };
}

const riceMillService = { getMills, getMillById, getOffers, getSellingPrices };
export default riceMillService;
