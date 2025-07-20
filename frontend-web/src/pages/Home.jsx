import React, { useState, useEffect, useRef } from "react";
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
    path ? `${BACKEND_BASE_URL}/${path.replace(/\\/g, "/").replace(/^backend\//, "")}` : null;

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
        const { data } = await axios.get(`${BACKEND_BASE_URL}/api/promotions/active`);
        if (!data?.length) return setShowTextFallback(true);

        setActivePromos(data);

        const slides = await Promise.all(
          data.map(async (promo) => {
            const imageUrl = getImageUrlFromPath(promo.path);
            if (imageUrl && (await checkImageExists(imageUrl))) {
              return { ...promo, imageUrl };
            }
            return null;
          })
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
      3000
    );
    return () => clearInterval(interval);
  }, [imageSlides, activePromos]);

  const handleNavigation = (path) => navigate(path);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col overflow-y-auto snap-y snap-mandatory scroll-smooth min-h-0">

        <section className="snap-start min-h-screen pt-20 mb-24 flex justify-between items-center w-full px-10">
          {carData.map(({ image, path }, index) => (
            <div
              key={index}
              className="relative w-[380px] h-[570px] overflow-hidden border-4 border-black rounded-3xl transition-transform duration-300 ease-in-out hover:scale-110"
            >
              <img src={image} alt={`Car ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-[2px] rounded-2xl bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] hover:scale-105 transition-transform duration-300 ease-in-out">
                  <button
                    onClick={() => handleNavigation(path)}
                    className="w-36 h-12 bg-black text-[#FFD12E] text-[20px] font-inter font-normal rounded-2xl shadow-2xl flex items-center justify-center"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="snap-start min-h-screen mb-24 flex items-center justify-center w-full px-10">
          <div className="relative w-[1000px] h-[390px] overflow-hidden rounded-3xl border border-gray-300 shadow-lg">
            {imageSlides.length > 0 ? (
              imageSlides.map((promo, index) => (
                <img
                  key={promo._id}
                  src={promo.imageUrl}
                  alt={`Promo ${promo.code}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover rounded-3xl transition-all duration-1000 ease-in-out ${
                    index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                />
              ))
            ) : showTextFallback && activePromos.length > 0 ? (
              activePromos.map((promo, index) => (
                <div
                  key={promo._id}
                  className={`absolute top-0 left-0 w-full h-full flex items-center justify-center text-center bg-white text-black rounded-3xl px-10 transition-opacity duration-1000 ${
                    index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div>
                    <h2 className="text-4xl font-bold mb-4">PromoCode: {promo.code}</h2>
                    <p className="text-2xl font-medium">
                      {promo.discountValue}
                      {promo.discountType === "Percentage" ? "%" : " LKR"} Off
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full h-full text-lg text-gray-600">
                No active promotions available.
              </div>
            )}
          </div>
        </section>

        <section className="snap-start min-h-screen mb-24 flex flex-col items-center justify-center w-full text-center px-10">
          <p className="text-black text-[50px] font-inter font-normal break-words">
            At URBANMOVE Sri Lanka, we transform the way you travel for the better
          </p>
          <div className="text-black text-[30px] font-inter font-normal break-words mt-8">
            <p>
              Movement is our passion; it fuels our purpose. Every day, we wake up<br />
              driven to enhance your journey. We strive to redefine what it means<br />
              to travel seamlessly - whether you’re exploring the vibrant streets<br />
              of Colombo or heading to the serene beaches of Galle. We’re here to<br />
              connect you to every destination, every opportunity, and every<br />
              adventure you seek. With us, your ride is not just a trip; it’s a<br />
              commitment to comfort, safety, and efficiency. Experience the<br />
              freedom of real-time travel, powered by our dedicated team, all at<br />
              the incredible speed of now.
            </p>
          </div>
        </section>

        <section className="snap-start min-h-screen">
          <FeedbackSlideshow />
        </section>
      </div>
    </div>
  );
}

export default Home;
