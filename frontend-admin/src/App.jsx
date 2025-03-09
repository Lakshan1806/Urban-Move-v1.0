import Navbar from "./components/Navbar";
import RouteSelect from "./components/RouteSelect";

function App() {
  return (
    <div className="grid gap-4 grid-cols-[200px_1fr] ">
      <Navbar/>
      <RouteSelect/>
    </div>
  );
}

export default App;
