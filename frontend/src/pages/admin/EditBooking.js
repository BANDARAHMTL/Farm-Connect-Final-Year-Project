import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get("/bookings").then(res => {
      const b = res.data.find(x => String(x.id) === String(id));
      if (!b) { alert("Not found"); navigate("/admin/bookings"); return; }
      setForm(b);
    }).catch(() => alert("Failed to load"));
  }, [id, navigate]);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.put(`/bookings/${id}/status`, { status: form.status });
      navigate("/admin/bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  }

  if (!form) return <div>Loading…</div>;
  return (
    <form className="form" onSubmit={submit}>
      <h3>Edit Booking #{form.id}</h3>
      <div><strong>Farmer:</strong> {form.userName || form.user_name || "-"}</div>
      <div><strong>Vehicle:</strong> {form.vehicle_number || form.vehicleNumber || "-"}</div>
      <div><strong>Date:</strong> {form.booking_date || form.bookingDate || "-"}</div>
      <label>Status</label>
      <select className="input" value={form.status || "pending"} onChange={e => setForm({ ...form, status: e.target.value })}>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="completed">Completed</option>
      </select>
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
        <button type="submit" className="fc-btn fc-btn-primary">Update Status</button>
      </div>
    </form>
  );
}
