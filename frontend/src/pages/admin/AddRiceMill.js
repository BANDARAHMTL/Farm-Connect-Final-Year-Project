// Replaced by inline modal in RiceMills.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function AddRiceMill() {
  const nav = useNavigate();
  useEffect(() => { nav("/admin/rices"); }, []);
  return null;
}
