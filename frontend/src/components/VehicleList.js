import React from "react";

/* ── Design tokens matching site theme ── */
const T = {
  bg:"#071810", card:"#0e2318", cardB:"#122a1e", border:"#1a3828",
  green:"#22c55e", greenDk:"#16a34a", greenLt:"#86efac",
  gold:"#eab308", text:"#f1f5f2",
  mid:"rgba(241,245,242,0.65)", low:"rgba(241,245,242,0.32)",
};

const BASE = "http://localhost:8080";
const FALLBACK = {
  Tractor:   "https://as1.ftcdn.net/v2/jpg/09/51/54/28/1000_F_951542872_JKqzGL542DkS0SXaCcwMX7QAOqahG1Jw.jpg",
  Harvester: "https://tse1.mm.bing.net/th/id/OIP.Bc-0XefIbXGwjnEpO0govwHaEO?rs=1&pid=ImgDetMain&o=7&rm=3",
};

function getImg(v) {
  const raw = v.imageUrl || v.image_url || v.image || "";
  if (!raw) return FALLBACK[v.type] || FALLBACK.Tractor;
  if (raw.startsWith("http") || raw.startsWith("blob")) return raw;
  return BASE + raw;
}

export default function VehicleList({
  vehicles=[], sessionLabels=[], sessionDurations=[],
  isBooked=()=>false, expandedVehicleId, setExpandedVehicleId=()=>{},
  onBook=()=>{}, date
}) {
  if (!vehicles.length) return null;

  return (
    <>
      {vehicles.map((v, idx) => {
        const expanded = expandedVehicleId === v.id;
        const img      = getImg(v);
        const rating   = Number(v.rating) || +(3.8 + (idx % 5) * 0.18).toFixed(1);
        const reviews  = Number(v.reviews) || (14 + idx * 9);
        const price    = v.pricePerAcre ?? v.price_per_acre ?? 0;
        const available = (v.status || "Available") === "Available";

        return (
          <article key={v.id ?? `v-${idx}`} style={{
            background: T.card,
            borderRadius: 18,
            overflow: "hidden",
            border: expanded
              ? `2px solid ${T.green}`
              : `1.5px solid ${T.border}`,
            boxShadow: expanded
              ? `0 0 0 3px ${T.green}22, 0 16px 40px rgba(0,0,0,0.4)`
              : "0 4px 20px rgba(0,0,0,0.3)",
            transition: "all 0.22s ease",
          }}>

            {/* ── IMAGE — full brightness, responsive height ── */}
            <div style={{ position:"relative", height:200, overflow:"hidden", background:"#0a1e12", flexShrink:0 }}>
              <img
                src={img}
                alt={v.title || v.type}
                onError={e => { e.target.src = FALLBACK[v.type] || FALLBACK.Tractor; }}
                style={{
                  width:"100%", height:"100%",
                  objectFit:"cover", objectPosition:"center",
                  display:"block",
                  transition:"transform 0.5s ease",
                }}
                onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
              />
              {/* Very light tint — keeps image visible */}
              <div style={{ position:"absolute", inset:0, background:"rgba(7,24,16,0.18)" }}/>

              {/* Status badge */}
              <div style={{
                position:"absolute", top:10, left:10,
                background: available ? `${T.greenDk}ee` : "rgba(220,38,38,0.9)",
                color:"#fff", borderRadius:99, padding:"4px 12px",
                fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.05em",
                display:"flex", alignItems:"center", gap:5,
                backdropFilter:"blur(6px)",
              }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:available?"#bbf7d0":"#fca5a5", display:"inline-block" }}/>
                {available ? "Available" : "Booked"}
              </div>

              {/* Type badge */}
              <div style={{
                position:"absolute", top:10, right:10,
                background:"rgba(7,24,16,0.72)", backdropFilter:"blur(10px)",
                color:"rgba(241,245,242,0.9)", borderRadius:99, padding:"4px 12px",
                fontSize:"0.68rem", fontWeight:700, border:`1px solid ${T.border}`,
              }}>
                {v.type || "Tractor"}
              </div>

              {/* Price gradient overlay at bottom */}
              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                background:"linear-gradient(to top, rgba(7,24,16,0.92) 0%, transparent 100%)",
                padding:"28px 16px 12px",
              }}>
                <span style={{ color:"#fff", fontWeight:900, fontSize:"1.15rem", letterSpacing:"-0.3px" }}>
                  Rs {price.toLocaleString()}
                  <span style={{ fontSize:"0.7rem", fontWeight:500, color:T.mid }}> /acre</span>
                </span>
              </div>
            </div>

            {/* ── CARD BODY ── */}
            <div style={{ padding:"18px 20px 20px" }}>

              {/* Name + stars */}
              <div style={{ marginBottom:12 }}>
                <h3 style={{ margin:"0 0 7px", fontSize:"1rem", fontWeight:800, color:T.text, letterSpacing:"-0.2px" }}>
                  {v.title || `${v.type} — Unit ${v.regNumber || v.reg_number || idx + 1}`}
                </h3>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ display:"flex", gap:2 }}>
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                        fill={i <= Math.round(rating) ? "#eab308" : "#1a3828"} stroke="none">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize:"0.77rem", fontWeight:700, color:T.gold }}>{rating.toFixed(1)}</span>
                  <span style={{ fontSize:"0.7rem", color:T.low }}>({reviews} reviews)</span>
                </div>
              </div>

              {/* Meta info grid */}
              <div style={{
                display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 10px",
                background:T.cardB, borderRadius:12, padding:"11px 14px", marginBottom:16,
                border:`1px solid ${T.border}`,
              }}>
                {[
                  { icon:"👤", val: v.ownerName || v.owner_name || "N/A" },
                  { icon:"📍", val: v.location || "Unknown" },
                  { icon:"📞", val: v.ownerMobile || v.owner_mobile || "N/A" },
                  { icon:"🔖", val: v.regNumber || v.reg_number || "—" },
                ].map((m, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:6, color:T.mid, fontSize:"0.77rem" }}>
                    <span>{m.icon}</span>
                    <span style={{ fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.val}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => setExpandedVehicleId(expanded ? null : v.id)} style={{
                  flex:1, padding:"11px 14px", borderRadius:12,
                  border: `1.5px solid ${expanded ? "transparent" : T.border}`,
                  background: expanded
                    ? `linear-gradient(135deg, ${T.bg}, ${T.card})`
                    : "transparent",
                  color: T.mid,
                  fontSize:"0.84rem", fontWeight:700, cursor:"pointer",
                  fontFamily:"inherit", transition:"all 0.15s",
                }}>
                  {expanded ? "▲ Hide" : "View Details"}
                </button>
                <button onClick={() => setExpandedVehicleId(expanded ? null : v.id)} style={{
                  padding:"11px 22px", borderRadius:12, border:"none",
                  background:`linear-gradient(135deg, ${T.greenDk}, ${T.green})`,
                  color:"#fff", fontSize:"0.84rem", fontWeight:800,
                  cursor:"pointer", fontFamily:"inherit",
                  boxShadow:`0 4px 14px ${T.green}44`,
                  display:"flex", alignItems:"center", gap:6,
                }}>
                  🚜 Book
                </button>
              </div>

              {/* ── EXPANDED SESSIONS ── */}
              {expanded && (
                <div style={{ marginTop:18 }}>
                  <div style={{
                    fontSize:"0.68rem", fontWeight:700, color:T.low,
                    textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12,
                    display:"flex", alignItems:"center", gap:8,
                  }}>
                    <div style={{ flex:1, height:1, background:T.border }}/>
                    Time Slots for {date}
                    <div style={{ flex:1, height:1, background:T.border }}/>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {sessionLabels.map((label, sIdx) => {
                      const booked = isBooked(v.id, date, sIdx);
                      return (
                        <div key={sIdx} style={{
                          display:"flex", alignItems:"center", justifyContent:"space-between",
                          padding:"11px 14px", borderRadius:12,
                          background: booked ? "rgba(220,38,38,0.08)" : T.cardB,
                          border: booked ? "1px solid rgba(220,38,38,0.25)" : `1px solid ${T.border}`,
                          transition:"all 0.12s",
                        }}>
                          <div>
                            <div style={{ fontSize:"0.84rem", fontWeight:700, color:T.text }}>
                              Session {sIdx+1} · {label}
                            </div>
                            <div style={{ fontSize:"0.7rem", color:T.low, marginTop:2 }}>
                              {sessionDurations[sIdx] ? `${sessionDurations[sIdx]} hrs` : ""}
                              {!booked && ` · est. Rs ${price.toLocaleString()}/acre`}
                            </div>
                          </div>
                          {booked
                            ? <span style={{ background:"rgba(220,38,38,0.15)", color:"#f87171", borderRadius:99, padding:"5px 14px", fontSize:"0.7rem", fontWeight:800 }}>Booked</span>
                            : <button onClick={() => onBook(v, sIdx)} style={{
                                background:`linear-gradient(135deg,${T.greenDk},${T.green})`,
                                color:"#fff", border:"none", borderRadius:99,
                                padding:"6px 18px", fontSize:"0.76rem", fontWeight:800,
                                cursor:"pointer", fontFamily:"inherit",
                                boxShadow:`0 3px 10px ${T.green}44`,
                              }}>Book Now</button>
                          }
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </>
  );
}
