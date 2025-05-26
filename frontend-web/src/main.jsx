import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import {AuthProvider} from "./context/AuthContext";
import { DriverAuthProvider } from "./context/driverAuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DriverAuthProvider >
        <App />
        </DriverAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
