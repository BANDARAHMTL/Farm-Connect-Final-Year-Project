import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminOrders() {
  const [rows,    setRows]    = useState([]);
  const [q,       setQ]       = useState("");
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [mills,   setMills]   = useState([]);

  useEffect(() => { load(); loadMills(); }, []);

  async function load() {
    try {
      const res = await api.get("/rice/orders");
      setRows(res.data || []);
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function loadMills() {
    try {
      const res = await api.get("/rices");
      setMills(res.data || []);
    } catch {}
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/rice/orders/${editRow.id}`, {
        customerName:  editRow.customer_name,
        mobile:        editRow.mobile,
        address:       editRow.address,
        riceType:      editRow.rice_type,
        millId:        editRow.mill_id,
        millName:      editRow.mill_name,
        weightKg:      editRow.weight_kg,
        quantity:      editRow.quantity,
        totalPrice:    editRow.total_price,
        paymentMethod: editRow.payment_method,
      });
      setRows(prev => prev.map(r => r.id === editRow.id ? {...r,...editRow} : r));
      setEditRow(null);
    } catch(err) { alert(err?.response?.data?.message || "Update failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/rice/orders/${id}`);
      setRows(prev => prev.filter(r => r.id !== id));
    } catch(err) { alert(err?.response?.data?.message || "Delete failed"); }
    setConfirm(null);
  }

  const filtered = rows.filter(r =>
    (r.customer_name||"").toLowerCase().includes(q.toLowerCase()) ||
    (r.rice_type||"").toLowerCase().includes(q.toLowerCase()) ||
    (r.mill_name||"").toLowerCase().includes(q.toLowerCase())
  );

  const totalRevenue = rows.reduce((s,r)=>s+Number(r.total_price||0),0);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:240, gap:10, color:"var(--n500)" }}>
      <span className="fc-spin">◌</span> Loading orders…
    </div>
  );

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div className="fc-page-header">
        <div>
          <div className="fc-page-title">Rice Orders</div>
          <div className="fc-page-subtitle">
            {rows.length} orders · Total Revenue: <span style={{ color:"var(--g700)", fontWeight:700 }}>Rs {totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="fc-toolbar">
        <div className="fc-search" style={{ flex:1, maxWidth:380 }}>
          <span className="fc-search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input className="fc-input" placeholder="Search customer, rice type, mill…"
            value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <span style={{ fontSize:"0.82rem", color:"var(--n500)" }}>{filtered.length} results</span>
      </div>

      <div className="fc-table-wrap">
        <table className="fc-table" style={{ minWidth:860 }}>
          <thead>
            <tr><th>#</th><th>Customer</th><th>Mobile</th><th>Rice Type</th><th>Mill</th><th>Weight</th><th>Qty</th><th>Total</th><th>Payment</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign:"center", color:"var(--n400)", padding:"32px 0" }}>No orders found</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id}>
                <td style={{ color:"var(--n400)" }}>{r.id}</td>
                <td style={{ fontWeight:600 }}>{r.customer_name || "—"}</td>
                <td style={{ color:"var(--n600)", fontSize:"0.82rem" }}>{r.mobile || "—"}</td>
                <td>{r.rice_type || "—"}</td>
                <td style={{ color:"var(--n600)", fontSize:"0.85rem" }}>{r.mill_name || "—"}</td>
                <td>{r.weight_kg} kg</td>
                <td>{r.quantity}</td>
                <td style={{ fontWeight:700, color:"var(--g700)" }}>Rs {Number(r.total_price||0).toLocaleString()}</td>
                <td>
                  <span style={{ background:"var(--n100)", color:"var(--n600)", padding:"2px 9px", borderRadius:99, fontSize:"0.75rem", fontWeight:600 }}>
                    {r.payment_method || "—"}
                  </span>
                </td>
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
          <div className="fc-modal" style={{ maxWidth:500 }}>
            <div className="fc-modal-header">
              <div>
                <div className="fc-modal-title">Edit Order #{editRow.id}</div>
                <div className="fc-modal-subtitle">{editRow.customer_name}</div>
              </div>
              <button className="fc-modal-close" onClick={() => setEditRow(null)}>×</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="fc-modal-body">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 18px" }}>
                  <div className="fc-field">
                    <label className="fc-label">Customer Name</label>
                    <input className="fc-input" value={editRow.customer_name || ""}
                      onChange={e => setEditRow(p => ({...p, customer_name:e.target.value}))} />
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Mobile</label>
                    <input className="fc-input" value={editRow.mobile || ""}
                      onChange={e => setEditRow(p => ({...p, mobile:e.target.value}))} />
                  </div>
                  <div className="fc-field" style={{ gridColumn:"1/-1" }}>
                    <label className="fc-label">Address</label>
                    <input className="fc-input" value={editRow.address || ""}
                      onChange={e => setEditRow(p => ({...p, address:e.target.value}))} />
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Rice Type</label>
                    <input className="fc-input" value={editRow.rice_type || ""}
                      onChange={e => setEditRow(p => ({...p, rice_type:e.target.value}))} />
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Mill</label>
                    <select className="fc-select" value={editRow.mill_id || ""}
                      onChange={e => {
                        const m = mills.find(x => String(x.id) === e.target.value);
                        setEditRow(p => ({...p, mill_id:e.target.value, mill_name:m?.name||p.mill_name}));
                      }}>
                      {mills.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Weight (kg)</label>
                    <input type="number" min="1" className="fc-input" value={editRow.weight_kg || ""}
                      onChange={e => setEditRow(p => ({...p, weight_kg:e.target.value}))} />
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Quantity</label>
                    <input type="number" min="1" className="fc-input" value={editRow.quantity || ""}
                      onChange={e => setEditRow(p => ({...p, quantity:e.target.value}))} />
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Total Price (Rs)</label>
                    <input type="number" className="fc-input" value={editRow.total_price || ""}
                      onChange={e => setEditRow(p => ({...p, total_price:e.target.value}))} />
                  </div>
                  <div className="fc-field">
                    <label className="fc-label">Payment Method</label>
                    <select className="fc-select" value={editRow.payment_method || "cod"}
                      onChange={e => setEditRow(p => ({...p, payment_method:e.target.value}))}>
                      <option value="cod">Cash on Delivery</option>
                      <option value="online">Online</option>
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

      {confirm && (
        <div className="fc-modal-overlay">
          <div className="fc-modal" style={{ maxWidth:380 }}>
            <div className="fc-modal-header">
              <div className="fc-modal-title">Delete Order?</div>
              <button className="fc-modal-close" onClick={() => setConfirm(null)}>×</button>
            </div>
            <div className="fc-modal-body" style={{ textAlign:"center" }}>
              <p style={{ color:"var(--n600)", lineHeight:1.7, fontSize:"0.9rem" }}>
                Delete order from <strong style={{ color:"var(--n900)" }}>{confirm.customer_name}</strong>?<br />
                <span style={{ fontSize:"0.82rem", color:"var(--n400)" }}>{confirm.rice_type} — Rs {Number(confirm.total_price||0).toLocaleString()}</span>
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
