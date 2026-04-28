import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ═════ CORE COMPONENTS ═════
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";

// ═════ PAGES ═════
import Home from "./pages/Home";
import Account from "./pages/Account";
import AccountSignIn from "./pages/Account_sign_in";
import AccountSignUp from "./pages/Account_sign_up";
import Selling from "./pages/Selling";
import RiceMarket from "./pages/RiceMarketplace";
import BookingPage from "./pages/BookingPage";
import AdminAreaRoutes from "./pages/AdminAreaRoutes";
import AdminLogin from "./pages/admin/Login";

// ═════ SERVICES ═════
import vehicleService from "./services/vehicleService";

// ═════ CONSTANTS & UTILS ═════
import {
  SESSION_LABELS,
  SESSION_DURATIONS,
  FALLBACK_LOCATIONS,
  DEFAULT_BOOKING_FORM,
} from "./constants";
import { getTodayISO } from "./utils";

/**
 * Main App Component
 * Root component handling main routing and booking page logic
 */
export default function App() {
  // ═════ STATE MANAGEMENT ═════
  const [currentPage, setCurrentPage] = useState("Home");
  const [vehicleType, setVehicleType] = useState("Tractor");
  const [location, setLocation] = useState(FALLBACK_LOCATIONS[0]);
  const [date, setDate] = useState(getTodayISO());
  const [bookings, setBookings] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSession, setSelectedSession] = useState(0);
  const [form, setForm] = useState(DEFAULT_BOOKING_FORM);
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [vehicles, setVehicles] = useState([]);

  // ═════ FETCH VEHICLES ═════
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await vehicleService.getVehicles();
        if (mounted) setVehicles(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load vehicles:", err?.message);
        setVehicles([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ═════ REFRESH VEHICLES ═════
  const refreshVehicles = async () => {
    try {
      const list = await vehicleService.getVehicles();
      setVehicles(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to refresh vehicles:", err?.message);
    }
  };

  // ═════ MANAGE BOOKINGS ═════
  useEffect(() => {
    setBookings((prev) => {
      const next = { ...prev };
      vehicles.forEach((v) => {
        if (!next[v.id]) next[v.id] = {};
        if (!next[v.id][date]) {
          const count = Math.floor(Math.random() * 3);
          const s = new Set();
          while (s.size < count)
            s.add(Math.floor(Math.random() * SESSION_LABELS.length));
          next[v.id][date] = Array.from(s);
        }
      });
      return next;
    });
  }, [date, vehicles]);

  // ═════ RESET MODEL FILTER ON TYPE/LOCATION CHANGE ═════
  useEffect(() => {
    setSelectedModelId("");
  }, [vehicleType, location]);

  // ═════ MEMOIZED COMPUTATIONS ═════
  const modelOptions = useMemo(
    () =>
      vehicles.filter(
        (v) => v.type === vehicleType && v.location === location
      ),
    [vehicles, vehicleType, location]
  );

  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          v.type === vehicleType &&
          v.location === location &&
          (!selectedModelId || String(v.id) === String(selectedModelId))
      ),
    [vehicleType, location, vehicles, selectedModelId]
  );

  const availableLocations = useMemo(() => {
    const s = new Set();
    vehicles.forEach((v) => {
      if (v && v.location && v.type === vehicleType) s.add(v.location);
    });
    return Array.from(s).sort();
  }, [vehicles, vehicleType]);

  const modalTotalPrice = useMemo(
    () =>
      Math.round(
        (selectedVehicle?.pricePerAcre || 0) * (parseFloat(form.area) || 0)
      ),
    [selectedVehicle, form.area]
  );

  // ═════ SYNC LOCATION WITH AVAILABLE OPTIONS ═════
  useEffect(() => {
    if (
      availableLocations.length > 0 &&
      !availableLocations.includes(location)
    ) {
      setLocation(availableLocations[0]);
    }
  }, [availableLocations]);

  // ═════ UTILITY FUNCTIONS ═════
  const isBooked = (vehicleId, dateISO, idx) => {
    return bookings[vehicleId]?.[dateISO]?.includes(idx) || false;
  };

  const handleConfirm = () => {
    if (!selectedVehicle) return;
    setBookings((prev) => {
      const next = { ...prev };
      if (!next[selectedVehicle.id]) next[selectedVehicle.id] = {};
      if (!next[selectedVehicle.id][date]) next[selectedVehicle.id][date] = [];
      if (!next[selectedVehicle.id][date].includes(selectedSession))
        next[selectedVehicle.id][date] = [
          ...next[selectedVehicle.id][date],
          selectedSession,
        ];
      return next;
    });
    setShowModal(false);
  };

  // ═════ RENDER ═════
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <div className="app">
                <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
                <div className="app-layout">
                  <main className="main-content">
                    {currentPage === "Home" && (
                      <Home setCurrentPage={setCurrentPage} />
                    )}
                    {currentPage === "Booking" && (
                      <BookingPage
                        vehicleType={vehicleType}
                        setVehicleType={setVehicleType}
                        location={location}
                        setLocation={setLocation}
                        selectedModelId={selectedModelId}
                        setSelectedModelId={setSelectedModelId}
                        date={date}
                        setDate={setDate}
                        vehicles={vehicles}
                        bookings={bookings}
                        expandedVehicleId={expandedVehicleId}
                        setExpandedVehicleId={setExpandedVehicleId}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        selectedVehicle={selectedVehicle}
                        setSelectedVehicle={setSelectedVehicle}
                        selectedSession={selectedSession}
                        setSelectedSession={setSelectedSession}
                        form={form}
                        setForm={setForm}
                        handleConfirm={handleConfirm}
                        modelOptions={modelOptions}
                        filtered={filtered}
                        isBooked={isBooked}
                        modalTotalPrice={modalTotalPrice}
                        availableLocations={availableLocations}
                        refreshVehicles={refreshVehicles}
                      />
                    )}
                    {currentPage === "Selling" && <Selling />}
                    {currentPage === "Account" && (
                      <Account setCurrentPage={setCurrentPage} />
                    )}
                    {currentPage === "AccountSignIn" && (
                      <AccountSignIn setCurrentPage={setCurrentPage} />
                    )}
                    {currentPage === "AccountSignUp" && (
                      <AccountSignUp setCurrentPage={setCurrentPage} />
                    )}
                    {currentPage === "RiceMarket" && <RiceMarket />}
                  </main>
                </div>
              </div>
            }
          />

          {/* Admin Routes */}

          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminAreaRoutes />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
