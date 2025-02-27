import myImage from '../assets/rent.image.1.png'; 
import { useState } from "react";

function Rent() {
  return (
    <div>
      <h1 className="text-2xl font-bold p-4">RENT</h1>
      <Button1 />
      <Button2 />
      <Button3 />
      <Image1 />
      <Text1/>
      <CarRentalForm/>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute top-24 right-63">
      <button className="bg-transparent font-bold text-black-500 p-2 rounded relative overflow-hidden group">
        Renting Options
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </button>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute top-24 right-30">
      <button className="bg-transparent font-bold text-black-500 p-2 rounded relative overflow-hidden group">
        Car Options
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </button>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute top-24 right-4">
      <button className="bg-transparent font-bold text-black-500 p-2 rounded relative overflow-hidden group">
        Reviews
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </button>
    </div>
  );
}

function Image1() {
  return (
    <div className="absolute top-40  right-30">
      <img src={myImage} alt="My Imported Image" className="w-145 h-145 object-cover  " />
    </div>
  );
}

function Text1() {
  return (
    <div className="p-4 absolute top-50  right-150">
      <h1 className="text-4xl font-bold">Browse our fleet and pick <br/>the perfect car for a day, a week, or even a month.</h1>
    </div>
  );
}

function CarRentalForm() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  return (
    <div className="absolute top-85  right-200">
      <div className="bg-black text-white p-6 rounded-2xl border-2 border-yellow-400 shadow-lg w-[600px]">
        {/* Date & Time Pickers */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-orange-400">Pick up date & time</h2>
            <div className="bg-white text-black p-4 rounded-lg mt-2 w-[250px]">
              <p className="text-gray-400 text-sm">Mon Feb 14</p>
              <p className="text-xl font-bold">Today <span className="text-2xl">9 : 41 AM</span></p>
              <p className="text-gray-400 text-sm">Weds Feb 16</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-orange-400">Drop off date & time</h2>
            <div className="bg-white text-black p-4 rounded-lg mt-2 w-[250px]">
              <p className="text-gray-400 text-sm">Mon Feb 14</p>
              <p className="text-xl font-bold">Today <span className="text-2xl">9 : 41 AM</span></p>
              <p className="text-gray-400 text-sm">Weds Feb 16</p>
            </div>
          </div>
        </div>

       {/* Branch Selection */}
<div className="flex justify-between items-center mb-6">
  <div>
    <h3 className="text-orange-400 text-md mb-1">Pick up branch</h3>
    <select
      value={pickupLocation}
      onChange={(e) => setPickupLocation(e.target.value)}
      className="w-[250px] p-2 rounded-lg text-black bg-white"
    >
      <option value="">Select location</option>
      <option value="colombo">Colombo</option>
      <option value="jaffna">Jaffna</option>
      <option value="batticaloa">Batticaloa</option>
      <option value="galle">Galle</option>
    </select>
  </div>

  <div>
    <h3 className="text-orange-400 text-md mb-1">Drop off branch</h3>
    <select
      value={dropoffLocation}
      onChange={(e) => setDropoffLocation(e.target.value)}
      className="w-[250px] p-2 rounded-lg text-black bg-white"
    >
      <option value="">Select location</option>
      <option value="colombo">Colombo</option>
      <option value="jaffna">Jaffna</option>
      <option value="batticaloa">Batticaloa</option>
      <option value="galle">Galle</option>
    </select>
  </div>
</div>


        {/* Show Cars Button */}
        <div className="flex justify-center">
          <button className="mt-4 px-6 py-3 text-orange-400 border-2 border-orange-400 rounded-full text-lg font-bold hover:bg-orange-500 hover:text-black transition">
            Show cars
          </button>
        </div>
      </div>
    </div>
  );
}



export default Rent;


