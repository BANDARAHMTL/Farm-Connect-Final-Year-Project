import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const PAGES = [
  { id: "Home",        label: "HOME"        },
  { id: "Booking",     label: "BOOKING"     },
  { id: "Selling",     label: "SELL PADDY"  },
  { id: "RiceMarket",  label: "RICE MARKET" },
  { id: "Account",     label: "ACCOUNT"     },
];

export default function NavBar({ currentPage, setCurrentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* ── TOP HEADER BAR (logo + brand) ── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e0eeea",
        boxShadow: "0 1px 4px rgba(10,46,26,0.06)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "10px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo + Brand */}
          <button onClick={() => setCurrentPage("Home")} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 14, padding: 0,
          }}>
            {/* Logo circle */}
            <div style={{
              width: 50, height: 50, borderRadius: "50%",
              background: "linear-gradient(135deg, #0d3d1e, #1a6e3e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 10px rgba(10,46,26,0.25)",
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0a2e1a", fontFamily: "var(--font-display)", lineHeight: 1.1, letterSpacing: "-0.3px" }}>
                FarmConnect
              </div>
              <div style={{ fontSize: "0.68rem", color: "#6b8577", fontWeight: 500, letterSpacing: "0.03em" }}>
                Agricultural Services Platform
              </div>
            </div>
          </button>

          {/* Right side — sign in / sign up / admin */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                background: "rgba(255, 255, 255, 0.1)",
                border: "1.5px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 8,
                color: "#f5c518",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.borderColor = "#f5c518";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Admin Login — opens /login route */}
            <a href="/login" style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", border: "1.5px solid #d4a017",
              color: "#a37b00", borderRadius: 8, padding: "7px 14px",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--font-body)", textDecoration: "none",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fef9e7"; e.currentTarget.style.color = "#7a5c00"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#a37b00"; }}>
              🔐 Admin
            </a>

            <div style={{ width: 1, height: 24, background: "#d1e8da" }} />

            <button onClick={() => setCurrentPage("AccountSignIn")} style={{
              background: "transparent", border: "1.5px solid #c3d6cc",
              color: "#2e4438", borderRadius: 8, padding: "8px 18px",
              fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-body)", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#e8f5eb"; e.currentTarget.style.borderColor = "#27a85c"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#c3d6cc"; }}>
              Sign In
            </button>
            <button onClick={() => setCurrentPage("AccountSignUp")} style={{
              background: "linear-gradient(135deg, #1a6e3e, #27a85c)",
              color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px",
              fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--font-body)", boxShadow: "0 3px 10px rgba(27,110,62,0.28)",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 16px rgba(27,110,62,0.38)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 3px 10px rgba(27,110,62,0.28)"; }}>
              Register
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV BAR (green, like agriculture dept style) ── */}
      <nav style={{
        background: "linear-gradient(90deg, #1a5c30 0%, #1e6e38 50%, #1a5c30 100%)",
        boxShadow: "0 3px 12px rgba(10,46,26,0.2)",
        position: "sticky", top: 0, zIndex: 200,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center" }} className="fc-desktop-nav">
            {PAGES.map((p, i) => (
              <button key={p.id}
                onClick={() => setCurrentPage(p.id)}
                style={{
                  background: currentPage === p.id ? "rgba(245,197,24,0.18)" : "transparent",
                  border: "none",
                  borderBottom: currentPage === p.id ? "3px solid #f5c518" : "3px solid transparent",
                  color: currentPage === p.id ? "#f5c518" : "rgba(255,255,255,0.88)",
                  padding: "16px 22px",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.06em",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  if (currentPage !== p.id) {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderBottom = "3px solid rgba(245,197,24,0.4)";
                  }
                }}
                onMouseLeave={e => {
                  if (currentPage !== p.id) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.88)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderBottom = "3px solid transparent";
                  }
                }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="fc-mobile-menu-btn"
            style={{
              display: "none", background: "rgba(255,255,255,0.1)",
              border: "none", color: "#fff", borderRadius: 7,
              padding: "8px 10px", cursor: "pointer", fontSize: "1.1rem",
            }}>
            ☰
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{ background: "#0d3d1e", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "6px 12px 12px" }}>
            {PAGES.map(p => (
              <button key={p.id} onClick={() => { setCurrentPage(p.id); setMenuOpen(false); }} style={{
                display: "block", width: "100%", textAlign: "left",
                background: currentPage === p.id ? "rgba(245,197,24,0.12)" : "transparent",
                border: "none", color: currentPage === p.id ? "#f5c518" : "rgba(255,255,255,0.78)",
                padding: "12px 16px", borderRadius: 8,
                fontSize: "0.85rem", fontWeight: 600, fontFamily: "var(--font-body)",
                cursor: "pointer", marginBottom: 2,
              }}>
                {p.label}
              </button>
            ))}
            {/* Admin login in mobile menu */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 8, paddingTop: 8 }}>
              <a href="/login" style={{
                display: "flex", alignItems: "center", gap: 8,
                color: "#f5c518", textDecoration: "none",
                padding: "12px 16px", borderRadius: 8, fontSize: "0.85rem", fontWeight: 700,
                background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)",
              }}>
                🔐 Admin Login
              </a>
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 640px) {
            .fc-desktop-nav { display: none !important; }
            .fc-mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
          }
        `}</style>
      </nav>
    </>
  );
}
