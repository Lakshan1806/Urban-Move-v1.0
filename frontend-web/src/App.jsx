import { Routes, Route } from "react-router-dom"; 
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import Rent from "./pages/Rent";
import Drive from "./pages/Drive";
import Ride from "./pages/Ride";
import Help from "./pages/Help";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <div>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/drive" element={<Drive />} />
          <Route path="/ride" element={<Ride />} />
          <Route path="/help" element={<Help />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
