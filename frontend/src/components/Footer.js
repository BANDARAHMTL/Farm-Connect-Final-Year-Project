import React from "react";

export default function Footer({ setCurrentPage }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#1d5a34",
        color: "#fff",
        padding: "40px 20px 20px",
        marginTop: "60px",
        borderTop: "3px solid #27a85c"
      }}
    >
      {/* Main Footer Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px",
          marginBottom: "30px"
        }}
      >
        {/* About Section */}
        <div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#f5c518", fontWeight: "700" }}>
            🌾 FarmConnect
          </h3>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.8", color: "rgba(255,255,255,0.8)" }}>
            Connecting farmers with markets, equipment, and opportunities for sustainable growth.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#f5c518", fontWeight: "700" }}>
            Quick Links
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              { label: "Home", page: "Home" },
              { label: "Booking", page: "Booking" },
              { label: "Rice Market", page: "RiceMarket" },
              { label: "About", page: "About" }
            ].map((link) => (
              <li key={link.page} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => setCurrentPage(link.page)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    padding: 0,
                    transition: "color 0.3s ease"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#f5c518")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.8)")}
                >
                  → {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#f5c518", fontWeight: "700" }}>
            Services
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "Equipment Rental",
              "Rice Marketplace",
              "Price Management",
              "Logistics Support"
            ].map((service) => (
              <li key={service} style={{ marginBottom: "10px", color: "rgba(255,255,255,0.8)", fontSize: "0.95rem" }}>
                ✓ {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#f5c518", fontWeight: "700" }}>
            Contact Us
          </h3>
          <div style={{ fontSize: "0.95rem", lineHeight: "2", color: "rgba(255,255,255,0.8)" }}>
            <p>📧 info@farmconnect.lk</p>
            <p>📞 +94 (11) 234 5678</p>
            <p>📍 Colombo, Sri Lanka</p>
            <p style={{ marginTop: "10px", opacity: 0.7, fontSize: "0.85rem" }}>
              Available 24/7 for support
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.2)",
        paddingTop: "20px",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "15px", fontSize: "0.9rem" }}>
          Follow us on social media
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          {[
            { icon: "f", label: "Facebook" },
            { icon: "𝕏", label: "Twitter" },
            { icon: "📷", label: "Instagram" },
            { icon: "in", label: "LinkedIn" }
          ].map((social) => (
            <button
              key={social.label}
              title={social.label}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#f5c518",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f5c518";
                e.target.style.color = "#1d5a34";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.1)";
                e.target.style.color = "#f5c518";
              }}
            >
              {social.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.2)",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
            © {currentYear} FarmConnect. All rights reserved.
          </p>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "Privacy Policy", href: "#" },
            { label: "Terms & Conditions", href: "#" },
            { label: "Cookie Policy", href: "#" }
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                fontSize: "0.85rem",
                transition: "color 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => (e.target.style.color = "#f5c518")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.6)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ textAlign: "right", flex: 1 }}>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
            Version 4.0
          </p>
        </div>
      </div>

      {/* Extra Bottom Decoration */}
      <div
        style={{
          borderTop: "2px solid #27a85c",
          marginTop: "15px",
          paddingTop: "10px",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.4)"
        }}
      >
        Empowering Agriculture Through Technology
      </div>
    </footer>
  );
}
