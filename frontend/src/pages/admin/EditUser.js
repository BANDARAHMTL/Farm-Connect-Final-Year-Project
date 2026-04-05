import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get("/admin/farmers").then(res => {
      const u = res.data.find(x => String(x.id) === String(id));
      if (!u) { alert("Not found"); navigate("/admin/users"); return; }
      setForm(u);
    }).catch(() => alert("Failed to load"));
  }, [id, navigate]);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.put(`/admin/farmers/${id}`, form);
      navigate("/admin/users");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  }

  if (!form) return <div>Loading…</div>;
  return (
    <form className="form" onSubmit={submit}>
      <h3>Edit Farmer</h3>
      <label>Full Name</label>
      <input className="input" value={form.fullName || form.name || ""} onChange={e => setForm({ ...form, fullName: e.target.value })} />
      <label>Phone</label>
      <input className="input" value={form.phone || form.mobile || ""} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <label>Email</label>
      <input className="input" value={form.email || ""} readOnly style={{ background: "#f5f5f5" }} />
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
        <button type="submit" className="fc-btn fc-btn-primary">Update</button>
      </div>
    </form>
  );
}
