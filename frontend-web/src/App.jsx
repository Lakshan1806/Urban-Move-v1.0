import NavBar from "./components/Navbar";
import RouteSelect from "./components/RouteSelect.jsx";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials=true;

function App() {
  return (
    <div className="debug-outlines">
      <div className="h-dvh ">
        <NavBar />
        <RouteSelect />
      </div>
    </div>
  );
}

export default App;
