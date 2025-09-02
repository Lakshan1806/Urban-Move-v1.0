import { useState, useEffect } from "react";
import FeedbackSlide from "./FeedbackSlide";
import useFeedbacks from "../hooks/useFeedbacks";

const FeedbackSlideshow = () => {
  const { feedbacks, loading, error } = useFeedbacks();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (feedbacks.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % feedbacks.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [feedbacks.length]);

  if (loading)
    return <div className="py-8 text-center">Loading feedbacks...</div>;
  if (error)
    return (
      <div className="py-8 text-center text-red-500">
        Error loading feedbacks
      </div>
    );
  if (feedbacks.length === 0)
    return <div className="py-8 text-center">No feedbacks yet</div>;

  return (
    <div className="relative bg-gray-200 py-8">
      <h2 className="mb-8 text-center text-4xl font-bold">
        What Our Users Say
      </h2>

      <div className="relative h-64 overflow-hidden">
        {feedbacks.map((feedback, index) => (
          <div
            key={feedback._id}
            className={`absolute inset-0 flex justify-center transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <FeedbackSlide feedback={feedback} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        {feedbacks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`mx-1 h-3 w-3 rounded-full ${
              index === currentSlide ? "bg-blue-500" : "bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackSlideshow;
