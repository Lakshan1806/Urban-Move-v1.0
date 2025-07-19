import { useState, useEffect } from 'react';
import axios from 'axios';

const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('/api/feedbacks');
        setFeedbacks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return { feedbacks, loading, error };
};

export default useFeedbacks;