import React, { useEffect, useState } from "react";
import api from "../../api/api";

const SESSION_LABELS = ["6–9am","9–12am","12–3pm","3–6pm","6–9pm","9–12pm"];

const BADGE_MAP = {
  pending:   { bg:"var(--warning-bg)",  fg:"#92400e", dot:"#d97706" },
  approved:  { bg:"var(--success-bg)",  fg:"#14532d", dot:"#16a34a" },
  completed: { bg:"var(--success-bg)",  fg:"#14532d", dot:"#16a34a" },
  rejected:  { bg:"var(--danger-bg)",   fg:"#991b1b", dot:"#dc2626" },
};

function Badge({ status }) {
  const c = BADGE_MAP[(status||"pending").toLowerCase()] || { bg:"var(--n100)", fg:"var(--n600)", dot:"var(--n400)" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:99,
      fontSize:"0.72rem", fontWeight:700, background:c.bg, color:c.fg, textTransform:"capitalize" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {(status||"pending").toLowerCase()}
    </span>
  );
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [q,        setQ]        = useState("");
  const [loading,  setLoading]  = useState(true);
  const [editRow,  setEditRow]  = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data || []);
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault(); setSaving(true);
    try {
      await api.put(`/bookings/${editRow.id}`, {
        sessionIndex:  Number(editRow.session_index ?? 0),
        sessionLabel:  SESSION_LABELS[Number(editRow.session_index ?? 0)],
        bookingDate:   editRow.booking_date,
        address:       editRow.address,
        areaAcres:     editRow.area_acres,
        paymentMethod: editRow.payment_method,
        totalPrice:    Math.round((editRow.price_per_acre||0) * (editRow.area_acres||0)),
        status:        editRow.status,
      });
      setBookings(prev => prev.map(b => b.id === editRow.id ? {...b,...editRow} : b));
      setEditRow(null);
    } catch(err) { alert(err?.response?.data?.message || "Update failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch(err) { alert(err?.response?.data?.message || "Delete failed"); }
    setConfirm(null);
  }

  const filtered = bookings.filter(b =>
    (b.farmer_name||b.farmerFullName||"").toLowerCase().includes(q.toLowerCase()) ||
    (b.vehicle_title||b.vehicle_number||"").toLowerCase().includes(q.toLowerCase()) ||
    (b.farmer_ref_id||b.farmerRefId||"").toLowerCase().includes(q.toLowerCase())
  );

  const counts = {
    all: bookings.length,
    pending:   bookings.filter(b => b.status==="pending").length,
    approved:  bookings.filter(b => b.status==="approved").length,
    rejected:  bookings.filter(b => b.status==="rejected").length,
    completed: bookings.filter(b => b.status==="completed").length,
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:240, gap:10, color:"var(--n500)" }}>
      <span className="fc-spin">◌</span> Loading bookings…
    </div>
  );

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div className="fc-page-header">
        <div>
          <div className="fc-page-title">Bookings</div>
          <div className="fc-page-subtitle">Manage vehicle booking requests from farmers</div>
        </div>
      </div>

      {/* Summary pills */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:22 }}>
        {[
          {label:"Total",     val:counts.all,       color:"var(--g600)"},
          {label:"Pending",   val:counts.pending,   color:"#d97706"},
          {label:"Approved",  val:counts.approved,  color:"#16a34a"},
          {label:"Rejected",  val:counts.rejected,  color:"#dc2626"},
          {label:"Completed", val:counts.completed, color:"#7c3aed"},
        ].map(c => (
          <div key={c.label} style={{
            background:"#fff", borderRadius:10, padding:"10px 18px",
            border:"1px solid var(--border)", boxShadow:"var(--shadow-xs)",
            borderTop:`3px solid ${c.color}`, minWidth:90, textAlign:"center",
          }}>
            <div style={{ fontSize:"1.3rem", fontWeight:800, color:"var(--n900)" }}>{c.val}</div>
            <div style={{ fontSize:"0.72rem", color:"var(--n500)", fontWeight:500, marginTop:2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="fc-toolbar">
        <div className="fc-search" style={{ flex:1, maxWidth:400 }}>
          <span className="fc-search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input className="fc-input" placeholder="Search farmer, vehicle or ID…"
            value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <span style={{ fontSize:"0.82rem", color:"var(--n500)", fontWeight:500 }}>
          {filtered.length} of {bookings.length} records
        </span>
      </div>

      {/* Table */}
      <div className="fc-table-wrap">
        <table className="fc-table" style={{ minWidth:900 }}>
          <thead>
            <tr>
              <th>#</th><th>Vehicle</th><th>Farmer</th><th>Farmer ID</th>
              <th>Session</th><th>Date</th><th>Area</th><th>Total</th>
              <th>Payment</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign:"center", color:"var(--n400)", padding:"32px 0" }}>No bookings found</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id}>
                <td style={{ color:"var(--n400)", fontWeight:500 }}>{b.id}</td>
                <td style={{ fontWeight:600 }}>{b.vehicle_title || b.vehicle_number || "—"}</td>
                <td style={{ fontWeight:500 }}>{b.farmer_name || b.farmerFullName || "—"}</td>
                <td style={{ fontFamily:"monospace", fontSize:"0.78rem", color:"var(--g700)" }}>{b.farmer_ref_id || b.farmerRefId || "—"}</td>
                <td>
                  <span style={{ background:"var(--info-bg)", color:"var(--info)", padding:"2px 9px", borderRadius:99, fontSize:"0.75rem", fontWeight:600 }}>
                    {b.session_label || SESSION_LABELS[b.session_index||0] || "—"}
                  </span>
                </td>
                <td style={{ color:"var(--n600)", fontSize:"0.85rem" }}>{b.booking_date || "—"}</td>
                <td>{b.area_acres || b.quantity || "—"} ac</td>
                <td style={{ fontWeight:700, color:"var(--g700)" }}>
                  Rs {Number(b.total_price || Math.round((b.price_per_acre||0)*(b.area_acres||0))||0).toLocaleString()}
                </td>
                <td>
                  <span style={{ background:"var(--n100)", color:"var(--n600)", padding:"2px 9px", borderRadius:99, fontSize:"0.75rem", fontWeight:600 }}>
                    {b.payment_method || "—"}
                  </span>
                </td>
                <td><Badge status={b.status} /></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="fc-btn fc-btn-secondary fc-btn-sm" onClick={() => setEditRow({...b})}>Edit</button>
                    <button className="fc-btn fc-btn-danger fc-btn-sm" onClick={() => setConfirm(b)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editRow && (
        <div className="fc-modal-overlay" onClick={e => e.target === e.currentTarget && setEditRow(null)}>
          <div className="fc-modal" style={{ maxWidth:480 }}>
            <div className="fc-modal-header">
              <div>
                <div className="fc-modal-title">Edit Booking #{editRow.id}</div>
                <div className="fc-modal-subtitle">{editRow.vehicle_title || "Vehicle"} — {editRow.farmer_name || "Farmer"}</div>
              </div>
              <button className="fc-modal-close" onClick={() => setEditRow(null)}>×</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="fc-modal-body">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 18px" }}>
                  <div className="fc-field">
                    <label className="fc-label">Session</label>
                    <select className="fc-select" value={editRow.session_index ?? 0}
                      onChange={e => setEditRow(p => ({...p, session_index:Number(e.target.value), session_label:SESSION_LABELS[Number(e.target.value)]}))}>
                      {SESSION_LABELS.map((l,i) => <option key={i} value={i}>{l}</option>)}
                    </select>
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Booking Date</label>
                    <input type="date" className="fc-input" value={editRow.booking_date || ""}
                      onChange={e => setEditRow(p => ({...p, booking_date:e.target.value}))} />
                  </div>
                  <div className="fc-field" style={{ gridColumn:"1/-1" }}>
                    <label className="fc-label">Address</label>
                    <input className="fc-input" value={editRow.address || ""}
                      onChange={e => setEditRow(p => ({...p, address:e.target.value}))} />
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Area (acres)</label>
                    <input type="number" min="0.1" step="0.01" className="fc-input" value={editRow.area_acres || ""}
                      onChange={e => setEditRow(p => ({...p, area_acres:e.target.value}))} />
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Payment Method</label>
                    <select className="fc-select" value={editRow.payment_method || "cash"}
                      onChange={e => setEditRow(p => ({...p, payment_method:e.target.value}))}>
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  <div className="fc-field" style={{ gridColumn:"1/-1" }}>
                    <label className="fc-label">Status</label>
                    <select className="fc-select" value={editRow.status || "pending"}
                      onChange={e => setEditRow(p => ({...p, status:e.target.value}))}>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="fc-modal-footer">
                <button type="button" className="fc-btn fc-btn-ghost" onClick={() => setEditRow(null)}>Cancel</button>
                <button type="submit" className="fc-btn fc-btn-primary" disabled={saving}>
                  {saving ? <><span className="fc-spin">◌</span> Saving…</> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirm && (
        <div className="fc-modal-overlay">
          <div className="fc-modal" style={{ maxWidth:380 }}>
            <div className="fc-modal-header">
              <div className="fc-modal-title">Delete Booking?</div>
              <button className="fc-modal-close" onClick={() => setConfirm(null)}>×</button>
            </div>
            <div className="fc-modal-body" style={{ textAlign:"center", padding:"28px" }}>
              <p style={{ color:"var(--n600)", fontSize:"0.9rem", lineHeight:1.6 }}>
                Are you sure you want to delete the booking for<br />
                <strong style={{ color:"var(--n900)" }}>{confirm.farmer_name || "this farmer"}</strong>?<br />
                <span style={{ fontSize:"0.82rem", color:"var(--n400)" }}>{confirm.vehicle_title} · {confirm.booking_date}</span>
              </p>
              <p style={{ fontSize:"0.8rem", color:"var(--danger)", margin:"12px 0 0" }}>This action cannot be undone.</p>
            </div>
            <div className="fc-modal-footer">
              <button className="fc-btn fc-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="fc-btn fc-btn-danger" style={{ background:"var(--danger)", color:"#fff" }} onClick={() => handleDelete(confirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
