import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home.jsx";
import Rent from "./pages/Rent.jsx";
import Drive from "./pages/Drive.jsx";
import Ride from "./pages/Ride.jsx";
import Help from "./pages/Help.jsx";

function App() {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/drive" element={<Drive />} />
          <Route path="/ride" element={<Ride />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
