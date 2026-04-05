import React, { useEffect, useState } from "react";
import api from "../../api/api";

const BASE = "http://localhost:8080";
const IMG_PLACEHOLDER = "https://via.placeholder.com/60x60?text=Rice";

function MarketplaceModal({ listing, mills, onClose, onSave }) {
  const editing = !!listing?.id;
  const [form, setForm] = useState(listing || {
    millId:"", riceTypeId:"", title:"", pricePerKg:90, availableKg:1000,
    minOrderKg:5, maxOrderKg:500, description:"", deliveryTime:"1-3 days", status:"active"
  });
  const [riceTypes, setRiceTypes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(listing?.imageUrl||listing?.image_url||null);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    if (form.millId) {
      api.get(`/rice-types?millId=${form.millId}`)
        .then(res => setRiceTypes(Array.isArray(res.data)?res.data:[]))
        .catch(()=>setRiceTypes([]));
    }
  }, [form.millId]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const cfg = { headers: { "Content-Type": "multipart/form-data" } };
      if (editing) await api.put(`/marketplace/${listing.id}`, fd, cfg);
      else         await api.post("/marketplace", fd, cfg);
      onSave();
    } catch(err) { alert(err.response?.data?.message||"Save failed"); }
    finally { setSaving(false); }
  }

  const s = {
    overlay: { position:"fixed", inset:0, background:"#0006", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" },
    modal:   { background:"var(--surface)", borderRadius:14, width:"min(560px,95vw)", maxHeight:"90vh", overflowY:"auto", padding:28 },
    label:   { display:"block", fontWeight:600, fontSize:"0.83rem", color:"#555", marginBottom:5 },
    input:   { width:"100%", padding:"9px 12px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:"0.9rem", boxSizing:"border-box", outline:"none" },
    grid2:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 },
    btn:     (bg,fg) => ({ background:bg, color:fg, border:"none", borderRadius:8, padding:"10px 20px", fontWeight:700, fontSize:"0.88rem", cursor:"pointer" }),
  };

  return (
    <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={s.modal}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
          <h3 style={{ margin:0, color:"#1a2535" }}>{editing?"✏️ Edit Listing":"🛍️ Add Listing"}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer" }}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={s.grid2}>
            <div>
              <label style={s.label}>Rice Mill *</label>
              <select style={s.input} value={form.millId||""} onChange={e=>setForm({...form,millId:e.target.value,riceTypeId:""})} required>
                <option value="">Select mill…</option>
                {mills.map(m=><option key={m.id} value={m.id}>{m.millName}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Rice Type *</label>
              <select style={s.input} value={form.riceTypeId||""} onChange={e=>setForm({...form,riceTypeId:e.target.value})} required disabled={!form.millId}>
                <option value="">Select type…</option>
                {riceTypes.map(t=><option key={t.id} value={t.id}>{t.type_name} (Rs {t.price_per_kg}/kg)</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={s.label}>Listing Title</label>
            <input style={s.input} value={form.title||""} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Araliya Samba Premium 5kg" />
          </div>
          <div style={s.grid2}>
            <div><label style={s.label}>Price / kg (Rs) *</label><input style={s.input} type="number" step="0.01" min="1" value={form.pricePerKg||""} onChange={e=>setForm({...form,pricePerKg:Number(e.target.value)})} required /></div>
            <div><label style={s.label}>Available Stock (kg)</label><input style={s.input} type="number" value={form.availableKg||0} onChange={e=>setForm({...form,availableKg:Number(e.target.value)})} /></div>
          </div>
          <div style={s.grid2}>
            <div><label style={s.label}>Min Order (kg)</label><input style={s.input} type="number" value={form.minOrderKg||1} onChange={e=>setForm({...form,minOrderKg:Number(e.target.value)})} /></div>
            <div><label style={s.label}>Max Order (kg)</label><input style={s.input} type="number" value={form.maxOrderKg||1000} onChange={e=>setForm({...form,maxOrderKg:Number(e.target.value)})} /></div>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={s.label}>Description</label>
            <textarea style={{...s.input,height:64,resize:"vertical"}} value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})} />
          </div>
          <div style={s.grid2}>
            <div><label style={s.label}>Delivery Time</label><input style={s.input} value={form.deliveryTime||"1-3 days"} onChange={e=>setForm({...form,deliveryTime:e.target.value})} /></div>
            <div><label style={s.label}>Status</label>
              <select style={s.input} value={form.status||"active"} onChange={e=>setForm({...form,status:e.target.value})}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={s.label}>Listing Image</label>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              {preview && <img src={preview.startsWith("blob")?preview:(preview.startsWith("http")?preview:BASE+preview)} alt="preview" style={{ width:64,height:64,borderRadius:8,objectFit:"cover",border:"1px solid #eee" }} onError={e=>{e.target.src=IMG_PLACEHOLDER}} />}
              <div>
                <input type="file" accept="image/*" onChange={handleFile} style={{display:"none"}} id="mp-img-input" />
                <label htmlFor="mp-img-input" style={{ ...s.btn("#f0f4ff","var(--g700)"), display:"inline-block", cursor:"pointer", padding:"8px 16px" }}>
                  📷 {preview?"Change Image":"Upload Image"}
                </label>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button type="button" onClick={onClose} style={s.btn("#f3f4f6","#374151")}>Cancel</button>
            <button type="submit" style={s.btn("var(--g700)","#fff")} disabled={saving}>{saving?"Saving…":(editing?"Update":"Add Listing")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [mills,    setMills]    = useState([]);
  const [q, setQ]               = useState("");
  const [millFilter, setMillFilter] = useState("all");
  const [modal,    setModal]    = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      const [lr, mr] = await Promise.all([api.get("/marketplace/admin"), api.get("/rices")]);
      setListings(Array.isArray(lr.data)?lr.data:[]);
      setMills(Array.isArray(mr.data)?mr.data:[]);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  }

  async function remove(id) {
    try { await api.delete(`/marketplace/${id}`); setListings(prev=>prev.filter(l=>l.id!==id)); }
    catch(e) { alert(e.response?.data?.message||"Delete failed"); }
    setConfirm(null);
  }

  const filtered = listings.filter(l => {
    const matchMill = millFilter==="all" || String(l.millId)===String(millFilter);
    const matchQ = !q || (l.title||"").toLowerCase().includes(q.toLowerCase()) ||
      (l.riceTypeName||"").toLowerCase().includes(q.toLowerCase()) ||
      (l.millName||"").toLowerCase().includes(q.toLowerCase());
    return matchMill && matchQ;
  });

  const s = {
    header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 },
    bar:    { display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" },
    input:  { padding:"8px 14px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:"0.9rem", outline:"none" },
    btn:    (bg,fg) => ({ background:bg, color:fg, border:"none", borderRadius:8, padding:"9px 18px", fontWeight:600, fontSize:"0.85rem", cursor:"pointer" }),
    table:  { width:"100%", borderCollapse:"collapse", background:"var(--surface)", borderRadius:12, overflow:"hidden", boxShadow:"var(--shadow-sm)" },
    th:     { padding:"12px 14px", background:"#f8fafc", textAlign:"left", fontSize:"0.78rem", color:"#6b7280", fontWeight:700, borderBottom:"1px solid #f0f0f0" },
    td:     { padding:"11px 14px", borderBottom:"1px solid #f8f8f8", fontSize:"0.88rem", color:"#374151", verticalAlign:"middle" },
    badge:  (s) => ({ background:s==="active"?"#d1fae5":"#fee2e2", color:s==="active"?"#065f46":"#991b1b", padding:"2px 10px", borderRadius:20, fontSize:"0.75rem", fontWeight:700 }),
  };

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#888" }}>Loading marketplace…</div>;

  return (
    <div>
      <div style={s.header}>
        <div>
          <h2 style={{ margin:0, color:"#1a2535" }}>🛍️ Rice Marketplace</h2>
          <p style={{ margin:"4px 0 0", color:"#888", fontSize:"0.83rem" }}>{listings.length} listings in marketplace</p>
        </div>
        <button style={s.btn("var(--g700)","#fff")} onClick={()=>setModal({})}>+ Add Listing</button>
      </div>
      <div style={s.bar}>
        <input style={{...s.input,width:220}} placeholder="🔍 Search listings…" value={q} onChange={e=>setQ(e.target.value)} />
        <select style={s.input} value={millFilter} onChange={e=>setMillFilter(e.target.value)}>
          <option value="all">All Mills</option>
          {mills.map(m=><option key={m.id} value={m.id}>{m.millName}</option>)}
        </select>
        <span style={{ color:"#aaa", fontSize:"0.82rem", alignSelf:"center" }}>{filtered.length} results</span>
      </div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Image</th><th style={s.th}>Title</th><th style={s.th}>Mill</th>
            <th style={s.th}>Rice Type</th><th style={s.th}>Price/kg</th>
            <th style={s.th}>Stock</th><th style={s.th}>Delivery</th>
            <th style={s.th}>Status</th><th style={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(l => (
            <tr key={l.id}>
              <td style={s.td}>
                {l.imageUrl ? (
                  <img
                    src={l.imageUrl.startsWith("http") ? l.imageUrl : BASE + l.imageUrl}
                    alt={l.title}
                    style={{ width:48,height:48,borderRadius:8,objectFit:"cover",border:"1px solid #eee",display:"block" }}
                    onError={e=>{e.target.src=IMG_PLACEHOLDER}}
                  />
                ) : (
                  <div style={{ width:48,height:48,borderRadius:8,background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",border:"1px solid #eee" }}>🍚</div>
                )}
              </td>
              <td style={s.td}><strong>{l.title||l.riceTypeName}</strong></td>
              <td style={s.td}>{l.millName}</td>
              <td style={s.td}><span style={{ background:"#f0f9ff", color:"#0369a1", padding:"2px 8px", borderRadius:12, fontSize:"0.78rem" }}>{l.riceTypeName}</span></td>
              <td style={s.td}><strong style={{ color:"var(--g700)" }}>Rs {Number(l.pricePerKg).toLocaleString()}</strong></td>
              <td style={s.td}>{Number(l.availableKg).toLocaleString()} kg</td>
              <td style={s.td}>{l.deliveryTime}</td>
              <td style={s.td}><span style={s.badge(l.status)}>{l.status}</span></td>
              <td style={s.td}>
                <div style={{ display:"flex", gap:6 }}>
                  <button style={s.btn("#f0f4ff","var(--g700)")} onClick={()=>setModal({...l,millId:l.millId,riceTypeId:l.riceTypeId,pricePerKg:l.pricePerKg,availableKg:l.availableKg,minOrderKg:l.minOrderKg,maxOrderKg:l.maxOrderKg})}>Edit</button>
                  <button style={s.btn("#fff1f2","#ef4444")} onClick={()=>setConfirm(l)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length===0 && <tr><td colSpan={9} style={{ textAlign:"center",padding:40,color:"#aaa" }}>No listings found</td></tr>}
        </tbody>
      </table>

      {modal!==null && <MarketplaceModal listing={modal?.id?modal:null} mills={mills} onClose={()=>setModal(null)} onSave={()=>{setModal(null);loadAll();}} />}
      {confirm && (
        <div style={{ position:"fixed", inset:0, background:"#0006", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"var(--surface)", borderRadius:12, padding:28, width:340, boxShadow:"0 8px 32px #0002" }}>
            <h4 style={{ margin:"0 0 10px" }}>Delete Listing?</h4>
            <p style={{ color:"#666", margin:"0 0 20px" }}>Delete <strong>{confirm.title||confirm.riceTypeName}</strong>?</p>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button style={s.btn("#f3f4f6","#374151")} onClick={()=>setConfirm(null)}>Cancel</button>
              <button style={s.btn("#ef4444","#fff")} onClick={()=>remove(confirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
