import React, { useEffect, useState } from "react";
import { getAllRiceMills } from "../data/riceMills";
import ricePriceService from "../services/ricePriceService";

const PADDY_TYPES = [
  "Nadu",
  "Samba",
  "Kiri Samba",
  "Red Rice",
  "White Rice",
  "Suwandel",
  "Keeri Samba",
  "Raw Rice",
];

export default function RiceMillPriceManager() {
  const mills = getAllRiceMills();
  const [selectedMillId, setSelectedMillId] = useState(mills[0]?.id || "");
  const [prices, setPrices] = useState({}); // { riceType: { pricePerKg, enabled, lastUpdated } }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!selectedMillId) {
        setPrices({});
        return;
      }
      const map = await ricePriceService.getPricesByMill(selectedMillId);
      if (mounted) setPrices(map || {});
    })();
    return () => (mounted = false);
  }, [selectedMillId]);

  function onChangePrice(riceType, value) {
    setPrices((p) => ({ ...p, [riceType]: { ...(p[riceType] || {}), pricePerKg: value } }));
  }

  function onToggleEnabled(riceType) {
    setPrices((p) => ({ ...p, [riceType]: { ...(p[riceType] || {}), enabled: !(p[riceType]?.enabled ?? true) } }));
  }

  async function savePrice(riceType) {
    const entry = prices[riceType] || {};
    setSaving(true);
    try {
      await ricePriceService.createOrUpdatePrice(selectedMillId, riceType, Number(entry.pricePerKg) || 0, !!entry.enabled);
      const refreshed = await ricePriceService.getPricesByMill(selectedMillId);
      setPrices(refreshed || {});
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="price-manager-page">
      <h2>Rice Mill Price Manager</h2>

      <div className="field">
        <label>Select Mill</label>
        <select value={selectedMillId} onChange={(e) => setSelectedMillId(e.target.value)}>
          {mills.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} — {m.location}
            </option>
          ))}
        </select>
      </div>

      <table className="price-table" style={{ width: "100%", marginTop: 12 }}>
        <thead>
          <tr>
            <th>Rice Type</th>
            <th>Price (Rs / kg)</th>
            <th>Buying Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {PADDY_TYPES.map((type) => {
            const e = prices[type] || { pricePerKg: "", enabled: true };
            return (
              <tr key={type}>
                <td>{type}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={e.pricePerKg ?? ""}
                    onChange={(ev) => onChangePrice(type, ev.target.value)}
                    style={{ width: 140 }}
                  />
                </td>
                <td>
                  <input type="checkbox" checked={!!e.enabled} onChange={() => onToggleEnabled(type)} />
                </td>
                <td>
                  <button className="btn" onClick={() => savePrice(type)} disabled={saving}>
                    Save
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <script>
        {`
          // (run in browser console) — adjust millId if different; common id is "mill-2"
          const KEY = "rice_prices_v1";
          const millId = "mill-2"; // verify in src/data/riceMills.js or the dropdown
          const riceType = "Samba";
          const price = 120;
          const all = JSON.parse(localStorage.getItem(KEY) || "{}");
          all[millId] = all[millId] || {};
          all[millId][riceType] = { pricePerKg: Number(price), enabled: true, lastUpdated: Date.now() };
          localStorage.setItem(KEY, JSON.stringify(all));
          console.log("Saved price locally:", all[millId][riceType]);
        `}
      </script>
    </div>
  );
}