import React, { useEffect, useState } from "react";
import api from "../../api/api";

function RiceTypeModal({ type, mills, paddyVarieties, onClose, onSave }) {
  const editing = !!type?.id;
  const [form, setForm] = useState(type || {
    millId: "", typeName: "", pricePerKg: "", stockKg: 0, description: "", status: "active"
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); setErr("");
    if (!form.millId)   return setErr("Please select a rice mill.");
    if (!form.typeName) return setErr("Please select a paddy type.");
    const price = Number(form.pricePerKg);
    if (!price || price <= 0) return setErr("Buying price must be greater than 0.");
    setSaving(true);
    try {
      const payload = { millId: form.millId, typeName: form.typeName, pricePerKg: price, stockKg: Number(form.stockKg)||0, description: form.description, status: form.status };
      if (editing) await api.put(`/rice-types/${type.id}`, payload);
      else         await api.post("/rice-types", payload);
      onSave();
    } catch (e) { setErr(e.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  }

  const s = {
    overlay: { position:"fixed", inset:0, background:"#0007", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" },
    modal:   { background:"var(--surface)", borderRadius:16, width:"min(500px,95vw)", padding:30, boxShadow:"0 24px 80px #0005" },
    label:   { display:"block", fontWeight:700, fontSize:"0.79rem", color:"#555", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" },
    input:   { width:"100%", padding:"10px 13px", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:"0.92rem", boxSizing:"border-box", outline:"none" },
    grid2:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:15 },
    mb:      { marginBottom:15 },
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div>
            <h3 style={{ margin:0, color:"#1a2535" }}>{editing ? "✏️ Edit Rice Type" : "🍚 Add Rice Type & Price"}</h3>
            <p style={{ margin:"4px 0 0", color:"#888", fontSize:"0.77rem" }}>Set the buying price for a paddy type at a specific rice mill</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:24, cursor:"pointer", color:"#aaa" }}>×</button>
        </div>

        {err && (
          <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, padding:"9px 13px", color:"#dc2626", fontSize:"0.82rem", marginBottom:14 }}>
            ⚠️ {err}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Mill — mandatory */}
          <div style={s.mb}>
            <label style={s.label}>Rice Mill * <span style={{ color:"#ef4444" }}>— required</span></label>
            <select
              style={{ ...s.input, borderColor: !form.millId && err ? "#ef4444" : "#e5e7eb" }}
              value={form.millId || ""}
              onChange={e => setForm({ ...form, millId: e.target.value })}
              disabled={editing}
            >
              <option value="">— Select Rice Mill —</option>
              {mills.map(m => <option key={m.id} value={m.id}>{m.millName} {m.location ? `· ${m.location}` : ""}</option>)}
            </select>
            {editing && <p style={{ margin:"4px 0 0", color:"#aaa", fontSize:"0.75rem" }}>Mill cannot be changed when editing. Delete and re-add to change mill.</p>}
          </div>

          {/* Paddy type — loaded from paddy_types master list */}
          <div style={s.mb}>
            <label style={s.label}>Paddy Variety * <span style={{ color:"#ef4444" }}>— required</span></label>
            <select
              style={{ ...s.input, borderColor: !form.typeName && err ? "#ef4444" : "#e5e7eb" }}
              value={form.typeName || ""}
              onChange={e => setForm({ ...form, typeName: e.target.value })}
            >
              <option value="">— Select Paddy Variety —</option>
              {paddyVarieties.map(v => <option key={v.id} value={v.type_name}>{v.type_name}</option>)}
            </select>
          </div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Buying Price / kg (Rs) *</label>
              <input
                style={{ ...s.input, fontSize:"1.05rem", fontWeight:700, color:"#059669" }}
                type="number" step="0.01" min="0.01" placeholder="0.00"
                value={form.pricePerKg || ""}
                onChange={e => setForm({ ...form, pricePerKg: e.target.value })}
              />
              <p style={{ margin:"4px 0 0", color:"#aaa", fontSize:"0.73rem" }}>Price mills pay farmers per kg</p>
            </div>
            <div>
              <label style={s.label}>Stock Capacity (kg)</label>
              <input style={s.input} type="number" min="0"
                value={form.stockKg || 0}
                onChange={e => setForm({ ...form, stockKg: e.target.value })} />
            </div>
          </div>

          <div style={s.mb}>
            <label style={s.label}>Description</label>
            <textarea style={{ ...s.input, height:60, resize:"vertical" }} placeholder="Optional notes…"
              value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ ...s.mb }}>
            <label style={s.label}>Status</label>
            <select style={s.input} value={form.status || "active"} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">✅ Active — visible to farmers</option>
              <option value="inactive">⛔ Inactive — hidden</option>
            </select>
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:6 }}>
            <button type="button" onClick={onClose} style={{ background:"#f3f4f6", color:"#374151", border:"none", borderRadius:9, padding:"10px 20px", fontWeight:700, cursor:"pointer" }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ background:"var(--g700)", color:"#fff", border:"none", borderRadius:9, padding:"10px 24px", fontWeight:700, cursor:"pointer" }}>
              {saving ? "Saving…" : editing ? "✅ Update" : "✅ Add Rice Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RiceTypes() {
  const [types,          setTypes]          = useState([]);
  const [mills,          setMills]          = useState([]);
  const [paddyVarieties, setPaddyVarieties] = useState([]);
  const [millFilter,     setMillFilter]     = useState("all");
  const [q,              setQ]              = useState("");
  const [modal,          setModal]          = useState(null);
  const [confirm,        setConfirm]        = useState(null);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      const [tr, mr, pr] = await Promise.all([
        api.get("/rice-types"),
        api.get("/rices"),
        api.get("/paddy-types"),
      ]);
      setTypes(Array.isArray(tr.data) ? tr.data : []);
      setMills(Array.isArray(mr.data) ? mr.data : []);
      setPaddyVarieties((Array.isArray(pr.data) ? pr.data : []).filter(v => v.status === "active"));
    } catch(e) { console.error(e); } finally { setLoading(false); }
  }

  async function remove(id) {
    try { await api.delete(`/rice-types/${id}`); setTypes(prev => prev.filter(t => t.id !== id)); }
    catch(e) { alert(e.response?.data?.message || "Delete failed"); }
    setConfirm(null);
  }

  const millName = (id) => mills.find(m => m.id === id)?.millName || `Mill ${id}`;

  const filtered = types.filter(t => {
    const matchMill = millFilter === "all" || String(t.mill_id) === String(millFilter);
    const matchQ = !q || (t.type_name || "").toLowerCase().includes(q.toLowerCase()) || (t.mill_name || "").toLowerCase().includes(q.toLowerCase());
    return matchMill && matchQ;
  });

  const s = {
    btn:   (bg, fg, sm) => ({ background:bg, color:fg, border:"none", borderRadius:8, padding: sm ? "7px 14px" : "9px 18px", fontWeight: sm ? 600 : 700, fontSize: sm ? "0.8rem" : "0.85rem", cursor:"pointer" }),
    input: { padding:"8px 14px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:"0.9rem", outline:"none" },
    th:    { padding:"12px 14px", background:"#f8fafc", textAlign:"left", fontSize:"0.76rem", color:"#6b7280", fontWeight:700, borderBottom:"1px solid #f0f0f0" },
    td:    { padding:"11px 14px", borderBottom:"1px solid #f8f8f8", fontSize:"0.88rem", color:"#374151", verticalAlign:"middle" },
    badge: (st) => ({ background: st==="active" ? "#d1fae5" : "#fee2e2", color: st==="active" ? "#065f46" : "#991b1b", padding:"2px 10px", borderRadius:20, fontSize:"0.73rem", fontWeight:700 }),
  };

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#888" }}>Loading rice types…</div>;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
        <div>
          <h2 style={{ margin:0, color:"#1a2535" }}>🍚 Rice Types & Buying Prices</h2>
          <p style={{ margin:"5px 0 0", color:"#888", fontSize:"0.82rem" }}>Each rice mill can set a different buying price per paddy variety</p>
        </div>
        <button style={s.btn("var(--g700)","#fff")} onClick={() => setModal({})}>+ Add Rice Type</button>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:15, flexWrap:"wrap", alignItems:"center" }}>
        <input style={{ ...s.input, width:210 }} placeholder="🔍 Search…" value={q} onChange={e => setQ(e.target.value)} />
        <select style={s.input} value={millFilter} onChange={e => setMillFilter(e.target.value)}>
          <option value="all">All Mills</option>
          {mills.map(m => <option key={m.id} value={m.id}>{m.millName}</option>)}
        </select>
        <span style={{ color:"#aaa", fontSize:"0.82rem" }}>{filtered.length} entries</span>
      </div>

      <div style={{ background:"var(--surface)", borderRadius:14, boxShadow:"0 2px 10px #0001", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              <th style={s.th}>Rice Mill</th>
              <th style={s.th}>Paddy Variety</th>
              <th style={s.th}>Buying Price / kg</th>
              <th style={s.th}>Stock Capacity</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td style={s.td}><span style={{ color:"#ccc", fontSize:"0.8rem" }}>{t.id}</span></td>
                <td style={s.td}>
                  <div>
                    <strong style={{ color:"#1a2535" }}>{t.mill_name || millName(t.mill_id)}</strong>
                  </div>
                </td>
                <td style={s.td}>
                  <span style={{ background:"#f0f9ff", color:"#0369a1", padding:"3px 10px", borderRadius:12, fontSize:"0.8rem", fontWeight:600 }}>
                    🌾 {t.type_name}
                  </span>
                </td>
                <td style={s.td}>
                  <strong style={{ color:"#059669", fontSize:"1rem" }}>Rs {Number(t.price_per_kg).toLocaleString()}</strong>
                  <span style={{ color:"#aaa", fontSize:"0.75rem" }}> / kg</span>
                </td>
                <td style={s.td}>{Number(t.stock_kg).toLocaleString()} kg</td>
                <td style={s.td}><span style={s.badge(t.status || "active")}>{t.status || "active"}</span></td>
                <td style={s.td}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button style={s.btn("#f0f4ff","var(--g700)",true)} onClick={() => setModal({ ...t, millId: t.mill_id, typeName: t.type_name, pricePerKg: t.price_per_kg, stockKg: t.stock_kg })}>Edit</button>
                    <button style={s.btn("#fff1f2","#ef4444",true)} onClick={() => setConfirm(t)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign:"center", padding:40, color:"#aaa" }}>
                {q || millFilter !== "all" ? "No entries match your filter." : "No rice types yet. Click + Add Rice Type."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <RiceTypeModal
          type={modal?.id ? modal : null}
          mills={mills}
          paddyVarieties={paddyVarieties}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); loadAll(); }}
        />
      )}
      {confirm && (
        <div style={{ position:"fixed", inset:0, background:"#0007", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"var(--surface)", borderRadius:12, padding:28, width:340, boxShadow:"0 8px 32px #0002" }}>
            <h4 style={{ margin:"0 0 10px" }}>Delete Rice Type?</h4>
            <p style={{ color:"#666", margin:"0 0 20px" }}>Delete <strong>{confirm.type_name}</strong> from <strong>{confirm.mill_name || "this mill"}</strong>?</p>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button style={s.btn("#f3f4f6","#374151")} onClick={() => setConfirm(null)}>Cancel</button>
              <button style={s.btn("#ef4444","#fff")}    onClick={() => remove(confirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
