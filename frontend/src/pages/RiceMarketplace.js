import React, { useState, useMemo, useEffect } from "react";
import api from "../api/api";
import OnlinePaymentForm from "../components/OnlinePaymentForm";
import { getImageUrl } from "../utils/imageUrl";

const MARKET_SLIDES = [
  "https://media.istockphoto.com/photos/rice-mill-picture-id525076865?k=6&m=525076865&s=612x612&w=0&h=YeK0GCHS9I4kOjETmI2J-NG9Kj44jUguhfAmZu1QLSw=",
  "https://tse2.mm.bing.net/th/id/OIP.FYzFHLF5PCOAz1CSro5LDAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://th.bing.com/th/id/R.2e3f4fb766f49b9993676b2f084dd569?rik=JcAXvc60fahlCg&pid=ImgRaw&r=0",
];

const DISTRICTS = ["Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha","Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kurunegala","Matara","Matale","Monaragala","Polonnaruwa","Puttalam","Ratnapura","Trincomalee"];
const WEIGHT_OPTIONS = [{value:5,label:"5 kg",priceMultiplier:1},{value:10,label:"10 kg",priceMultiplier:0.95},{value:25,label:"25 kg",priceMultiplier:0.90}];

export default function RiceMarketplace() {
  const [listings,setListings]   = useState([]);
  const [loading,setLoading]     = useState(true);
  const [selType,setSelType]     = useState("all");
  const [selMill,setSelMill]     = useState("all");
  const [search,setSearch]       = useState("");
  const [selected,setSelected]   = useState(null);
  const [showOrder,setShowOrder] = useState(false);
  const [showCardPay,setSCP]     = useState(false);
  const [submitting,setSubm]     = useState(false);
  const [orderSuccess,setOS]     = useState(null);
  const [order,setOrder]         = useState({name:"",mobileNumber:"",address:"",district:"",paymentMethod:"",deliveryOption:"normal",selectedWeight:5,quantity:1});

  useEffect(()=>{
    setLoading(true);
    api.get("/marketplace")
      .then(r=>{
        // Map backend response to frontend format (handles both camelCase and snake_case)
        const mapped = Array.isArray(r.data.data) ? r.data.data.map(item => ({
          id: item.id,
          riceTypeName: item.riceTypeName || item.type_name,
          millName: item.millName || item.mill_name,
          millId: item.millId || item.mill_id,
          millLocation: item.millLocation || item.mill_location,
          basePricePerKg: parseFloat(item.pricePerKg || item.price_per_kg),
          availableKg: parseFloat(item.availableKg || item.available_kg),
          minOrderKg: parseFloat(item.minOrderKg || item.min_order_kg),
          maxOrderKg: parseFloat(item.maxOrderKg || item.max_order_kg),
          description: item.description,
          imageUrl: item.imageUrl || item.image_url,
          deliveryTime: item.deliveryTime || item.delivery_time || '1-3 days',
        })) : [];
        setListings(mapped);
      })
      .catch(err=>{ console.error("Marketplace fetch error:", err); setListings([]); })
      .finally(()=>setLoading(false));
  },[]);

  const uniqueTypes = useMemo(()=>["all",...new Set(listings.map(l=>l.riceTypeName))]   ,[listings]);
  const uniqueMills = useMemo(()=>["all",...new Set(listings.map(l=>l.millName))]       ,[listings]);
  const filtered    = useMemo(()=>listings.filter(l=>{
    const mt=selType==="all"||l.riceTypeName===selType;
    const mm=selMill==="all"||l.millName===selMill;
    const ms=!search||l.riceTypeName.toLowerCase().includes(search.toLowerCase())||l.millName.toLowerCase().includes(search.toLowerCase())||(l.millLocation||"").toLowerCase().includes(search.toLowerCase());
    return mt&&mm&&ms;
  }),[listings,selType,selMill,search]);

  function calcPrice(){
    if(!selected)return null;
    const w=WEIGHT_OPTIONS.find(x=>x.value===order.selectedWeight)||WEIGHT_OPTIONS[0];
    const ppkg=selected.basePricePerKg*w.priceMultiplier;
    const sub=ppkg*order.selectedWeight*order.quantity;
    const del=order.deliveryOption==="fast"?500:200;
    return{pricePerKg:Math.round(ppkg),subtotal:Math.round(sub),deliveryFee:del,total:Math.round(sub+del)};
  }

  function openOrder(l){
    setSelected(l);
    setOrder({name:"",mobileNumber:"",address:"",district:"",paymentMethod:"",deliveryOption:"normal",selectedWeight:5,quantity:1});
    setOS(null); setShowOrder(true);
  }

  async function handleOrder(e){
    e.preventDefault();
    if(order.paymentMethod==="online"){setSCP(true);return;}
    await submitOrder();
  }

  async function submitOrder(){
    const p=calcPrice();
    setSubm(true);
    try{
      await api.post("/orders",{
        listingId:selected.id,riceTypeName:selected.riceTypeName,millId:selected.millId,
        millName:selected.millName,customerName:order.name,mobileNumber:order.mobileNumber,
        address:order.address,district:order.district,paymentMethod:order.paymentMethod,
        deliveryOption:order.deliveryOption,packageSize:order.selectedWeight,
        quantity:order.quantity,pricePerKg:p.pricePerKg,subtotal:p.subtotal,
        deliveryFee:p.deliveryFee,totalAmount:p.total,
      });
      setOS({message:"Order placed successfully!",total:p.total});
    }catch(err){alert(err?.response?.data?.message||"Order failed.");}
    finally{setSubm(false);}
  }

  const price=calcPrice();

  return (
    <React.Fragment>
    <div style={{fontFamily:"'Inter',sans-serif",background:"#0a0e0b",minHeight:"100vh",color:"#fff"}}>

      {/* ══ HERO — SLIDESHOW ══ */}
      <MarketHero count={listings.length} />

      {/* ══ FILTER BAR ══ */}
      <div style={{background:"#0d1610",borderBottom:"1px solid #1a2e1e",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"14px 40px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:99,padding:"9px 18px",flex:1,minWidth:180}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search rice type, mill or location…"
              style={{border:"none",outline:"none",background:"transparent",fontSize:"0.83rem",color:"#fff",fontFamily:"inherit",width:"100%"}}/>
          </div>
          {[{val:selType,fn:setSelMill.bind(null),realFn:setSelType,opts:uniqueTypes,pre:"🍚 "},{val:selMill,fn:setSelType.bind(null),realFn:setSelMill,opts:uniqueMills,pre:"🏭 "}].map((f,i)=>(
            <div key={i} style={{position:"relative"}}>
              <select value={i===0?selType:selMill} onChange={e=>(i===0?setSelType:setSelMill)(e.target.value)} style={{appearance:"none",padding:"9px 32px 9px 16px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:99,background:"rgba(255,255,255,0.05)",fontSize:"0.82rem",color:"#fff",fontFamily:"inherit",fontWeight:600,outline:"none",cursor:"pointer"}}>
                {(i===0?uniqueTypes:uniqueMills).map(t=><option key={t} value={t} style={{background:"#111a13"}}>{i===0?(t==="all"?"All Rice Types":t):(t==="all"?"All Mills":t)}</option>)}
              </select>
              <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",fontSize:"0.58rem",pointerEvents:"none"}}>▼</span>
            </div>
          ))}
          <div style={{color:"rgba(255,255,255,0.3)",fontSize:"0.78rem",whiteSpace:"nowrap"}}>{filtered.length} listing{filtered.length!==1?"s":""}</div>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"40px 40px 80px"}}>
        {loading ? (
          <div style={{textAlign:"center",padding:"80px",color:"rgba(255,255,255,0.3)"}}>
            <div style={{fontSize:"3rem",marginBottom:12}}>🍚</div>
            <div>Loading marketplace…</div>
          </div>
        ) : filtered.length===0 ? (
          <div style={{textAlign:"center",padding:"80px",background:"rgba(255,255,255,0.02)",borderRadius:20,border:"1px dashed rgba(255,255,255,0.08)"}}>
            <div style={{fontSize:"3rem",marginBottom:12}}>🔍</div>
            <div style={{fontWeight:700,color:"rgba(255,255,255,0.4)"}}>No listings match your search</div>
            <div style={{color:"rgba(255,255,255,0.25)",fontSize:"0.83rem",marginTop:6}}>Try adjusting your filters</div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:22}}>
            {filtered.map(l=><RiceCard key={l.id} listing={l} onOrder={()=>openOrder(l)}/>)}
          </div>
        )}
      </div>
    </div>

    {/* ══ ORDER MODAL ══ */}
    {showOrder && selected && (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(8px)"}}
        onClick={e=>e.target===e.currentTarget&&setShowOrder(false)}>
        <div style={{background:"#0d1610",border:"1px solid #1a2e1e",borderRadius:20,width:"100%",maxWidth:860,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,0.6)"}}>
          {/* Header */}
          <div style={{background:"linear-gradient(135deg,#071f10,#0d2e18)",padding:"22px 28px",borderRadius:"20px 20px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1a2e1e"}}>
            <div>
              <h2 style={{margin:"0 0 3px",fontSize:"1.1rem",fontWeight:800,color:"#fff"}}>🛒 Place Your Order</h2>
              <p style={{margin:0,color:"rgba(255,255,255,0.4)",fontSize:"0.8rem"}}>{selected.riceTypeName} from {selected.millName}</p>
            </div>
            <button onClick={()=>setShowOrder(false)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)",width:36,height:36,borderRadius:"50%",fontSize:"1.2rem",cursor:"pointer",lineHeight:1}}>×</button>
          </div>

          {orderSuccess ? (
            <div style={{textAlign:"center",padding:"56px 32px"}}>
              <div style={{width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#134d2e,#27a85c)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:"1.8rem",boxShadow:"0 0 32px rgba(39,168,92,0.3)"}}>✅</div>
              <h3 style={{color:"#4ade80",margin:"0 0 8px",fontFamily:"Georgia,serif",fontSize:"1.5rem"}}>Order Placed!</h3>
              <p style={{color:"rgba(255,255,255,0.5)",marginBottom:8}}>{orderSuccess.message}</p>
              <div style={{fontSize:"1.4rem",fontWeight:900,color:"#fff",marginBottom:20}}>Rs {orderSuccess.total.toLocaleString()}</div>
              <button onClick={()=>setShowOrder(false)} style={{background:"linear-gradient(135deg,#134d2e,#27a85c)",color:"#fff",border:"none",borderRadius:12,padding:"12px 28px",fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Done</button>
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"300px 1fr"}}>
              {/* Left panel */}
              <div style={{background:"rgba(255,255,255,0.02)",borderRight:"1px solid #1a2e1e",padding:"24px"}}>
                <h3 style={{margin:"0 0 16px",color:"rgba(255,255,255,0.6)",fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Order Summary</h3>
                {/* Rice info */}
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px",marginBottom:18}}>
                  {getImageUrl(selected.imageUrl)&&<img src={getImageUrl(selected.imageUrl)} alt="" style={{width:"100%",height:90,objectFit:"cover",borderRadius:8,marginBottom:10,filter:"brightness(0.7)"}} onError={e=>{e.target.style.display="none"}}/>}
                  <div style={{fontWeight:800,color:"#fff",marginBottom:2}}>{selected.riceTypeName} Rice</div>
                  <div style={{color:"rgba(255,255,255,0.4)",fontSize:"0.8rem",marginBottom:6}}>from {selected.millName}</div>
                  <div style={{color:"rgba(241,245,242,0.38)",fontSize:"0.75rem",marginBottom:2}}>📍 {selected.millLocation}</div>
                  <div style={{color:"rgba(241,245,242,0.38)",fontSize:"0.75rem"}}>🚚 {selected.deliveryTime}</div>
                </div>

                {/* Package selection */}
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Package Size</div>
                  {WEIGHT_OPTIONS.map(w=>(
                    <label key={w.value} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:`1.5px solid ${order.selectedWeight===w.value?"rgba(96,165,250,0.5)":"rgba(255,255,255,0.08)"}`,borderRadius:10,cursor:"pointer",background:order.selectedWeight===w.value?"rgba(96,165,250,0.08)":"transparent",marginBottom:7,transition:"all 0.15s"}}>
                      <input type="radio" name="weight" value={w.value} checked={order.selectedWeight===w.value} onChange={()=>setOrder(p=>({...p,selectedWeight:w.value}))} style={{accentColor:"#60a5fa"}}/>
                      <span style={{fontWeight:700,color:"#fff",fontSize:"0.85rem"}}>{w.label}</span>
                      <span style={{marginLeft:"auto",color:"#60a5fa",fontWeight:700,fontSize:"0.85rem"}}>Rs {Math.round(selected.basePricePerKg*w.priceMultiplier*w.value)}</span>
                      {w.priceMultiplier<1&&<span style={{background:"rgba(74,222,128,0.15)",color:"#4ade80",fontSize:"0.65rem",fontWeight:800,borderRadius:4,padding:"2px 6px"}}>-{Math.round((1-w.priceMultiplier)*100)}%</span>}
                    </label>
                  ))}
                </div>

                {/* Quantity */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.83rem",fontWeight:600}}>Quantity</span>
                  <select value={order.quantity} onChange={e=>setOrder(p=>({...p,quantity:parseInt(e.target.value)}))}
                    style={{appearance:"none",padding:"7px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#fff",fontFamily:"inherit",fontWeight:700,outline:"none",cursor:"pointer"}}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} style={{background:"#111a13"}}>{n}</option>)}
                  </select>
                </div>

                {/* Total */}
                {price&&(
                  <div style={{background:"linear-gradient(135deg,#071f10,#0d2e18)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:12,padding:"14px"}}>
                    <div style={{fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Order Total</div>
                    {[["Subtotal",`Rs ${price.subtotal.toLocaleString()}`],["Delivery",`Rs ${price.deliveryFee}`]].map(([l,v])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                        <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem"}}>{l}</span>
                        <span style={{color:"rgba(255,255,255,0.7)",fontSize:"0.82rem",fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:"1px solid rgba(96,165,250,0.2)"}}>
                      <span style={{fontWeight:800,color:"#fff"}}>TOTAL</span>
                      <span style={{fontWeight:900,color:"#60a5fa",fontSize:"1.2rem"}}>Rs {price.total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: form */}
              <form onSubmit={handleOrder} style={{padding:"24px"}}>
                <h3 style={{margin:"0 0 20px",color:"rgba(255,255,255,0.6)",fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Delivery Information</h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  {[{l:"Full Name *",k:"name",ph:"Your full name",req:true},{l:"Mobile *",k:"mobileNumber",ph:"07X XXX XXXX",req:true}].map(f=>(
                    <MField key={f.k} label={f.l}>
                      <input value={order[f.k]} onChange={e=>setOrder(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} required={f.req} style={minp}/>
                    </MField>
                  ))}
                </div>
                <MField label="Delivery Address *">
                  <textarea value={order.address} onChange={e=>setOrder(p=>({...p,address:e.target.value}))} placeholder="Street address, city" required style={{...minp,resize:"vertical",minHeight:70,marginBottom:16}}/>
                </MField>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <MField label="District *">
                    <div style={{position:"relative"}}>
                      <select value={order.district} onChange={e=>setOrder(p=>({...p,district:e.target.value}))} required style={{...minp,appearance:"none",paddingRight:32,cursor:"pointer"}}>
                        <option value="" style={{background:"#111a13"}}>Select District</option>
                        {DISTRICTS.map(d=><option key={d} style={{background:"#111a13"}}>{d}</option>)}
                      </select>
                      <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",fontSize:"0.58rem",pointerEvents:"none"}}>▼</span>
                    </div>
                  </MField>
                  <MField label="Delivery Speed">
                    <div style={{display:"flex",flexDirection:"column",gap:6,paddingTop:2}}>
                      {[["normal","🕐 Normal (6 hrs) · Rs 200"],["fast","⚡ Fast (1-2 hrs) · Rs 500"]].map(([v,l])=>(
                        <label key={v} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",border:`1px solid ${order.deliveryOption===v?"rgba(96,165,250,0.4)":"rgba(255,255,255,0.08)"}`,borderRadius:8,cursor:"pointer",background:order.deliveryOption===v?"rgba(96,165,250,0.07)":"transparent",fontSize:"0.78rem"}}>
                          <input type="radio" name="delivery" value={v} checked={order.deliveryOption===v} onChange={()=>setOrder(p=>({...p,deliveryOption:v}))} style={{accentColor:"#60a5fa"}}/>
                          <span style={{color:"rgba(255,255,255,0.7)"}}>{l}</span>
                        </label>
                      ))}
                    </div>
                  </MField>
                </div>
                <MField label="Payment Method *">
                  <div style={{display:"flex",gap:10,paddingTop:2}}>
                    {[["cod","💵 Cash on Delivery"],["online","💳 Online Payment"]].map(([v,l])=>(
                      <label key={v} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px",border:`1.5px solid ${order.paymentMethod===v?"rgba(96,165,250,0.4)":"rgba(255,255,255,0.08)"}`,borderRadius:10,cursor:"pointer",background:order.paymentMethod===v?"rgba(96,165,250,0.07)":"transparent",fontSize:"0.82rem",fontWeight:600,color:order.paymentMethod===v?"#60a5fa":"rgba(255,255,255,0.5)",transition:"all 0.15s"}}>
                        <input type="radio" name="paymentMethod" value={v} checked={order.paymentMethod===v} onChange={e=>setOrder(p=>({...p,paymentMethod:e.target.value}))} style={{display:"none"}} required/>
                        {l}
                      </label>
                    ))}
                  </div>
                </MField>
                <div style={{marginTop:20,display:"flex",gap:12}}>
                  <button type="button" onClick={()=>setShowOrder(false)} style={{flex:1,padding:"12px",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#1e3a8a,#2563eb)",color:"#fff",border:"none",borderRadius:10,fontWeight:800,cursor:submitting?"not-allowed":"pointer",fontFamily:"inherit",opacity:submitting?0.7:1,boxShadow:"0 0 20px rgba(37,99,235,0.3)"}}>
                    {submitting?"Placing…":"🛒 Confirm Order"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    )}

    {/* ══ CARD PAYMENT ══ */}
    {showCardPay && selected && (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1200,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(10px)"}}>
        <div style={{background:"#0d1610",border:"1px solid #1a2e1e",borderRadius:20,width:"min(460px,100%)",padding:32,boxShadow:"0 32px 80px #000a"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <h3 style={{margin:0,color:"#fff",fontSize:"1.1rem"}}>💳 Online Payment</h3>
              <p style={{margin:"4px 0 0",color:"rgba(255,255,255,0.4)",fontSize:"0.78rem"}}>{selected.riceTypeName} · {selected.millName}</p>
            </div>
            <button onClick={()=>setSCP(false)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",width:36,height:36,borderRadius:"50%",fontSize:"1.2rem",cursor:"pointer",lineHeight:1}}>×</button>
          </div>
          <OnlinePaymentForm amount={calcPrice()?.total} onCancel={()=>setSCP(false)} onSuccess={async()=>{setSCP(false);await submitOrder();}} setIsProcessing={setSubm}/>
        </div>
      </div>
    )}
    </React.Fragment>
  );
}

function MarketHero({ count }) {
  const [si, setSi]   = React.useState(0);
  const [fade, setFade] = React.useState(true);
  const go = n => { setFade(false); setTimeout(() => { setSi((n + MARKET_SLIDES.length) % MARKET_SLIDES.length); setFade(true); }, 300); };
  React.useEffect(() => { const t = setInterval(() => go(si + 1), 5000); return () => clearInterval(t); }, [si]);
  return (
    <div style={{ position:"relative", height:360, overflow:"hidden" }}>
      {/* FULL BRIGHT img tag — not CSS background */}
      <div style={{ position:"absolute", inset:0, transition:"opacity 0.32s", opacity:fade?1:0 }}>
        <img src={MARKET_SLIDES[si]} alt="Rice Market"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }}/>
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(100deg, rgba(7,24,16,0.88) 0%, rgba(7,24,16,0.55) 42%, rgba(7,24,16,0.08) 68%, transparent 100%)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:100,
          background:"linear-gradient(to top, #071810, transparent)" }}/>
      </div>
      {/* TEXT */}
      <div style={{ position:"relative", zIndex:5, height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px" }}>
        <div style={{ fontSize:"0.66rem", color:"#3b82f6", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:1.5, background:"#3b82f6" }}/> Rice Marketplace
        </div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:900, margin:"0 0 12px", letterSpacing:"-1px", lineHeight:1.1, color:"#f1f5f2", transition:"opacity 0.32s", opacity:fade?1:0 }}>
          Premium Rice,<br/><span style={{ color:"#3b82f6" }}>Direct from Mills</span>
        </h1>
        <p style={{ color:"rgba(241,245,242,0.82)", fontSize:"0.9rem", lineHeight:1.75, maxWidth:440, marginBottom:20 }}>
          Browse <strong style={{ color:"#f1f5f2" }}>{count}</strong> certified varieties from trusted mills — doorstep delivery across Sri Lanka.
        </p>
        <div style={{ display:"flex", gap:7 }}>
          {MARKET_SLIDES.map((_,i) => (
            <button key={i} onClick={() => go(i)} style={{ width:i===si?22:7, height:7, borderRadius:99, background:i===si?"#3b82f6":"rgba(255,255,255,0.28)", border:"none", cursor:"pointer", padding:0, transition:"all 0.3s" }}/>
          ))}
        </div>
      </div>
      {/* ARROWS */}
      <button onClick={() => go(si-1)} style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", zIndex:10, width:40, height:40, borderRadius:"50%", background:"rgba(7,24,16,0.7)", border:"1px solid rgba(255,255,255,0.22)", color:"#f1f5f2", fontSize:"1.4rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)", lineHeight:1 }}>‹</button>
      <button onClick={() => go(si+1)} style={{ position:"absolute", right:118, top:"50%", transform:"translateY(-50%)", zIndex:10, width:40, height:40, borderRadius:"50%", background:"rgba(7,24,16,0.7)", border:"1px solid rgba(255,255,255,0.22)", color:"#f1f5f2", fontSize:"1.4rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)", lineHeight:1 }}>›</button>
      {/* THUMBNAIL STRIP */}
      <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", zIndex:10, display:"flex", flexDirection:"column", gap:8 }}>
        {MARKET_SLIDES.map((img,i) => (
          <button key={i} onClick={() => go(i)} style={{ width:88, height:58, padding:0, border:"none", borderRadius:10, overflow:"hidden", cursor:"pointer",
            outline:i===si?"2.5px solid #3b82f6":"1.5px solid rgba(255,255,255,0.2)", outlineOffset:2,
            opacity:i===si?1:0.52, transition:"all 0.25s", boxShadow:i===si?"0 0 16px #3b82f655":"none" }}>
            <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          </button>
        ))}
      </div>
    </div>
  );
}

function RiceCard({listing:l,onOrder}){
  const [hov,setHov]=useState(false);
  const imageUrl = getImageUrl(l.imageUrl);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:"#0e2318",border:"1px solid #1a3828",borderRadius:18,overflow:"hidden",display:"flex",flexDirection:"column",transition:"all 0.22s",boxShadow:hov?"0 16px 48px rgba(0,0,0,0.4), 0 0 0 2px rgba(59,130,246,0.4)":"0 4px 16px rgba(0,0,0,0.25)",transform:hov?"translateY(-4px)":"none"}}>
      {/* Image — full bright, no filter */}
      <div style={{height:220,position:"relative",background:"#0a1e12",overflow:"hidden",flexShrink:0}}>
        {imageUrl
          ? <img src={imageUrl} alt={l.riceTypeName} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",display:"block",transition:"transform 0.45s",transform:hov?"scale(1.06)":"scale(1)"}} onError={e=>{e.target.style.display="none"}}/>
          : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3.5rem",opacity:0.5}}>🌾</div>
        }
        <div style={{position:"absolute",top:10,left:10,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",borderRadius:99,padding:"4px 12px",fontSize:"0.72rem",fontWeight:700,color:"#60a5fa",border:"1px solid rgba(96,165,250,0.2)"}}>{l.riceTypeName}</div>
        <div style={{position:"absolute",top:10,right:10,background:"rgba(245,197,24,0.15)",border:"1px solid rgba(245,197,24,0.3)",borderRadius:99,padding:"4px 10px",fontSize:"0.7rem",fontWeight:700,color:"#f5c518"}}>
          ⭐ {l.millRating}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top,rgba(0,0,0,0.7),transparent)",padding:"20px 14px 10px"}}>
          <div style={{fontWeight:900,color:"#fff",fontSize:"1.2rem",letterSpacing:"-0.5px"}}>Rs {l.basePricePerKg}<span style={{fontSize:"0.7rem",opacity:0.7}}>/kg</span></div>
        </div>
      </div>
      {/* Body */}
      <div style={{padding:"16px 18px 20px",flex:1,display:"flex",flexDirection:"column"}}>
        <h3 style={{margin:"0 0 4px",fontSize:"1rem",fontWeight:800,color:"#f1f5f2"}}>{l.riceTypeName} Rice</h3>
        <p style={{margin:"0 0 3px",color:"rgba(241,245,242,0.6)",fontSize:"0.8rem",fontWeight:600}}>{l.millName}</p>
        <p style={{margin:"0 0 12px",color:"rgba(241,245,242,0.38)",fontSize:"0.75rem"}}>📍 {l.millLocation} · 🚚 {l.deliveryTime}</p>
        {(l.riceDescription||l.description)&&<p style={{margin:"0 0 14px",color:"rgba(241,245,242,0.55)",fontSize:"0.8rem",lineHeight:1.6}}>{(l.riceDescription||l.description).slice(0,90)}{(l.riceDescription||l.description).length>90?"…":""}</p>}
        {/* Package mini-cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14}}>
          {WEIGHT_OPTIONS.map(w=>(
            <div key={w.value} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,padding:"8px 5px",textAlign:"center"}}>
              <div style={{fontWeight:700,color:"rgba(241,245,242,0.75)",fontSize:"0.75rem"}}>{w.label}</div>
              <div style={{color:"#60a5fa",fontWeight:800,fontSize:"0.82rem"}}>Rs {Math.round(l.basePricePerKg*w.priceMultiplier*w.value)}</div>
              {w.priceMultiplier<1&&<div style={{color:"#4ade80",fontSize:"0.58rem",fontWeight:700}}>-{Math.round((1-w.priceMultiplier)*100)}%</div>}
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:12,marginBottom:12}}>
          <span style={{color:l.availableKg>100?"#86efac":"#fb923c",fontSize:"0.78rem",fontWeight:700}}>
            {l.availableKg>100?`📦 ${Math.floor(l.availableKg/25)} bags left`:"⚠️ Low stock"}
          </span>
        </div>
        <button onClick={onOrder} style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#1e3a8a,#2563eb)",color:"#fff",border:"none",borderRadius:10,fontWeight:800,cursor:"pointer",fontSize:"0.88rem",fontFamily:"inherit",boxShadow:hov?"0 0 20px rgba(37,99,235,0.35)":"none",transition:"box-shadow 0.2s",marginTop:"auto"}}>
          🛒 Order Now
        </button>
      </div>
    </div>
  );
}

function MField({label,children}){
  return (
    <div style={{marginBottom:0}}>
      <label style={{display:"block",fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7}}>{label}</label>
      {children}
    </div>
  );
}

const minp={width:"100%",padding:"11px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,fontSize:"0.88rem",color:"#fff",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
