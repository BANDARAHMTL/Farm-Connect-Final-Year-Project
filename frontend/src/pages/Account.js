import React, { useEffect, useState, useRef } from "react";
import api from "../api/api";

/* ── Design tokens — matches entire site ── */
const T = {
  bg:"#071810", card:"#0e2318", cardB:"#122a1e", border:"#1a3828",
  green:"#22c55e", greenDk:"#16a34a", greenLt:"#86efac",
  gold:"#eab308", blue:"#3b82f6",
  red:"#ef4444",  redLt:"#f87171",
  text:"#f1f5f2", mid:"rgba(241,245,242,0.65)", low:"rgba(241,245,242,0.32)",
};

/* ── Banner slideshow images (same as account) ── */
const BANNER_SLIDES = [
  "https://png.pngtree.com/thumb_back/fh260/background/20240610/pngtree-concept-use-of-the-smart-farmer-system-came-to-help-analysis-image_15746622.jpg",
  "https://media.licdn.com/dms/image/v2/D4D12AQHSkb6l2Xb7nQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1725462960833?e=2147483647&v=beta&t=rqL0A0Ll2q1rVuPOJ_DM6uP_tJ0RESfcuIZpXTaAjjQ",
  "https://tse2.mm.bing.net/th/id/OIP.gXEwO0XRig7tItX-Swm_PwHaEO?w=1792&h=1024&rs=1&pid=ImgDetMain&o=7&rm=3",
];

