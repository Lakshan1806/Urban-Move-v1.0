import { Routes, Route } from "react-router-dom";
//import DriverProtectedRoute from "./DriverProtectedRoute";
import DriverHome from "../pages/driverHome";
import Profile from "../pages/profile.jsx";

function DriverRouteSelect() {
  return (
    <div>
      <main className="h-dvh ">
        <Routes>
          <Route path="/" element={<DriverHome />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default DriverRouteSelect;
