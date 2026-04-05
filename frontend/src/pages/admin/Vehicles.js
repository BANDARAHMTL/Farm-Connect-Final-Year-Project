import React, { useEffect, useRef, useState } from "react";
import api from "../../api/api";

const API_BASE = "http://localhost:8080";
const LOCATIONS = [
  "Polonnaruwa","Anuradhapura","Ampara","Trincomalee","Kurunegala",
  "Kandy","Galle","Matara","Jaffna","Kegalle","Gampaha","Badulla","Monaragala","Colombo",
];

/* ─── helpers ────────────────────────────────────────────────── */
function resolveImg(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("blob")) return url;
  return API_BASE + url;
}

function StarRating({ value = 0 }) {
  const full  = Math.round(value);
  return (
    <span style={{ color:"#f59e0b", fontSize:"0.9rem", letterSpacing:1 }}>
      {"★".repeat(full)}{"☆".repeat(5 - full)}
      <span style={{ color:"#9ca3af", fontSize:"0.75rem", marginLeft:4 }}>{value.toFixed(1)}</span>
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    Available:   { bg:"#d1fae5", fg:"#065f46", dot:"#10b981" },
    Booked:      { bg:"#dbeafe", fg:"#1e40af", dot:"#3b82f6" },
    Maintenance: { bg:"#fef3c7", fg:"#92400e", dot:"#f59e0b" },
  };
  const c = map[status] || map.Available;
  return (
    <span style={{ background:c.bg, color:c.fg, borderRadius:20, padding:"3px 12px",
      fontSize:"0.73rem", fontWeight:700, display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot, display:"inline-block" }} />
      {status}
    </span>
  );
}

