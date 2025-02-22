import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Rides from "./pages/Rides";
import Rentals from "./pages/Rentals";
import Customers from "./pages/Customers";
import Drivers from "./pages/Drivers";
import Financials from "./pages/Financials";
import Messages from "./pages/Messages";
import Account from "./pages/Account";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="w-full h-full flex bg-neutral-100">

      <div>
        <Navbar />
      </div>

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/account" element={<Account />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
