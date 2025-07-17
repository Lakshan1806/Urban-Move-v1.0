import axios from "axios";
import { useEffect, useState } from "react";

function ExpiredPromotions() {
  const [promotion, setPromotion] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_Expired_promotions");
        console.log(response);
        setPromotion(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="col-span-3 row-span-6 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto">
      <div className="sticky top-0 z-20 bg-white/30 rounded-t-3xl backdrop-blur-md px-4 py-4 flex justify-center">
        <h3 className="text-sm font-bold uppercase">Expired Promotions</h3>
      </div>
      {promotion.length > 0 ? (
        promotion.map((promo) => {
          console.log(promo.path);
          return (
            <div
              key={promo._id}
              className="p-4 mx-4 rounded-xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-5 items-center h-full"
            >
              <img
                src={promo.path || null}
                alt="promo image"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold">{promo.code}</h3>
                <p>ExpiresAt: {promo.expiresAt}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center h-full">
          No Expired Promotions
        </div>
      )}
    </div>
  );
}

export default ExpiredPromotions;
