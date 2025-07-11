import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AuthContainer from "./components/AuthContainer";
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="debug-outlines">
      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
