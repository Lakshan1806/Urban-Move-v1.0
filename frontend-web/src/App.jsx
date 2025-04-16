import NavBar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import RouteSelect from "./components/RouteSelect.jsx";

function App() {
  return (
    <div className="debug-outlines">
      <AuthProvider>
        <div className="h-dvh "> 
          <NavBar />
          <RouteSelect />
        </div>
      </AuthProvider>
    </div>
  );
}

export default App;
