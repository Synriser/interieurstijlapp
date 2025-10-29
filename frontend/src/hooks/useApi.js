import { useState, useEffect } from 'react';

/**
 * Custom hook for API calls with loading and error states
 * @param {Function} apiFunc - The API function to call
 * @param {Array} deps - Dependencies array for useEffect
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useApi = (apiFunc, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc();
      setData(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
};
