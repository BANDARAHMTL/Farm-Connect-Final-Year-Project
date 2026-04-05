/**
 * PaddyTypes.js  —  "Paddy Buying Prices" admin page
 *
 * Manages rice_types (mill_id + paddy variety + buying price per kg).
 * This is what farmers see when selling paddy — each mill sets its own
 * buying price per paddy variety.
 *
 * Separate from rice_marketplace (selling price to customers).
 */
import React, { useEffect, useState } from "react";
import api from "../../api/api";

// ── Add / Edit Modal ─────────────────────────────────────────────
function PaddyModal({ item, mills, onClose, onSave }) {
  // item is a rice_types row: { id, mill_id, type_name, price_per_kg, stock_kg, description, status }
  const editing = !!item?.id;
  const [form, setForm] = useState(
    item?.id
      ? {
          millId:      String(item.mill_id || ""),
          typeName:    item.type_name    || "",
          pricePerKg:  item.price_per_kg || "",
          stockKg:     item.stock_kg     || 0,
          description: item.description  || "",
          status:      item.status       || "active",
        }
      : { millId:"", typeName:"", pricePerKg:"", stockKg:0, description:"", status:"active" }
  );
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  // Find selected mill for display
  const selectedMill = mills.find(m => String(m.id) === String(form.millId));

  const s = {
    overlay: { position:"fixed", inset:0, background:"#0007", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
    modal:   { background:"var(--surface)", borderRadius:16, width:"min(520px,100%)", maxHeight:"92vh", overflowY:"auto", padding:32, boxShadow:"0 24px 80px #0005" },
    label:   { display:"block", fontWeight:700, fontSize:"0.8rem", color:"#555", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" },
    input:   { width:"100%", padding:"11px 14px", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:"0.92rem", boxSizing:"border-box", outline:"none" },
    row:     { marginBottom:18 },
    grid2:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 },
    btn:     (bg,fg) => ({ background:bg, color:fg, border:"none", borderRadius:9, padding:"11px 24px", fontWeight:700, fontSize:"0.88rem", cursor:"pointer" }),
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!form.millId)          return setErr("Please select a rice mill.");
    if (!form.typeName.trim()) return setErr("Paddy type name is required.");
    const price = Number(form.pricePerKg);
    if (!price || price <= 0)  return setErr("Buying price must be greater than 0.");
    setSaving(true);
    try {
      const payload = {
        millId:      form.millId,
        typeName:    form.typeName.trim(),
        pricePerKg:  price,
        stockKg:     Number(form.stockKg) || 0,
        description: form.description,
        status:      form.status,
      };
      if (editing) await api.put(`/rice-types/${item.id}`, payload);
      else         await api.post("/rice-types", payload);
      onSave();
    } catch (e) { setErr(e.response?.data?.message || "Save failed. Try again."); }
    finally { setSaving(false); }
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <h3 style={{ margin:0, color:"#1a2535", fontSize:"1.15rem" }}>
              {editing ? "✏️ Edit Paddy Buying Price" : "🌾 Add Paddy Buying Price"}
            </h3>
            <p style={{ margin:"5px 0 0", color:"#888", fontSize:"0.78rem" }}>
              Set the price a mill will pay farmers per kg for this paddy variety
            </p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:24, cursor:"pointer", color:"#aaa", lineHeight:1 }}>×</button>
        </div>

        {err && (
          <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 14px", color:"#dc2626", fontSize:"0.83rem", marginBottom:16 }}>
            ⚠️ {err}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Rice Mill - mandatory */}
          <div style={s.row}>
            <label style={s.label}>Rice Mill *</label>
            <select
              style={{ ...s.input, background: form.millId ? "#fff" : "#fffbeb", borderColor: form.millId ? "#e5e7eb" : "#f59e0b" }}
              value={form.millId}
              onChange={e => setForm({ ...form, millId: e.target.value })}
            >
              <option value="">— Select Rice Mill —</option>
              {mills.map(m => (
                <option key={m.id} value={m.id}>{m.millName} {m.location ? `· ${m.location}` : ""}</option>
              ))}
            </select>
            {selectedMill && (
              <div style={{ marginTop:8, padding:"8px 12px", background:"#f0fdf4", borderRadius:8, fontSize:"0.8rem", color:"#065f46", display:"flex", alignItems:"center", gap:8 }}>
                {selectedMill.image_url && (
                  <img src={selectedMill.image_url.startsWith("http") ? selectedMill.image_url : `http://localhost:8080${selectedMill.image_url}`}
                    alt="" style={{ width:32, height:32, borderRadius:6, objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
                )}
                <span>✅ {selectedMill.millName}{selectedMill.location ? ` — ${selectedMill.location}` : ""}</span>
              </div>
            )}
          </div>

          <div style={s.row}>
            <label style={s.label}>Paddy Type / Variety *</label>
            <input
              style={s.input}
              type="text"
              placeholder="e.g. Nadu, Samba, Red Rice, Kiri Samba…"
              value={form.typeName}
              onChange={e => setForm({ ...form, typeName: e.target.value })}
            />
          </div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Buying Price / kg (Rs) *</label>
              <input
                style={{ ...s.input, fontSize:"1.1rem", fontWeight:800, color:"#059669" }}
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={form.pricePerKg}
                onChange={e => setForm({ ...form, pricePerKg: e.target.value })}
              />
              <p style={{ margin:"5px 0 0", color:"#9ca3af", fontSize:"0.75rem" }}>
                Price paid to farmers per kg
              </p>
            </div>
            <div>
              <label style={s.label}>Mill Stock (kg)</label>
              <input
                style={s.input}
                type="number"
                min="0"
                placeholder="0"
                value={form.stockKg}
                onChange={e => setForm({ ...form, stockKg: e.target.value })}
              />
              <p style={{ margin:"5px 0 0", color:"#9ca3af", fontSize:"0.75rem" }}>
                Current stock at mill
              </p>
            </div>
          </div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Status</label>
              <select style={s.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">✅ Active (visible to farmers)</option>
                <option value="inactive">⛔ Inactive (hidden)</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Description</label>
              <input
                style={s.input}
                placeholder="Optional notes…"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {/* Price preview */}
          {form.millId && form.pricePerKg > 0 && (
            <div style={{ background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)", border:"1.5px solid #a7f3d0", borderRadius:12, padding:"14px 18px", marginBottom:18 }}>
              <div style={{ fontSize:"0.78rem", color:"#065f46", fontWeight:700, marginBottom:4 }}>💰 PREVIEW</div>
              <div style={{ fontSize:"1rem", color:"#1a2535" }}>
                <strong>{selectedMill?.millName}</strong> will pay{" "}
                <strong style={{ color:"#059669", fontSize:"1.1rem" }}>Rs {Number(form.pricePerKg).toLocaleString()}/kg</strong>{" "}
                for <strong>{form.typeName || "this paddy"}</strong>
              </div>
              <div style={{ fontSize:"0.78rem", color:"#6b7280", marginTop:4 }}>
                e.g. 1,000 kg → Rs {(Number(form.pricePerKg) * 1000).toLocaleString()}
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button type="button" onClick={onClose} style={s.btn("#f3f4f6", "#374151")}>Cancel</button>
            <button type="submit" style={s.btn("#059669", "#fff")} disabled={saving}>
              {saving ? "Saving…" : editing ? "✅ Update" : "✅ Add Buying Price"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Confirm Delete ───────────────────────────────────────────────
function ConfirmDelete({ item, onClose, onConfirm }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#0007", zIndex:1001, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"var(--surface)", borderRadius:14, padding:28, width:340, boxShadow:"0 8px 40px #0003" }}>
        <h4 style={{ margin:"0 0 10px", color:"#1a2535" }}>🗑️ Delete Buying Price?</h4>
        <p style={{ color:"#666", margin:"0 0 6px" }}>
          Delete <strong>{item.type_name}</strong> from <strong>{item.mill_name}</strong>?
        </p>
        <p style={{ color:"#dc2626", fontSize:"0.78rem", margin:"0 0 20px" }}>
          ⚠️ Farmers will no longer see this mill's price for this paddy type.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ background:"#f3f4f6", color:"#374151", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ background:"#ef4444", color:"#fff", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:700, cursor:"pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function PaddyTypes() {
  const [types,      setTypes]      = useState([]);
  const [mills,      setMills]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [millFilter, setMillFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal,      setModal]      = useState(null);
  const [confirm,    setConfirm]    = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [tr, mr] = await Promise.all([
        api.get("/rice-types"),
        api.get("/rices"),
      ]);
      setTypes(Array.isArray(tr.data) ? tr.data : []);
      setMills(Array.isArray(mr.data) ? mr.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    try {
      await api.delete(`/rice-types/${confirm.id}`);
      setTypes(prev => prev.filter(t => t.id !== confirm.id));
    } catch (e) { alert(e.response?.data?.message || "Delete failed"); }
    setConfirm(null);
  }

  const filtered = types.filter(t => {
    const matchMill   = millFilter === "all" || String(t.mill_id) === String(millFilter);
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchSearch = !search ||
      (t.type_name  || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.mill_name  || "").toLowerCase().includes(search.toLowerCase());
    return matchMill && matchStatus && matchSearch;
  });

  const activeCount   = types.filter(t => t.status === "active").length;
  const avgPrice      = types.length ? Math.round(types.reduce((s, t) => s + Number(t.price_per_kg), 0) / types.length) : 0;
  const millCount     = new Set(types.map(t => t.mill_id)).size;

  const s = {
    btn:   (bg,fg,sm) => ({ background:bg, color:fg, border:"none", borderRadius:8, padding:sm?"7px 14px":"10px 20px", fontWeight:700, fontSize:sm?"0.8rem":"0.88rem", cursor:"pointer" }),
    input: { padding:"9px 14px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:"0.9rem", outline:"none" },
    th:    { padding:"12px 16px", background:"#f8fafc", textAlign:"left", fontSize:"0.77rem", color:"#6b7280", fontWeight:700, borderBottom:"1px solid #f0f0f0", whiteSpace:"nowrap" },
    td:    { padding:"13px 16px", borderBottom:"1px solid #f8f8f8", fontSize:"0.88rem", color:"#374151", verticalAlign:"middle" },
    badge: (st) => ({ background:st==="active"?"#d1fae5":"#fee2e2", color:st==="active"?"#065f46":"#991b1b", padding:"3px 11px", borderRadius:20, fontSize:"0.73rem", fontWeight:700, display:"inline-block" }),
  };

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, color:"#1a2535", fontSize:"1.4rem" }}>🌾 Paddy Buying Prices</h2>
          <p style={{ margin:"5px 0 0", color:"#888", fontSize:"0.82rem" }}>
            Each mill sets its own buying price per paddy variety — shown to farmers in the Selling section
          </p>
        </div>
        <button style={s.btn("#059669","#fff")} onClick={() => setModal({})}>
          + Add Buying Price
        </button>
      </div>

      {/* ── Info banner ── */}
      <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"12px 16px", marginBottom:18, fontSize:"0.82rem", color:"#92400e", display:"flex", alignItems:"flex-start", gap:10 }}>
        <span style={{ fontSize:"1.1rem" }}>💡</span>
        <div>
          <strong>How it works:</strong> Each entry here = one rice mill + one paddy variety + the price that mill pays to buy paddy from farmers.
          These prices appear on the <strong>Sell Paddy</strong> page when farmers compare mill offers.
          This is <em>separate</em> from the rice selling prices in the Marketplace (what customers pay for processed rice).
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:"flex", gap:14, marginBottom:20, flexWrap:"wrap" }}>
        {[
          { label:"Total Entries",    value:types.length, icon:"📋", color:"var(--g700)" },
          { label:"Active Prices",    value:activeCount,  icon:"✅", color:"#059669" },
          { label:"Mills Listed",     value:millCount,    icon:"🏭", color:"#7c3aed" },
          { label:"Avg Buying Price", value:`Rs ${avgPrice}`, icon:"💰", color:"#f59e0b" },
        ].map(c => (
          <div key={c.label} style={{ background:"var(--surface)", borderRadius:12, padding:"16px 20px", boxShadow:"var(--shadow-sm)", flex:1, minWidth:120, textAlign:"center" }}>
            <div style={{ fontSize:"1.5rem", marginBottom:4 }}>{c.icon}</div>
            <div style={{ fontSize:"1.4rem", fontWeight:800, color:c.color }}>{c.value}</div>
            <div style={{ fontSize:"0.75rem", color:"#888", marginTop:2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <input
          style={{ ...s.input, width:220 }}
          placeholder="🔍 Search paddy type or mill…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={s.input} value={millFilter} onChange={e => setMillFilter(e.target.value)}>
          <option value="all">All Mills</option>
          {mills.map(m => <option key={m.id} value={m.id}>{m.millName}</option>)}
        </select>
        <select style={s.input} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span style={{ color:"#aaa", fontSize:"0.82rem" }}>{filtered.length} entries</span>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div style={{ padding:60, textAlign:"center", color:"#aaa" }}>Loading…</div>
      ) : (
        <div style={{ background:"var(--surface)", borderRadius:14, boxShadow:"0 2px 12px #0001", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th style={s.th}>Rice Mill</th>
                <th style={s.th}>Paddy Variety</th>
                <th style={s.th}>Buying Price / kg</th>
                <th style={s.th}>Mill Stock</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ background: i%2===0?"#fff":"#fafafa" }}>
                  <td style={s.td}>
                    <strong style={{ color:"#1a2535" }}>{t.mill_name || `Mill ${t.mill_id}`}</strong>
                  </td>
                  <td style={s.td}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:"1.1rem" }}>🌾</span>
                      <span style={{ fontWeight:600 }}>{t.type_name}</span>
                    </div>
                  </td>
                  <td style={s.td}>
                    <span style={{ fontSize:"1.05rem", fontWeight:800, color:"#059669" }}>
                      Rs {Number(t.price_per_kg).toLocaleString()}
                    </span>
                    <span style={{ color:"#aaa", fontSize:"0.75rem" }}> / kg</span>
                  </td>
                  <td style={s.td}>
                    <span style={{ color:"#6b7280" }}>{Number(t.stock_kg || 0).toLocaleString()} kg</span>
                  </td>
                  <td style={s.td}><span style={s.badge(t.status||"active")}>{t.status||"active"}</span></td>
                  <td style={s.td}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button style={s.btn("#f0f9ff","var(--g700)",true)} onClick={() => setModal(t)}>Edit</button>
                      <button style={s.btn("#fff1f2","#ef4444",true)} onClick={() => setConfirm(t)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign:"center", padding:50, color:"#bbb" }}>
                    {search || millFilter !== "all" ? "No entries match your filter." : "No buying prices set yet. Click + Add Buying Price to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal !== null && (
        <PaddyModal
          item={modal?.id ? modal : null}
          mills={mills}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); loadAll(); }}
        />
      )}
      {confirm && (
        <ConfirmDelete
          item={confirm}
          onClose={() => setConfirm(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
