import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_GROUPS = [
  {
    label: "Overview",
    links: [
      { to: "/admin",             label: "Dashboard",        end: true },
    ],
  },
  {
    label: "Operations",
    links: [
      { to: "/admin/bookings",    label: "Bookings"         },
      { to: "/admin/sellings",    label: "Selling Requests" },
      { to: "/admin/orders",      label: "Rice Orders"      },
    ],
  },
  {
    label: "Inventory",
    links: [
      { to: "/admin/vehicles",    label: "Vehicles"         },
      { to: "/admin/rices",       label: "Rice Mills"       },
      { to: "/admin/rice-types",  label: "Rice Types"       },
      { to: "/admin/paddy-types", label: "Paddy Prices"     },
      { to: "/admin/marketplace", label: "Marketplace"      },
    ],
  },
  {
    label: "Users",
    links: [
      { to: "/admin/users",       label: "Farmers"          },
    ],
  },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
  return (
    <aside style={{
      width: collapsed ? 64 : 234,
      minHeight: "100vh",
      background: "var(--g900)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.22s ease",
      overflow: "hidden",
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      {/* Brand */}
      <div style={{
        padding: collapsed ? "22px 0" : "22px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        gap: 10,
        flexShrink: 0,
      }}>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
              FarmConnect
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--g300)", marginTop: 2, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Admin Portal
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: "rgba(255,255,255,0.07)",
          border: "none",
          color: "var(--g300)",
          width: 28,
          height: 28,
          borderRadius: 6,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.15s",
          fontSize: "0.85rem",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{
                padding: "10px 20px 5px",
                fontSize: "0.66rem",
                fontWeight: 700,
                color: "var(--g300)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.7,
              }}>
                {group.label}
              </div>
            )}
            {group.links.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                title={collapsed ? label : undefined}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: collapsed ? "10px 0" : "9px 20px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.58)",
                  background: isActive ? "rgba(39,168,92,0.18)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--g400)" : "3px solid transparent",
                  textDecoration: "none",
                  fontSize: "0.865rem",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.13s",
                })}>
                <SidebarDot active={false} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
            FarmConnect v2.0
          </div>
        </div>
      )}
    </aside>
  );
}

function SidebarDot() {
  return <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", flexShrink: 0, opacity: 0.6 }} />;
}
