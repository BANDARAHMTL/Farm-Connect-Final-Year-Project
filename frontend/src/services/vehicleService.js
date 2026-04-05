// vehicleService.js — pure API, NO static fallback
import api from "../api/api";

function mapVehicle(v) {
  return {
    id:           v.id,
    type:         v.vehicleType  || v.vehicle_type  || "Tractor",
    title:        v.model        || v.vehicleType    || "Vehicle",
    ownerName:    v.ownerName    || v.owner_name     || "",
    ownerMobile:  v.ownerMobile  || v.owner_mobile   || "",
    regNumber:    v.regNumber    || v.reg_number     || "",
    rating:       v.rating       ?? 0,
    reviews:      v.reviews      ?? 0,
    location:     v.location     || "",
    pricePerAcre: Number(v.pricePerAcre || v.price_per_acre || 0),
    imageUrl:     v.imageUrl     || v.image_url      || null,
    status:       v.status       || "Available",
    // legacy keys for VehicleList.js
    image:        v.imageUrl     || v.image_url      || "",
    owner_name:   v.ownerName    || v.owner_name     || "",
    owner_mobile: v.ownerMobile  || v.owner_mobile   || "",
    reg_number:   v.regNumber    || v.reg_number     || "",
    price_per_acre: Number(v.pricePerAcre || v.price_per_acre || 0),
  };
}

export async function getVehicles() {
  const res = await api.get("/vehicles");
  return Array.isArray(res.data) ? res.data.map(mapVehicle) : [];
}

export async function getVehicleById(id) {
  const res = await api.get(`/vehicles/${id}`);
  return mapVehicle(res.data);
}

const vehicleService = { getVehicles, getVehicleById };
export default vehicleService;
