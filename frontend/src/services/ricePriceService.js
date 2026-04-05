import api from "../api/api";

const STORAGE_KEY = "rice_prices_v1";

/*
 LocalStorage helper format:
 {
   [millId]: {
     [riceType]: { pricePerKg: number, enabled: boolean, lastUpdated: timestamp }
   }
 }
*/

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocal(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {}
}

export async function getPricesByMill(millId) {
  // try backend first
  try {
    const res = await api.get(`/mills/${encodeURIComponent(millId)}/prices`);
    if (res && Array.isArray(res.data)) {
      // normalize to map { riceType: { pricePerKg, enabled, lastUpdated } }
      const map = {};
      res.data.forEach((p) => {
        if (p && p.riceType) {
          map[p.riceType] = {
            pricePerKg: Number(p.pricePerKg) || 0,
            enabled: p.enabled !== false,
            lastUpdated: p.lastUpdated ? new Date(p.lastUpdated).getTime() : Date.now(),
          };
        }
      });
      return map;
    }
  } catch (err) {
    // ignore and fallback to local
    console.warn("getPricesByMill backend failed:", err?.message || err);
  }

  const local = readLocal();
  return local[millId] || {};
}

export async function getPrice(millId, riceType) {
  const prices = await getPricesByMill(millId);
  return prices[riceType] || null;
}

export async function createOrUpdatePrice(millId, riceType, pricePerKg, enabled = true) {
  const payload = { millId, riceType, pricePerKg: Number(pricePerKg) || 0, enabled: !!enabled, lastUpdated: new Date().toISOString() };

  // try backend
  try {
    // attempt PUT to update, fallback to POST
    const res = await api.put(`/mills/${encodeURIComponent(millId)}/prices/${encodeURIComponent(riceType)}`, payload).catch(() => null);
    if (res && res.data) return res.data;
    const res2 = await api.post(`/mills/${encodeURIComponent(millId)}/prices`, payload).catch(() => null);
    if (res2 && res2.data) return res2.data;
  } catch (err) {
    console.warn("createOrUpdatePrice backend failed:", err?.message || err);
  }

  // local fallback: persist to localStorage
  const all = readLocal();
  all[millId] = all[millId] || {};
  all[millId][riceType] = { pricePerKg: Number(payload.pricePerKg), enabled: payload.enabled, lastUpdated: Date.now() };
  writeLocal(all);
  return all[millId][riceType];
}

export async function deletePrice(millId, riceType) {
  try {
    await api.delete(`/mills/${encodeURIComponent(millId)}/prices/${encodeURIComponent(riceType)}`);
  } catch (err) {
    console.warn("deletePrice backend failed:", err?.message || err);
  }

  const all = readLocal();
  if (all[millId]) {
    delete all[millId][riceType];
    writeLocal(all);
  }
  return true;
}

const ricePriceService = { getPricesByMill, getPrice, createOrUpdatePrice, deletePrice };
export default ricePriceService;