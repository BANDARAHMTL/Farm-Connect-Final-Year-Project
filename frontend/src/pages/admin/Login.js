import React, { useState } from "react";
import api from "../../api/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err,      setErr]      = useState("");
  const [loading,  setLoading]  = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const res = await api.post("/admin/login", { username, password });
      localStorage.setItem("admin_token",   res.data.token);
      localStorage.setItem("admin_profile", JSON.stringify(res.data.admin));
      window.location.href = "/admin";
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, var(--g900) 0%, var(--g800) 50%, #1a4a2e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "var(--font-body)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(39,168,92,0.06)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(39,168,92,0.04)" }} />
      </div>
      <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, var(--g500), var(--g400))",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16, boxShadow: "0 8px 24px rgba(39,168,92,0.35)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
            FarmConnect
          </div>
          <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Admin Portal
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--n900)", marginBottom: 6 }}>
            Sign in to continue
          </h2>
          <p style={{ fontSize: "0.83rem", color: "var(--n500)", marginBottom: 28 }}>
            Enter your admin credentials to access the dashboard.
          </p>
          {err && (
            <div className="fc-alert fc-alert-error" style={{ marginBottom: 20 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {err}
            </div>
          )}
          <form onSubmit={submit}>
            <div className="fc-field">
              <label className="fc-label">Username</label>
              <input className="fc-input" value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin" required autoFocus />
            </div>
            <div className="fc-field" style={{ marginBottom: 24 }}>
              <label className="fc-label">Password</label>
              <input type="password" className="fc-input" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required />
            </div>
            <button type="submit" className="fc-btn fc-btn-primary fc-btn-full fc-btn-lg" disabled={loading}>
              {loading ? <><span className="fc-spin">◌</span> Signing in…</> : "Sign In"}
            </button>
          </form>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <a href="/" style={{ fontSize: "0.82rem", color: "var(--g600)", textDecoration: "none", fontWeight: 500 }}>
              ← Back to Farmer Portal
            </a>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
          FarmConnect v2.0 · Secure Admin Access
        </div>
      </div>
    </div>
  );
}
