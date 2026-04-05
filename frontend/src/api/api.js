import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── REQUEST: attach correct token ─────────────────────────
api.interceptors.request.use((config) => {
  const url         = config.url || "";
  const adminToken  = localStorage.getItem("admin_token");
  const farmerToken = localStorage.getItem("farmerToken");

  // Admin-only endpoints always get admin token
  const isAdminEndpoint =
    url.startsWith("/admin") ||
    url.includes("/marketplace/admin") ||
    url.includes("/marketplace") && (config.method === "post" || config.method === "put" || config.method === "delete") ||
    url.includes("/vehicles") && (config.method === "post" || config.method === "put" || config.method === "delete") ||
    url.includes("/rices") && (config.method === "post" || config.method === "put" || config.method === "delete") ||
    url.includes("/rice-mills") && (config.method === "post" || config.method === "put" || config.method === "delete") ||
    url.includes("/rice-types") && (config.method === "post" || config.method === "put" || config.method === "delete") ||
    url.includes("/paddy-types") && (config.method === "post" || config.method === "put" || config.method === "delete") ||
    url.includes("/bookings") && !url.includes("/user/") ||
    url.startsWith("/selling") && (config.method === "put" || config.method === "delete") ||
    url.startsWith("/rice/orders");

  if (isAdminEndpoint && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (farmerToken) {
    // Farmer token for all farmer actions
    config.headers.Authorization = `Bearer ${farmerToken}`;
  } else if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
}, (error) => Promise.reject(error));

// ── RESPONSE: NEVER clear tokens automatically ────────────
// Tokens are only cleared on explicit logout.
// Automatic clearing was causing logout-on-login bug.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
