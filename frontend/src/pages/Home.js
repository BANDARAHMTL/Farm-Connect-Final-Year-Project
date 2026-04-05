import React, { useEffect, useState, useRef } from "react";
import api from "../api/api";

const T = {
  bg:"#071810", card:"#0e2318", cardB:"#122a1e", border:"#1a3828",
  green:"#22c55e", greenDk:"#16a34a", greenLt:"#86efac",
  gold:"#eab308", goldLt:"#fef08a",
  blue:"#3b82f6", blLt:"#93c5fd",
  text:"#f1f5f2", mid:"rgba(241,245,242,0.65)", low:"rgba(241,245,242,0.32)",
};

const SLIDES = [
  { img:"https://agrospectrumindia.com/wp-content/uploads/2025/01/Digital-farming_Thumbnail-jpg.webp",
    h1:"Connect. Grow.", accent:"Prosper.", sub:"Sri Lanka's leading agri-tech platform — book equipment, sell paddy, buy rice." },
  { img:"https://as2.ftcdn.net/v2/jpg/05/62/11/37/1000_F_562113747_NVrgEH65tRGyARtoUSvGmY3HeY2xf51W.jpg",
    h1:"Smart Farm", accent:"Equipment.", sub:"Book GPS-guided tractors and harvesters from verified operators island-wide." },
  { img:"https://www.greenlivinganswers.com/blog/wp-content/uploads/2024/09/sustainable-agriculture-technology.webp",
    h1:"Sustainable", accent:"Farming.", sub:"Leverage eco-friendly technology to maximise your farm yield and profitability." },
  { img:"https://as2.ftcdn.net/v2/jpg/06/59/24/09/1000_F_659240919_7jeTldYQyXqZQkRV0D2db7Hx5EqdoJeI.jpg",
    h1:"Grow Smarter,", accent:"Earn More.", sub:"Join 200+ certified farmers building a prosperous future with FarmConnect." },
  { img:"https://thumbs.dreamstime.com/b/improve-agriculture-efficiency-smart-farming-autonomous-tractors-precision-field-work-aig-m-autonomous-tractor-333383885.jpg",
    h1:"Next-Gen", accent:"Agriculture.", sub:"GPS-guided precision equipment for maximum field efficiency across Sri Lanka." },
];

const SERVICES = [
  { img:"https://as1.ftcdn.net/v2/jpg/09/51/54/28/1000_F_951542872_JKqzGL542DkS0SXaCcwMX7QAOqahG1Jw.jpg",
    icon:"🚜", accent:"#eab308", page:"Booking", title:"Equipment Booking",
    desc:"Book tractors and harvesters from verified professionals. Pick your date, location, and session — pay online instantly.",
    tags:["GPS-Guided","Online Payment","All Districts"] },
  { img:"https://th.bing.com/th/id/R.2e3f4fb766f49b9993676b2f084dd569?rik=JcAXvc60fahlCg&pid=ImgRaw&r=0",
    icon:"🌾", accent:"#22c55e", page:"Selling", title:"Paddy Selling",
    desc:"Get live competitive offers from certified mills. Compare prices side by side and submit your selling request in minutes.",
    tags:["Live Mill Prices","Verified Mills","24h Response"] },
  { img:"https://media.istockphoto.com/photos/rice-mill-picture-id525076865?k=6&m=525076865&s=612x612&w=0&h=YeK0GCHS9I4kOjETmI2J-NG9Kj44jUguhfAmZu1QLSw=",
    icon:"🛒", accent:"#3b82f6", page:"Marketplace", title:"Rice Marketplace",
    desc:"Browse premium rice varieties with bulk discounts. Order 5–25 kg packs with doorstep delivery across Sri Lanka.",
    tags:["Bulk Discounts","Home Delivery","Certified Mills"] },
];

