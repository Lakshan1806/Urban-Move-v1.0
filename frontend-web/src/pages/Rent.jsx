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
import RateUsModal from "../components/Feedback/RateUsModal";

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
    <div className="flex h-full flex-col">
      <div className="flex flex-row">RENT</div>

      <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col overflow-y-auto scroll-smooth">
        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12">
          <div className="col-span-6 row-span-12 flex h-full flex-col items-center justify-center text-5xl font-bold">
            <h1>
              Browse our fleet and pick the perfect car for a day, a week, or
              even a month.
            </h1>
            <div className="flex flex-col items-center gap-4 p-6">
              {!showForm && (
                <div className="button-wrapper w-full justify-center px-4 py-2 text-xl sm:w-48">
                  <button onClick={handleShowForm} className="button-primary">
                    Rent Now
                  </button>
                </div>
              )}
              <RateUsButton />
            </div>
          </div>

          <img
            src={myImage}
            alt="Car Rental"
            className="col-span-6 row-span-12 h-full px-30"
          />
        </div>

        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12">
          <Image src={myImage2} />
          <Image src={myImage3} />
          <Image src={myImage4} />
        </div>

        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12">
          <Slideshow />
        </div>

        <div className="h-[180px] shrink-0 snap-start">
          <Footer />
        </div>
      </div>

      {showForm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl rounded-xl bg-white shadow-lg">
              <button
                onClick={handleCloseForm}
                className="absolute top-2 right-2 z-10 text-xl font-bold text-gray-500 hover:text-gray-800"
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
    <div className="col-span-4 row-span-12 h-full">
      <div className="flex h-full items-center justify-center">
        <img
          src={src}
          alt="Rental Car"
          className="h-3/4 w-2/3 rounded-xl border-4 border-gray-600 shadow-2xl transition-transform duration-300 hover:scale-105 hover:shadow-xl md:max-w-sm lg:max-w-md"
        />
      </div>
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
    <div className="col-span-12 row-span-12 h-full">
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={slideshowPath[current]}
          alt="slideshow"
          className="h-3/4 overflow-hidden rounded-xl border-4 border-gray-600 object-cover shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl"
        />
      </div>
    </div>
  );
}

function RateUsButton({ userId }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="button-wrapper w-full justify-center px-2 py-2 text-xl sm:w-48">
        <button onClick={() => setShowModal(true)} className="button-primary">
          Rate Us
        </button>
      </div>

      {showModal && (
        <RateUsModal userId={userId} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default Rent;
