import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

export default function Users() {
  const [users,   setUsers]   = useState([]);
  const [q,       setQ]       = useState("");
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const res = await api.get("/admin/farmers"); setUsers(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }
  async function remove(id) {
    try { await api.delete(`/admin/farmers/${id}`); setUsers(prev => prev.filter(u => u.id !== id)); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
    setConfirm(null);
  }

  const filtered = users.filter(u =>
    (u.fullName || u.name || "").toLowerCase().includes(q.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:240, gap:10, color:"var(--n500)" }}>
      <span className="fc-spin">◌</span> Loading farmers…
    </div>
  );

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div className="fc-page-header">
        <div>
          <div className="fc-page-title">Farmers</div>
          <div className="fc-page-subtitle">{users.length} registered farmers</div>
        </div>
      </div>

      <div className="fc-toolbar">
        <div className="fc-search" style={{ flex:1, maxWidth:380 }}>
          <span className="fc-search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input className="fc-input" placeholder="Search by name or email…"
            value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <span style={{ fontSize:"0.82rem", color:"var(--n500)" }}>{filtered.length} results</span>
      </div>

      <div className="fc-table-wrap">
        <table className="fc-table">
          <thead>
            <tr><th>#</th><th>Full Name</th><th>Email</th><th>Phone</th><th>NIC</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign:"center", color:"var(--n400)", padding:"32px 0" }}>No farmers found</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id}>
                <td style={{ color:"var(--n400)", fontWeight:500 }}>{u.id}</td>
                <td style={{ fontWeight:600 }}>{u.fullName || u.name}</td>
                <td style={{ color:"var(--n600)" }}>{u.email}</td>
                <td style={{ color:"var(--n600)" }}>{u.phone || u.mobile || "—"}</td>
                <td style={{ fontFamily:"monospace", fontSize:"0.82rem" }}>{u.nic || "—"}</td>
                <td>
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:5,
                    padding:"3px 10px", borderRadius:99, fontSize:"0.72rem", fontWeight:700,
                    background:"var(--success-bg)", color:"#14532d",
                  }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:"#16a34a" }} />
                    {u.status || "active"}
                  </span>
                </td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <Link to={`/admin/users/${u.id}/edit`} className="fc-btn fc-btn-secondary fc-btn-sm" style={{ textDecoration:"none" }}>Edit</Link>
                    <button className="fc-btn fc-btn-danger fc-btn-sm" onClick={() => setConfirm(u)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm && (
        <div className="fc-modal-overlay">
          <div className="fc-modal" style={{ maxWidth:380 }}>
            <div className="fc-modal-header">
              <div className="fc-modal-title">Delete Farmer?</div>
              <button className="fc-modal-close" onClick={() => setConfirm(null)}>×</button>
            </div>
            <div className="fc-modal-body" style={{ textAlign:"center" }}>
              <p style={{ color:"var(--n600)", lineHeight:1.7, fontSize:"0.9rem" }}>
                You are about to permanently delete<br />
                <strong style={{ color:"var(--n900)" }}>{confirm.fullName || confirm.name}</strong>
                <br/><span style={{ fontSize:"0.82rem", color:"var(--n400)" }}>{confirm.email}</span>
              </p>
              <p style={{ color:"var(--danger)", fontSize:"0.8rem", marginTop:10 }}>This cannot be undone.</p>
            </div>
            <div className="fc-modal-footer">
              <button className="fc-btn fc-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="fc-btn" style={{ background:"var(--danger)", color:"#fff" }} onClick={() => remove(confirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
