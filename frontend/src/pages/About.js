import React from "react";

export default function About() {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #27a85c 0%, #1d7a42 100%)",
        color: "#8bf787",
        padding: "60px 20px",
        textAlign: "center",
        borderRadius: "12px",
        marginBottom: "40px"
      }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "12px", fontWeight: "700" }}>
          About FarmConnect
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.95 }}>
          Empowering farmers and connecting agricultural communities across Sri Lanka
        </p>
      </div>

      {/* Mission & Vision */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        marginBottom: "40px"
      }}>
        <div style={{
          background: "#eaeaea",
          padding: "30px",
          borderRadius: "12px",
          border: "2px solid #27a85c"
        }}>
          <h2 style={{ color: "#27a85c", marginBottom: "15px", fontSize: "1.5rem" }}>🎯 Our Mission</h2>
          <p style={{ color: "#555", lineHeight: "1.8", fontSize: "0.95rem" }}>
            FarmConnect aims to revolutionize agricultural trading in Sri Lanka by creating a transparent, 
            efficient, and farmer-friendly marketplace. We bridge the gap between farmers, rice mills, 
            and consumers to ensure fair pricing and quality products.
          </p>
        </div>

        <div style={{
          background: "#f5f5f5",
          padding: "30px",
          borderRadius: "12px",
          border: "2px solid #f5c518"
        }}>
          <h2 style={{ color: "#f5c518", marginBottom: "15px", fontSize: "1.5rem" }}>🌟 Our Vision</h2>
          <p style={{ color: "#555", lineHeight: "1.8", fontSize: "0.95rem" }}>
            To create a sustainable agricultural ecosystem where farmers have direct access to markets, 
            equipment, and fair pricing. We envision a future where technology empowers rural communities 
            and drives agricultural prosperity.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{
          color: "#27a85c",
          marginBottom: "25px",
          fontSize: "1.8rem",
          textAlign: "center"
        }}>
          💡 What We Offer
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px"
        }}>
          {[
            {
              icon: "🌾",
              title: "Equipment Rental",
              desc: "Access to modern farming equipment like tractors and harvesters"
            },
            {
              icon: "🛒",
              title: "Rice Marketplace",
              desc: "Direct marketplace for buying and selling rice products"
            },
            {
              icon: "📊",
              title: "Price Management",
              desc: "Real-time pricing and transparent market rates"
            },
            {
              icon: "🚚",
              title: "Logistics Support",
              desc: "Reliable delivery and booking management system"
            },
            {
              icon: "👥",
              title: "Farmer Community",
              desc: "Connect with fellow farmers and share experiences"
            },
            {
              icon: "💰",
              title: "Fair Pricing",
              desc: "Transparent pricing with no hidden charges"
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid #e0e0e0",
                textAlign: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(39, 168, 92, 0.15)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{feature.icon}</div>
              <h3 style={{ color: "#27a85c", marginBottom: "10px", fontSize: "1.1rem" }}>
                {feature.title}
              </h3>
              <p style={{ color: "#777", font: "0.9rem", lineHeight: "1.6" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{
        background: "linear-gradient(135deg, #f5c518 0%, #e6b300 100%)",
        padding: "40px",
        borderRadius: "12px",
        color: "#2e4438",
        marginBottom: "40px"
      }}>
        <h2 style={{ marginBottom: "25px", fontSize: "1.8rem", textAlign: "center" }}>
          ✨ Why Choose FarmConnect?
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          maxWidth: "900px",
          margin: "0 auto"
        }}>
          {[
            "✓ Transparent pricing without intermediaries",
            "✓ Secure and reliable platform",
            "✓ Support for small and large farmers",
            "✓ Real-time booking and tracking",
            "✓ Multiple payment options",
            "✓ 24/7 customer support"
          ].map((reason, idx) => (
            <div key={idx} style={{
              fontSize: "1rem",
              fontWeight: "500",
              lineHeight: "1.8"
            }}>
              {reason}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div style={{
        background: "#f5f5f5",
        padding: "40px",
        borderRadius: "12px",
        textAlign: "center",
        marginBottom: "40px"
      }}>
        <h2 style={{ color: "#27a85c", marginBottom: "20px", fontSize: "1.8rem" }}>
          📞 Get In Touch
        </h2>
        <p style={{ color: "#777", marginBottom: "20px", fontSize: "1rem", lineHeight: "1.8" }}>
          Have questions? We're here to help! Contact our team at:
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
          <div>
            <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "5px" }}>Email</p>
            <p style={{ color: "#27a85c", fontWeight: "600", fontSize: "1.1rem" }}>
              info@farmconnect.lk
            </p>
          </div>
          <div>
            <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "5px" }}>Phone</p>
            <p style={{ color: "#27a85c", fontWeight: "600", fontSize: "1.1rem" }}>
              +94 (11) 234 5678
            </p>
          </div>
          <div>
            <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "5px" }}>Location</p>
            <p style={{ color: "#27a85c", fontWeight: "600", fontSize: "1.1rem" }}>
              Colombo, Sri Lanka
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{
          color: "#27a85c",
          marginBottom: "25px",
          fontSize: "1.8rem",
          textAlign: "center"
        }}>
          👨‍💼 Our Team
        </h2>
        <p style={{
          textAlign: "center",
          color: "#777",
          marginBottom: "30px",
          fontSize: "1rem",
          lineHeight: "1.8"
        }}>
          FarmConnect is built by a dedicated team of developers and agriculture professionals 
          committed to transforming the farming industry through technology.
        </p>
      </div>
    </div>
  );
}
