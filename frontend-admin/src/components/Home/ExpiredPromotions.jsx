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
    <div className="col-span-3 row-span-6 flex flex-col overflow-auto rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div className="sticky top-0 z-20 flex justify-center rounded-t-3xl bg-white/30 px-4 py-4 backdrop-blur-md">
        <h3 className="text-sm font-bold uppercase">Expired Promotions</h3>
      </div>
      {promotion.length > 0 ? (
        promotion.map((promo) => {
          console.log(promo.path);
          return (
            <div
              key={promo._id}
              className="mx-4 flex h-full flex-row items-center gap-5 rounded-xl p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]"
            >
              <img
                src={promo.path || null}
                alt="promo image"
                className="h-24 w-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold">{promo.code}</h3>
                <p>ExpiresAt: {promo.expiresAt}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-full items-center justify-center">
          No Expired Promotions
        </div>
      )}
    </div>
  );
}

export default ExpiredPromotions;
