import AvailableCars from "../components/Rentals/AvailableCars";
import CurrentActivity from "../components/Rentals/CurrentActivity";

function Rentals() {
  return (
    <div>
      <div>
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Rentals
        </h1>
        <div className="grid grid-cols-12 grid-rows-12 gap-3 h-svh">
          <AvailableCars />
          <CurrentActivity/>
        </div>
      </div>
    </div>
  );
}

export default Rentals;
