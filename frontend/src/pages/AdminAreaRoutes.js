import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Admin Components
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

// Admin Pages
import Dashboard from "./admin/Dashboard";
import Vehicles from "./admin/Vehicles";
import RiceMills from "./admin/RiceMills";
import RiceTypes from "./admin/RiceTypes";
import PaddyTypes from "./admin/PaddyTypes";
import Marketplace from "./admin/Marketplace";
import Users from "./admin/Users";
import EditUser from "./admin/EditUser";
import Bookings from "./admin/Bookings";
import EditBooking from "./admin/EditBooking";
import AdminSellings from "./admin/Sellings";
import AdminOrders from "./admin/Orders";

/**
 * AdminAreaRoutes Component
 * Main admin dashboard with sidebar, navbar, and admin routes
 */
export default function AdminAreaRoutes() {
  const [admin, setAdmin] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  // Load admin profile from localStorage on mount
  useEffect(() => {
    try {
      setAdmin(JSON.parse(localStorage.getItem("admin_profile") || "null"));
    } catch (error) {
      console.error("Failed to load admin profile:", error);
    }
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Admin Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Admin Navbar */}
        <AdminNavbar admin={admin} />

        {/* Routes Container */}
        <div
          style={{
            padding: "28px 28px 40px",
            flex: 1,
            background: "var(--g050)",
            overflowY: "auto",
          }}
        >
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="rices" element={<RiceMills />} />
            <Route path="rice-types" element={<RiceTypes />} />
            <Route path="paddy-types" element={<PaddyTypes />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id/edit" element={<EditUser />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id/edit" element={<EditBooking />} />
            <Route path="sellings" element={<AdminSellings />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
