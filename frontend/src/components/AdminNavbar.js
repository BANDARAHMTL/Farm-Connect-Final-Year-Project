import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar({ admin }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_profile");
    navigate("/login");
  }

  const initials = (admin?.fullName || "Admin")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header style={{
      height: 58,
      background: "#fff",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "var(--shadow-xs)",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "var(--g500)",
          boxShadow: "0 0 0 3px var(--g100)",
        }} />
        <span style={{ fontSize: "0.82rem", color: "var(--n500)", fontWeight: 500 }}>
          Admin Panel
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "6px 14px 6px 6px",
          background: "var(--g050)",
          border: "1px solid var(--border)",
          borderRadius: 99,
        }}>
          <div style={{
            width: 30, height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--g700), var(--g500))",
            color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 800,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--n900)", lineHeight: 1.2 }}>
              {admin?.fullName || "Admin"}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--n400)", lineHeight: 1 }}>
              {admin?.username || "administrator"}
            </div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="fc-btn fc-btn-ghost fc-btn-sm"
          style={{ fontSize: "0.8rem", color: "var(--danger)", borderColor: "#fecaca" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--danger-bg)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
