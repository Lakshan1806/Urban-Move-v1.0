import axios from "axios";
import Navbar from "./components/Navbar";
import DriverRouteSelect from "./components/DriverRouteSelect";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="debug-outlines">
      <div className="h-dvh ">
        <Navbar />
        <DriverRouteSelect />
      </div>
    </div>
  );
}

export default App;
