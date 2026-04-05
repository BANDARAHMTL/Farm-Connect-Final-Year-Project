import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function AddVehicle() {
  const nav = useNavigate();
  useEffect(() => { nav("/admin/vehicles"); }, []);
  return null;
}
