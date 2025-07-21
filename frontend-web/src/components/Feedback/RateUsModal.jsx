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
    const [error, setError] = useState("");

    const submitFeedback = async () => {
        if (!rating) {
            setError("Please select a rating!");
            return;
        }

        setIsSubmitting(true);
        setError("");
        try {
            await axios.post("/api/feedbacks", {
                userId: user._id,
                rating,
                note
            });
            onClose();
        } catch (error) {
            console.error("Feedback submission failed:", error.response?.data || error.message);
            setError("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold z-10"
                    >
                        &times;
                    </button>

                    <div className="p-6">
                        <h1 className="text-xl font-bold text-center mb-4">Rate Your Experience</h1>

                        <div className="flex flex-col items-center">
                            <div className="flex justify-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        size={28}
                                        className={`cursor-pointer mx-1 ${
                                            (hover || rating) > i ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                        onClick={() => setRating(i + 1)}
                                        onMouseEnter={() => setHover(i + 1)}
                                        onMouseLeave={() => setHover(null)}
                                    />
                                ))}
                            </div>

                            <textarea
                                placeholder="Tell us about your experience (optional)..."
                                className="w-full p-3 text-sm border border-gray-300 rounded-lg mb-4 min-h-[100px]"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />

                            {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

                            <div className="button-wrapper w-full px-2 py-1 text-base justify-center">
                                <button
                                    onClick={submitFeedback}
                                    disabled={isSubmitting}
                                    className="button-primary w-full"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}