import { useState, useEffect } from "react";
import myImage from "../assets/rent.image.1.png";
import myImage2 from "../assets/rent.image.2.png";
import myImage3 from "../assets/rent.image.3.png";
import myImage4 from "../assets/rent.image.4.png";
import { Link } from "react-router-dom";
import axios from 'axios';
import CarSelection from "./CarSelection.jsx"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"


function ConditionalButton({ text }) {
  const { user } = useAuth(); // assuming `user` is null when not logged in
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate("/feedback");
    } else {
      navigate("/signin");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
    >
      {text}
    </button>
  );
}





function Rent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">RENT</h1>
      <div className="flex justify-center gap-4 mt-4">
        <Button text="Renting Options" link="/rent-options" />
        <Button text="Car Options" link="/car-options" />
        <ConditionalButton text="Reviews" />
      </div>
      <div className="flex flex-col items-center md:flex-row md:justify-between mt-10">
        <Image1 />
        <Text1 />
      </div>
      <div className="flex justify-center gap-6 mt-12">
        <Image src={myImage2} />
        <Image src={myImage3} />
        <Image src={myImage4} />
      </div>
      <RentNowForm/>
      <Slideshow/>
    </div>
  );
}



function  RentNowForm ()   {
  // List of available cities
  const availableCities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Miami",
    "San Francisco"
  ];
  
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupTime: '',
    dropoffTime: ''
  });
  
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableCars, setAvailableCars] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [showCarSelection, setShowCarSelection] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // If we were showing cars and the user changes any form data,
    // hide the car selection until they search again
    if (showCarSelection) {
      setShowCarSelection(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      // Search for available cars
      const response = await axios.get('http://localhost:5000/api/cars/available', {
        params: formData
      });
      
      setAvailableCars(response.data.data.cars);
      setSearchParams(response.data.data);
      setShowCarSelection(true);
      
      // If no cars are available, show a message
      if (response.data.data.cars.length === 0) {
        setMessage('No cars available for the selected time and location. Please try different dates or locations.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error searching for available cars');
      setShowCarSelection(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Rent Now</h2>
        
        {message && (
          <div className={`p-3 mb-4 rounded ${message.includes('Error') || message.includes('No cars') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="pickupLocation" className="block text-gray-700 font-medium mb-2">
              Pickup Location
            </label>
            <select
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Pickup City</option>
              {availableCities.map((city) => (
                <option key={`pickup-${city}`} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="dropoffLocation" className="block text-gray-700 font-medium mb-2">
              Drop-off Location
            </label>
            <select
              id="dropoffLocation"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Drop-off City</option>
              {availableCities.map((city) => (
                <option key={`dropoff-${city}`} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="pickupTime" className="block text-gray-700 font-medium mb-2">
              Pickup Time
            </label>
            <input
              type="datetime-local"
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="dropoffTime" className="block text-gray-700 font-medium mb-2">
              Drop-off Time
            </label>
            <input
              type="datetime-local"
              id="dropoffTime"
              name="dropoffTime"
              value={formData.dropoffTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Find Available Cars'}
          </button>
        </form>
      </div>
      
      {showCarSelection && (
        <CarSelection 
          cars={availableCars} 
          searchParams={searchParams}
          onBookingComplete={() => {
            setShowCarSelection(false);
            setFormData({
              pickupLocation: '',
              dropoffLocation: '',
              pickupTime: '',
              dropoffTime: ''
            });
            setMessage('Booking completed successfully!');
          }}
        />
      )}
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

function Image({ src }) {
  return (
    <div className="w-1/3 flex justify-center">
      <img src={src} alt="Rental Car" className="w-full max-w-xs md:max-w-sm lg:max-w-md" />
    </div>
  );
}



function Slideshow  ()  {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/images")
      .then(res => setImages(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images.length) return <div>Loading slideshow...</div>;

  return (
    <div className="w-full h-[400px] flex justify-center items-center bg-gray-200 rounded-xl overflow-hidden shadow-md">
      <img
        src={images[current]}
        alt="slideshow"
        className="w-full h-full object-cover transition-all duration-500"
      />
    </div>
  );
};




export default Rent;
 