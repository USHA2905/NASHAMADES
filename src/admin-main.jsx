import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AdminLogin from "./AdminLogin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminLogin />
  </StrictMode>
);