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
    <div className="col-span-5 row-span-6 flex shrink-0 flex-col overflow-auto rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div className="sticky top-0 z-20 flex justify-center rounded-t-xl bg-white/30 px-4 py-4 backdrop-blur-md">
        <h3 className="text-sm font-bold uppercase">Active Promotions</h3>
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
        <div className="flex h-full items-center justify-center">
          No Active Promotions
        </div>
      )}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <p className="mb-4">Really deactivate this promocode?</p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded bg-gray-200 px-4 py-2"
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
