import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Car10 from "../assets/home_car1 0.svg";
import Car20 from "../assets/home_car2 0.svg";
import Car30 from "../assets/home_car3 0.svg";
import FeedbackSlideshow from "../components/Feedback/FeedbackSlideshow";

const BACKEND_BASE_URL = "http://localhost:5000";

const carData = [
  { image: Car20, path: "/ride" },
  { image: Car10, path: "/rent" },
  { image: Car30, path: "/drive" },
];

function Home() {
  const navigate = useNavigate();
  const [activePromos, setActivePromos] = useState([]);
  const [imageSlides, setImageSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTextFallback, setShowTextFallback] = useState(false);

  const getImageUrlFromPath = (path) =>
    path
      ? `${BACKEND_BASE_URL}/${path.replace(/\\/g, "/").replace(/^backend\//, "")}`
      : null;

  const checkImageExists = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_BASE_URL}/api/promotions/active`,
        );
        if (!data?.length) return setShowTextFallback(true);

        setActivePromos(data);

        const slides = await Promise.all(
          data.map(async (promo) => {
            const imageUrl = getImageUrlFromPath(promo.path);
            if (imageUrl && (await checkImageExists(imageUrl))) {
              return { ...promo, imageUrl };
            }
            return null;
          }),
        );

        const validSlides = slides.filter(Boolean);
        setImageSlides(validSlides);
        setShowTextFallback(validSlides.length === 0);
      } catch (err) {
        console.error("Failed to fetch promotions:", err);
        setShowTextFallback(true);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    const slideCount = imageSlides.length || activePromos.length;
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % slideCount),
      3000,
    );
    return () => clearInterval(interval);
  }, [imageSlides, activePromos]);

  const handleNavigation = (path) => navigate(path);

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col overflow-y-auto scroll-smooth">
        <section className="mb-24 flex min-h-screen w-full snap-start items-center justify-between px-10 pt-20">
          {carData.map(({ image, path }, index) => (
            <div
              key={index}
              className="relative h-[570px] w-[380px] overflow-hidden rounded-3xl border-4 border-black transition-transform duration-300 ease-in-out hover:scale-110"
            >
              <img
                src={image}
                alt={`Car ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] p-[2px] transition-transform duration-300 ease-in-out hover:scale-105">
                  <button
                    onClick={() => handleNavigation(path)}
                    className="font-inter flex h-12 w-36 items-center justify-center rounded-2xl bg-black text-[20px] font-normal text-[#FFD12E] shadow-2xl"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-24 flex min-h-screen w-full snap-start items-center justify-center px-10">
          <div className="relative h-[390px] w-[1000px] overflow-hidden rounded-3xl border border-gray-300 shadow-lg">
            {imageSlides.length > 0 ? (
              imageSlides.map((promo, index) => (
                <img
                  key={promo._id}
                  src={promo.imageUrl}
                  alt={`Promo ${promo.code}`}
                  className={`absolute top-0 left-0 h-full w-full rounded-3xl object-cover transition-all duration-1000 ease-in-out ${
                    index === currentIndex
                      ? "z-10 opacity-100"
                      : "pointer-events-none z-0 opacity-0"
                  }`}
                />
              ))
            ) : showTextFallback && activePromos.length > 0 ? (
              activePromos.map((promo, index) => (
                <div
                  key={promo._id}
                  className={`absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-3xl bg-white px-10 text-center text-black transition-opacity duration-1000 ${
                    index === currentIndex
                      ? "z-10 opacity-100"
                      : "pointer-events-none z-0 opacity-0"
                  }`}
                >
                  <div>
                    <h2 className="mb-4 text-4xl font-bold">
                      PromoCode: {promo.code}
                    </h2>
                    <p className="text-2xl font-medium">
                      {promo.discountValue}
                      {promo.discountType === "Percentage" ? "%" : " LKR"} Off
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg text-gray-600">
                No active promotions available.
              </div>
            )}
          </div>
        </section>

        <section className="mb-24 flex min-h-screen w-full snap-start flex-col items-center justify-center px-10 text-center">
          <p className="font-inter text-[30px] font-normal break-words text-black">
            At URBANMOVE Sri Lanka, we transform the way you travel for the
            better
          </p>
          <div className="font-inter mt-8 text-[20px] font-normal break-words text-black">
            <p>
              Movement is our passion; it fuels our purpose. Every day, we wake
              up
              <br />
              driven to enhance your journey. We strive to redefine what it
              means
              <br />
              to travel seamlessly - whether you’re exploring the vibrant
              streets
              <br />
              of Colombo or heading to the serene beaches of Galle. We’re here
              to
              <br />
              connect you to every destination, every opportunity, and every
              <br />
              adventure you seek. With us, your ride is not just a trip; it’s a
              <br />
              commitment to comfort, safety, and efficiency. Experience the
              <br />
              freedom of real-time travel, powered by our dedicated team, all at
              <br />
              the incredible speed of now.
            </p>
          </div>
        </section>

        <section className="snap-start">
          <FeedbackSlideshow />
        </section>
      </div>
    </div>
  );
}

export default Home;
