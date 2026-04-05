import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import riceMillService from "../services/riceMillService";

const SELL_SLIDES = [
  "https://th.bing.com/th/id/R.2e3f4fb766f49b9993676b2f084dd569?rik=JcAXvc60fahlCg&pid=ImgRaw&r=0",
  "https://media.istockphoto.com/photos/rice-mill-picture-id525076865?k=6&m=525076865&s=612x612&w=0&h=YeK0GCHS9I4kOjETmI2J-NG9Kj44jUguhfAmZu1QLSw=",
  "https://tse2.mm.bing.net/th/id/OIP.FYzFHLF5PCOAz1CSro5LDAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
];
const MILL_IMG  = "https://media.istockphoto.com/photos/rice-mill-picture-id525076865?k=6&m=525076865&s=612x612&w=0&h=YeK0GCHS9I4kOjETmI2J-NG9Kj44jUguhfAmZu1QLSw=";

const STEPS = [
  { id:0, icon:"🌾", label:"Enter Stock"    },
  { id:1, icon:"🏭", label:"Choose Mill"    },
  { id:2, icon:"✅", label:"Submit Request" },
];

export default function Selling() {
  const [step,setStep]         = useState(0);
  const [paddyTypes,setPTs]    = useState([]);
  const [paddyType,setPT]      = useState("");
  const [stockKg,setStockKg]   = useState("");
  const [offers,setOffers]     = useState(null);
  const [selectedMill,setSM]   = useState(null);
  const [loading,setLoading]   = useState(false);
  const [submitting,setSubm]   = useState(false);
  const [submitted,setSubd]    = useState(false);
  const [form,setForm]         = useState({name:"",contactNumber:"",address:""});
  const [isLoggedIn,setLogd]   = useState(false);
  const [farmerName,setFN]     = useState("");

  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem("farmer")||"null");
      const t = localStorage.getItem("farmerToken");
      if (f&&t){ setLogd(true); setFN(f.name||""); setForm(p=>({...p,name:f.name||"",contactNumber:f.mobile||"",address:f.address||""})); }
    } catch {}
    axios.get("http://localhost:8080/api/paddy-types/active")
      .then(r=>{ const ts=Array.isArray(r.data)?r.data:[]; setPTs(ts); if(ts.length)setPT(ts[0].type_name); })
      .catch(()=>{ const d=["Nadu","Samba","Kiri Samba","Red Rice","Suwandel","Keeri Samba"]; setPTs(d.map(t=>({type_name:t,price_per_kg:0}))); setPT(d[0]); });
  },[]);

  const canCheck   = useMemo(()=>{ const n=parseFloat(stockKg); return !isNaN(n)&&n>0; },[stockKg]);
  const totalPrice = useMemo(()=>{ if(!selectedMill||!stockKg)return 0; return Math.round((selectedMill.pricePerKg||0)*(parseFloat(stockKg)||0)); },[selectedMill,stockKg]);

  const checkPrices = useCallback(async()=>{
    if(!canCheck)return; setLoading(true);
    try { const r=await riceMillService.getOffers(paddyType,stockKg); setOffers(r); setStep(1); }
    catch{ alert("Failed to fetch prices."); } finally{ setLoading(false); }
  },[paddyType,stockKg,canCheck]);

  function selectMill(m){ setSM(m); setStep(2); }
  function changeForm(e){ const{name,value}=e.target; setForm(p=>({...p,[name]:value})); }

  async function handleSubmit(e){
    e.preventDefault();
    const token=localStorage.getItem("farmerToken");
    if(!token){alert("Please sign in first.");return;}
    const stock=parseFloat(stockKg)||0;
    if(stock<=0){alert("Enter valid quantity.");return;}
    setSubm(true);
    try{
      const farmer=JSON.parse(localStorage.getItem("farmer")||"null");
      await axios.post("http://localhost:8080/api/selling",{
        farmerId:farmer?.id||null, millId:selectedMill?.millId||selectedMill?.id||null,
        riceType:paddyType, stockKg:stock, pricePerKg:selectedMill?.pricePerKg||0,
      },{headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}});
      setSubd(true);
    }catch(err){alert(err?.response?.data?.message||"Failed. Try again.");}
    finally{setSubm(false);}
  }

  function reset(){ setStep(0); setOffers(null); setSM(null); setStockKg(""); setSubd(false); }

  /* ── SUCCESS ── */
  if(submitted) return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#0a0e0b",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
      <div style={{background:"#111a13",border:"1px solid #1e2e22",borderRadius:24,padding:"60px 48px",textAlign:"center",maxWidth:520,width:"100%"}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#134d2e,#27a85c)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:"2rem",boxShadow:"0 0 40px rgba(39,168,92,0.3)"}}>✅</div>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.9rem",fontWeight:900,color:"#fff",margin:"0 0 8px"}}>Request Submitted!</h2>
        <p style={{color:"rgba(255,255,255,0.5)",marginBottom:6,fontSize:"0.9rem"}}>Your selling request has been sent to</p>
        <div style={{fontSize:"1.1rem",fontWeight:800,color:"#4ade80",background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:12,padding:"12px 24px",marginBottom:24,display:"inline-block"}}>
          🏭 {selectedMill?.name||selectedMill?.millName}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"18px",marginBottom:28}}>
          {[{l:"Type",v:paddyType},{l:"Quantity",v:`${parseFloat(stockKg).toLocaleString()} kg`},{l:"Est. Payout",v:`Rs ${totalPrice.toLocaleString()}`}].map((s,i)=>(
            <div key={i}><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{s.l}</div><div style={{fontWeight:800,color:"#fff",fontSize:"0.95rem"}}>{s.v}</div></div>
          ))}
        </div>
        <div style={{background:"rgba(245,197,24,0.08)",border:"1px solid rgba(245,197,24,0.2)",borderRadius:10,padding:"12px 18px",marginBottom:24,color:"rgba(245,197,24,0.85)",fontSize:"0.83rem"}}>
          ⏰ Mill will contact you within <strong>24 hours</strong>
        </div>
        <button onClick={reset} style={{background:"linear-gradient(135deg,#134d2e,#27a85c)",color:"#fff",border:"none",borderRadius:12,padding:"14px 32px",fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 0 24px rgba(39,168,92,0.3)"}}>
          🌾 Submit Another Request
        </button>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#0a0e0b",minHeight:"100vh",color:"#fff"}}>

      {/* ══ HERO — SLIDESHOW ══ */}
      <SellHero isLoggedIn={isLoggedIn} farmerName={farmerName} />

      {/* ══ LOGIN ALERT ══ */}
      {!isLoggedIn && (
        <div style={{maxWidth:1100,margin:"0 auto 0",padding:"24px 40px 0"}}>
          <div style={{background:"rgba(245,197,24,0.08)",border:"1px solid rgba(245,197,24,0.25)",borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:"1.3rem"}}>⚠️</span>
            <div style={{flex:1,color:"rgba(255,255,255,0.65)",fontSize:"0.85rem"}}>You can browse prices — but must <strong style={{color:"#f5c518"}}>sign in</strong> to submit a request.</div>
            <a href="#" onClick={e=>{e.preventDefault();}} style={{background:"#f5c518",color:"#0a0e0b",borderRadius:8,padding:"8px 18px",fontSize:"0.8rem",fontWeight:800,textDecoration:"none",whiteSpace:"nowrap"}}>Sign In →</a>
          </div>
        </div>
      )}

      <div style={{maxWidth:1100,margin:"32px auto 60px",padding:"0 40px"}}>

        {/* ══ STEPPER ══ */}
        <div style={{display:"flex",gap:0,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,overflow:"hidden",marginBottom:32}}>
          {STEPS.map((s,i)=>{
            const active=step===i, done=step>i;
            return (
              <button key={i} onClick={()=>done&&setStep(i)} style={{
                flex:1,border:"none",cursor:done?"pointer":"default",padding:"18px",
                background:active?"rgba(245,197,24,0.12)":done?"rgba(74,222,128,0.06)":"transparent",
                borderRight:i<2?"1px solid rgba(255,255,255,0.06)":"none",
                display:"flex",alignItems:"center",gap:12,fontFamily:"inherit",
                transition:"background 0.2s",
              }}>
                <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:active?"rgba(245,197,24,0.2)":done?"rgba(74,222,128,0.2)":"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",border:active?"1px solid rgba(245,197,24,0.4)":done?"1px solid rgba(74,222,128,0.4)":"1px solid rgba(255,255,255,0.08)"}}>
                  {done?"✓":s.icon}
                </div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:700,fontSize:"0.85rem",color:active?"#f5c518":done?"#4ade80":"rgba(255,255,255,0.5)"}}>{s.label}</div>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.25)"}}>Step {i+1}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ══ STEP 0 ══ */}
        {step===0 && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:24}}>
            <DarkCard title="What are you selling?" icon="🌾" subtitle="Select paddy type and stock quantity">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
                <DarkField label="Paddy Type">
                  <div style={{position:"relative"}}>
                    <select value={paddyType} onChange={e=>setPT(e.target.value)} style={selStyle}>
                      {paddyTypes.map(t=><option key={t.type_name} value={t.type_name}>{t.type_name}</option>)}
                    </select>
                    <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",fontSize:"0.6rem",pointerEvents:"none"}}>▼</span>
                  </div>
                </DarkField>
                <DarkField label="Available Stock (kg)">
                  <input type="number" min="1" value={stockKg} onChange={e=>setStockKg(e.target.value)}
                    placeholder="e.g. 500" style={{...inpStyle,borderColor:stockKg&&canCheck?"rgba(74,222,128,0.5)":undefined}}/>
                </DarkField>
              </div>
              {canCheck && (
                <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:12,padding:"14px 18px",marginBottom:24,display:"flex",gap:12,alignItems:"center"}}>
                  <span style={{fontSize:"1.3rem"}}>📦</span>
                  <div>
                    <div style={{fontWeight:700,color:"#4ade80",fontSize:"0.88rem"}}>Ready to find offers</div>
                    <div style={{color:"rgba(255,255,255,0.5)",fontSize:"0.78rem",marginTop:2}}>
                      Selling <strong style={{color:"#fff"}}>{parseFloat(stockKg).toLocaleString()} kg</strong> of <strong style={{color:"#fff"}}>{paddyType}</strong>
                    </div>
                  </div>
                </div>
              )}
              <button onClick={checkPrices} disabled={!canCheck||loading} style={{
                background:canCheck?"linear-gradient(135deg,#134d2e,#27a85c)":"rgba(255,255,255,0.06)",
                color:canCheck?"#fff":"rgba(255,255,255,0.3)",border:"none",borderRadius:12,
                padding:"14px 32px",fontWeight:800,fontSize:"0.95rem",cursor:canCheck?"pointer":"not-allowed",
                fontFamily:"inherit",boxShadow:canCheck?"0 0 24px rgba(39,168,92,0.25)":"none",display:"flex",alignItems:"center",gap:10,
              }}>
                {loading ? <><Spin/> Fetching prices…</> : <>🔍 Check Mill Prices →</>}
              </button>
            </DarkCard>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <HowItWorks/>
              <PriceList paddyTypes={paddyTypes}/>
            </div>
          </div>
        )}

        {/* ══ STEP 1 ══ */}
        {step===1 && offers && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"18px 24px",marginBottom:24}}>
              <div>
                <div style={{fontWeight:800,color:"#fff",fontSize:"1rem"}}>Live Offers — <span style={{color:"#f5c518"}}>{offers.paddyType}</span></div>
                <div style={{color:"rgba(255,255,255,0.4)",fontSize:"0.8rem",marginTop:2}}>{Number(offers.stockKg).toLocaleString()} kg · {offers.mills.length} mill{offers.mills.length!==1?"s":""}</div>
              </div>
              <button onClick={()=>setStep(0)} style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"9px 18px",fontSize:"0.82rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                ← Change Details
              </button>
            </div>
            {offers.mills.length===0
              ? <div style={{textAlign:"center",padding:"60px",background:"rgba(255,255,255,0.03)",borderRadius:20,border:"1px dashed rgba(255,255,255,0.1)"}}>
                  <div style={{fontSize:"3rem",marginBottom:12}}>🏭</div>
                  <div style={{fontWeight:700,color:"rgba(255,255,255,0.5)"}}>No offers for {offers.paddyType}</div>
                  <button onClick={()=>setStep(0)} style={{marginTop:16,background:"rgba(255,255,255,0.06)",color:"#fff",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontFamily:"inherit"}}>← Try Another Type</button>
                </div>
              : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
                  {offers.mills.map((mill,i)=><MillCard key={i} mill={mill} isBest={i===0} isSelected={selectedMill?.id===mill.id} onSelect={()=>selectMill(mill)}/>)}
                </div>
            }
          </div>
        )}

        {/* ══ STEP 2 ══ */}
        {step===2 && selectedMill && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:24}}>
            <DarkCard title="Submit Your Request" icon="✅" subtitle={`Sending to ${selectedMill.name||selectedMill.millName}`}
              headerAction={<button onClick={()=>setStep(1)} style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"7px 14px",fontSize:"0.78rem",cursor:"pointer",fontFamily:"inherit"}}>← Change Mill</button>}>
              {/* Summary row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:12,padding:"16px 18px",marginBottom:20}}>
                {[{l:"Mill",v:selectedMill.name||selectedMill.millName},{l:"Location",v:`📍 ${selectedMill.location}`},{l:"Price",v:`Rs ${selectedMill.pricePerKg}/kg`,hi:true}].map((s,i)=>(
                  <div key={i}><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{s.l}</div><div style={{fontWeight:800,color:s.hi?"#4ade80":"#fff",fontSize:s.hi?"1.05rem":"0.88rem"}}>{s.v}</div></div>
                ))}
              </div>
              {/* Total */}
              <div style={{background:"linear-gradient(135deg,#071f10,#134d2e,#1a6e3e)",borderRadius:14,padding:"20px 24px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 0 32px rgba(20,77,46,0.35)"}}>
                <div>
                  <div style={{color:"rgba(167,243,208,0.7)",fontSize:"0.75rem",fontWeight:700,marginBottom:6}}>💰 Estimated Payout</div>
                  <div style={{fontSize:"2.2rem",fontWeight:900,color:"#fff",letterSpacing:"-1px"}}>Rs {totalPrice.toLocaleString()}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700,color:"rgba(255,255,255,0.8)",marginBottom:4}}>{paddyType}</div>
                  <div style={{color:"rgba(167,243,208,0.7)",fontSize:"0.82rem"}}>{stockKg} kg × Rs {selectedMill.pricePerKg}/kg</div>
                </div>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{fontSize:"0.72rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:16}}>📝 Your Contact Details</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <DarkField label="Full Name *"><input name="name" value={form.name} onChange={changeForm} placeholder="Your name" required style={inpStyle}/></DarkField>
                  <DarkField label="Contact Number *"><input name="contactNumber" value={form.contactNumber} onChange={changeForm} placeholder="07X XXX XXXX" required style={inpStyle}/></DarkField>
                </div>
                <DarkField label="Farm Address"><input name="address" value={form.address} onChange={changeForm} placeholder="Farm address for collection" style={{...inpStyle,marginBottom:16}}/></DarkField>
                <div style={{background:"rgba(245,197,24,0.06)",border:"1px solid rgba(245,197,24,0.18)",borderRadius:10,padding:"12px 16px",marginBottom:20,color:"rgba(245,197,24,0.75)",fontSize:"0.8rem",display:"flex",gap:8,alignItems:"center"}}>
                  <span>ℹ️</span> Mill will contact you within 24 hours to confirm collection.
                </div>
                <div style={{display:"flex",gap:12}}>
                  <button type="button" onClick={()=>setStep(1)} style={{flex:1,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{flex:2.5,background:"linear-gradient(135deg,#134d2e,#27a85c)",color:"#fff",border:"none",borderRadius:10,padding:"13px",fontWeight:800,cursor:submitting?"not-allowed":"pointer",fontFamily:"inherit",opacity:submitting?0.7:1,boxShadow:"0 0 20px rgba(39,168,92,0.3)"}}>
                    {submitting?<><Spin/>Submitting…</>:"✅ Submit Request"}
                  </button>
                </div>
              </form>
            </DarkCard>
            <OrderSidebar mill={selectedMill} paddyType={paddyType} stockKg={stockKg} total={totalPrice}/>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sell Hero Slideshow ── */
function SellHero({ isLoggedIn, farmerName }) {
  const [si, setSi]   = React.useState(0);
  const [fade, setFade] = React.useState(true);
  const go = n => { setFade(false); setTimeout(() => { setSi((n + SELL_SLIDES.length) % SELL_SLIDES.length); setFade(true); }, 300); };
  React.useEffect(() => { const t = setInterval(() => go(si + 1), 5000); return () => clearInterval(t); }, [si]);
  return (
    <div style={{ position:"relative", height:380, overflow:"hidden" }}>
      {/* FULL BRIGHT IMAGE via img tag */}
      <div style={{ position:"absolute", inset:0, transition:"opacity 0.32s", opacity:fade?1:0 }}>
        <img src={SELL_SLIDES[si]} alt="Paddy"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }}/>
        {/* gradient: left dark for text, right stays bright */}
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(100deg, rgba(7,24,16,0.88) 0%, rgba(7,24,16,0.55) 42%, rgba(7,24,16,0.08) 68%, transparent 100%)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:100,
          background:"linear-gradient(to top, #071810, transparent)" }}/>
      </div>
      {/* TEXT */}
      <div style={{ position:"relative", zIndex:5, height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px 32px" }}>
        <div style={{ fontSize:"0.66rem", color:"#eab308", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:1.5, background:"#eab308" }}/> Paddy Selling Centre
        </div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:900, margin:"0 0 12px", letterSpacing:"-1px", lineHeight:1.1, color:"#f1f5f2", transition:"opacity 0.32s", opacity:fade?1:0 }}>
          Get the <span style={{ color:"#eab308" }}>Best Price</span><br/>For Your Harvest
        </h1>
        <p style={{ color:"rgba(241,245,242,0.82)", fontSize:"0.9rem", lineHeight:1.75, maxWidth:440, marginBottom:18 }}>
          Compare real-time offers from verified mills. Submit your request in minutes.
        </p>
        {isLoggedIn && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.35)", borderRadius:99, padding:"6px 16px", fontSize:"0.8rem", color:"#86efac", marginBottom:14 }}>
            👨‍🌾 Welcome, <strong>{farmerName}</strong>
          </div>
        )}
        <div style={{ display:"flex", gap:7 }}>
          {SELL_SLIDES.map((_,i) => (
            <button key={i} onClick={() => go(i)} style={{ width:i===si?22:7, height:7, borderRadius:99, background:i===si?"#eab308":"rgba(255,255,255,0.28)", border:"none", cursor:"pointer", padding:0, transition:"all 0.3s" }}/>
          ))}
        </div>
      </div>
      {/* ARROWS */}
      <button onClick={() => go(si-1)} style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", zIndex:10, width:40, height:40, borderRadius:"50%", background:"rgba(7,24,16,0.7)", border:"1px solid rgba(255,255,255,0.22)", color:"#f1f5f2", fontSize:"1.4rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)", lineHeight:1 }}>‹</button>
      <button onClick={() => go(si+1)} style={{ position:"absolute", right:118, top:"50%", transform:"translateY(-50%)", zIndex:10, width:40, height:40, borderRadius:"50%", background:"rgba(7,24,16,0.7)", border:"1px solid rgba(255,255,255,0.22)", color:"#f1f5f2", fontSize:"1.4rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)", lineHeight:1 }}>›</button>
      {/* THUMBNAIL STRIP */}
      <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", zIndex:10, display:"flex", flexDirection:"column", gap:8 }}>
        {SELL_SLIDES.map((img,i) => (
          <button key={i} onClick={() => go(i)} style={{ width:88, height:58, padding:0, border:"none", borderRadius:10, overflow:"hidden", cursor:"pointer",
            outline:i===si?"2.5px solid #eab308":"1.5px solid rgba(255,255,255,0.2)", outlineOffset:2,
            opacity:i===si?1:0.52, transition:"all 0.25s", boxShadow:i===si?"0 0 16px #eab30855":"none" }}>
            <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Sub Components ── */
function DarkCard({title,icon,subtitle,children,headerAction}){
  return (
    <div style={{background:"#111a13",border:"1px solid #1e2e22",borderRadius:20,overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,#071f10,#0d2e18)",padding:"22px 28px",borderBottom:"1px solid #1e2e22",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:40,height:40,borderRadius:10,background:"rgba(245,197,24,0.1)",border:"1px solid rgba(245,197,24,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>{icon}</div>
          <div>
            <div style={{fontWeight:800,color:"#fff",fontSize:"1rem"}}>{title}</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",marginTop:2}}>{subtitle}</div>
          </div>
        </div>
        {headerAction}
      </div>
      <div style={{padding:"28px"}}>{children}</div>
    </div>
  );
}

function DarkField({label,children}){
  return (
    <div>
      <label style={{display:"block",fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7}}>{label}</label>
      {children}
    </div>
  );
}

function HowItWorks(){
  return (
    <div style={{background:"#111a13",border:"1px solid #1e2e22",borderRadius:16,padding:"22px"}}>
      <div style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:18}}>How It Works</div>
      {[{n:1,icon:"🌾",t:"Enter Stock",d:"Select paddy type & quantity"},{n:2,icon:"🏭",t:"Compare Offers",d:"See live prices from all mills"},{n:3,icon:"✅",t:"Submit Request",d:"Confirm & send to chosen mill"},{n:4,icon:"📞",t:"Mill Contacts You",d:"Within 24 hours to arrange pickup"}].map((s,i)=>(
        <div key={i} style={{display:"flex",gap:12,marginBottom:i<3?14:0}}>
          <div style={{width:32,height:32,borderRadius:8,flexShrink:0,background:"linear-gradient(135deg,#134d2e,#1a6e3e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem"}}>{s.icon}</div>
          <div><div style={{fontWeight:700,color:"rgba(255,255,255,0.8)",fontSize:"0.83rem"}}>{s.t}</div><div style={{color:"rgba(255,255,255,0.35)",fontSize:"0.73rem",marginTop:2}}>{s.d}</div></div>
        </div>
      ))}
    </div>
  );
}

function PriceList({paddyTypes}){
  return (
    <div style={{background:"linear-gradient(135deg,#071f10,#0d2e18)",border:"1px solid #1e2e22",borderRadius:16,padding:"22px",flex:1}}>
      <div style={{fontSize:"0.68rem",fontWeight:700,color:"#f5c518",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>⚡ Live Paddy Types</div>
      {paddyTypes.slice(0,6).map((t,i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<Math.min(paddyTypes.length,6)-1?"1px solid rgba(255,255,255,0.06)":"none"}}>
          <span style={{color:"rgba(255,255,255,0.7)",fontSize:"0.83rem"}}>🌾 {t.type_name}</span>
          <span style={{color:"#4ade80",fontWeight:700,fontSize:"0.78rem"}}>{t.price_per_kg>0?`Rs ${t.price_per_kg}/kg`:"Varies"}</span>
        </div>
      ))}
    </div>
  );
}

function MillCard({mill,isBest,isSelected,onSelect}){
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onSelect}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:isSelected?"rgba(74,222,128,0.06)":hov?"rgba(255,255,255,0.04)":"#111a13",border:isSelected?"1.5px solid rgba(74,222,128,0.4)":isBest?"1.5px solid rgba(245,197,24,0.3)":"1px solid #1e2e22",borderRadius:18,overflow:"hidden",cursor:"pointer",transition:"all 0.18s",position:"relative"}}>
      {isBest && <div style={{background:"linear-gradient(90deg,#134d2e,#1a6e3e)",padding:"5px 0",textAlign:"center",fontSize:"0.65rem",fontWeight:800,color:"#f5c518",letterSpacing:"0.1em"}}>⭐ BEST PRICE</div>}
      {mill.imageUrl
        ? <div style={{height:120,overflow:"hidden",position:"relative"}}><img src={mill.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.6)"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent)"}}/></div>
        : <div style={{height:100,backgroundImage:`url(${MILL_IMG})`,backgroundSize:"cover",backgroundPosition:"center",filter:"brightness(0.72)"}}/>
      }
      <div style={{padding:"16px 18px"}}>
        {isSelected && <div style={{position:"absolute",top:10,right:10,width:24,height:24,borderRadius:"50%",background:"#4ade80",display:"flex",alignItems:"center",justifyContent:"center",color:"#0a0e0b",fontSize:"0.75rem",fontWeight:900}}>✓</div>}
        <h4 style={{margin:"0 0 3px",fontWeight:800,color:"#fff",fontSize:"0.95rem"}}>{mill.name||mill.millName}</h4>
        <p style={{margin:"0 0 10px",color:"rgba(255,255,255,0.4)",fontSize:"0.78rem"}}>📍 {mill.location}</p>
        <div style={{background:isBest?"linear-gradient(135deg,#134d2e,#1a6e3e)":"rgba(255,255,255,0.05)",borderRadius:10,padding:"12px 14px",marginBottom:12,border:isBest?"none":"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontWeight:900,fontSize:"1.6rem",color:isBest?"#fff":"#4ade80",letterSpacing:"-0.5px"}}>Rs {mill.pricePerKg.toLocaleString()}<span style={{fontSize:"0.7rem",opacity:0.7}}>/kg</span></div>
          <div style={{fontWeight:700,color:isBest?"rgba(167,243,208,0.8)":"rgba(255,255,255,0.5)",fontSize:"0.82rem",marginTop:2}}>💰 Total: Rs {mill.totalValue.toLocaleString()}</div>
        </div>
        <button onClick={e=>{e.stopPropagation();onSelect();}} style={{width:"100%",padding:"10px",background:isSelected?"#4ade80":"linear-gradient(135deg,#134d2e,#27a85c)",color:isSelected?"#0a0e0b":"#fff",border:"none",borderRadius:8,fontWeight:800,fontSize:"0.82rem",cursor:"pointer",fontFamily:"inherit"}}>
          {isSelected?"✓ Selected":"Select This Mill →"}
        </button>
      </div>
    </div>
  );
}

