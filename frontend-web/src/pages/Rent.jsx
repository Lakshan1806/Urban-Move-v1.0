import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import myImage from "../assets/rent.image.1.png";
import myImage2 from "../assets/rent.image.2.png";
import myImage3 from "../assets/rent.image.3.png";
import myImage4 from "../assets/rent.image.4.png";
import RentNowForm from "../components/Rent/RentNowForm";
import Footer from "../components/Footer";

function Rent() {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showForm") === "true" && isAuthenticated) {
      setShowForm(true);
      document.body.style.overflow = "hidden";
    }
  }, [location.search, isAuthenticated]);

  const handleShowForm = () => {
    if (!isAuthenticated) {
      navigate(`/signin?redirect=/rent?showForm=true`);
    } else {
      setShowForm(true);
      document.body.style.overflow = "auto";
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="h-full flex flex-col ">
      <div className="flex flex-row">RENT</div>

      <div className="flex-1 flex flex-col overflow-y-auto  min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <div className="h-full col-span-6 row-span-12 flex flex-col">
            <h1>
              Browse our fleet and pick the perfect car for a day, a week, or
              even a month.
            </h1>
            {!showForm && (
              <div className="button-wrapper">
                <button
                onClick={handleShowForm}
                className="button-primary"
              >
                Rent Now
              </button></div>
            )}
          </div>

          <img
            src={myImage}
            alt="Car Rental"
            className="h-full col-span-6 row-span-12"
          />
        </div>

        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <Image src={myImage2} />
          <Image src={myImage3} />
          <Image src={myImage4} />
        </div>

        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <Slideshow />
        </div>

        <div className=" h-[180px] shrink-0 snap-start">
          <Footer />
        </div>
      </div>

      {showForm && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-xl bg-white rounded-xl shadow-lg">
              <button
                onClick={handleCloseForm}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold z-10"
              >
                &times;
              </button>

              <RentNowForm onClose={handleCloseForm} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Image({ src }) {
  return (
    <div className="h-full col-span-4 row-span-12">
      <div className="flex h-full items-center justify-center"><img
        src={src}
        alt="Rental Car"
        className="h-3/4 w-2/3 md:max-w-sm lg:max-w-md"
      /></div>
    </div>
  );
}

function Slideshow() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/user/slideshow_images");
        setImages(response.data);
      } catch (error) {
        console.log("Error loading slideshow images", error);
      }
    };

    fetchData();
  }, []);

  const slideshowPath = images.map((image) => image.keyImage);

  useEffect(() => {
    if (slideshowPath.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideshowPath.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slideshowPath]);

  if (slideshowPath.length === 0) return <div>Loading slideshow...</div>;

  return (
    <div className="h-full col-span-12 row-span-12 ">
      <div className="flex h-full w-full items-center justify-center" ><img
        src={slideshowPath[current]}
        alt="slideshow"
        className=" h-3/4 object-cover transition-all duration-500"
      /></div>
    </div>
  );
}

export default Rent;
