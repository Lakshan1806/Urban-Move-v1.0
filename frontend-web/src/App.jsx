import NavBar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import RouteSelect from "./components/RouteSelect.jsx";
//import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <div className="debug-outlines">
      {/*<GoogleOAuthProvider clientId="8873127349-1mrci9u3pdqucjqbjarq4f0n8aoi1fp4.apps.googleusercontent.com">*/}
        <AuthProvider>
          <div className="h-dvh "> 
            <NavBar />
            <RouteSelect />
          </div>
        </AuthProvider>
      {/*</GoogleOAuthProvider>*/}
    </div>
  );
}

export default App;
