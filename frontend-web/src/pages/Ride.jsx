import { useState } from "react";
import ridecar from "../assets/Ride-pics/ridecar.svg";
//import promotionpic from "../assets/Ride-pics/promotionpic.svg";

function Ride() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Pickup:", pickup);
    console.log("Drop-off:", dropoff);
  };

  return (
    <div className="flex items-center min-h-screen bg-white text-black px-12 py-8">
      {/* Left Section - H1 + Form */}
      <div className="flex flex-col items-center w-1/2 pr-12">
        <h1 className="text-4xl font-bold mb-6 leading-tight text-center">
          Request a ride for <br /> immediate pickup or <br /> schedule one for later
        </h1>

        {/* Ride Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-black p-8 rounded-[35px] shadow-md border-2 border-[#FF7C1D] flex flex-col gap-5 w-full max-w-md"
        >
          <div className="w-full">
          <label className="block font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] mb-2">
          Pick up location
            </label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="border p-3 w-full rounded bg-white text-black border-[#FF7C1D]"
              placeholder="Enter pickup location"
              required
            />
          </div>

          <div className="w-full">
          <label className="block font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] mb-2">
          Drop off location
            </label>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="border p-3 w-full rounded bg-white text-black border-[#FF7C1D]"
              placeholder="Enter drop-off location"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="bg-black border border-[#FF7C1D] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] px-6 py-2 rounded-[50px]"            >
              PRICE
            </button>
            <button
              type="button"
              className="bg-black border border-[#FF7C1D] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] px-6 py-2 rounded-[50px]"            >
              LATER
            </button>
          </div>
        </form>
      </div>

      {/* Right Section - Larger Image */}
      <div className="w-1/2 flex justify-end">
        <img
          src={ridecar}
          alt="Ride Car"
          className="w-[750px] h-auto object-contain"
        />
      </div>
      
      
      
      
     
    </div>
    
  );
}

export default Ride;
