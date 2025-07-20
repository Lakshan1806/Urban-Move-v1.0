import axios from "axios";
import { useEffect, useState } from "react";

function ActivePromotions() {
  const [promotion, setPromotion] = useState([]);
  const [promotionId, setPromotionId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleDeactivation = async () => {
    if (!promotionId) return;
    try {
      await axios.patch("/admin/deactivate_promotion", { promotionId });
      setPromotionId(null);
    } catch (err) {
      console.error("Failed to deactivate promo:", err);
    }
  };

  return (
    <div className="col-span-5 row-span-6 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto shrink-0">
      <div className="sticky top-0 z-20 bg-white/30 rounded-t-xl backdrop-blur-md px-4 py-4 flex justify-center">
        <h3 className="text-sm font-bold uppercase">Active Promotions</h3>
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
                <div className="button-wrapper">
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => {
                      setPromotionId(promo._id);
                      setShowConfirmation(true);
                    }}
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center h-full">
          No Active Promotions
        </div>
      )}
      {showConfirmation && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <p className="mb-4">Really deactivate this promocode?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <div className="button-wrapper">
                <button
                  className="button-primary"
                  onClick={() => {
                    handleDeactivation();
                    setShowConfirmation(false);
                  }}
                >
                  Yes, deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivePromotions;
