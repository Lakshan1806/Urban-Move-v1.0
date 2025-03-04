import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import myImage from "../assets/rent.image.1.png";
import myImage2 from "../assets/rent.image.2.png";
import myImage3 from "../assets/rent.image.3.png";
import myImage4 from "../assets/rent.image.4.png";
import slide1 from "../assets/rent.slide.1.png";
import slide2 from "../assets/rent.slide.2.png";
import slide3 from "../assets/rent.slide.3.png";
import review1 from "../assets/rent.review.1.png";
import review2 from "../assets/rent.review.2.png";
import review3 from "../assets/rent.review.3.png";
import review4 from "../assets/rent.review.4.png";
import review5 from "../assets/rent.review.5.png";
import review6 from "../assets/rent.review.6.png";
import { Link } from "react-router-dom";

function Rent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">RENT</h1>
      <div className="flex justify-center gap-4 mt-4">
        <Button text="Renting Options" link="/rent-options" />
        <Button text="Car Options" link="/car-options" />
        <Button text="Reviews" link="/feedback" />
      </div>
      <div className="flex flex-col items-center md:flex-row md:justify-between mt-10">
        <Image1 />
        <Text1 />
      </div>
      <CarRentalForm />
      <div className="flex justify-center gap-6 mt-12">
        <Image src={myImage2} />
        <Image src={myImage3} />
        <Image src={myImage4} />
      </div>
      <AutoSlideshow />
      <Review />
    </div>
  );
}

function Button({ text, link }) {
  return (
    <Link to={link} className="inline-block">
      <button className="bg-transparent font-bold text-black p-2 rounded relative overflow-hidden group">
        {text}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </button>
    </Link>
  );
}

function Image1() {
  return (
    <div className="w-full md:w-1/2 flex justify-center">
      <img src={myImage} alt="Car Rental" className="w-full max-w-sm md:max-w-md lg:max-w-lg" />
    </div>
  );
}

function Text1() {
  return (
    <div className="text-center md:text-left md:w-1/2 p-4">
      <h1 className="text-2xl md:text-4xl font-bold">
        Browse our fleet and pick the perfect car for a day, a week, or even a month.
      </h1>
    </div>
  );
}

function CarRentalForm() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  return (
    <div className="mt-12 flex justify-center">
      <div className="bg-black text-white p-6 rounded-2xl border-2 border-yellow-400 shadow-lg w-full max-w-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <DateSelector title="Pick up date & time" />
          <DateSelector title="Drop off date & time" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <LocationSelect label="Pick up branch" value={pickupLocation} onChange={setPickupLocation} />
          <LocationSelect label="Drop off branch" value={dropoffLocation} onChange={setDropoffLocation} />
        </div>

        <div className="flex justify-center">
          <button className="mt-4 px-6 py-3 text-orange-400 border-2 border-orange-400 rounded-full text-lg font-bold hover:bg-orange-500 hover:text-black transition">
            Show cars
          </button>
        </div>
      </div>
    </div>
  );
}

function DateSelector({ title }) {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold text-orange-400">{title}</h2>
      <div className="bg-white text-black p-4 rounded-lg mt-2 w-48">
        <p className="text-gray-400 text-sm">Mon Feb 14</p>
        <p className="text-xl font-bold">Today <span className="text-2xl">9 : 41 AM</span></p>
        <p className="text-gray-400 text-sm">Weds Feb 16</p>
      </div>
    </div>
  );
}

function LocationSelect({ label, value, onChange }) {
  return (
    <div className="w-full md:w-48">
      <h3 className="text-orange-400 text-md mb-1">{label}</h3>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2 rounded-lg text-black bg-white">
        <option value="">Select location</option>
        <option value="colombo">Colombo</option>
        <option value="jaffna">Jaffna</option>
        <option value="batticaloa">Batticaloa</option>
        <option value="galle">Galle</option>
      </select>
    </div>
  );
}

function Image({ src }) {
  return (
    <div className="w-1/3 flex justify-center">
      <img src={src} alt="Rental Car" className="w-full max-w-xs md:max-w-sm lg:max-w-md" />
    </div>
  );
}

function AutoSlideshow() {
  const images = [slide1, slide2, slide3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4x2 mx-auto overflow-hidden mt-20">
      <div className="relative w-full h-200">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index + 1}`} className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
    </div>
  );
}

function Review() {
  const images = [review1, review2, review3, review4, review5, review6];

  return (
    <div className="relative h-100 flex items-center overflow-hidden mt-12">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ x: "-100%" }}
          animate={{ x: "100vw" }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity, delay: index * 6 }}
        >
          <img src={image} alt={`Review ${index + 1}`} className="w-auto h-auto max-w-full max-h-96" />
        </motion.div>
      ))}
    </div>
  );
}

export default Rent;
 