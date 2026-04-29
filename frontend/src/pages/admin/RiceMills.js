import React, { useEffect, useRef, useState } from "react";
import api from "../../api/api";

const API_BASE = "http://localhost:8080";

function resolveImg(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("blob")) return url;
  return API_BASE + url;
}

/* ─── Image Upload Zone ──────────────────────────────────────── */
function ImageUploadZone({ preview, onChange, label = "Mill Photo" }) {
  const inputRef = useRef();
  const [drag,  setDrag]  = useState(false);
  const [error, setError] = useState("");

  function handleFile(file) {
    if (!file) return;
    const allowed = ["image/jpeg","image/jpg","image/png","image/webp","image/gif"];
    if (!allowed.includes(file.type)) { setError("Only JPG, PNG or WEBP images."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10 MB."); return; }
    setError("");
    onChange(file, URL.createObjectURL(file));
  }
  function onDrop(e) { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }

  return (
    <div>
      <label style={{ display:"block", fontWeight:700, fontSize:"0.82rem",
        color:"#374151", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>
        {label}
      </label>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        style={{
          border: drag ? "2.5px dashed #3b82f6" : preview ? "2.5px solid #e5e7eb" : "2.5px dashed #d1d5db",
          borderRadius:14, background: drag ? "#eff6ff" : "#fafafa",
          cursor:"pointer", transition:"all 0.2s", overflow:"hidden",
          minHeight: preview ? 0 : 140, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", position:"relative",
        }}
      >
        {preview ? (
          <>
            <img src={resolveImg(preview)} alt="preview"
              style={{ width:"100%", height:210, objectFit:"cover", display:"block" }}
              onError={e => { e.target.style.display="none"; }} />
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              background:"linear-gradient(transparent,#00000099)", color:"#fff",
              padding:"20px 16px 10px", fontSize:"0.8rem", fontWeight:600, textAlign:"center",
            }}>📷 Click or drag to replace photo</div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"30px 20px", color:"#9ca3af" }}>
            <div style={{ fontSize:"3.2rem", marginBottom:10 }}>🏭</div>
            <div style={{ fontWeight:700, fontSize:"0.95rem", color:"#374151", marginBottom:6 }}>
              Drop mill photo here
            </div>
            <div style={{ fontSize:"0.8rem", marginBottom:14 }}>JPG · PNG · WEBP · max 10 MB</div>
            <div style={{
              background:"#1a2535", color:"#fff", padding:"8px 20px",
              borderRadius:8, display:"inline-block", fontWeight:700, fontSize:"0.85rem",
            }}>📂 Choose File</div>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*"
        style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
      {error && <p style={{ color:"#ef4444", fontSize:"0.8rem", marginTop:6 }}>⚠️ {error}</p>}
      {preview && !error && (
        <p style={{ color:"#10b981", fontSize:"0.8rem", marginTop:6, fontWeight:600 }}>✅ Image ready</p>
      )}
    </div>
  );
}

/* ─── Mill Modal ─────────────────────────────────────────────── */
function MillModal({ mill, onClose, onSave }) {
  const editing = !!mill?.id;
  const [form, setForm] = useState(mill ? {
    millName:      mill.millName      || "",
    location:      mill.location      || "",
    address:       mill.address       || "",
    contactNumber: mill.contactNumber || "",
    email:         mill.email         || "",
    description:   mill.description   || "",
    rating:        mill.rating        || 4.0,
    status:        mill.status        || "active",
  } : {
    millName:"", location:"", address:"", contactNumber:"",
    email:"", description:"", rating:4.0, status:"active",
  });

  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(mill?.imageUrl || mill?.image_url || null);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState("");

  function f(k)  { return e => setForm(p => ({ ...p, [k]: e.target.value })); }
  function fn(k) { return e => setForm(p => ({ ...p, [k]: Number(e.target.value) })); }
  function setImg(file, blobUrl) { setImgFile(file); setPreview(blobUrl); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imgFile) fd.append("image", imgFile);
      const cfg = { headers:{ "Content-Type":"multipart/form-data" } };
      if (editing) await api.put(`/rices/${mill.id}`, fd, cfg);
      else         await api.post("/rices", fd, cfg);
      onSave();
    } catch (ex) {
      setErr(ex.response?.data?.message || ex.message || "Save failed");
    } finally { setSaving(false); }
  }

  const inp = {
    width:"100%", padding:"10px 13px", border:"1.5px solid #e5e7eb",
    borderRadius:9, fontSize:"0.9rem", boxSizing:"border-box",
    outline:"none", background:"#fafafa",
  };
  const lbl = {
    display:"block", fontWeight:700, fontSize:"0.8rem",
    color:"#374151", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.4px",
  };
  const btn = (bg, fg) => ({
    background:bg, color:fg, border:"none", borderRadius:9,
    padding:"11px 22px", fontWeight:700, fontSize:"0.88rem", cursor:"pointer",
  });

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(15,23,42,0.65)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
      backdropFilter:"blur(4px)",
    }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{
        background:"var(--surface)", borderRadius:18, width:"min(720px,100%)",
        maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px #0003",
      }}>
        {/* Header */}
        <div style={{
          padding:"22px 28px 18px", borderBottom:"1.5px solid #f3f4f6",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:"linear-gradient(135deg,#713f12,#a16207)",
          borderRadius:"18px 18px 0 0", color:"#fff",
        }}>
          <div>
            <h3 style={{ margin:0, fontSize:"1.1rem", fontWeight:800 }}>
              {editing ? "✏️ Edit Rice Mill" : "🏭 Add New Rice Mill"}
            </h3>
            <p style={{ margin:"3px 0 0", opacity:0.75, fontSize:"0.8rem" }}>
              {editing ? `Editing: ${mill.millName}` : "Fill in details and upload a mill photo"}
            </p>
          </div>
          <button onClick={onClose} style={{
            background:"#ffffff20", border:"none", color:"#fff", borderRadius:8,
            width:34, height:34, fontSize:20, cursor:"pointer",
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding:28 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            {/* Left – fields */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div style={{ gridColumn:"span 2" }}>
                  <label style={lbl}>Mill Name *</label>
                  <input style={inp} value={form.millName} onChange={f("millName")} required placeholder="e.g. Araliya Rice Mill" />
                </div>
                <div>
                  <label style={lbl}>Location *</label>
                  <input style={inp} value={form.location} onChange={f("location")} required placeholder="City / District" />
                </div>
                <div>
                  <label style={lbl}>Contact No.</label>
                  <input style={inp} value={form.contactNumber} onChange={f("contactNumber")} placeholder="07X XXX XXXX" />
                </div>
              </div>

              <div>
                <label style={lbl}>Address</label>
                <input style={inp} value={form.address} onChange={f("address")} placeholder="Full street address" />
              </div>

              <div>
                <label style={lbl}>Email</label>
                <input style={inp} type="email" value={form.email} onChange={f("email")} placeholder="mill@example.com" />
              </div>

              <div>
                <label style={lbl}>Description</label>
                <textarea style={{ ...inp, height:90, resize:"vertical" }}
                  value={form.description} onChange={f("description")}
                  placeholder="Brief description of the mill and specialty…" />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={lbl}>Rating (0–5)</label>
                  <input style={inp} type="number" min="0" max="5" step="0.1"
                    value={form.rating} onChange={fn("rating")} />
                </div>
                <div>
                  <label style={lbl}>Status</label>
                  <select style={inp} value={form.status} onChange={f("status")}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right – image */}
            <div>
              <ImageUploadZone preview={preview} onChange={setImg} label="Rice Mill Photo" />
              <div style={{
                marginTop:12, padding:"10px 14px", background:"#fffbeb",
                borderRadius:9, border:"1px solid #fde68a", fontSize:"0.78rem", color:"#92400e",
              }}>
                <strong>📌 Tips:</strong>
                <ul style={{ margin:"6px 0 0", paddingLeft:16, lineHeight:1.7 }}>
                  <li>Show the mill building or entrance</li>
                  <li>Landscape orientation works best</li>
                  <li>Accepted: JPG, PNG, WEBP ≤ 10 MB</li>
                </ul>
              </div>
            </div>
          </div>

          {err && (
            <div style={{
              marginTop:16, padding:"10px 16px", background:"#fef2f2",
              border:"1px solid #fecaca", borderRadius:8, color:"#dc2626", fontSize:"0.85rem",
            }}>⚠️ {err}</div>
          )}

          <div style={{
            display:"flex", gap:12, justifyContent:"flex-end",
            marginTop:24, paddingTop:20, borderTop:"1.5px solid #f3f4f6",
          }}>
            <button type="button" onClick={onClose} style={btn("#f3f4f6","#374151")}>Cancel</button>
            <button type="submit"
              style={{ ...btn(editing?"#713f12":"#a16207","#fff"), minWidth:150, opacity:saving?0.7:1 }}
              disabled={saving}>
              {saving ? "⏳ Saving…" : editing ? "✅ Update Mill" : "✅ Add Rice Mill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function RiceMills() {
  const [mills,   setMills]   = useState([]);
  const [q,       setQ]       = useState("");
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState("");

  useEffect(() => { load(); }, []);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function load() {
    try { const r = await api.get("/rices"); setMills(Array.isArray(r.data.data) ? r.data.data : []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function remove(m) {
    try {
      await api.delete(`/rices/${m.id}`);
      setMills(prev => prev.filter(x => x.id !== m.id));
      showToast(`✅ ${m.millName} deleted`);
    } catch (e) { alert(e.response?.data?.message || "Delete failed"); }
    setConfirm(null);
  }

  const filtered = mills.filter(m =>
    !q ||
    (m.millName||"").toLowerCase().includes(q.toLowerCase()) ||
    (m.location||"").toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300 }}>
      <div style={{ textAlign:"center", color:"#6b7280" }}>
        <div style={{ fontSize:"2.5rem", marginBottom:12 }}>⏳</div>
        <div style={{ fontWeight:600 }}>Loading rice mills…</div>
      </div>
    </div>
  );

  const statusBadge = (s) => ({
    background: s==="active" ? "#d1fae5" : "#fee2e2",
    color:      s==="active" ? "#065f46" : "#991b1b",
    padding:"3px 12px", borderRadius:20, fontSize:"0.73rem", fontWeight:700,
    display:"inline-flex", alignItems:"center", gap:5,
  });

  return (
    <div style={{ maxWidth:1100 }}>
      {toast && (
        <div style={{
          position:"fixed", top:20, right:20, background:"#1a2535", color:"#fff",
          padding:"12px 20px", borderRadius:10, zIndex:9999,
          boxShadow:"0 8px 24px #0003", fontSize:"0.88rem", fontWeight:600,
        }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <h2 style={{ margin:0, fontSize:"1.5rem", fontWeight:800, color:"#1a2535" }}>🏭 Rice Mills</h2>
          <p style={{ margin:"4px 0 0", color:"#6b7280", fontSize:"0.85rem" }}>
            Manage all registered rice mills — {mills.length} total
          </p>
        </div>
        <button onClick={() => setModal({})} style={{
          background:"linear-gradient(135deg,#713f12,#a16207)", color:"#fff",
          border:"none", borderRadius:10, padding:"11px 22px",
          fontWeight:700, fontSize:"0.9rem", cursor:"pointer",
          boxShadow:"0 4px 14px #a1620740", display:"flex", alignItems:"center", gap:8,
        }}>
          + Add Rice Mill
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
        {[
          { label:"Total Mills",    value:mills.length,                                          accent:"#a16207" },
          { label:"Active",         value:mills.filter(m=>m.status==="active").length,           accent:"#10b981" },
          { label:"Inactive",       value:mills.filter(m=>m.status!=="active").length,           accent:"#ef4444" },
          { label:"With Photos",    value:mills.filter(m=>m.imageUrl||m.image_url).length,       accent:"#3b82f6" },
        ].map(s => (
          <div key={s.label} style={{
            background:"var(--surface)", borderRadius:12, padding:"16px 20px",
            borderTop:`4px solid ${s.accent}`, boxShadow:"0 2px 10px #0001", flex:1, minWidth:120,
          }}>
            <div style={{ fontSize:"1.8rem", fontWeight:900, color:s.accent }}>{s.value}</div>
            <div style={{ fontSize:"0.78rem", color:"#6b7280", marginTop:2, fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display:"flex", gap:10, marginBottom:18, alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, maxWidth:340 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>🔍</span>
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search by name or location…"
            style={{
              width:"100%", padding:"9px 12px 9px 36px", border:"1.5px solid #e5e7eb",
              borderRadius:9, fontSize:"0.9rem", outline:"none", boxSizing:"border-box",
            }} />
        </div>
        <span style={{ color:"#9ca3af", fontSize:"0.82rem" }}>{filtered.length} results</span>
      </div>

      {/* Grid cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
        {filtered.map(m => {
          const img = resolveImg(m.imageUrl || m.image_url);
          return (
            <div key={m.id} style={{
              background:"var(--surface)", borderRadius:14, overflow:"hidden",
              boxShadow:"0 3px 14px #0001", border:"1px solid #f0f0f0",
              transition:"transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 28px #0002"; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 3px 14px #0001"; }}>
              {/* Image */}
              <div style={{ height:160, background:"#f3f4f6", position:"relative", overflow:"hidden" }}>
                {img ? (
                  <img src={img} alt={m.millName}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
                ) : null}
                <div style={{
                  display: img ? "none" : "flex",
                  width:"100%", height:"100%",
                  alignItems:"center", justifyContent:"center",
                  flexDirection:"column", color:"#d1d5db",
                }}>
                  <div style={{ fontSize:"3.5rem" }}>🏭</div>
                  <div style={{ fontSize:"0.78rem", marginTop:6, fontWeight:600 }}>No photo yet</div>
                </div>
                <div style={{
                  position:"absolute", top:10, right:10,
                }}>
                  <span style={statusBadge(m.status)}>
                    <span style={{ width:6, height:6, borderRadius:"50%",
                      background:m.status==="active"?"#10b981":"#ef4444", display:"inline-block" }} />
                    {m.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding:"16px 18px" }}>
                <h4 style={{ margin:"0 0 4px", color:"#1a2535", fontSize:"1rem", fontWeight:800 }}>{m.millName}</h4>
                <p style={{ margin:"0 0 10px", color:"#6b7280", fontSize:"0.83rem" }}>📍 {m.location}</p>
                {m.contactNumber && (
                  <p style={{ margin:"0 0 6px", color:"#374151", fontSize:"0.83rem" }}>📞 {m.contactNumber}</p>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                  <span style={{ color:"#f59e0b", fontSize:"0.88rem" }}>
                    {"★".repeat(Math.round(m.rating||0))}{"☆".repeat(5-Math.round(m.rating||0))}
                    <span style={{ color:"#9ca3af", fontSize:"0.75rem", marginLeft:4 }}>
                      {(m.rating||0).toFixed(1)}
                    </span>
                  </span>
                  <span style={{
                    background:"#f0fdf4", color:"#065f46", padding:"2px 10px",
                    borderRadius:12, fontSize:"0.75rem", fontWeight:700,
                  }}>
                    {m.typeCount||0} rice types
                  </span>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:14, paddingTop:12, borderTop:"1px solid #f3f4f6" }}>
                  <button onClick={() => setModal(m)} style={{
                    flex:1, background:"#eff6ff", color:"#1d4ed8",
                    border:"1px solid #bfdbfe", borderRadius:8,
                    padding:"8px", fontWeight:700, fontSize:"0.82rem", cursor:"pointer",
                  }}>✏️ Edit</button>
                  <button onClick={() => setConfirm(m)} style={{
                    flex:1, background:"#fef2f2", color:"#dc2626",
                    border:"1px solid #fecaca", borderRadius:8,
                    padding:"8px", fontWeight:700, fontSize:"0.82rem", cursor:"pointer",
                  }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty */}
        {filtered.length === 0 && (
          <div style={{ gridColumn:"span 4", textAlign:"center", padding:"60px 20px", color:"#9ca3af" }}>
            <div style={{ fontSize:"3rem", marginBottom:10 }}>🏭</div>
            <div style={{ fontWeight:600, fontSize:"1rem" }}>No rice mills found</div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <MillModal
          mill={modal?.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load(); showToast("✅ Rice mill saved!"); }}
        />
      )}

      {/* Confirm */}
      {confirm && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(15,23,42,0.6)", zIndex:999,
          display:"flex", alignItems:"center", justifyContent:"center",
          backdropFilter:"blur(3px)",
        }}>
          <div style={{
            background:"var(--surface)", borderRadius:14, padding:28, width:"min(380px,90vw)",
            boxShadow:"0 16px 48px #0003",
          }}>
            <div style={{ fontSize:"2.5rem", textAlign:"center", marginBottom:12 }}>🗑️</div>
            <h4 style={{ margin:"0 0 8px", textAlign:"center" }}>Delete Rice Mill?</h4>
            <p style={{ color:"#6b7280", textAlign:"center", margin:"0 0 8px", fontSize:"0.9rem" }}>
              Delete <strong>{confirm.millName}</strong>?
            </p>
            <p style={{ color:"#ef4444", textAlign:"center", margin:"0 0 22px", fontSize:"0.82rem" }}>
              ⚠️ All rice types and marketplace listings will also be deleted.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{
                flex:1, background:"#f3f4f6", color:"#374151", border:"none",
                borderRadius:9, padding:12, fontWeight:700, cursor:"pointer",
              }} onClick={() => setConfirm(null)}>Cancel</button>
              <button style={{
                flex:1, background:"#dc2626", color:"#fff", border:"none",
                borderRadius:9, padding:12, fontWeight:700, cursor:"pointer",
              }} onClick={() => remove(confirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
