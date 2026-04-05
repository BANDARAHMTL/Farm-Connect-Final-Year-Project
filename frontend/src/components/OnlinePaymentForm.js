/**
 * OnlinePaymentForm.js
 * 
 * Stripe-style card payment UI component.
 * Shows when user selects "Online" / card payment.
 * Simulates Stripe integration (real Stripe.js can replace card tokenization).
 */
import React, { useState, useRef } from "react";

const CARD_BRANDS = {
  visa:       { name:"Visa",       color:"#1a1f71", bg:"#fff",      text:"VISA",   style:{ fontFamily:"serif", fontWeight:900, letterSpacing:1, fontSize:"1.1rem", color:"#1a1f71" } },
  mastercard: { name:"MasterCard", color:"#eb001b", bg:"#fff",      icon:"mc" },
  amex:       { name:"Amex",       color:"#2e77bc", bg:"#2e77bc",   text:"AM\nEX", style:{ fontSize:"0.55rem", fontWeight:900, color:"#fff", lineHeight:1.1, letterSpacing:1 } },
  unknown:    { name:"",           color:"#ccc",    bg:"transparent" },
};

function detectBrand(num) {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n))  return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
}

function formatCard(val, brand) {
  const digits = val.replace(/\D/g, "");
  if (brand === "amex") {
    return digits.slice(0,4) + (digits.length>4?" "+digits.slice(4,10):"") + (digits.length>10?" "+digits.slice(10,15):"");
  }
  return digits.slice(0,16).replace(/(\d{4})/g,"$1 ").trim();
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g,"");
  if (digits.length <= 2) return digits;
  return digits.slice(0,2) + "/" + digits.slice(2,4);
}

function CardBrandIcon({ brand, size=28 }) {
  if (brand === "visa") return (
    <svg width={size*1.6} height={size} viewBox="0 0 48 28">
      <rect width="48" height="28" rx="4" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
      <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle"
        style={{fontFamily:"serif",fontWeight:900,fontSize:16,fill:"#1a1f71",letterSpacing:1}}>VISA</text>
    </svg>
  );
  if (brand === "mastercard") return (
    <svg width={size*1.2} height={size} viewBox="0 0 36 28">
      <rect width="36" height="28" rx="4" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
      <circle cx="14" cy="14" r="9" fill="#eb001b" opacity="0.9"/>
      <circle cx="22" cy="14" r="9" fill="#f79e1b" opacity="0.9"/>
      <path d="M18 7.5a9 9 0 010 13A9 9 0 0118 7.5z" fill="#ff5f00" opacity="0.9"/>
    </svg>
  );
  if (brand === "amex") return (
    <svg width={size*1.2} height={size} viewBox="0 0 36 28">
      <rect width="36" height="28" rx="4" fill="#2e77bc"/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{fontFamily:"Arial",fontWeight:900,fontSize:8,fill:"#fff",letterSpacing:0.5}}>AMEX</text>
    </svg>
  );
  return null;
}