/* ─── Image Upload Zone ──────────────────────────────────────── */
function ImageUploadZone({ preview, onChange, label = "Vehicle Photo" }) {
  const inputRef = useRef();
  const [drag, setDrag]   = useState(false);
  const [error, setError] = useState("");

  function handleFile(file) {
    if (!file) return;
    const allowed = ["image/jpeg","image/jpg","image/png","image/webp","image/gif"];
    if (!allowed.includes(file.type)) { setError("Only JPG, PNG or WEBP images allowed."); return; }
    if (file.size > 10 * 1024 * 1024)  { setError("Image must be under 10 MB."); return; }
    setError("");
    onChange(file, URL.createObjectURL(file));
  }
  function onInputChange(e) { handleFile(e.target.files[0]); }
  function onDrop(e) {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  }

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
          borderRadius: 14,
          background: drag ? "#eff6ff" : preview ? "#f9fafb" : "#fafafa",
          cursor: "pointer",
          transition: "all 0.2s",
          overflow: "hidden",
          minHeight: preview ? 180 : 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {preview ? (
          <>
            <img
              src={resolveImg(preview)}
              alt="preview"
              style={{ width:"100%", height:200, objectFit:"cover", display:"block" }}
              onError={e => { e.target.style.display="none"; }}
            />
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              background:"linear-gradient(transparent, #00000099)",
              color:"#fff", padding:"20px 16px 10px",
              fontSize:"0.8rem", fontWeight:600, textAlign:"center",
            }}>
              📷 Click or drag to change photo
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"24px 20px", color:"#9ca3af" }}>
            <div style={{ fontSize:"3rem", marginBottom:10 }}>🖼️</div>
            <div style={{ fontWeight:700, fontSize:"0.95rem", color:"#374151", marginBottom:6 }}>
              Drop image here, or click to browse
            </div>
            <div style={{ fontSize:"0.8rem" }}>JPG · PNG · WEBP · up to 10 MB</div>
            <div style={{
              marginTop:14, background:"#1a2535", color:"#fff",
              padding:"8px 20px", borderRadius:8, display:"inline-block",
              fontWeight:700, fontSize:"0.85rem",
            }}>
              📂 Choose File
            </div>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*"
        style={{ display:"none" }} onChange={onInputChange} />

      {error && (
        <p style={{ color:"#ef4444", fontSize:"0.8rem", marginTop:6, fontWeight:600 }}>⚠️ {error}</p>
      )}
      {preview && (
        <p style={{ color:"#10b981", fontSize:"0.8rem", marginTop:6, fontWeight:600 }}>
          ✅ Image ready to upload
        </p>
      )}
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────── */
function VehicleModal({ vehicle, onClose, onSave }) {
  const editing = !!vehicle?.id;
  const [form, setForm] = useState(vehicle ? {
    vehicleNumber: vehicle.vehicleNumber || vehicle.vehicle_number || "",
    vehicleType:   vehicle.vehicleType   || vehicle.vehicle_type   || "Tractor",
    model:         vehicle.model         || vehicle.title          || "",
    capacity:      vehicle.capacity      || 4,
    status:        vehicle.status        || "Available",
    ownerName:     vehicle.ownerName     || vehicle.owner_name     || "",
    ownerMobile:   vehicle.ownerMobile   || vehicle.owner_mobile   || "",
    regNumber:     vehicle.regNumber     || vehicle.reg_number     || "",
    rating:        vehicle.rating        || 4.0,
    reviews:       vehicle.reviews       || 0,
    location:      vehicle.location      || LOCATIONS[0],
    pricePerAcre:  vehicle.pricePerAcre  || vehicle.price_per_acre || 3000,
  } : {
    vehicleNumber:"", vehicleType:"Tractor", model:"", capacity:4,
    status:"Available", ownerName:"", ownerMobile:"", regNumber:"",
    rating:4.0, reviews:0, location:LOCATIONS[0], pricePerAcre:3000,
  });

  const [imgFile,  setImgFile]  = useState(null);
  const [preview,  setPreview]  = useState(vehicle?.imageUrl || vehicle?.image_url || null);
  const [saving,   setSaving]   = useState(false);
  const [saveErr,  setSaveErr]  = useState("");

  function setImg(file, blobUrl) { setImgFile(file); setPreview(blobUrl); }
  function f(k)  { return e => setForm(p => ({ ...p, [k]: e.target.value })); }
  function fn(k) { return e => setForm(p => ({ ...p, [k]: Number(e.target.value) })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setSaveErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, String(v)));
      if (imgFile) fd.append("image", imgFile);
      const cfg = { headers:{ "Content-Type":"multipart/form-data" } };
      if (editing) await api.put(`/vehicles/${vehicle.id}`, fd, cfg);
      else         await api.post("/vehicles", fd, cfg);
      onSave();
    } catch (err) {
      setSaveErr(err.response?.data?.message || err.message || "Save failed");
    } finally { setSaving(false); }
  }

  const inp = {
    width:"100%", padding:"10px 13px", border:"1.5px solid #e5e7eb",
    borderRadius:9, fontSize:"0.9rem", boxSizing:"border-box",
    outline:"none", background:"#fafafa", transition:"border-color 0.2s",
  };
  const lbl = { display:"block", fontWeight:700, fontSize:"0.8rem",
    color:"#374151", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.4px" };
  const btn = (bg, fg) => ({
    background:bg, color:fg, border:"none", borderRadius:9,
    padding:"11px 22px", fontWeight:700, fontSize:"0.88rem", cursor:"pointer",
    transition:"opacity 0.15s",
  });

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(15,23,42,0.65)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
      backdropFilter:"blur(4px)",
    }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{
        background:"var(--surface)", borderRadius:18, width:"min(700px,100%)",
        maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px #0003",
        display:"flex", flexDirection:"column",
      }}>
        {/* Header */}
        <div style={{
          padding:"22px 28px 18px", borderBottom:"1.5px solid #f3f4f6",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background: editing ? "linear-gradient(135deg,#1e3a5f,#1a2535)" : "linear-gradient(135deg,#064e3b,#065f46)",
          borderRadius:"18px 18px 0 0", color:"#fff",
        }}>
          <div>
            <h3 style={{ margin:0, fontSize:"1.1rem", fontWeight:800 }}>
              {editing ? "✏️ Edit Vehicle" : "🚜 Add New Vehicle"}
            </h3>
            <p style={{ margin:"3px 0 0", opacity:0.75, fontSize:"0.8rem" }}>
              {editing ? `Editing: ${vehicle.vehicleNumber||vehicle.vehicle_number}` : "Fill in details and upload a photo"}
            </p>
          </div>
          <button onClick={onClose} style={{
            background:"#ffffff20", border:"none", color:"#fff", borderRadius:8,
            width:34, height:34, fontSize:20, cursor:"pointer", lineHeight:"34px", textAlign:"center",
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding:28 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            {/* Left column – fields */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={lbl}>Vehicle No. *</label>
                  <input style={inp} value={form.vehicleNumber} onChange={f("vehicleNumber")} required placeholder="WP-TRC-1001" />
                </div>
                <div>
                  <label style={lbl}>Type</label>
                  <select style={inp} value={form.vehicleType} onChange={f("vehicleType")}>
                    <option>Tractor</option>
                    <option>Harvester</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={lbl}>Model / Name</label>
                <input style={inp} value={form.model} onChange={f("model")} placeholder="e.g. Kubota M7040" />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={lbl}>Owner Name</label>
                  <input style={inp} value={form.ownerName} onChange={f("ownerName")} placeholder="Full name" />
                </div>
                <div>
                  <label style={lbl}>Mobile</label>
                  <input style={inp} value={form.ownerMobile} onChange={f("ownerMobile")} placeholder="07X XXX XXXX" />
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={lbl}>Reg. Number</label>
                  <input style={inp} value={form.regNumber} onChange={f("regNumber")} />
                </div>
                <div>
                  <label style={lbl}>Location</label>
                  <select style={inp} value={form.location} onChange={f("location")}>
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={lbl}>Price / Acre (Rs)</label>
                  <input style={inp} type="number" min="0" value={form.pricePerAcre} onChange={fn("pricePerAcre")} />
                </div>
                <div>
                  <label style={lbl}>Capacity (acres)</label>
                  <input style={inp} type="number" min="0" value={form.capacity} onChange={fn("capacity")} />
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={lbl}>Status</label>
                  <select style={inp} value={form.status} onChange={f("status")}>
                    <option>Available</option>
                    <option>Booked</option>
                    <option>Maintenance</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Rating (0–5)</label>
                  <input style={inp} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={fn("rating")} />
                </div>
              </div>
            </div>

            {/* Right column – image */}
            <div>
              <ImageUploadZone
                preview={preview}
                onChange={setImg}
                label="Vehicle Photo"
              />
              <div style={{
                marginTop:12, padding:"10px 14px", background:"#f8fafc",
                borderRadius:9, border:"1px solid #e5e7eb", fontSize:"0.78rem", color:"#6b7280",
              }}>
                <strong style={{ color:"#374151" }}>📌 Tips:</strong>
                <ul style={{ margin:"6px 0 0", paddingLeft:16, lineHeight:1.7 }}>
                  <li>Use a clear side-view photo</li>
                  <li>Good lighting improves bookings</li>
                  <li>Accepted: JPG, PNG, WEBP ≤ 10MB</li>
                </ul>
              </div>
            </div>
          </div>

          {saveErr && (
            <div style={{
              marginTop:16, padding:"10px 16px", background:"#fef2f2",
              border:"1px solid #fecaca", borderRadius:8, color:"#dc2626", fontSize:"0.85rem",
            }}>⚠️ {saveErr}</div>
          )}

          <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:24, paddingTop:20, borderTop:"1.5px solid #f3f4f6" }}>
            <button type="button" onClick={onClose} style={btn("#f3f4f6","#374151")}>Cancel</button>
            <button type="submit" style={{ ...btn(editing?"#1a2535":"#064e3b","#fff"), minWidth:140, opacity:saving?0.7:1 }} disabled={saving}>
              {saving ? "⏳ Saving…" : (editing ? "✅ Update Vehicle" : "✅ Add Vehicle")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function Vehicles() {
  const [vehicles,   setVehicles]   = useState([]);
  const [q,          setQ]          = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modal,      setModal]      = useState(null);
  const [confirm,    setConfirm]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState("");

  useEffect(() => { load(); }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function load() {
    try { const r = await api.get("/vehicles"); setVehicles(r.data || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function remove(v) {
    try {
      await api.delete(`/vehicles/${v.id}`);
      setVehicles(prev => prev.filter(x => x.id !== v.id));
      showToast(`✅ ${v.vehicleNumber||v.vehicle_number} deleted`);
    } catch (e) { alert(e.response?.data?.message || "Delete failed"); }
    setConfirm(null);
  }

  const filtered = vehicles.filter(v => {
    const vt = v.vehicleType || v.vehicle_type || "";
    const ok = typeFilter === "all" || vt === typeFilter;
    const q2 = q.toLowerCase();
    return ok && (!q || [v.vehicleNumber,v.vehicle_number,v.ownerName,v.owner_name,v.model,v.location]
      .some(s => (s||"").toLowerCase().includes(q2)));
  });

  const counts = {
    total:    vehicles.length,
    tractor:  vehicles.filter(v => (v.vehicleType||v.vehicle_type) === "Tractor").length,
    harvester:vehicles.filter(v => (v.vehicleType||v.vehicle_type) === "Harvester").length,
    available:vehicles.filter(v => v.status === "Available").length,
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300 }}>
      <div style={{ textAlign:"center", color:"#6b7280" }}>
        <div style={{ fontSize:"2.5rem", marginBottom:12 }}>⏳</div>
        <div style={{ fontWeight:600 }}>Loading vehicles…</div>
      </div>
    </div>
  );

  const cardStyle = (accent) => ({
    background:"var(--surface)", borderRadius:12, padding:"16px 20px",
    borderTop:`4px solid ${accent}`, boxShadow:"0 2px 10px #0001",
    flex:1, minWidth:120,
  });

  return (
    <div style={{ maxWidth:1200 }}>
      {/* Toast */}
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
          <h2 style={{ margin:0, fontSize:"1.5rem", fontWeight:800, color:"#1a2535" }}>🚜 Vehicles</h2>
          <p style={{ margin:"4px 0 0", color:"#6b7280", fontSize:"0.85rem" }}>
            Manage tractors and harvesters available for booking
          </p>
        </div>
        <button onClick={() => setModal({})} style={{
          background:"linear-gradient(135deg,#064e3b,#059669)", color:"#fff",
          border:"none", borderRadius:10, padding:"11px 22px",
          fontWeight:700, fontSize:"0.9rem", cursor:"pointer",
          boxShadow:"0 4px 14px #05966940", display:"flex", alignItems:"center", gap:8,
        }}>
          + Add Vehicle
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
        {[
          { label:"Total Vehicles", value:counts.total,     accent:"#6366f1" },
          { label:"Tractors",       value:counts.tractor,   accent:"#f59e0b" },
          { label:"Harvesters",     value:counts.harvester, accent:"#3b82f6" },
          { label:"Available Now",  value:counts.available, accent:"#10b981" },
        ].map(s => (
          <div key={s.label} style={cardStyle(s.accent)}>
            <div style={{ fontSize:"1.8rem", fontWeight:900, color:s.accent }}>{s.value}</div>
            <div style={{ fontSize:"0.78rem", color:"#6b7280", marginTop:2, fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>🔍</span>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search vehicles, owners, locations…"
            style={{
              width:"100%", padding:"9px 12px 9px 36px", border:"1.5px solid #e5e7eb",
              borderRadius:9, fontSize:"0.9rem", outline:"none", boxSizing:"border-box",
            }}
          />
        </div>
        {["all","Tractor","Harvester"].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{
            padding:"9px 18px", borderRadius:9, border:"1.5px solid",
            borderColor: typeFilter===t ? "#1a2535" : "#e5e7eb",
            background: typeFilter===t ? "#1a2535" : "#fff",
            color: typeFilter===t ? "#fff" : "#374151",
            fontWeight:600, fontSize:"0.85rem", cursor:"pointer",
          }}>
            {t==="all" ? "All Types" : t==="Tractor" ? "🚜 Tractors" : "🌾 Harvesters"}
          </button>
        ))}
        <span style={{ color:"#9ca3af", fontSize:"0.82rem", marginLeft:4 }}>{filtered.length} results</span>
      </div>

      {/* Table */}
      <div style={{ background:"var(--surface)", borderRadius:14, boxShadow:"0 2px 12px #0001", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Photo","Vehicle No.","Type","Model","Owner","Location","Price/Acre","Rating","Status","Actions"].map(h => (
                <th key={h} style={{
                  padding:"13px 14px", textAlign:"left", fontSize:"0.72rem",
                  color:"#6b7280", fontWeight:700, borderBottom:"1.5px solid #f0f0f0",
                  textTransform:"uppercase", letterSpacing:"0.5px",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, idx) => {
              const imgSrc = resolveImg(v.imageUrl || v.image_url);
              return (
                <tr key={v.id} style={{ background: idx%2===0?"#fff":"#fafbfc", transition:"background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#f0f9ff"}
                  onMouseLeave={e => e.currentTarget.style.background=idx%2===0?"#fff":"#fafbfc"}>
                  <td style={{ padding:"10px 14px" }}>
                    {imgSrc ? (
                      <img src={imgSrc} alt={v.model||"vehicle"}
                        style={{ width:56, height:44, objectFit:"cover", borderRadius:8,
                          border:"1.5px solid #e5e7eb", display:"block" }}
                        onError={e => {
                          e.target.style.display="none";
                          e.target.nextSibling.style.display="flex";
                        }} />
                    ) : null}
                    <div style={{
                      width:56, height:44, borderRadius:8, background:"#f3f4f6",
                      display: imgSrc ? "none" : "flex", alignItems:"center", justifyContent:"center",
                      fontSize:"1.4rem", border:"1.5px solid #e5e7eb",
                    }}>
                      {(v.vehicleType||v.vehicle_type)==="Harvester" ? "🌾" : "🚜"}
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <strong style={{ color:"#1a2535", fontSize:"0.88rem" }}>{v.vehicleNumber||v.vehicle_number}</strong>
                  </td>
                  <td style={{ padding:"10px 14px", fontSize:"0.85rem", color:"#374151" }}>
                    {(v.vehicleType||v.vehicle_type)==="Harvester" ? "🌾" : "🚜"} {v.vehicleType||v.vehicle_type}
                  </td>
                  <td style={{ padding:"10px 14px", fontSize:"0.85rem", color:"#374151" }}>{v.model||"-"}</td>
                  <td style={{ padding:"10px 14px", fontSize:"0.85rem" }}>
                    <div style={{ color:"#374151", fontWeight:600 }}>{v.ownerName||v.owner_name||"-"}</div>
                    <div style={{ color:"#9ca3af", fontSize:"0.75rem" }}>{v.ownerMobile||v.owner_mobile||""}</div>
                  </td>
                  <td style={{ padding:"10px 14px", fontSize:"0.85rem", color:"#374151" }}>
                    📍 {v.location||"-"}
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ fontWeight:700, color:"#059669" }}>
                      Rs {Number(v.pricePerAcre||v.price_per_acre||0).toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <StarRating value={v.rating||0} />
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <StatusBadge status={v.status||"Available"} />
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={() => setModal(v)} style={{
                        background:"#eff6ff", color:"#1d4ed8", border:"1px solid #bfdbfe",
                        borderRadius:7, padding:"6px 14px", fontWeight:600,
                        fontSize:"0.8rem", cursor:"pointer",
                      }}>Edit</button>
                      <button onClick={() => setConfirm(v)} style={{
                        background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca",
                        borderRadius:7, padding:"6px 14px", fontWeight:600,
                        fontSize:"0.8rem", cursor:"pointer",
                      }}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{ textAlign:"center", padding:"50px 20px", color:"#9ca3af" }}>
                <div style={{ fontSize:"2.5rem", marginBottom:8 }}>🔍</div>
                <div style={{ fontWeight:600 }}>No vehicles found</div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal !== null && (
        <VehicleModal
          vehicle={modal?.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load(); showToast("✅ Vehicle saved successfully!"); }}
        />
      )}

      {/* Confirm Delete */}
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
            <h4 style={{ margin:"0 0 8px", textAlign:"center", color:"#1a2535" }}>Delete Vehicle?</h4>
            <p style={{ color:"#6b7280", textAlign:"center", margin:"0 0 22px", fontSize:"0.9rem" }}>
              Delete <strong>{confirm.vehicleNumber||confirm.vehicle_number}</strong>?<br/>
              This action cannot be undone.
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
