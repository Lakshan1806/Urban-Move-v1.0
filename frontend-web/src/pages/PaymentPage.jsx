import React, { useState } from "react";
import axios from "axios";

const PromoPage = () => {
    // States for applying promo code
    const [appliedCode, setAppliedCode] = useState("");
    const [originalAmount, setOriginalAmount] = useState(""); // Manually entered amount
    const [finalAmount, setFinalAmount] = useState(null); // Final amount after applying promo
    const [applyMessage, setApplyMessage] = useState("");

    // Function to apply a promo code
    const applyPromoCode = async () => {
        if (!originalAmount || isNaN(originalAmount) || originalAmount <= 0) {
            setApplyMessage("Please enter a valid amount");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/promo/apply", {
                code: appliedCode.trim(),
                amount: parseFloat(originalAmount),
            });

            const discountedAmount = parseFloat(originalAmount) - (parseFloat(originalAmount) * response.data.discount) / 100;
            setFinalAmount(discountedAmount);
            setApplyMessage(`Promo applied! New Amount: $${discountedAmount.toFixed(2)}`);
        } catch (error) {
            setApplyMessage(error.response?.data?.message || "Invalid promo code");
            setFinalAmount(null);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Apply Promo Code</h2>

            {/* Apply Promo Code Section */}
            <div className="p-4 border border-gray-300 rounded">
                <h3 className="text-xl font-semibold mb-2">Apply Promo Code</h3>
                <input
                    type="number"
                    placeholder="Enter Amount"
                    className="border p-2 mr-2"
                    value={originalAmount}
                    onChange={(e) => setOriginalAmount(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Promo Code"
                    className="border p-2 mr-2"
                    value={appliedCode}
                    onChange={(e) => setAppliedCode(e.target.value)}
                />
                <button onClick={applyPromoCode} className="bg-green-500 text-white p-2">Apply</button>
                <p>{applyMessage}</p>
                {finalAmount !== null && (
                    <h3 className="text-lg font-bold mt-2">Final Amount: ${finalAmount.toFixed(2)}</h3>
                )}
            </div>
        </div>
    );
};

export default PromoPage;
