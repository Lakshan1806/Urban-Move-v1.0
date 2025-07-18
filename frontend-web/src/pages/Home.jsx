import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Car10 from "../assets/home_car1 0.svg";
import Car20 from "../assets/home_car2 0.svg";
import Car30 from "../assets/home_car3 0.svg";

const BACKEND_BASE_URL = "http://localhost:5000";

function Home() {
  const navigate = useNavigate();
  const [activePromos, setActivePromos] = useState([]);
  const [imageSlides, setImageSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTextFallback, setShowTextFallback] = useState(false);

  const topRef = useRef(null);
  const middleRef = useRef(null);
  const bottomRef = useRef(null);

  const getImageUrlFromPath = (path) => {
    if (!path) return null;
    const normalizedPath = path.replace(/\\/g, "/").replace(/^backend\//, "");
    return `${BACKEND_BASE_URL}/${normalizedPath}`;
  };

  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await axios.get(`${BACKEND_BASE_URL}/api/promotions/active`);
        if (response.data?.length > 0) {
          setActivePromos(response.data);

          const promosWithImages = [];
          for (const promo of response.data) {
            const imageUrl = getImageUrlFromPath(promo.path);
            if (imageUrl) {
              const exists = await checkImageExists(imageUrl);
              if (exists) {
                promosWithImages.push({ ...promo, imageUrl });
              }
            }
          }

          if (promosWithImages.length > 0) {
            setImageSlides(promosWithImages);
            setShowTextFallback(false);
          } else {
            setShowTextFallback(true);
          }
        } else {
          setShowTextFallback(true);
        }
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
        setShowTextFallback(true);
      }
    };

    fetchPromos();
  }, []);

  useEffect(() => {
    const slideCount = imageSlides.length || activePromos.length;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 3000);
    return () => clearInterval(interval);
  }, [imageSlides, activePromos]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      <div ref={topRef} className="snap-start flex flex-col items-center w-full px-10 h-screen pt-30">
        <div className="flex justify-between items-center w-full">
          {[Car20, Car10, Car30].map((car, index) => {
            const paths = ["/ride", "/rent", "/drive"];

            return (
              <div
                key={index}
                className="relative w-[380px] h-[570px] overflow-hidden border-4 border-black rounded-3xl transition-transform duration-300 ease-in-out hover:scale-110"
              >
                <img src={car} alt={`Car ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-[2px] rounded-2xl bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] transition-transform duration-300 ease-in-out hover:scale-105">
                    <button
                      onClick={() => handleNavigation(paths[index])}
                      className="w-36 h-12 bg-black text-[#FFD12E] text-[20px] font-inter font-normal break-words rounded-2xl shadow-2xl flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-100"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div ref={middleRef} className="snap-start flex items-center justify-center w-full h-screen">
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
      </div>

      <div ref={bottomRef} className="snap-start flex flex-col items-center justify-center w-full text-center h-screen px-10">
        <p className="text-black text-[50px] font-inter font-normal break-words">
          At URBANMOVE Sri Lanka, we transform the way you travel for the better
        </p>
        <div className="text-black text-[30px] font-inter font-normal break-words mt-8">
          <p>
            Movement is our passion; it fuels our purpose. Every day, we wake up
            <br />
            driven to enhance your journey. We strive to redefine what it means <br />
            to travel seamlessly - whether you’re exploring the vibrant streets of <br />
            Colombo or heading to the serene beaches of Galle. We’re here to <br />
            connect you to every destination, every opportunity, brand every <br />
            adventure you seek. With us, your ride is not just a trip; it’s a <br />
            commitment to comfort, safety, and efficiency. Experience the <br />
            freedom of real-time travel, powered by our dedicated team, all at <br />
            the incredible speed of now.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
