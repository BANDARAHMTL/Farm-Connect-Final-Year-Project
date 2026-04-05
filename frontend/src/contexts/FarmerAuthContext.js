import React, { createContext, useState, useEffect } from "react";
export const FarmerAuthContext = createContext();

export function FarmerAuthProvider({ children }) {
  const [farmer, setFarmer] = useState(null);
  useEffect(() => {
    const farmerData = localStorage.getItem("farmer");
    if (farmerData) setFarmer(JSON.parse(farmerData));
  }, []);
  return (
    <FarmerAuthContext.Provider value={{ farmer, setFarmer }}>
      {children}
    </FarmerAuthContext.Provider>
  );
}