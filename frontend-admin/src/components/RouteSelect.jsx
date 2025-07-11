import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Rides from "../pages/Rides";
import Rentals from "../pages/Rentals";
import Customers from "../pages/Customers";
import Drivers from "../pages/Drivers";
import Financials from "../pages/Financials";
import Messages from "../pages/Messages";
import Account from "../pages/Account";
import Administration from "../pages/Administration";
import ProtectedRoute from "./ProtectedRoute";
import Roles from "../context/roles";

function RouteSelect() {
  return (
    <div>
      <main className="h-dvh py-[20px] px-[50px] overflow-hidden">
        <Routes>
          <Route index element={<Home />} />
          <Route path="rides" element={<Rides />} />
          <Route path="rentals" element={<Rentals />} />
          <Route path="customers" element={<Customers />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="financials" element={<Financials />} />
          <Route path="messages" element={<Messages />} />
          <Route path="account" element={<Account />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={[Roles.SUPER_ADMIN]}>
                <Administration />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default RouteSelect;