function OrderSidebar({mill,paddyType,stockKg,total}){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{background:"#111a13",border:"1px solid #1e2e22",borderRadius:16,overflow:"hidden"}}>
        <div style={{background:"rgba(74,222,128,0.06)",borderBottom:"1px solid rgba(74,222,128,0.12)",padding:"14px 18px",fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Order Summary</div>
        <div style={{padding:"18px"}}>
          {[{l:"Mill",v:mill.name||mill.millName},{l:"Location",v:`📍 ${mill.location}`},{l:"Type",v:paddyType},{l:"Quantity",v:`${parseFloat(stockKg||0).toLocaleString()} kg`},{l:"Rate",v:`Rs ${mill.pricePerKg}/kg`}].map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <span style={{color:"rgba(255,255,255,0.35)",fontSize:"0.78rem"}}>{s.l}</span>
              <span style={{fontWeight:700,color:"rgba(255,255,255,0.75)",fontSize:"0.8rem",textAlign:"right",maxWidth:"55%"}}>{s.v}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0",borderTop:"1px solid rgba(74,222,128,0.2)",marginTop:4}}>
            <span style={{fontWeight:700,color:"rgba(255,255,255,0.6)"}}>Total</span>
            <span style={{fontWeight:900,color:"#4ade80",fontSize:"1.3rem"}}>Rs {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div style={{background:"#111a13",border:"1px solid #1e2e22",borderRadius:16,padding:"18px"}}>
        {[{i:"🔒",t:"Verified Mills",d:"All partner mills are certified"},{i:"⚡",t:"Fast Response",d:"Contact within 24 hours"},{i:"💰",t:"Best Prices",d:"Compare all at once"}].map((b,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:i<2?12:0}}>
            <span style={{fontSize:"1.1rem"}}>{b.i}</span>
            <div><div style={{fontWeight:700,color:"rgba(255,255,255,0.7)",fontSize:"0.82rem"}}>{b.t}</div><div style={{color:"rgba(255,255,255,0.3)",fontSize:"0.72rem"}}>{b.d}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Spin(){return <span style={{display:"inline-block",animation:"spin 0.7s linear infinite",marginRight:6}}>⟳</span>;}

const inpStyle={width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,fontSize:"0.88rem",color:"#fff",outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border-color 0.2s"};
const selStyle={...inpStyle,appearance:"none",paddingRight:36,cursor:"pointer"};
