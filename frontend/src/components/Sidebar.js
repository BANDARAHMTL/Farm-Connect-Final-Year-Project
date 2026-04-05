import React from "react";

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>🌾 FarmConnect</h3>
        <p>Agricultural Services</p>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="section-label">Main Menu</div>
          <button
            className={`sidebar-link ${currentPage === "Home" ? "active" : ""}`}
            onClick={() => setCurrentPage("Home")}
          >
            🏠 Dashboard
          </button>
          <button
            className={`sidebar-link ${currentPage === "Booking" ? "active" : ""}`}
            onClick={() => setCurrentPage("Booking")}
          >
            🚜 Equipment Booking
          </button>
          <button
            className={`sidebar-link ${currentPage === "Selling" ? "active" : ""}`}
            onClick={() => setCurrentPage("Selling")}
          >
            🌾 Paddy Selling
          </button>
        </div>

        <div className="nav-section">
          <div className="section-label">Market & Info</div>
          <button
            className={`sidebar-link ${currentPage === "RiceMarket" ? "active" : ""}`}
            onClick={() => setCurrentPage("RiceMarket")}
          >
            📊 Rice Market
          </button>
          <button
            className={`sidebar-link ${currentPage === "About" ? "active" : ""}`}
            onClick={() => setCurrentPage("About")}
          >
            ℹ️ About Us
          </button>
        </div>

        <div className="nav-section">
          <div className="section-label">Account</div>
          <button
            className={`sidebar-link ${currentPage === "Account" ? "active" : ""}`}
            onClick={() => setCurrentPage("Account")}
          >
            👤 My Account
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <div className="user-name">John Farmer</div>
            <div className="user-role">Premium Member</div>
          </div>
        </div>
        <div className="sidebar-stats">
         
         {/*
         
          <div className="stat-item">
            <span>Bookings</span>
            <span className="stat-value">12</span>
          </div>
          <div className="stat-item">
            <span>Sales</span>
            <span className="stat-value">8</span>
          </div>
       
       */  }
       
        </div>
      </div>
    </aside>
  );
}