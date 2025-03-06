import React, { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
    const [amount, setAmount] = useState(100); // Example amount
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(amount);
    const [message, setMessage] = useState("");

    const validatePromoCode = async () => {
        try {
            const response = await axios.post("/api/promo/validate", { code: promoCode });
            setDiscount(response.data.discount);
            setFinalAmount(amount - (amount * response.data.discount) / 100);
            setMessage("Promo code applied successfully!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Invalid promo code");
            setDiscount(0);
            setFinalAmount(amount);
        }
    };

    const handlePayment = async () => {
        try {
            const response = await axios.post("/api/payment/process-payment", {
                amount,
                promoCode,
            });
            alert(`Payment successful! Amount Paid: ${response.data.amountPaid}`);
        } catch (error) {
            alert("Payment failed");
        }
    };

    return (
        <div>
            <h2>Payment Page</h2>
            <p>Original Amount: ${amount}</p>
            <input 
                type="text" 
                placeholder="Enter Promo Code" 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value)} 
            />
            <button onClick={validatePromoCode}>Apply</button>
            <p>{message}</p>
            <h3>Final Amount: ${finalAmount.toFixed(2)}</h3>
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default PaymentPage;
