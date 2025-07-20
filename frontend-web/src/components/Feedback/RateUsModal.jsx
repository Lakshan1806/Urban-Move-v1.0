import { useState, useContext } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function RateUsModal({ onClose }) {
    const { user } = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitFeedback = async () => {
        if (!rating) {
            alert("Please select a rating!");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post("/api/feedbacks", {
                userId: user._id,
                rating,
                note
            });
            alert("Thanks for your feedback! 🚀");
            onClose();
        } catch (error) {
            console.error("Feedback submission failed:", error.response?.data || error.message);
            alert("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-semibold mb-4 text-center">Rate Us</h2>

                <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            size={30}
                            className={`cursor-pointer ${
                                (hover || rating) > i ? "text-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => setRating(i + 1)}
                            onMouseEnter={() => setHover(i + 1)}
                            onMouseLeave={() => setHover(null)}
                        />
                    ))}
                </div>

                <textarea
                    placeholder="Your feedback (optional)..."
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <button
                    onClick={submitFeedback}
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>
    );
}