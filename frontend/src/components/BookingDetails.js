import React, { useEffect, useState } from "react";
import axios from "axios";
import OnlinePaymentForm from "./OnlinePaymentForm";

// Matches the 6 session slots shown in the image dropdown
const SESSION_LABELS = ["6-9am","9-12am","12-3pm","3-6pm","6-9pm","9-12pm"];

export default function BookingDetails({
  show, vehicle,
  sessionIndex = 0, setSessionIndex,
  onClose = () => {}, onConfirm = () => {},
  selectedLocation, date,
}) {
  const [local, setLocal] = useState({
    session:      0,        // Row 1 left  — session dropdown index
    farmerName:   "",       // Row 1 right — Farmer Name *
    address:      "",       // Row 2 right — Address
    areaAcres:    "",       // Row 3 left  — Area (acres) *
    paymentMethod:"cash",   // Row 3 right — Payment Method
    bookingDate:  "",       // shown in banner
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false); // show card form when "online" selected

  // Auto-fill from logged-in farmer when modal opens
  useEffect(() => {
    if (!show) return;
    try {
      const farmer = JSON.parse(localStorage.getItem("farmer") || "null");
      setLocal({
        session:       sessionIndex || 0,
        farmerName:    farmer?.name    || "",
        address:       farmer?.address || "",
        areaAcres:     "",
        paymentMethod: "cash",
        bookingDate:   date || new Date().toISOString().slice(0, 10),
      });
    } catch {
      setLocal({
        session:0, farmerName:"", address:"",
        areaAcres:"", paymentMethod:"cash",
        bookingDate: date || new Date().toISOString().slice(0, 10),
      });
    }
  }, [show, date, sessionIndex]);

  function handleChange(e) {
    const { name, value } = e.target;
    setLocal(s => ({ ...s, [name]: value }));
    if (name === "session" && setSessionIndex) setSessionIndex(Number(value));
  }

  const pricePerAcre = Number(vehicle?.pricePerAcre || 0);
  const acres        = parseFloat(local.areaAcres) || 0;
  const totalPrice   = Math.round(pricePerAcre * acres);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("farmerToken");
    if (!token) { alert("Please sign in first."); onClose(); return; }
    if (acres <= 0)        { alert("Please enter area in acres."); return; }
    if (!local.bookingDate){ alert("Please select a booking date."); return; }

    // If online payment, show card form first
    if (local.paymentMethod === "online") {
      setShowPayment(true);
      return;
    }
    await submitBooking("cash");
  }

  async function submitBooking(payMethod) {
    setSubmitting(true);
    try {
      const farmer = JSON.parse(localStorage.getItem("farmer") || "null");
      const sesIdx = Number(local.session || 0);
      const payload = {
        vehicleId:    vehicle?.id             || null,
        vehicleName:  vehicle?.title          || null,
        vehicleType:  vehicle?.vehicleType    || vehicle?.type || null,
        pricePerAcre: pricePerAcre,
        bookingDate:  local.bookingDate,
        session:      sesIdx,
        sessionLabel: SESSION_LABELS[sesIdx],
        farmerId:     farmer?.id              || null,
        farmerName:   local.farmerName,
        address:      local.address,
        areaAcres:    acres,
        paymentMethod: payMethod || local.paymentMethod,
        totalPrice:   totalPrice,
        status:       "pending",
      };
      const token = localStorage.getItem("farmerToken");
      const res = await axios.post("http://localhost:8080/api/bookings", payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      alert(res.data?.message || "✅ Booking confirmed!");
      if (onConfirm) onConfirm(res.data);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!show || !vehicle) return null;

  // ── Online payment overlay ──────────────────────────────────────
  if (showPayment) return (
    <div style={{ position:"fixed", inset:0, background:"#0007", zIndex:1100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"min(460px,100%)", padding:32, boxShadow:"0 24px 80px #0005" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h3 style={{ margin:0, color:"#1a2535", fontSize:"1.1rem" }}>💳 Online Payment</h3>
            <p style={{ margin:"4px 0 0", color:"#888", fontSize:"0.78rem" }}>Vehicle booking · {vehicle?.title}</p>
          </div>
          <button onClick={()=>setShowPayment(false)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#aaa" }}>×</button>
        </div>
        <OnlinePaymentForm
          amount={totalPrice}
          onCancel={() => setShowPayment(false)}
          onSuccess={async (payInfo) => {
            setShowPayment(false);
            await submitBooking("online");
          }}
          setIsProcessing={setSubmitting}
        />
      </div>
    </div>
  );

  // ── styles (match image closely) ──────────────────────
  const labelStyle = { fontSize:"0.82rem", color:"#666", fontWeight:600, display:"block", marginBottom:4 };
  const inputStyle = { width:"100%", padding:"8px 10px", border:"1px solid #d0d0d0", borderRadius:6,
    fontSize:"0.9rem", outline:"none", boxSizing:"border-box" };
  const fieldStyle = { display:"flex", flexDirection:"column" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
      zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>

      <div style={{ background:"#fff", borderRadius:10, width:560, maxHeight:"95vh",
        overflowY:"auto", boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>

        {/* ── HEADER ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"18px 22px", borderBottom:"1px solid #eee" }}>
          <h3 style={{ margin:0, fontSize:"1.05rem", fontWeight:700 }}>
            Book {vehicle?.title || "Vehicle"}
          </h3>
          <button onClick={onClose} style={{ background:"none", border:"none",
            fontSize:"1.4rem", cursor:"pointer", color:"#888", lineHeight:1 }}>×</button>
        </div>

        {/* ── BANNER (vehicle name | date | session) ── */}
        <div style={{ margin:"14px 22px 6px", background:"#f4f8ff",
          border:"1px solid #d0e4ff", borderRadius:8, padding:"10px 14px" }}>
          <div style={{ fontWeight:700, fontSize:"0.93rem" }}>
            {vehicle.title} &nbsp;|&nbsp; 📅 {local.bookingDate || date}
            &nbsp;|&nbsp; ⏰ {SESSION_LABELS[Number(local.session || 0)]}
          </div>
          <div style={{ color:"#555", fontSize:"0.83rem", marginTop:3 }}>
            📍 {vehicle.location || selectedLocation} &nbsp;|&nbsp; Rs {pricePerAcre}/acre
          </div>
        </div>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} style={{ padding:"10px 22px 20px" }}>

          {/* Row 0 — Booking Date (hidden input shown in banner) */}
          <div style={{ marginBottom:12, ...fieldStyle }}>
            <label style={labelStyle}>Booking Date *</label>
            <input type="date" name="bookingDate" value={local.bookingDate}
              onChange={handleChange} min={new Date().toISOString().slice(0,10)}
              style={inputStyle} required />
          </div>

          {/* Row 1 — Session | Farmer Name */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Session</label>
              <select name="session" value={local.session} onChange={handleChange} style={inputStyle}>
                {SESSION_LABELS.map((lbl, i) => (
                  <option key={i} value={i}>{lbl}</option>
                ))}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Farmer Name *</label>
              <input name="farmerName" value={local.farmerName} onChange={handleChange}
                placeholder="H.M.THARINDU LAKMAL BANDARA" style={inputStyle} required />
            </div>
          </div>

          {/* Row 2 — Farmer ID | Address */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:12 }}>

            <div style={fieldStyle}>
              <label style={labelStyle}>Address</label>
              <input name="address" value={local.address} onChange={handleChange}
                placeholder="NO 359/1, YAYA05, ..." style={inputStyle} />
            </div>
          </div>

          {/* Row 3 — Area (acres) | Payment Method */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Area (acres) *</label>
              <input type="number" name="areaAcres" value={local.areaAcres}
                onChange={handleChange} min="0.1" step="0.01"
                placeholder="0.1" style={inputStyle} required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Payment Method</label>
              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                {[["cash","💵 Cash"],["online","💳 Online"]].map(([v,l]) => (
                  <label key={v} style={{
                    flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                    padding:"10px 8px", border:`2px solid ${local.paymentMethod===v ? "var(--g700)" : "#e5e7eb"}`,
                    borderRadius:8, cursor:"pointer", fontSize:"0.85rem", fontWeight:700,
                    background: local.paymentMethod===v ? "var(--g100)" : "#fff",
                    color: local.paymentMethod===v ? "var(--g700)" : "#6b7280",
                    transition:"all 0.15s",
                  }}>
                    <input type="radio" name="paymentMethod" value={v}
                      checked={local.paymentMethod===v}
                      onChange={handleChange} style={{ display:"none" }} />
                    {l}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── TOTAL (footer, matches image blue text) ── */}
          {acres > 0 && (
            <div style={{ color:"#0b79d0", fontWeight:700, fontSize:"0.95rem", marginBottom:16 }}>
              Total: Rs {totalPrice.toLocaleString()} ({local.areaAcres} acres × Rs {pricePerAcre}/acre)
            </div>
          )}

          {/* ── BUTTONS ── */}
          <div style={{ display:"flex", gap:10, paddingTop:12, borderTop:"1px solid #f0f0f0" }}>
            <button type="button" onClick={onClose}
              style={{ flex:1, padding:"10px 0", border:"1px solid #ccc", borderRadius:6,
                background:"#fff", cursor:"pointer", fontWeight:600, color:"#555", fontSize:"0.9rem" }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              style={{ flex:1, padding:"10px 0", border:"none", borderRadius:6,
                background:"#0b79d0", color:"#fff", cursor:"pointer",
                fontWeight:700, fontSize:"0.9rem", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
