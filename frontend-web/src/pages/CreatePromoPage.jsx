import { useEffect, useState } from "react";
import axios from "axios";

const CreatePromoPage = () => {
  const [form, setForm] = useState({
    code: "",
    discount: "",
    expiry: "",
    usageLimit: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [promos, setPromos] = useState([]);

  const fetchPromos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/promo/all");
      setPromos(response.data);
    } catch (err) {
      console.error("Failed to fetch promo codes:", err);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.code || !form.discount || !form.usageLimit) {
      setError("Please fill in promo code, discount, and usage limit.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/promo/create",
        {
          code: form.code.trim(),
          discount: parseFloat(form.discount),
          expirationDate: form.expiry || null,
          usageLimit: parseInt(form.usageLimit),
        },
      );

      setMessage(`✅ Promo "${form.code}" created successfully!`);
      setForm({ code: "", discount: "", expiry: "", usageLimit: "" });
      fetchPromos();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "❌ Failed to create promo code. Server error.",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6">
      <div className="mb-8 w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-center text-4xl font-light text-transparent">
          Create Promo Code
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="code"
            placeholder="Promo Code"
            value={form.code}
            onChange={handleChange}
            className="w-full rounded-md border p-3"
            required
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="w-full rounded-md border p-3"
            required
          />
          <input
            type="date"
            name="expiry"
            placeholder="Expiry Date"
            value={form.expiry}
            onChange={handleChange}
            className="w-full rounded-md border p-3"
          />
          <input
            type="number"
            name="usageLimit"
            placeholder="Usage Limit"
            value={form.usageLimit}
            onChange={handleChange}
            className="w-full rounded-md border p-3"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 py-3 font-semibold text-white hover:opacity-90"
          >
            Create Promo
          </button>
          {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
      </div>

      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-2xl font-semibold">Existing Promo Codes</h3>
        {promos.length === 0 ? (
          <p>No promo codes found.</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Code</th>
                <th className="p-3">Discount (%)</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Usage Limit</th>
                <th className="p-3">Used</th>
                <th className="p-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo._id} className="border-t">
                  <td className="p-3">{promo.code}</td>
                  <td className="p-3">{promo.discount}</td>
                  <td className="p-3">
                    {promo.expirationDate
                      ? new Date(promo.expirationDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">{promo.usageLimit}</td>
                  <td className="p-3">{promo.usedCount || 0}</td>
                  <td className="p-3">
                    {promo.isActive ? "Active" : "Not Active"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CreatePromoPage;
