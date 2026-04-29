import React, { useEffect, useState } from "react";
import api from "../../api/api";

const BADGE = {
  PENDING:  { bg:"#fff3cd", fg:"#856404" },
  APPROVED: { bg:"#d4edda", fg:"#155724" },
  REJECTED: { bg:"#f8d7da", fg:"#721c24" },
};

function Badge({ status }) {
  const s = (status||"PENDING").toUpperCase();
  const c = BADGE[s] || { bg:"#eee", fg:"#666" };
  return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:"0.78rem", fontWeight:600, background:c.bg, color:c.fg }}>{s}</span>;
}

export default function AdminSellings() {
  const [rows,    setRows]    = useState([]);
  const [q,       setQ]       = useState("");
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get("/selling");
      setRows(res.data?.data || []);
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/selling/${editRow.id}`, {
        riceType:   editRow.rice_type,
        stockKg:    editRow.stock_kg,
        pricePerKg: editRow.price_per_kg,
        status:     editRow.status,
      });
      setRows(prev => prev.map(r => r.id === editRow.id ? { ...r, ...editRow,
        total_price: Math.round(editRow.stock_kg * editRow.price_per_kg) } : r));
      setEditRow(null);
    } catch(err) { alert(err?.response?.data?.message || "Update failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/selling/${id}`);
      setRows(prev => prev.filter(r => r.id !== id));
    } catch(err) { alert(err?.response?.data?.message || "Delete failed"); }
    setConfirm(null);
  }

  const filtered = rows.filter(r =>
    (r.farmerName||"").toLowerCase().includes(q.toLowerCase()) ||
    (r.rice_type||"").toLowerCase().includes(q.toLowerCase()) ||
    (r.millName||"").toLowerCase().includes(q.toLowerCase())
  );

  const totals = {
    all:      rows.length,
    pending:  rows.filter(r => r.status === "PENDING").length,
    approved: rows.filter(r => r.status === "APPROVED").length,
    rejected: rows.filter(r => r.status === "REJECTED").length,
    revenue:  rows.filter(r=>r.status==="APPROVED").reduce((s,r)=>s+Number(r.total_price||0),0),
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:240, gap:10, color:"var(--n500)" }}>
      <span className="fc-spin">◌</span> Loading selling requests…
    </div>
  );

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div className="fc-page-header">
        <div>
          <div className="fc-page-title">Selling Requests</div>
          <div className="fc-page-subtitle">Manage paddy selling requests from farmers</div>
        </div>
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:22 }}>
        {[
          {label:"Total",       val:totals.all,                      color:"var(--g600)"},
          {label:"Pending",     val:totals.pending,                  color:"#d97706"},
          {label:"Approved",    val:totals.approved,                 color:"#16a34a"},
          {label:"Rejected",    val:totals.rejected,                 color:"#dc2626"},
          {label:"Revenue",     val:`Rs ${totals.revenue.toLocaleString()}`, color:"#7c3aed"},
        ].map(c => (
          <div key={c.label} style={{
            background:"#fff", borderRadius:10, padding:"10px 18px",
            border:"1px solid var(--border)", boxShadow:"var(--shadow-xs)",
            borderTop:`3px solid ${c.color}`, minWidth:90, textAlign:"center",
          }}>
            <div style={{ fontSize:c.label==="Revenue"?"0.95rem":"1.3rem", fontWeight:800, color:"var(--n900)" }}>{c.val}</div>
            <div style={{ fontSize:"0.72rem", color:"var(--n500)", fontWeight:500, marginTop:2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="fc-toolbar">
        <div className="fc-search" style={{ flex:1, maxWidth:380 }}>
          <span className="fc-search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input className="fc-input" placeholder="Search farmer, rice type, mill…"
            value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <span style={{ fontSize:"0.82rem", color:"var(--n500)" }}>{filtered.length} results</span>
      </div>

      <div className="fc-table-wrap">
        <table className="fc-table">
          <thead>
            <tr><th>#</th><th>Farmer</th><th>Rice Type</th><th>Mill</th><th>Stock (kg)</th><th>Price/kg</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign:"center", color:"var(--n400)", padding:"32px 0" }}>No selling requests found</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id}>
                <td style={{ color:"var(--n400)" }}>{r.id}</td>
                <td style={{ fontWeight:600 }}>{r.farmerName || "—"}</td>
                <td>{r.rice_type || "—"}</td>
                <td style={{ color:"var(--n600)", fontSize:"0.85rem" }}>{r.millName || <span style={{ color:"var(--n300)" }}>Unassigned</span>}</td>
                <td style={{ fontWeight:500 }}>{r.stock_kg} kg</td>
                <td>Rs {r.price_per_kg}</td>
                <td style={{ fontWeight:700, color:"var(--g700)" }}>Rs {Number(r.total_price||0).toLocaleString()}</td>
                <td><Badge status={r.status} /></td>
                <td style={{ color:"var(--n500)", fontSize:"0.82rem" }}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="fc-btn fc-btn-secondary fc-btn-sm" onClick={() => setEditRow({...r})}>Edit</button>
                    <button className="fc-btn fc-btn-danger fc-btn-sm" onClick={() => setConfirm(r)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editRow && (
        <div className="fc-modal-overlay" onClick={e => e.target === e.currentTarget && setEditRow(null)}>
          <div className="fc-modal" style={{ maxWidth:440 }}>
            <div className="fc-modal-header">
              <div>
                <div className="fc-modal-title">Edit Selling Request #{editRow.id}</div>
                <div className="fc-modal-subtitle">{editRow.farmerName}</div>
              </div>
              <button className="fc-modal-close" onClick={() => setEditRow(null)}>×</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="fc-modal-body">
                <div className="fc-field">
                  <label className="fc-label">Rice Type</label>
                  <select className="fc-select" value={editRow.rice_type || ""} onChange={e => setEditRow(p => ({...p, rice_type:e.target.value}))}>
                    {["Nadu","Samba","Kiri Samba","Red Rice","White Rice","Suwandel","Keeri Samba","Raw Rice"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 18px" }}>
                  <div className="fc-field">
                    <label className="fc-label">Stock (kg)</label>
                    <input type="number" min="1" className="fc-input" value={editRow.stock_kg || ""}
                      onChange={e => setEditRow(p => ({...p, stock_kg:e.target.value}))} required />
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Price per kg (Rs)</label>
                    <input type="number" min="1" className="fc-input" value={editRow.price_per_kg || ""}
                      onChange={e => setEditRow(p => ({...p, price_per_kg:e.target.value}))} required />
                  </div>
                </div>
                <div className="fc-field">
                  <label className="fc-label">Status</label>
                  <select className="fc-select" value={editRow.status || "PENDING"} onChange={e => setEditRow(p => ({...p, status:e.target.value}))}>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
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

      {confirm && (
        <div className="fc-modal-overlay">
          <div className="fc-modal" style={{ maxWidth:380 }}>
            <div className="fc-modal-header">
              <div className="fc-modal-title">Delete Selling Request?</div>
              <button className="fc-modal-close" onClick={() => setConfirm(null)}>×</button>
            </div>
            <div className="fc-modal-body" style={{ textAlign:"center" }}>
              <p style={{ color:"var(--n600)", lineHeight:1.7, fontSize:"0.9rem" }}>
                Delete request from <strong style={{ color:"var(--n900)" }}>{confirm.farmerName}</strong>?<br />
                <span style={{ fontSize:"0.82rem", color:"var(--n400)" }}>{confirm.rice_type} — {confirm.stock_kg} kg</span>
              </p>
              <p style={{ color:"var(--danger)", fontSize:"0.8rem", marginTop:10 }}>This cannot be undone.</p>
            </div>
            <div className="fc-modal-footer">
              <button className="fc-btn fc-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="fc-btn" style={{ background:"var(--danger)", color:"#fff" }} onClick={() => handleDelete(confirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
