import { useState, useRef } from "react";
import axios from "axios";

function AddPromotions() {
  const keyImageInputRef = useRef(null);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [promotionType, setPromotionType] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [maxUses, setMaxUses] = useState(0);
  const [perUserLimit, setPerUserLimit] = useState(0);
  const [expiresAt, setExpiresAt] = useState("");
  const [description, setDescription] = useState("");
  const [keyImageUrl, setKeyImageUrl] = useState(null);
  const [keyTempImage, setKeyTempImage] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const handleKeyImageClick = () => {
    keyImageInputRef.current.click();
  };

  const handleKeyFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    } else {
      const previewUrl = URL.createObjectURL(file);
      setKeyImageUrl(previewUrl);
      setKeyTempImage(file);
    }
  };

  const handleSave = async (e) => {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("discountType", discountType);
    formData.append("promotionType", promotionType);
    formData.append("discountValue", discountValue);
    formData.append("maxUses", maxUses);
    formData.append("perUserLimit", perUserLimit);
    formData.append("expiresAt", expiresAt);
    formData.append("description", description);

    if (keyTempImage) {
      formData.append("promoImage", keyTempImage);
    }

    try {
      const response = await axios.post("/admin/add_promotion", formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  return (
    <div className="col-span-5 row-span-6 p-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto">
      <div className="flex flex-col">
        <div>
          <h2>Add Promotion Details</h2>
          <div className="flex flex-col gap-2">
            <img
              src={keyImageUrl}
              alt={"preview"}
              className="w-50 rounded-lg object-cover"
            />
          </div>
          <input
            type="file"
            ref={keyImageInputRef}
            className="hidden"
            onChange={handleKeyFileChange}
          />

          <div className="flex flex-col gap-1">
            <div className="button-wrapper">
              <button
                type="button"
                className="button-primary"
                onClick={handleKeyImageClick}
              >
                Upload Key Image
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="code">Code:</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. SKGS10"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="discountType"
                value="Percentage"
                checked={discountType === "Percentage"}
                onChange={(e) => setDiscountType(e.target.value)}
              />
              Percentage
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="discountType"
                value="Fixed"
                checked={discountType === "Fixed"}
                onChange={(e) => setDiscountType(e.target.value)}
              />
              Fixed
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="promotionType"
                value="Ride"
                checked={promotionType === "Ride"}
                onChange={(e) => setPromotionType(e.target.value)}
              />
              Ride
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="promotionType"
                value="Rent"
                checked={promotionType === "Rent"}
                onChange={(e) => setPromotionType(e.target.value)}
              />
              Rent
            </label>
          </div>
          <div>
            <label htmlFor="discountValue">Discount Value:</label>
            <input
              type="number"
              id="discountValue"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              placeholder=""
            />
          </div>
          <div>
            <label htmlFor="maxUses">Max Uses:</label>
            <input
              type="number"
              id="perUserLimit"
              value={perUserLimit}
              onChange={(e) => setPerUserLimit(Number(e.target.value))}
              placeholder=""
            />
          </div>
          <div>
            <label htmlFor="maxUses">Uses Per User:</label>
            <input
              type="number"
              id="maxUses"
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
              placeholder=""
            />
          </div>
          <div>
            <label htmlFor="expiresAt">Expires At:</label>
            <input
              type="datetime-local"
              id="expiresAt"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              placeholder=""
            />
          </div>

          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>
          <div className="flex flex-row items-center justify-center gap-5">
            {isEditable ? (
              <div className="button-wrapper">
                <button
                  type="button"
                  className="button-primary"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="button-wrapper">
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => setIsEditable(true)}
                >
                  Add Promo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPromotions;
