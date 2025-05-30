import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { DriverAuthProvider } from "./context/DriverAuthContext-driver.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
        <DriverAuthProvider >
        <App />
        </DriverAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
