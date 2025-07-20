import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { DriverAuthProvider } from "./context/driverAuthContext.jsx";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import { twMerge } from "tailwind-merge";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PrimeReactProvider
        value={{
          unstyled: false,
          pt: Tailwind,
          ptOptions: {
            mergeSections: true,
            mergeProps: true,
            classNameMergeFunction: twMerge,
          },
        }}
      >
        <AuthProvider>
          <DriverAuthProvider>
            <App />
          </DriverAuthProvider>
        </AuthProvider>
      </PrimeReactProvider>
    </BrowserRouter>
  </StrictMode>
);
