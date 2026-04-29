import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const BADGE_MAP = {
  pending:   { bg:"var(--warning-bg)",  fg:"#92400e", dot:"#d97706" },
  approved:  { bg:"var(--success-bg)",  fg:"#14532d", dot:"#16a34a" },
  completed: { bg:"var(--success-bg)",  fg:"#14532d", dot:"#16a34a" },
  rejected:  { bg:"var(--danger-bg)",   fg:"#991b1b", dot:"#dc2626" },
  PENDING:   { bg:"var(--warning-bg)",  fg:"#92400e", dot:"#d97706" },
  APPROVED:  { bg:"var(--success-bg)",  fg:"#14532d", dot:"#16a34a" },
  REJECTED:  { bg:"var(--danger-bg)",   fg:"#991b1b", dot:"#dc2626" },
};

function Badge({ status }) {
  const c = BADGE_MAP[status] || { bg:"var(--n100)", fg:"var(--n600)", dot:"var(--n400)" };
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:99,
      fontSize:"0.72rem", fontWeight:700,
      background:c.bg, color:c.fg, textTransform:"capitalize",
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {(status||"pending").toLowerCase()}
    </span>
  );
}

function StatCard({ label, value, sub, color, onClick, icon }) {
  return (
    <div onClick={onClick} className="fc-stat"
      style={{ borderTop:`3px solid ${color}`, cursor: onClick ? "pointer" : "default" }}>
      <div className="fc-stat-icon" style={{ background: color + "18" }}>
        <span style={{ fontSize:"1.2rem", color }}>{icon}</span>
      </div>
      <div style={{ flex:1 }}>
        <div className="fc-stat-label">{label}</div>
        <div className="fc-stat-value">{value ?? "—"}</div>
        {sub && <div className="fc-stat-sub">{sub}</div>}
      </div>
      {onClick && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--n300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      )}
    </div>
  );
}

