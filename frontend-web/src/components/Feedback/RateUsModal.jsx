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
        note,
      });
      onClose();
    } catch (error) {
      console.error(
        "Feedback submission failed:",
        error.response?.data || error.message,
      );
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-xl bg-white shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 text-xl font-bold text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>

          <div className="p-6">
            <h1 className="mb-4 text-center text-xl font-bold">
              Rate Your Experience
            </h1>

            <div className="flex flex-col items-center">
              <div className="mb-4 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={28}
                    className={`mx-1 cursor-pointer ${
                      (hover || rating) > i
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHover(i + 1)}
                    onMouseLeave={() => setHover(null)}
                  />
                ))}
              </div>

              <textarea
                placeholder="Tell us about your experience (optional)..."
                className="mb-4 min-h-[100px] w-full rounded-lg border border-gray-300 p-3 text-sm"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              {error && (
                <p className="mb-3 text-center text-sm text-red-500">{error}</p>
              )}

              <div className="button-wrapper w-full justify-center px-2 py-1 text-base">
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