/* ═══════════════════════════════════════════════
   TOP BANNER — full width slideshow (like other pages)
═══════════════════════════════════════════════ */
function TopBanner({ farmer, onLogout }) {
  const [si, setSi]     = useState(0);
  const [fade, setFade] = useState(true);
  const timer = useRef(null);

  const go = (n) => {
    clearInterval(timer.current);
    setFade(false);
    setTimeout(() => { setSi((n + BANNER_SLIDES.length) % BANNER_SLIDES.length); setFade(true); }, 300);
    timer.current = setInterval(() => setSi(i => (i+1) % BANNER_SLIDES.length), 5000);
  };
  useEffect(() => {
    timer.current = setInterval(() => setSi(i => (i+1) % BANNER_SLIDES.length), 5000);
    return () => clearInterval(timer.current);
  }, []);

  const initials = (farmer?.name || "F").split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);

  return (
    <div style={{ position:"relative", height:280, overflow:"hidden" }}>
      {/* Slide image — full brightness */}
      <div style={{ position:"absolute", inset:0, transition:"opacity 0.35s", opacity:fade?1:0 }}>
        <img src={BANNER_SLIDES[si]} alt="Farm"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }}/>
        {/* left-heavy overlay — text on left, image visible on right */}
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(100deg, rgba(7,24,16,0.92) 0%, rgba(7,24,16,0.62) 45%, rgba(7,24,16,0.15) 75%, transparent 100%)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80,
          background:`linear-gradient(to top, ${T.bg}, transparent)` }}/>
      </div>

      {/* Thumbnail strip — top right */}
      <div style={{ position:"absolute", top:16, right:16, zIndex:10, display:"flex", gap:8 }}>
        {BANNER_SLIDES.map((img, i) => (
          <button key={i} onClick={() => go(i)} style={{
            width:72, height:46, padding:0, border:"none", borderRadius:8, overflow:"hidden",
            cursor:"pointer",
            outline: i===si ? `2.5px solid ${T.gold}` : `1.5px solid rgba(255,255,255,0.2)`,
            outlineOffset:2, opacity:i===si?1:0.55,
            transition:"all 0.25s", boxShadow:i===si?`0 0 14px ${T.gold}55`:"none",
          }}>
            <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          </button>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ position:"absolute", bottom:24, right:20, zIndex:10, display:"flex", gap:7 }}>
        {BANNER_SLIDES.map((_,i) => (
          <button key={i} onClick={() => go(i)} style={{
            width:i===si?22:7, height:7, borderRadius:99, border:"none", cursor:"pointer", padding:0,
            background:i===si?T.gold:"rgba(255,255,255,0.3)", transition:"all 0.3s",
          }}/>
        ))}
      </div>

      {/* Arrows */}
      <button onClick={() => go(si-1)} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", zIndex:10, width:40, height:40, borderRadius:"50%", background:"rgba(7,24,16,0.7)", border:`1px solid ${T.border}`, color:T.text, fontSize:"1.3rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)", lineHeight:1 }}>‹</button>
      <button onClick={() => go(si+1)} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", zIndex:10, width:40, height:40, borderRadius:"50%", background:"rgba(7,24,16,0.7)", border:`1px solid ${T.border}`, color:T.text, fontSize:"1.3rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)", lineHeight:1 }}>›</button>

      {/* Content — left aligned */}
      <div style={{ position:"relative", zIndex:5, height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 52px" }}>
        {farmer ? (
          <>
            <div style={{ fontSize:"0.66rem", color:T.greenLt, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:24, height:1.5, background:T.greenLt }}/> Farmer Dashboard
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:16 }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:`linear-gradient(135deg,${T.greenDk},${T.green})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", fontWeight:900, color:"#fff", flexShrink:0, boxShadow:`0 0 24px ${T.green}55` }}>
                {initials}
              </div>
              <div>
                <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:900, color:T.text, margin:"0 0 4px", letterSpacing:"-0.5px" }}>
                  Welcome back, <span style={{ color:T.gold }}>{farmer.name}</span>
                </h1>
                <p style={{ color:T.mid, fontSize:"0.83rem", margin:0 }}>
                  {farmer.email} · Member since {farmer.created_at ? new Date(farmer.created_at).toLocaleDateString("en-GB") : "N/A"}
                </p>
              </div>
            </div>
            <button onClick={onLogout} style={{ width:"fit-content", background:"rgba(239,68,68,0.12)", color:T.redLt, border:"1px solid rgba(239,68,68,0.28)", borderRadius:99, padding:"7px 18px", fontSize:"0.78rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize:"0.66rem", color:T.gold, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:24, height:1.5, background:T.gold }}/> Farmer Account
            </div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:900, color:T.text, margin:"0 0 10px", letterSpacing:"-1px" }}>
              Your Farm,<br/><span style={{ color:T.gold }}>Your Control</span>
            </h1>
            <p style={{ color:T.mid, fontSize:"0.9rem", lineHeight:1.75, maxWidth:400 }}>
              Sign in to manage bookings, track paddy selling requests, and access your full dashboard.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Status badge ── */
function Badge({ status }) {
  const s = (status||"pending").toLowerCase();
  const color = s==="approved"||s==="completed" ? T.green : s==="rejected" ? T.red : T.gold;
  return (
    <span style={{ display:"inline-block", padding:"3px 12px", borderRadius:99,
      fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.05em",
      background:`${color}1a`, color, border:`1px solid ${color}40` }}>
      {(status||"PENDING").toUpperCase()}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function Account({ setCurrentPage }) {
  const [farmer,   setFarmer]   = useState(null);
  const [bookings, setBookings] = useState([]);
  const [sellings, setSellings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("profile");

  useEffect(() => {
    const token  = localStorage.getItem("farmerToken");
    const cached = localStorage.getItem("farmer");
    if (!token || !cached) { setLoading(false); return; }
    let fd;
    try { fd = JSON.parse(cached); } catch { setLoading(false); return; }
    setFarmer(fd); setLoading(false);
    (async () => {
      try { const r = await api.get(`/bookings/user/${fd.id}`); setBookings(Array.isArray(r.data.data)?r.data.data:[]); } catch { setBookings([]); }
      try {
        const r = await api.get("/selling");
        setSellings((r.data.data||[]).filter(s => String(s.farmer_id)===String(fd.id)));
      } catch { setSellings([]); }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farmerToken");
    localStorage.removeItem("farmer");
    setFarmer(null);
    setCurrentPage("Home");
  };

  if (loading) return (
    <div style={{ background:T.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ textAlign:"center", color:T.mid }}>
        <div style={{ fontSize:"2.5rem", marginBottom:12 }}>🌿</div>
        <div style={{ fontSize:"0.9rem" }}>Loading your account…</div>
      </div>
    </div>
  );

  return (
    <div style={{ background:T.bg, minHeight:"100vh", fontFamily:"'Inter',sans-serif", color:T.text }}>

      {/* ── FULL WIDTH BANNER SLIDESHOW ── */}
      <TopBanner farmer={farmer} onLogout={handleLogout}/>

      {/* ── NOT LOGGED IN — sign in prompt below banner ── */}
      {!farmer && (
        <div style={{ maxWidth:480, margin:"48px auto 80px", padding:"0 24px" }}>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"40px 36px", textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:`${T.green}18`, border:`1px solid ${T.green}38`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem", margin:"0 auto 20px" }}>🔐</div>
            <h3 style={{ fontFamily:"Georgia,serif", fontSize:"1.6rem", fontWeight:900, color:T.text, margin:"0 0 10px" }}>Sign In Required</h3>
            <p style={{ color:T.low, fontSize:"0.86rem", lineHeight:1.75, marginBottom:28 }}>
              Please sign in or create a free account to access your farmer dashboard, bookings, and selling history.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <button onClick={()=>setCurrentPage("AccountSignIn")} style={{ background:`linear-gradient(135deg,${T.greenDk},${T.green})`, color:"#fff", border:"none", borderRadius:12, padding:"14px", fontSize:"0.92rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 0 22px ${T.green}44` }}>
                Sign In
              </button>
              <button onClick={()=>setCurrentPage("AccountSignUp")} style={{ background:"transparent", color:T.mid, border:`1px solid ${T.border}`, borderRadius:12, padding:"13px", fontSize:"0.9rem", cursor:"pointer", fontFamily:"inherit" }}>
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGGED IN CONTENT ── */}
      {farmer && (
        <>
          {/* Quick stats row */}
          <div style={{ background:T.card, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px", display:"flex", gap:0 }}>
              {[
                { n:bookings.length, l:"Total Bookings",       c:T.gold  },
                { n:sellings.length, l:"Selling Requests",     c:T.green },
                { n:bookings.filter(b=>(b.status||"").toLowerCase()==="completed").length, l:"Completed", c:T.blue },
                { n:bookings.filter(b=>(b.status||"").toLowerCase()==="pending").length,   l:"Pending",   c:"#fb923c" },
              ].map((s,i) => (
                <div key={i} style={{ flex:1, padding:"18px 20px", textAlign:"center", borderRight:i<3?`1px solid ${T.border}`:"none" }}>
                  <div style={{ fontSize:"1.8rem", fontWeight:900, color:s.c, letterSpacing:"-0.5px", lineHeight:1 }}>{s.n}</div>
                  <div style={{ fontSize:"0.66rem", color:T.low, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ background:T.card, borderBottom:`1px solid ${T.border}`, position:"sticky", top:56, zIndex:40 }}>
            <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px", display:"flex", gap:0 }}>
              {[
                { id:"profile",  label:"👤 Profile"                               },
                { id:"bookings", label:`🚜 Bookings (${bookings.length})`          },
                { id:"sellings", label:`🌾 Selling History (${sellings.length})`  },
              ].map(t => (
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  background:"transparent", border:"none",
                  borderBottom: tab===t.id ? `3px solid ${T.gold}` : "3px solid transparent",
                  color: tab===t.id ? T.gold : T.low,
                  padding:"15px 24px", fontSize:"0.82rem", fontWeight:700,
                  cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.02em",
                  transition:"color 0.15s",
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 40px 72px" }}>

            {/* ══ PROFILE ══ */}
            {tab==="profile" && (
              <div>
                <SecHead title="Profile Details" sub="Your registered farmer information"/>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10, marginBottom:28 }}>
                  {[
                    ["Farmer ID",    farmer.farmer_id   || "—"],
                    ["Full Name",    farmer.name        || "—"],
                    ["Email",        farmer.email       || "—"],
                    ["Mobile",       farmer.mobile      || "—"],
                    ["NIC",          farmer.nic         || "—"],
                    ["Address",      farmer.address     || "—"],
                    ["Land Number",  farmer.land_number || "—"],
                    ["Member Since", farmer.created_at ? new Date(farmer.created_at).toLocaleDateString("en-GB") : "N/A"],
                  ].map(([k,v],i) => (
                    <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 20px" }}>
                      <div style={{ fontSize:"0.66rem", fontWeight:700, color:T.low, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>{k}</div>
                      <div style={{ fontWeight:600, color:T.text, fontSize:"0.92rem", wordBreak:"break-all" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  <ABtn label="🚜 Book Equipment" color={T.gold}  dark onClick={()=>setCurrentPage("Booking")}/>
                  <ABtn label="🌾 Sell Paddy"     color={T.green}      onClick={()=>setCurrentPage("Selling")}/>
                  <ABtn label="🛒 Rice Market"    color={T.blue}       onClick={()=>setCurrentPage("Marketplace")}/>
                </div>
              </div>
            )}

            {/* ══ BOOKINGS ══ */}
            {tab==="bookings" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <SecHead title="My Bookings" sub="All equipment booking requests"/>
                  <ABtn label="+ New Booking" color={T.gold} dark small onClick={()=>setCurrentPage("Booking")}/>
                </div>
                {bookings.length===0
                  ? <Empty icon="📅" msg="No bookings yet" btn="Book Equipment" onClick={()=>setCurrentPage("Booking")}/>
                  : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {bookings.map(b => (
                        <div key={b.id} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"18px 22px" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:16, alignItems:"center" }}>
                            <div>
                              <div style={{ fontWeight:700, color:T.text, marginBottom:3 }}>{b.vehicle_name||b.vehicle_type||"Vehicle"}</div>
                              <div style={{ fontSize:"0.74rem", color:T.low }}>📅 {b.booking_date||"—"} · {b.session_label||"—"}</div>
                            </div>
                            <InfoCell label="Area"    value={`${b.area_acres||"—"} ac`}/>
                            <InfoCell label="Payment" value={b.payment_method||"—"}/>
                            <InfoCell label="Total"   value={`Rs ${Number(b.total_price||0).toLocaleString()}`} accent={T.gold}/>
                            <Badge status={b.status}/>
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            )}

            {/* ══ SELLINGS ══ */}
            {tab==="sellings" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <SecHead title="Selling History" sub="Your paddy selling requests"/>
                  <ABtn label="+ New Request" color={T.green} small onClick={()=>setCurrentPage("Selling")}/>
                </div>
                {sellings.length===0
                  ? <Empty icon="🌾" msg="No selling requests yet" btn="Sell Paddy" onClick={()=>setCurrentPage("Selling")}/>
                  : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {sellings.map(s => (
                        <div key={s.id} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"18px 22px" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:16, alignItems:"center" }}>
                            <div>
                              <div style={{ fontWeight:700, color:T.text, marginBottom:3 }}>{s.rice_type||"Paddy"}</div>
                              <div style={{ fontSize:"0.74rem", color:T.low }}>📅 {s.created_at?new Date(s.created_at).toLocaleDateString("en-GB"):"—"}</div>
                            </div>
                            <InfoCell label="Stock"  value={`${s.stock_kg||"—"} kg`}/>
                            <InfoCell label="Rate"   value={`Rs ${s.price_per_kg||"—"}/kg`}/>
                            <InfoCell label="Total"  value={`Rs ${Number(s.total_price||0).toLocaleString()}`} accent={T.green}/>
                            <Badge status={s.status}/>
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}

/* ── Helper components ── */
function SecHead({ title, sub }) {
  return (
    <div style={{ marginBottom:22 }}>
      <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.5rem", fontWeight:900, color:T.text, margin:"0 0 5px" }}>{title}</h2>
      <p style={{ color:T.low, fontSize:"0.8rem", margin:0 }}>{sub}</p>
    </div>
  );
}

function InfoCell({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontSize:"0.64rem", fontWeight:700, color:T.low, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{label}</div>
      <div style={{ fontWeight:700, color:accent||T.text, fontSize:"0.88rem" }}>{value}</div>
    </div>
  );
}

function ABtn({ label, color, dark, small, onClick }) {
  return (
    <button onClick={onClick} style={{
      background:`linear-gradient(135deg,${color}cc,${color})`,
      color: dark ? T.bg : "#fff", border:"none",
      borderRadius:10, padding:small?"9px 18px":"12px 22px",
      fontSize:small?"0.79rem":"0.87rem", fontWeight:800,
      cursor:"pointer", fontFamily:"inherit",
      boxShadow:`0 0 14px ${color}33`,
    }}>{label}</button>
  );
}

function Empty({ icon, msg, btn, onClick }) {
  return (
    <div style={{ textAlign:"center", padding:"52px 32px", background:T.card, borderRadius:18, border:`1px dashed ${T.border}` }}>
      <div style={{ fontSize:"2.5rem", marginBottom:12 }}>{icon}</div>
      <div style={{ fontWeight:600, color:T.low, fontSize:"0.92rem", marginBottom:20 }}>{msg}</div>
      <button onClick={onClick} style={{ background:`linear-gradient(135deg,${T.greenDk},${T.green})`, color:"#fff", border:"none", borderRadius:10, padding:"11px 22px", fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>{btn}</button>
    </div>
  );
}
