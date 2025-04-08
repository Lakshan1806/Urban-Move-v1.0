import { useState, useEffect } from "react";
import { GiGearStickPattern } from "react-icons/gi";
import { PiSeatbelt, PiPath, PiSpeedometer } from "react-icons/pi";
import { BsFuelPump } from "react-icons/bs";
import { RiSteering2Line } from "react-icons/ri";

function CarDetails({ car }) {
  if (!car) {
    return <div>Select a Car</div>;
  }
  const { images } = car;
  const [carImage, setCarImage] = useState(null);

  useEffect(() => {
    setCarImage(images[0]);
  }, [images]);

  return (
    <div className="flex flex-col gap-5 overflow-auto">
      <div className="flex flex-col  gap-5">
        <div className=" border-black">
          <img src={carImage} className="rounded-lg" />
        </div>
        <div className="flex flex-row  overflow-auto gap-5 justify-center">
          {images.map((image, index) => (
            <img
              src={image}
              key={index}
              onClick={() => setCarImage(image)}
              className="w-50 h-full rounded-lg object-cover"
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <p>Sedan</p>
          <h3 className="text-sm font-bold">{car.make} LC</h3>
          <p>Available number</p>
        </div>
        <div>
          <div className="flex">
            <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
              <button
                type="button"
                className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
              >
                edit
              </button>
            </div>
            <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
              <button
                type="button"
                className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
              >
                delete
              </button>
            </div>
          </div>

          <p>50$ /day</p>
        </div>
      </div>
      <div>about</div>
      <div className="grid grid-cols-3 justify-items-start gap-5">
        <div className="flex gap-5">
          <GiGearStickPattern className="w-[30px] h-[30px]" />
          <div>
            <p>Transmission</p>
            <p>Automatic</p>
          </div>
        </div>
        <div>
          <PiSeatbelt className="w-[30px] h-[30px]" />
        </div>
        <div>
          <PiPath className="w-[30px] h-[30px]" />
        </div>
        <div className="flex gap-5">
          <BsFuelPump className="w-[30px] h-[30px]" />
          <div>
            <p>Transmission</p>
            <p>Automatic</p>
          </div>
        </div>

        <div>
          <PiSpeedometer className="w-[30px] h-[30px]" />
        </div>
        <div>
          <RiSteering2Line className="w-[30px] h-[30px]" />
        </div>
      </div>
      <div>car Features</div>
    </div>
  );
}

export default CarDetails;