// ── Main Component ───────────────────────────────────────────────
export default function OnlinePaymentForm({ amount, currency="Rs", onSuccess, onCancel, isProcessing, setIsProcessing }) {
  const [card,    setCard]    = useState({ number:"", expiry:"", cvv:"", name:"" });
  const [errors,  setErrors]  = useState({});
  const [focused, setFocused] = useState(null);
  const [step,    setStep]    = useState("form"); // "form" | "processing" | "done"
  const expiryRef = useRef();
  const cvvRef    = useRef();
  const nameRef   = useRef();

  const brand = detectBrand(card.number);

  function validate() {
    const e = {};
    const raw = card.number.replace(/\s/g,"");
    if (raw.length < 13) e.number = "Enter a valid card number";
    const [mm,yy] = card.expiry.split("/");
    if (!mm || !yy || Number(mm) > 12 || Number(mm) < 1)   e.expiry = "Invalid expiry date";
    else {
      const now = new Date();
      if (Number("20"+yy) < now.getFullYear() || (Number("20"+yy) === now.getFullYear() && Number(mm) < now.getMonth()+1))
        e.expiry = "Card has expired";
    }
    if (card.cvv.length < 3) e.cvv = "Invalid CVC";
    if (!card.name.trim())   e.name = "Enter name on card";
    return e;
  }

  async function handlePay(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep("processing");
    setIsProcessing && setIsProcessing(true);
    // Simulate Stripe payment (replace with real Stripe.js in production)
    await new Promise(r => setTimeout(r, 2200));
    setStep("done");
    setTimeout(() => {
      setIsProcessing && setIsProcessing(false);
      onSuccess && onSuccess({ method: "card", brand, last4: card.number.replace(/\s/g,"").slice(-4) });
    }, 800);
  }

  const inp = (field) => ({
    width:"100%", padding:"18px 16px 10px", border:"none", borderBottom:`2px solid ${
      errors[field] ? "#ef4444" : focused===field ? "var(--g700)" : "#e5e7eb"
    }`, background: "transparent", fontSize:"1rem", outline:"none", boxSizing:"border-box",
    color:"var(--n900)", fontFamily:"'SF Mono', 'Roboto Mono', monospace", letterSpacing: field==="number" ? "0.15em" : "normal",
    transition:"border-color 0.2s",
  });

  const lbl = (field) => ({
    position:"absolute", top: (card[field] || focused===field) ? 6 : 18,
    left:0, fontSize: (card[field] || focused===field) ? "0.7rem" : "0.9rem",
    color: errors[field] ? "#ef4444" : focused===field ? "var(--g700)" : "#9ca3af",
    transition:"all 0.18s", pointerEvents:"none", fontWeight:600, letterSpacing:"0.03em",
  });

  if (step === "processing") return (
    <div style={{ textAlign:"center", padding:"40px 20px" }}>
      <div style={{ width:64, height:64, margin:"0 auto 20px", borderRadius:"50%",
        border:"3px solid #e5e7eb", borderTopColor:"var(--g700)",
        animation:"spin 0.9s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize:"1.05rem", fontWeight:700, color:"var(--n900)" }}>Processing Payment…</div>
      <div style={{ color:"#9ca3af", fontSize:"0.83rem", marginTop:6 }}>Please do not close this window</div>
    </div>
  );

  if (step === "done") return (
    <div style={{ textAlign:"center", padding:"40px 20px" }}>
      <div style={{ width:64, height:64, margin:"0 auto 20px", borderRadius:"50%",
        background:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"2rem" }}>✅</div>
      <div style={{ fontSize:"1.1rem", fontWeight:800, color:"#065f46" }}>Payment Successful!</div>
      <div style={{ color:"#6b7280", fontSize:"0.85rem", marginTop:6 }}>{currency} {Number(amount).toLocaleString()} charged</div>
    </div>
  );

  return (
    <div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .pay-inp:focus{outline:none}`}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:"0.7rem", fontWeight:800, color:"#9ca3af", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6 }}>
          Credit / Debit Card
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <CardBrandIcon brand="visa"       size={22} />
          <CardBrandIcon brand="mastercard" size={22} />
          <CardBrandIcon brand="amex"       size={22} />
          <div style={{ fontSize:"0.72rem", color:"#9ca3af", marginLeft:4 }}>SSL Encrypted</div>
          <span style={{ marginLeft:"auto", fontSize:"0.75rem", color:"#6b7280" }}>🔒 Secure</span>
        </div>
        <div style={{ marginTop:8, fontSize:"0.78rem", color:"#9ca3af", lineHeight:1.5 }}>
          You may be directed to your bank's 3D Secure process to authenticate.
        </div>
      </div>

      <form onSubmit={handlePay}>
        {/* Card Number */}
        <div style={{ position:"relative", marginBottom:20, borderBottom:`2px solid ${errors.number ? "#ef4444" : focused==="number" ? "var(--g700)" : "#e5e7eb"}`, transition:"border-color 0.2s" }}>
          <span style={lbl("number")}>Card number</span>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
            <input
              className="pay-inp"
              style={{ ...inp("number"), borderBottom:"none", flex:1, paddingRight:48 }}
              value={card.number}
              placeholder=""
              maxLength={brand==="amex" ? 17 : 19}
              onFocus={() => setFocused("number")}
              onBlur={() => setFocused(null)}
              onChange={e => {
                const formatted = formatCard(e.target.value, brand);
                setCard(p => ({ ...p, number:formatted }));
                setErrors(p => ({ ...p, number:"" }));
                const raw = formatted.replace(/\s/g,"");
                if ((brand==="amex" && raw.length===15) || (brand!=="amex" && raw.length===16)) {
                  expiryRef.current?.focus();
                }
              }}
            />
            <div style={{ position:"absolute", right:0, bottom:10, display:"flex", gap:4 }}>
              {brand !== "unknown" ? <CardBrandIcon brand={brand} size={22} /> : <span style={{ fontSize:"1.2rem", color:"#ccc" }}>💳</span>}
            </div>
          </div>
          {errors.number && <div style={{ color:"#ef4444", fontSize:"0.72rem", marginTop:3 }}>{errors.number}</div>}
        </div>

        {/* Expiry + CVV */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
          <div style={{ position:"relative", borderBottom:`2px solid ${errors.expiry ? "#ef4444" : focused==="expiry" ? "var(--g700)" : "#e5e7eb"}`, transition:"border-color 0.2s" }}>
            <span style={lbl("expiry")}>Expiry date</span>
            <div style={{ display:"flex", alignItems:"flex-end" }}>
              <input
                ref={expiryRef}
                className="pay-inp"
                style={{ ...inp("expiry"), borderBottom:"none", flex:1 }}
                value={card.expiry}
                maxLength={5}
                onFocus={() => setFocused("expiry")}
                onBlur={() => setFocused(null)}
                onChange={e => {
                  const v = formatExpiry(e.target.value);
                  setCard(p => ({ ...p, expiry:v }));
                  setErrors(p => ({ ...p, expiry:"" }));
                  if (v.length === 5) cvvRef.current?.focus();
                }}
              />
              {card.expiry.length===5 && !errors.expiry && <span style={{ color:"#059669", fontSize:"1.1rem", paddingBottom:10 }}>✓</span>}
            </div>
            {errors.expiry && <div style={{ color:"#ef4444", fontSize:"0.72rem", marginTop:3 }}>{errors.expiry}</div>}
          </div>

          <div style={{ position:"relative", borderBottom:`2px solid ${errors.cvv ? "#ef4444" : focused==="cvv" ? "var(--g700)" : "#e5e7eb"}`, transition:"border-color 0.2s" }}>
            <span style={lbl("cvv")}>CVC / CVV</span>
            <div style={{ display:"flex", alignItems:"flex-end" }}>
              <input
                ref={cvvRef}
                className="pay-inp"
                style={{ ...inp("cvv"), borderBottom:"none", flex:1 }}
                type="password"
                value={card.cvv}
                maxLength={brand==="amex"?4:3}
                onFocus={() => setFocused("cvv")}
                onBlur={() => setFocused(null)}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g,"");
                  setCard(p => ({ ...p, cvv:v }));
                  setErrors(p => ({ ...p, cvv:"" }));
                  const maxLen = brand==="amex"?4:3;
                  if (v.length === maxLen) nameRef.current?.focus();
                }}
              />
              {card.cvv.length >= 3 && !errors.cvv && <span style={{ color:"#059669", fontSize:"1.1rem", paddingBottom:10 }}>✓</span>}
            </div>
            {errors.cvv && <div style={{ color:"#ef4444", fontSize:"0.72rem", marginTop:3 }}>{errors.cvv}</div>}
          </div>
        </div>

        {/* Name */}
        <div style={{ position:"relative", borderBottom:`2px solid ${errors.name ? "#ef4444" : focused==="name" ? "var(--g700)" : "#e5e7eb"}`, marginBottom:24, transition:"border-color 0.2s" }}>
          <span style={lbl("name")}>Name on card</span>
          <div style={{ display:"flex", alignItems:"flex-end" }}>
            <input
              ref={nameRef}
              className="pay-inp"
              style={{ ...inp("name"), borderBottom:"none", flex:1, fontFamily:"inherit", letterSpacing:"normal" }}
              value={card.name}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              onChange={e => { setCard(p=>({...p, name:e.target.value})); setErrors(p=>({...p,name:""})); }}
            />
            {card.name.trim().length > 2 && !errors.name && <span style={{ color:"#059669", fontSize:"1.1rem", paddingBottom:10 }}>✓</span>}
          </div>
          {errors.name && <div style={{ color:"#ef4444", fontSize:"0.72rem", marginTop:3 }}>{errors.name}</div>}
        </div>

        {/* Amount summary */}
        {amount > 0 && (
          <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:10, padding:"12px 16px", marginBottom:18, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"0.82rem", color:"#0369a1", fontWeight:600 }}>Total to pay</span>
            <span style={{ fontSize:"1.15rem", fontWeight:800, color:"var(--g700)" }}>{currency} {Number(amount).toLocaleString()}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display:"flex", gap:10 }}>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{
              flex:1, padding:"13px", border:"1.5px solid #e5e7eb", borderRadius:10,
              background:"#fff", cursor:"pointer", fontWeight:600, color:"#6b7280", fontSize:"0.9rem"
            }}>Cancel</button>
          )}
          <button type="submit" style={{
            flex:2, padding:"13px", border:"none", borderRadius:10,
            background:"linear-gradient(135deg,var(--g800),var(--g700))", color:"#fff",
            cursor:"pointer", fontWeight:800, fontSize:"0.95rem",
            boxShadow:"0 4px 14px #1565C030", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            🔒 Pay {currency} {Number(amount).toLocaleString()}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:12, fontSize:"0.72rem", color:"#bbb" }}>
          Powered by Stripe · 256-bit SSL encryption
        </div>
      </form>
    </div>
  );
}