export default function Home({ setCurrentPage }) {
  const [idx, setIdx]   = useState(0);
  const [vis, setVis]   = useState(true);
  const timer = useRef(null);
  const [stats, setStats] = useState([
    { label:"Vehicles", value:"—",    icon:"🚜", color:T.gold    },
    { label:"Rice Mills", value:"—",  icon:"🏭", color:T.greenLt },
    { label:"Avg/kg",   value:"Rs —", icon:"💰", color:T.blue    },
    { label:"Farmers",  value:"200+", icon:"👨‍🌾", color:T.green   },
  ]);

  function goTo(n) {
    clearInterval(timer.current);
    setVis(false);
    setTimeout(() => { setIdx((n + SLIDES.length) % SLIDES.length); setVis(true); }, 300);
    timer.current = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5500);
  }
  useEffect(() => {
    timer.current = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(timer.current);
  }, []);
  useEffect(() => {
    let m = true;
    (async () => {
      try {
        const [vR, rR] = await Promise.allSettled([api.get("/vehicles"), api.get("/rice/listings")]);
        if (!m) return;
        const v = vR.status==="fulfilled"?vR.value.data:null;
        const r = rR.status==="fulfilled"?rR.value.data:null;
        setStats([
          { label:"Vehicles", value:Array.isArray(v)?String(v.length):"24", icon:"🚜", color:T.gold },
          { label:"Rice Mills", value:Array.isArray(r)?String(new Set(r.map(x=>x.millName)).size):"15", icon:"🏭", color:T.greenLt },
          { label:"Avg/kg", value:Array.isArray(r)&&r.length?`Rs ${Math.round(r.reduce((s,x)=>s+(x.basePricePerKg||0),0)/r.length)}`:"Rs 85", icon:"💰", color:T.blue },
          { label:"Farmers", value:"200+", icon:"👨‍🌾", color:T.green },
        ]);
      } catch {}
    })();
    return () => { m=false; };
  }, []);

  const sl = SLIDES[idx];

  return (
    <div style={{ background:T.bg, minHeight:"100vh", fontFamily:"'Inter',sans-serif", color:T.text }}>

      {/* ── HERO SLIDESHOW ── */}
      <div style={{ position:"relative", height:"calc(100vh - 70px)", minHeight:520, overflow:"hidden" }}>

        {/* Slide image — full brightness left side dark for text */}
        <div style={{ position:"absolute", inset:0, transition:"opacity 0.32s", opacity:vis?1:0 }}>
          <img src={sl.img} alt={sl.h1}
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }} />
          {/* left-to-right gradient so right side image stays visible */}
          <div style={{ position:"absolute", inset:0,
            background:"linear-gradient(100deg, rgba(7,24,16,0.88) 0%, rgba(7,24,16,0.58) 40%, rgba(7,24,16,0.12) 68%, transparent 100%)" }}/>
          {/* bottom fade */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:130,
            background:`linear-gradient(to top, ${T.bg}, transparent)` }}/>
        </div>

        {/* Text block */}
        <div style={{ position:"relative", zIndex:5, height:"100%", display:"flex",
          flexDirection:"column", justifyContent:"center", padding:"0 60px",
          maxWidth:680, transition:"opacity 0.32s", opacity:vis?1:0 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, width:"fit-content",
            background:`${T.gold}1e`, border:`1px solid ${T.gold}50`,
            borderRadius:99, padding:"5px 16px", marginBottom:22,
            fontSize:"0.68rem", fontWeight:800, color:T.gold, letterSpacing:"0.16em" }}>
            🌾 SRI LANKA AGRI-TECH · {idx+1}/{SLIDES.length}
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(2.6rem,6vw,4.6rem)",
            fontWeight:900, lineHeight:1.05, margin:"0 0 16px", letterSpacing:"-2px",
            textShadow:"0 2px 20px rgba(0,0,0,0.55)" }}>
            {sl.h1}<br/><span style={{ color:T.gold }}>{sl.accent}</span>
          </h1>
          <p style={{ fontSize:"1rem", color:"rgba(241,245,242,0.84)", lineHeight:1.8, maxWidth:460, marginBottom:36 }}>
            {sl.sub}
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:44 }}>
            <button onClick={()=>setCurrentPage("Booking")} style={{ background:`linear-gradient(135deg,${T.greenDk},${T.green})`, color:"#fff", border:"none", borderRadius:12, padding:"13px 28px", fontSize:"0.9rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 0 28px ${T.green}55` }}>🚜 Book Equipment</button>
            <button onClick={()=>setCurrentPage("Selling")} style={{ background:"rgba(255,255,255,0.1)", color:T.text, border:"1px solid rgba(255,255,255,0.28)", borderRadius:12, padding:"13px 24px", fontSize:"0.9rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>🌾 Sell Paddy</button>
            <button onClick={()=>setCurrentPage("Marketplace")} style={{ background:"rgba(255,255,255,0.05)", color:T.mid, border:"1px solid rgba(255,255,255,0.13)", borderRadius:12, padding:"13px 22px", fontSize:"0.9rem", cursor:"pointer", fontFamily:"inherit" }}>🛒 Buy Rice</button>
          </div>
          {/* Dots */}
          <div style={{ display:"flex", gap:8 }}>
            {SLIDES.map((_,i)=>(
              <button key={i} onClick={()=>goTo(i)} style={{ width:i===idx?30:8, height:8, borderRadius:99, background:i===idx?T.gold:"rgba(255,255,255,0.28)", border:"none", cursor:"pointer", padding:0, transition:"all 0.3s" }}/>
            ))}
          </div>
        </div>

        {/* Side thumbnail strip */}
        <div style={{ position:"absolute", right:28, top:"50%", transform:"translateY(-50%)", zIndex:10, display:"flex", flexDirection:"column", gap:10 }}>
          {SLIDES.map((s,i)=>(
            <button key={i} onClick={()=>goTo(i)} style={{ width:90, height:60, padding:0, border:"none", borderRadius:10, overflow:"hidden", cursor:"pointer",
              outline:i===idx?`2.5px solid ${T.gold}`:`1.5px solid rgba(255,255,255,0.18)`, outlineOffset:2,
              opacity:i===idx?1:0.55, transition:"all 0.25s", boxShadow:i===idx?`0 0 18px ${T.gold}44`:"none" }}>
              <img src={s.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
            </button>
          ))}
        </div>

        {/* Arrows */}
        <button onClick={()=>goTo(idx-1)} style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", zIndex:11, width:44, height:44, borderRadius:"50%", background:"rgba(7,24,16,0.7)", border:"1px solid rgba(255,255,255,0.22)", color:T.text, fontSize:"1.5rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)", lineHeight:1 }}>‹</button>
        <button onClick={()=>goTo(idx+1)} style={{ position:"absolute", right:136, top:"50%", transform:"translateY(-50%)", zIndex:11, width:44, height:44, borderRadius:"50%", background:"rgba(7,24,16,0.7)", border:"1px solid rgba(255,255,255,0.22)", color:T.text, fontSize:"1.5rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)", lineHeight:1 }}>›</button>
      </div>

      {/* ── STATS STRIP ── */}
      <div style={{ background:T.card, borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {stats.map((s,i)=>(
            <div key={i} style={{ padding:"26px 16px", textAlign:"center", borderRight:i<3?`1px solid ${T.border}`:"none" }}>
              <div style={{ fontSize:"1.7rem", marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontSize:"1.8rem", fontWeight:900, color:s.color, letterSpacing:"-0.5px" }}>{s.value}</div>
              <div style={{ fontSize:"0.68rem", color:T.low, marginTop:4, letterSpacing:"0.07em", textTransform:"uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"80px 32px 32px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <div style={{ width:36, height:2.5, background:T.gold, borderRadius:99 }}/>
          <span style={{ fontSize:"0.68rem", fontWeight:800, color:T.gold, letterSpacing:"0.18em", textTransform:"uppercase" }}>What We Offer</span>
        </div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.7rem,4vw,2.6rem)", fontWeight:900, margin:"0 0 48px", letterSpacing:"-0.5px" }}>
          Everything Your Farm Needs, <span style={{ color:T.gold }}>In One Place</span>
        </h2>
        {SERVICES.map((svc,i)=><ServiceRow key={i} svc={svc} flip={i%2===1} setCurrentPage={setCurrentPage}/>)}
      </div>

      {/* ── CTA ── */}
      <div style={{ background:T.card, borderTop:`1px solid ${T.border}`, padding:"72px 32px", textAlign:"center" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.6rem,4vw,2.4rem)", fontWeight:900, margin:"0 0 14px" }}>
            Join <span style={{ color:T.gold }}>200+ Sri Lankan</span> Farmers
          </h2>
          <p style={{ color:T.mid, fontSize:"0.92rem", lineHeight:1.8, marginBottom:32 }}>
            Free registration. Instant access to equipment bookings, live paddy prices, and the rice marketplace.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>setCurrentPage("Sign Up")} style={{ background:`linear-gradient(135deg,${T.greenDk},${T.green})`, color:"#fff", border:"none", borderRadius:12, padding:"14px 34px", fontSize:"0.92rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 0 24px ${T.green}44` }}>Create Free Account →</button>
            <button onClick={()=>setCurrentPage("Marketplace")} style={{ background:"transparent", color:T.mid, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 26px", fontSize:"0.92rem", cursor:"pointer", fontFamily:"inherit" }}>Browse Marketplace</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceRow({ svc, flip, setCurrentPage }) {
  const [hov,setHov] = useState(false);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", marginBottom:6, borderRadius:18, overflow:"hidden", border:`1px solid ${T.border}` }}>
      <div style={{ order:flip?2:1, position:"relative", height:320, overflow:"hidden" }}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        <img src={svc.img} alt={svc.title}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
            transform:hov?"scale(1.06)":"scale(1)", transition:"transform 0.5s ease" }}/>
        <div style={{ position:"absolute", inset:0, background:"rgba(7,24,16,0.15)" }}/>
        <div style={{ position:"absolute", top:18, left:18,
          background:"rgba(7,24,16,0.72)", backdropFilter:"blur(10px)",
          border:`1px solid ${svc.accent}44`, borderRadius:99,
          padding:"5px 14px", fontSize:"0.7rem", fontWeight:700, color:svc.accent }}>
          {svc.icon} {svc.title}
        </div>
      </div>
      <div style={{ order:flip?1:2, background:T.cardB, padding:"44px 44px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{ fontSize:"2rem", marginBottom:14 }}>{svc.icon}</div>
        <h3 style={{ fontFamily:"Georgia,serif", fontSize:"1.55rem", fontWeight:900, color:T.text, margin:"0 0 12px", letterSpacing:"-0.4px" }}>{svc.title}</h3>
        <p style={{ color:T.mid, fontSize:"0.88rem", lineHeight:1.8, margin:"0 0 22px" }}>{svc.desc}</p>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:26 }}>
          {svc.tags.map(t=>(
            <span key={t} style={{ background:`${svc.accent}18`, border:`1px solid ${svc.accent}38`, color:svc.accent, borderRadius:99, padding:"4px 12px", fontSize:"0.7rem", fontWeight:700 }}>{t}</span>
          ))}
        </div>
        <button onClick={()=>setCurrentPage(svc.page)} style={{ background:`linear-gradient(135deg,${svc.accent}cc,${svc.accent})`, color:svc.accent==="#eab308"?T.bg:"#fff", border:"none", borderRadius:12, padding:"12px 24px", fontWeight:800, fontSize:"0.88rem", cursor:"pointer", fontFamily:"inherit", width:"fit-content", boxShadow:`0 0 18px ${svc.accent}33` }}>
          Explore {svc.title} →
        </button>
      </div>
    </div>
  );
}
