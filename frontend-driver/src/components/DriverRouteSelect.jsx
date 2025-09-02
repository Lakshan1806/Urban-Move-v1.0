import { Routes, Route } from "react-router-dom";
import DriverProtectedRoute from "./DriverProtectedRoute";
import Profile from "../pages/profile.jsx";
import DriverRide from "../pages/DriverRide.jsx";

function DriverRouteSelect() {
  return (
    <div>
      <main className="h-dvh">
        <Routes>
          <Route
            path="/"
            element={
              <DriverProtectedRoute>
                <DriverRide />
              </DriverProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <DriverProtectedRoute>
                <Profile />
              </DriverProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default DriverRouteSelect;
