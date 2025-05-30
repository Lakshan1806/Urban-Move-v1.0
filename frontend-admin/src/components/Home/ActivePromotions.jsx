import axios from "axios";
import { useEffect, useState } from "react";

function ActivePromotions() { 
  const [promotion, setPromotion] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_promotions");
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
    <div className="col-span-4 row-span-6 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto">
      <p>Active Promotions</p>
      {promotion.map((promo) => {
        console.log(promo.photo);
        return (
          <div
            key={promo._id}
            className="p-4 my-2 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-5 items-center"
          >
            <img
              src={promo.photo || null}
              alt="promo image"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-bold">{promo.code}</h3>
              <p>ExpiresAt: {promo.expiresAt}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ActivePromotions;
