import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching data
 * @param {Function} fetchFn - Async function that returns data
 * @param {Array} dependencies - Dependencies to trigger refetch
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result.data || result);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('useFetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData 
  };
};