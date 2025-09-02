import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const PaymentPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    amount: "",
    promo: "",
  });

  const [userId, setUserId] = useState("");
  const [finalAmount, setFinalAmount] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndFare = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/auth/me");
        const user = userRes.data.user;
        if (user?._id) {
          setUserId(user._id);
          setForm((prev) => ({
            ...prev,
            name: user.username,
            email: user.email,
          }));

          const rideRes = await axios.get(
            `http://localhost:5000/api/triphistory/latest-ride/${user._id}`,
          );
          const latestRide = rideRes.data;

          if (latestRide?.fare) {
            setForm((prev) => ({ ...prev, amount: latestRide.fare }));
          }
        }
      } catch (err) {
        console.error("❌ Failed to load user or fare:", err);
      }
    };

    fetchUserAndFare();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      if (/^\d{0,16}$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "expiry") {
      if (/^\d{0,2}\/?\d{0,2}$/.test(value) && value.length <= 5) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "cvc") {
      if (/^\d{0,4}$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const applyPromoCode = async () => {
    const amount = parseFloat(form.amount);
    if (!form.promo || isNaN(amount)) {
      setApplyMessage("Please enter a valid promo code and amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/promo/apply",
        {
          code: form.promo.trim(),
        },
      );

      const discount = response.data.discount;
      const discountType = response.data.discountType;

      let discountedAmount = amount;
      if (discountType === "Percentage") {
        discountedAmount = amount - (amount * discount) / 100;
      } else if (discountType === "Fixed") {
        discountedAmount = amount - discount;
      }

      if (discountedAmount < 0) discountedAmount = 0;

      setFinalAmount(discountedAmount);
      setApplyMessage(
        `Promo applied! New Amount: Rs. ${discountedAmount.toFixed(2)}`,
      );
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid promo code";
      setApplyMessage(msg);
      setFinalAmount(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amountToPay =
        finalAmount !== null ? finalAmount : parseFloat(form.amount);

      const emailData = {
        recipient: form.email,
        subject: "Payment Confirmation",
        message: `Hello ${form.name}, your payment of Rs. ${amountToPay.toFixed(2)} has been processed successfully.`,
      };

      const response = await axios.post(
        "http://localhost:5000/api/email/send-email",
        emailData,
      );
      console.log("Email sent:", response);
      alert("Payment successful!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-light text-orange-500">
          Complete Your Payment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full rounded-md border p-3"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-md border p-3"
            required
          />
          <input
            type="text"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="Card Number"
            className="w-full rounded-md border p-3"
            maxLength={16}
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className="w-1/2 rounded-md border p-3"
              maxLength={5}
              required
            />
            <input
              type="text"
              name="cvc"
              value={form.cvc}
              onChange={handleChange}
              placeholder="CVC"
              className="w-1/2 rounded-md border p-3"
              maxLength={4}
              required
            />
          </div>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full rounded-md border p-3"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              name="promo"
              value={form.promo}
              onChange={handleChange}
              placeholder="Promo Code"
              className="w-full rounded-md border p-3"
            />
            <button
              type="button"
              onClick={applyPromoCode}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Apply
            </button>
          </div>
          {applyMessage && (
            <p className="text-sm text-gray-700">{applyMessage}</p>
          )}
          <div className="text-right text-lg font-semibold">
            Total: Rs.{" "}
            {finalAmount !== null
              ? finalAmount.toFixed(2)
              : form.amount || "0.00"}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md py-3 font-semibold text-white ${
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gradient-to-r from-yellow-400 to-orange-500"
            }`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
