// ═════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═════════════════════════════════════════════════════════════

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Today's date in ISO format
 */
export function getTodayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/**
 * Check if a specific vehicle session is booked
 * @param {Object} bookings - Booking data structure
 * @param {number} vehicleId - Vehicle ID
 * @param {string} dateISO - Date in ISO format
 * @param {number} sessionIdx - Session index
 * @returns {boolean} True if session is booked
 */
export function isSessionBooked(bookings, vehicleId, dateISO, sessionIdx) {
  return bookings[vehicleId]?.[dateISO]?.includes(sessionIdx) || false;
}

/**
 * Calculate statistics for display
 * @param {Array} items - Items to calculate stats for
 * @returns {Object} Stats object
 */
export function calculateStats(items, icon, label, subLabel) {
  return {
    icon,
    value: `${items}`,
    label: subLabel,
  };
}
