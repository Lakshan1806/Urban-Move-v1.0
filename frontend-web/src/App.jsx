import axios from "axios";
import NavBar from "./components/Navbar";
import RouteSelect from "./components/RouteSelect.jsx";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="debug-outlines">
      <div className="h-dvh flex flex-col">
        <div className="h-[80px]">
          <NavBar />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <RouteSelect />
        </div>
      </div>
    </div>
  );
}

export default App;
