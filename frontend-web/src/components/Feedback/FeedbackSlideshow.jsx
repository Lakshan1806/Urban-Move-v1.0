import React, { useState, useEffect } from 'react';
import FeedbackSlide from './FeedbackSlide';
import useFeedbacks from '../hooks/useFeedbacks';

const FeedbackSlideshow = () => {
  const { feedbacks, loading, error } = useFeedbacks();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (feedbacks.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % feedbacks.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(timer);
    }
  }, [feedbacks.length]);

  if (loading) return <div className="text-center py-8">Loading feedbacks...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading feedbacks</div>;
  if (feedbacks.length === 0) return <div className="text-center py-8">No feedbacks yet</div>;

  return (
    <div className="relative py-8 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8">What Our Users Say</h2>
      
      <div className="relative h-64 overflow-hidden">
        {feedbacks.map((feedback, index) => (
          <div 
            key={feedback._id}
            className={`absolute inset-0 transition-opacity duration-500 flex justify-center ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <FeedbackSlide feedback={feedback} />
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        {feedbacks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 mx-1 rounded-full ${
              index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackSlideshow;