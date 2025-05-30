import { Routes, Route } from "react-router-dom";
//import DriverProtectedRoute from "./DriverProtectedRoute";
import DriverHome from "../pages/driverHome";
function DriverRouteSelect() {
  return (
    <div>
      <main className="h-dvh ">
        <Routes>
          <Route path="/" element={<DriverHome />} />
        </Routes>
      </main>
    </div>
  );
}

export default DriverRouteSelect;
