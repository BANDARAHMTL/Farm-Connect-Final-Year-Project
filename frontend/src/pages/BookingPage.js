import React from "react";
import VehicleList from "../components/VehicleList";
import BookingDetails from "../components/BookingDetails";
import { SESSION_LABELS, SESSION_DURATIONS, FALLBACK_LOCATIONS, HERO_SLIDES } from "../constants";

/**
 * BookingPage Component
 * Main booking interface with hero section, filters, and vehicle listing
 */
export default function BookingPage({
  vehicleType,
  setVehicleType,
  location,
  setLocation,
  selectedModelId,
  setSelectedModelId,
  date,
  setDate,
  vehicles,
  bookings,
  expandedVehicleId,
  setExpandedVehicleId,
  showModal,
  setShowModal,
  selectedVehicle,
  setSelectedVehicle,
  selectedSession,
  setSelectedSession,
  form,
  setForm,
  handleConfirm,
  modelOptions,
  filtered,
  isBooked,
  modalTotalPrice,
  availableLocations,
}) {
  const [q, setQ] = React.useState("");
  const [bSlide, setBSlide] = React.useState(0);
  const [bFade, setBFade] = React.useState(true);

  // Filter vehicles by search query
  const display = filtered.filter((v) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      (v.title || "").toLowerCase().includes(s) ||
      (v.type || "").toLowerCase().includes(s) ||
      (v.location || "").toLowerCase().includes(s)
    );
  });

  // Auto-rotate hero slides
  React.useEffect(() => {
    const t = setInterval(() => {
      setBFade(false);
      setTimeout(() => {
        setBSlide((s) => (s + 1) % HERO_SLIDES.length);
        setBFade(true);
      }, 350);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleSlideChange = (index) => {
    setBFade(false);
    setTimeout(() => {
      setBSlide(index);
      setBFade(true);
    }, 300);
  };

  const handlePrevSlide = () => {
    setBFade(false);
    setTimeout(() => {
      setBSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
      setBFade(true);
    }, 300);
  };

  const handleNextSlide = () => {
    setBFade(false);
    setTimeout(() => {
      setBSlide((s) => (s + 1) % HERO_SLIDES.length);
      setBFade(true);
    }, 300);
  };

  return (
    <div
      style={{
        fontFamily: "'Inter',sans-serif",
        background: "#07140a",
        minHeight: "100vh",
      }}
    >
      {/* ═══ HERO — IMAGE SLIDESHOW ═══ */}
      <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
        {/* Slide image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transition: "opacity 0.32s",
            opacity: bFade ? 1 : 0,
          }}
        >
          <img
            src={HERO_SLIDES[bSlide].img}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(100deg, rgba(7,24,16,0.88) 0%, rgba(7,24,16,0.55) 42%, rgba(7,24,16,0.08) 68%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              background: "linear-gradient(to top, #071810, transparent)",
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 56px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(245,197,24,0.18)",
              border: "1px solid rgba(245,197,24,0.4)",
              borderRadius: 99,
              padding: "5px 16px",
              marginBottom: 16,
              fontSize: "0.68rem",
              fontWeight: 800,
              color: "#f5c518",
              letterSpacing: "0.14em",
              width: "fit-content",
            }}
          >
            🚜 EQUIPMENT BOOKING
          </div>
          <h1
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "clamp(2.2rem,5vw,3.6rem)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.08,
              margin: "0 0 12px",
              letterSpacing: "-1.5px",
              transition: "opacity 0.4s",
              opacity: bFade ? 1 : 0,
            }}
          >
            Drive Into<br />
            <span style={{ color: "#f5c518" }}>Excellence</span>
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 420,
              marginBottom: 28,
              lineHeight: 1.7,
              transition: "opacity 0.4s",
              opacity: bFade ? 1 : 0,
            }}
          >
            {HERO_SLIDES[bSlide].sub} — choose your date and time slot, book
            instantly.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSlideChange(i)}
                style={{
                  width: i === bSlide ? 28 : 8,
                  height: 8,
                  borderRadius: 99,
                  background:
                    i === bSlide ? "#f5c518" : "rgba(255,255,255,0.3)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          style={{
            position: "absolute",
            left: 18,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(7,24,16,0.72)",
            border: "1px solid rgba(255,255,255,0.22)",
            color: "#f1f5f2",
            fontSize: "1.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            lineHeight: 1,
          }}
        >
          ‹
        </button>
        <button
          onClick={handleNextSlide}
          style={{
            position: "absolute",
            right: 136,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(7,24,16,0.72)",
            border: "1px solid rgba(255,255,255,0.22)",
            color: "#f1f5f2",
            fontSize: "1.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            lineHeight: 1,
          }}
        >
          ›
        </button>

        {/* Thumbnail Strip */}
        <div
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {HERO_SLIDES.map((bs, i) => (
            <button
              key={i}
              onClick={() => handleSlideChange(i)}
              style={{
                width: 88,
                height: 58,
                padding: 0,
                border: "none",
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                outline:
                  i === bSlide
                    ? "2.5px solid #eab308"
                    : "1.5px solid rgba(255,255,255,0.2)",
                outlineOffset: 2,
                opacity: i === bSlide ? 1 : 0.52,
                transition: "all 0.25s",
                boxShadow: i === bSlide ? "0 0 16px #eab30855" : "none",
              }}
            >
              <img
                src={bs.img}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>

        {/* Stats Strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 5,
            display: "flex",
            background: "rgba(7,20,10,0.85)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "12px 56px",
            gap: 32,
          }}
        >
          {[
            { icon: "🚜", v: `${filtered.length || 0} Units`, l: "Available" },
            {
              icon: "📍",
              v: `${availableLocations.length || FALLBACK_LOCATIONS.length} Zones`,
              l: "Locations",
            },
            { icon: "💳", v: "Online Pay", l: "Secure" },
            { icon: "⭐", v: "Top Rated", l: "Equipment" },
          ].map((s, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {s.l}
                </div>
              </div>
              {i < 3 && (
                <div
                  style={{
                    width: 1,
                    height: 24,
                    background: "rgba(255,255,255,0.1)",
                    marginLeft: 22,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ STICKY FILTER BAR ═══ */}
      <div
        style={{
          background: "#0d1610",
          borderBottom: "1px solid #1a2e1e",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "12px 40px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 99,
              padding: "9px 18px",
              flex: "1 1 200px",
              minWidth: 160,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b8577"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, location…"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.84rem",
                color: "#fff",
                fontFamily: "inherit",
                width: "100%",
              }}
            />
          </div>

          {/* Type pills */}
          <div
            style={{
              display: "flex",
              gap: 6,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 99,
              padding: 4,
              flexShrink: 0,
            }}
          >
            {["Tractor", "Harvester"].map((t) => (
              <button
                key={t}
                onClick={() => setVehicleType(t)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 99,
                  border: "none",
                  background:
                    vehicleType === t ? "#1a6e3e" : "transparent",
                  color:
                    vehicleType === t
                      ? "#fff"
                      : "rgba(255,255,255,0.4)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {vehicleType === t ? "✓ " : ""}{t}
              </button>
            ))}
          </div>

          {/* Location & Model Selects */}
          {[
            {
              val: location,
              fn: setLocation,
              opts: (availableLocations.length > 0
                ? availableLocations
                : FALLBACK_LOCATIONS
              ).map((l) => ({ v: l, l })),
              pre: "📍",
            },
            {
              val: selectedModelId,
              fn: setSelectedModelId,
              opts: [
                { v: "", l: "All Models" },
                ...modelOptions.map((m) => ({ v: String(m.id), l: m.title })),
              ],
              pre: "🔖",
            },
          ].map((f, i) => (
            <div key={i} style={{ position: "relative", flexShrink: 0 }}>
              <select
                value={f.val}
                onChange={(e) => f.fn(e.target.value)}
                style={{
                  appearance: "none",
                  padding: "9px 36px 9px 16px",
                  border: "1.5px solid #d1e8da",
                  borderRadius: 99,
                  background: "#fff",
                  fontSize: "0.83rem",
                  color: "#0a2e1a",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {f.opts.map((o) => (
                  <option key={o.v} value={o.v}>
                    {f.pre} {o.l}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: "absolute",
                  right: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "0.58rem",
                  color: "#6b8577",
                  pointerEvents: "none",
                }}
              >
                ▼
              </span>
            </div>
          ))}

          {/* Date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 99,
              padding: "9px 16px",
              background: "rgba(255,255,255,0.05)",
              flexShrink: 0,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b8577"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "0.83rem",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "inherit",
                fontWeight: 600,
                background: "transparent",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "32px 40px 72px",
          background: "#0a0e0b",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 5px",
                letterSpacing: "-0.3px",
              }}
            >
              Explore Our Equipment
            </h2>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#6b8577" }}>
              <strong style={{ color: "#4ade80" }}>{display.length}</strong>{" "}
              {vehicleType.toLowerCase()}
              {display.length !== 1 ? "s" : ""} available near{" "}
              <strong style={{ color: "#4ade80" }}>{location}</strong>
            </p>
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.25)",
              fontWeight: 500,
            }}
          >
            Showing results for:{" "}
            <strong style={{ color: "rgba(255,255,255,0.6)" }}>
              {date}
            </strong>
          </div>
        </div>

        {/* Empty State */}
        {display.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "96px 20px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 24,
              border: "2px dashed rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontSize: "5rem", marginBottom: 16, opacity: 0.6 }}>
              🚜
            </div>
            <div
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              No vehicles found
            </div>
            <div
              style={{
                fontSize: "0.86rem",
                color: "#6b8577",
                lineHeight: 1.6,
              }}
            >
              Try adjusting your filters, location, or date to find available
              equipment.
            </div>
          </div>
        )}

        {/* Vehicle Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
            gap: 26,
          }}
        >
          <VehicleList
            vehicles={display}
            sessionLabels={SESSION_LABELS}
            sessionDurations={SESSION_DURATIONS}
            isBooked={isBooked}
            expandedVehicleId={expandedVehicleId}
            setExpandedVehicleId={setExpandedVehicleId}
            onBook={(vehicle, idx) => {
              if (isBooked(vehicle.id, date, idx)) return;
              setSelectedVehicle(vehicle);
              setSelectedSession(idx);
              setForm({
                farmerName: "",
                farmerId: "",
                address: "",
                area: "",
                payment: "online",
              });
              setShowModal(true);
            }}
            date={date}
          />
        </div>
      </div>

      {/* Booking Modal */}
      <BookingDetails
        show={showModal}
        vehicle={selectedVehicle}
        sessionIndex={selectedSession}
        setSessionIndex={setSelectedSession}
        sessionLabels={SESSION_LABELS}
        sessionDurations={SESSION_DURATIONS}
        form={form}
        setForm={setForm}
        modalTotalPrice={modalTotalPrice}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        selectedLocation={location}
        date={date}
      />
    </div>
  );
}
