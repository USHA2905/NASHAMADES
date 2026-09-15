import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Admin from "./Admin.jsx";

const currentPath = window.location.pathname;

const isAdminPage =
  currentPath === "/admin" ||
  currentPath === "/admin/";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isAdminPage ? <Admin /> : <App />}
  </StrictMode>
);