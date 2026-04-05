import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function EditRiceMill() {
  const nav = useNavigate();
  useEffect(() => { nav("/admin/rices"); }, []);
  return null;
}
