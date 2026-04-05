import React, { useState } from "react";
import axios from "axios";

const T = {
  bg:"#071810", card:"#0e2318", border:"#1a3828",
  green:"#22c55e", greenDk:"#16a34a",
  gold:"#eab308", text:"#f1f5f2",
  mid:"rgba(241,245,242,0.65)", low:"rgba(241,245,242,0.32)",
};

/* 3 images that cycle as a slideshow on the left panel */
const IMGS = [
  "https://media.telanganatoday.com/wp-content/uploads/2021/12/agri-digital.jpg",
  "https://www.dhyeyaias.com/storage/media/Unlocking-the-Potential-of-Agri-Tech.jpg",
  "https://tse2.mm.bing.net/th/id/OIP.RUV9Vp1oJan3DbObq_3fZAHaEL?rs=1&pid=ImgDetMain&o=7&rm=3",
];

const INP = {
  width:"100%", padding:"13px 16px", boxSizing:"border-box",
  background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.12)",
  borderRadius:10, fontSize:"0.9rem", color:T.text,
  outline:"none", fontFamily:"inherit", transition:"border-color 0.2s",
};

export default function FarmerSignIn({ setCurrentPage }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [si,       setSi]       = useState(0);
  const [fade,     setFade]     = useState(true);

  React.useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setSi(i => (i+1) % IMGS.length); setFade(true); }, 300);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await axios.post("http://localhost:8080/api/farmers/login",
        { email, password }, { headers:{"Content-Type":"application/json"} });
      if (!res.data?.token) { setError("Login failed: no token received."); return; }
      localStorage.setItem("farmerToken", res.data.token);
      localStorage.setItem("farmer", JSON.stringify(res.data.farmer));
      setCurrentPage("Account");
    } catch(err) {
      setError(err?.response?.data?.message || "Login failed. Check credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"calc(100vh - 70px)", display:"grid", gridTemplateColumns:"1fr 1fr", fontFamily:"'Inter',sans-serif", background:T.bg }}>

      {/* ── LEFT: IMAGE SLIDESHOW ── */}
      <div style={{ position:"relative", overflow:"hidden", minHeight:500 }}>
        {/* Full-size image — bright, visible */}
        <div style={{ position:"absolute", inset:0, transition:"opacity 0.32s", opacity:fade?1:0 }}>
          <img src={IMGS[si]} alt="Farm" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }}/>
          {/* Only darken enough for text readability */}
          <div style={{ position:"absolute", inset:0,
            background:"linear-gradient(135deg, rgba(7,24,16,0.75) 0%, rgba(7,24,16,0.45) 60%, rgba(7,24,16,0.2) 100%)" }}/>
        </div>

        {/* Thumbnail strip — right edge */}
        <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", zIndex:10, display:"flex", flexDirection:"column", gap:8 }}>
          {IMGS.map((img,i) => (
            <button key={i} onClick={()=>{setFade(false);setTimeout(()=>{setSi(i);setFade(true);},300);}} style={{
              width:72, height:48, padding:0, border:"none", borderRadius:8, overflow:"hidden", cursor:"pointer",
              outline:i===si?`2.5px solid ${T.gold}`:`1.5px solid rgba(255,255,255,0.2)`, outlineOffset:2,
              opacity:i===si?1:0.5, transition:"all 0.25s", boxShadow:i===si?`0 0 14px ${T.gold}55`:"none",
            }}>
              <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
            </button>
          ))}
        </div>

        {/* Dot indicators */}
        <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:10, display:"flex", gap:7 }}>
          {IMGS.map((_,i) => (
            <button key={i} onClick={()=>{setFade(false);setTimeout(()=>{setSi(i);setFade(true);},300);}} style={{
              width:i===si?22:7, height:7, borderRadius:99, border:"none", cursor:"pointer", padding:0,
              background:i===si?T.gold:"rgba(255,255,255,0.3)", transition:"all 0.3s",
            }}/>
          ))}
        </div>

        {/* Content overlay */}
        <div style={{ position:"relative", zIndex:5, height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"48px 44px" }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:`${T.gold}22`, border:`1px solid ${T.gold}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>🌿</div>
            <span style={{ fontWeight:800, fontSize:"1.05rem", color:T.text, fontFamily:"Georgia,serif" }}>FarmConnect</span>
          </div>

          {/* Main text */}
          <div>
            <div style={{ fontSize:"0.66rem", color:T.gold, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:24, height:1.5, background:T.gold }}/>Farmer Portal
            </div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:900, color:T.text, lineHeight:1.08, margin:"0 0 16px", letterSpacing:"-1px" }}>
              Welcome<br/>Back
            </h2>
            <p style={{ color:"rgba(241,245,242,0.72)", fontSize:"0.88rem", lineHeight:1.75, marginBottom:28, maxWidth:300 }}>
              Access your farm dashboard, manage bookings, and track paddy sales.
            </p>
            {["Equipment booking management","Live paddy selling prices","Rice marketplace access"].map((f,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:`${T.gold}22`, border:`1px solid ${T.gold}66`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:T.gold, fontSize:"0.65rem", fontWeight:900 }}>✓</span>
                </div>
                <span style={{ color:"rgba(241,245,242,0.7)", fontSize:"0.83rem" }}>{f}</span>
              </div>
            ))}
          </div>

          <div style={{ color:"rgba(241,245,242,0.28)", fontSize:"0.7rem" }}>© 2024 FarmConnect Sri Lanka</div>
        </div>
      </div>

      {/* ── RIGHT: SIGN IN FORM ── */}
      <div style={{ background:T.card, display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 56px" }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          <div style={{ marginBottom:34 }}>
            <h3 style={{ fontFamily:"Georgia,serif", fontSize:"1.9rem", fontWeight:900, color:T.text, margin:"0 0 8px" }}>Sign In</h3>
            <p style={{ color:T.low, fontSize:"0.84rem", margin:0 }}>Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"12px 16px", marginBottom:20, color:"#f87171", fontSize:"0.84rem", display:"flex", alignItems:"center", gap:8 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <Field label="EMAIL ADDRESS">
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com" required style={INP}/>
            </Field>
            <Field label="PASSWORD">
              <div style={{ position:"relative" }}>
                <input type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="Your password" required style={{ ...INP, paddingRight:46 }}/>
                <button type="button" onClick={()=>setShowPw(p=>!p)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.low, fontSize:"0.85rem", padding:0 }}>
                  {showPw?"👁":"👁‍🗨"}
                </button>
              </div>
            </Field>
            <div style={{ textAlign:"right", marginTop:-8 }}>
              <span style={{ color:`${T.gold}bb`, fontSize:"0.79rem", cursor:"pointer" }}>Forgot Password?</span>
            </div>
            <button type="submit" disabled={loading} style={{
              background:loading?"#1a3828":`linear-gradient(135deg,${T.greenDk},${T.green})`,
              color:"#fff", border:"none", borderRadius:12, padding:"14px",
              fontSize:"0.95rem", fontWeight:800, cursor:loading?"not-allowed":"pointer",
              fontFamily:"inherit", boxShadow:loading?"none":`0 0 28px ${T.green}44`, transition:"all 0.2s",
            }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div style={{ marginTop:28, textAlign:"center", color:T.low, fontSize:"0.83rem" }}>
            Don't have an account?{" "}
            <span onClick={()=>setCurrentPage("Sign Up")} style={{ color:T.gold, cursor:"pointer", fontWeight:700 }}>Register Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display:"block", fontSize:"0.69rem", fontWeight:700, color:"rgba(241,245,242,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:7 }}>{label}</label>
      {children}
    </div>
  );
}
