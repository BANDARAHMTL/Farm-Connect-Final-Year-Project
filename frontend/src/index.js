import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import "./lightMode.css";

createRoot(document.getElementById("root")).render(<App />);