function MiniBar({ data, color }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:72 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <span style={{ fontSize:"0.68rem", fontWeight:700, color:"var(--n600)" }}>{d.value}</span>
          <div style={{
            width:"100%",
            background: d.value > 0 ? color : "var(--n100)",
            borderRadius:"4px 4px 0 0",
            height:`${Math.max((d.value/max)*52, d.value > 0 ? 8 : 4)}px`,
            transition:"height 0.5s ease",
          }} />
          <span style={{ fontSize:"0.65rem", color:"var(--n400)", textAlign:"center", textTransform:"capitalize" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function RecentTable({ title, rows, columns, link, emptyMsg }) {
  const nav = useNavigate();
  return (
    <div className="fc-card">
      <div className="fc-card-header">
        <span className="fc-card-title">{title}</span>
        <button className="fc-btn fc-btn-ghost fc-btn-sm" onClick={() => nav(link)}>
          View all
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding:"28px 24px", textAlign:"center", color:"var(--n400)", fontSize:"0.85rem" }}>
          {emptyMsg}
        </div>
      ) : (
        <div className="fc-table-wrap" style={{ borderRadius:0, border:"none", boxShadow:"none" }}>
          <table className="fc-table">
            <thead>
              <tr>{columns.map(c => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const nav = useNavigate();
  const [stats,   setStats]   = useState({ farmers:0, vehicles:0, mills:0, bookings:0, sellings:0, orders:0 });
  const [bkData,  setBkData]  = useState([]);
  const [slData,  setSlData]  = useState([]);
  const [orData,  setOrData]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [fRes,vRes,mRes,bRes,sRes,oRes] = await Promise.allSettled([
        api.get("/admin/farmers"), api.get("/vehicles"), api.get("/rices"),
        api.get("/bookings"), api.get("/selling"), api.get("/rice/orders"),
      ]);
      const b = bRes.status==="fulfilled" ? (bRes.value.data?.data||[]) : [];
      const s = sRes.status==="fulfilled" ? (sRes.value.data?.data||[]) : [];
      const o = oRes.status==="fulfilled" ? (oRes.value.data?.data||[]) : [];
      setStats({
        farmers:  fRes.status==="fulfilled" ? (fRes.value.data?.data?.length||0) : 0,
        vehicles: vRes.status==="fulfilled" ? (vRes.value.data?.data?.length||0) : 0,
        mills:    mRes.status==="fulfilled" ? (mRes.value.data?.data?.length||0) : 0,
        bookings: b.length, sellings: s.length, orders: o.length,
      });
      setBkData(b.slice(0,6)); setSlData(s.slice(0,6)); setOrData(o.slice(0,6));
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  }

  const bookingChart = ["pending","approved","rejected","completed"].map(s => ({
    label: s.slice(0,4), value: bkData.filter(b => b.status===s).length,
  }));
  const sellingChart = ["PENDING","APPROVED","REJECTED"].map(s => ({
    label: s.slice(0,4).toLowerCase(), value: slData.filter(b => b.status===s).length,
  }));
  const totalRevenue   = orData.reduce((s,o) => s+Number(o.total_price||0),0);
  const approvedSelling = slData.filter(s => s.status==="APPROVED").reduce((a,s) => a+Number(s.total_price||0),0);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300, gap:10, color:"var(--n500)" }}>
      <span className="fc-spin" style={{ fontSize:"1.2rem" }}>◌</span>
      Loading dashboard…
    </div>
  );

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div className="fc-page-header">
        <div>
          <div className="fc-page-title">Dashboard</div>
          <div className="fc-page-subtitle">Overview of your farm management platform</div>
        </div>
        <button className="fc-btn fc-btn-primary fc-btn-sm" onClick={load}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>
      <div className="fc-grid fc-grid-3" style={{ marginBottom:24, gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))" }}>
        <StatCard label="Registered Farmers" value={stats.farmers}  color="var(--g600)" icon="👥" onClick={() => nav("/admin/users")} />
        <StatCard label="Vehicles"           value={stats.vehicles} color="#0284c7"     icon="🚜" onClick={() => nav("/admin/vehicles")} />
        <StatCard label="Rice Mills"         value={stats.mills}    color="#d97706"     icon="🏭" onClick={() => nav("/admin/rices")} />
        <StatCard label="Bookings"           value={stats.bookings} color="#7c3aed"     icon="📅" onClick={() => nav("/admin/bookings")} />
        <StatCard label="Selling Requests"   value={stats.sellings} color="#db2777"     icon="🌾"
          sub={`Rs ${approvedSelling.toLocaleString()} approved`} onClick={() => nav("/admin/sellings")} />
        <StatCard label="Rice Orders"        value={stats.orders}   color="var(--g500)" icon="🛒"
          sub={`Rs ${totalRevenue.toLocaleString()} revenue`} onClick={() => nav("/admin/orders")} />
      </div>
      <div className="fc-grid fc-grid-2" style={{ marginBottom:24 }}>
        <div className="fc-card">
          <div className="fc-card-header"><span className="fc-card-title">Booking Status</span></div>
          <div className="fc-card-body"><MiniBar data={bookingChart} color="var(--g600)" /></div>
        </div>
        <div className="fc-card">
          <div className="fc-card-header"><span className="fc-card-title">Selling Status</span></div>
          <div className="fc-card-body"><MiniBar data={sellingChart} color="#d97706" /></div>
        </div>
      </div>
      <div className="fc-grid fc-grid-3">
        <RecentTable
          title="Recent Bookings" link="/admin/bookings" emptyMsg="No bookings yet"
          columns={["Farmer","Date","Status"]}
          rows={bkData.map(b => [
            <span style={{ fontWeight:600, fontSize:"0.85rem" }}>{b.userName||"Farmer"}</span>,
            <span style={{ color:"var(--n500)", fontSize:"0.8rem" }}>{b.booking_date||"—"}</span>,
            <Badge status={b.status} />,
          ])}
        />
        <RecentTable
          title="Recent Sellings" link="/admin/sellings" emptyMsg="No selling requests yet"
          columns={["Farmer","Rice","Total","Status"]}
          rows={slData.map(s => [
            <span style={{ fontWeight:600, fontSize:"0.85rem" }}>{s.farmerName||"Farmer"}</span>,
            <span style={{ color:"var(--n500)", fontSize:"0.8rem" }}>{s.rice_type}</span>,
            <span style={{ color:"var(--g700)", fontWeight:700, fontSize:"0.85rem" }}>Rs {Number(s.total_price||0).toLocaleString()}</span>,
            <Badge status={s.status} />,
          ])}
        />
        <RecentTable
          title="Recent Orders" link="/admin/orders" emptyMsg="No orders yet"
          columns={["Customer","Rice","Wt","Total"]}
          rows={orData.map(o => [
            <span style={{ fontWeight:600, fontSize:"0.85rem" }}>{o.customer_name||"Customer"}</span>,
            <span style={{ color:"var(--n500)", fontSize:"0.8rem" }}>{o.rice_type}</span>,
            <span style={{ fontSize:"0.8rem" }}>{o.weight_kg}kg</span>,
            <span style={{ color:"var(--g700)", fontWeight:700, fontSize:"0.85rem" }}>Rs {Number(o.total_price||0).toLocaleString()}</span>,
          ])}
        />
      </div>
    </div>
  );
}
