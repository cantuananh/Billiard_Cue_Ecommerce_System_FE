import { useState } from 'react';

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const withLoading = async (asyncFunction) => {
    startLoading();
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

// Multiple loading states hook
export const useLoadingStates = (initialStates = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialStates);

  const setLoading = (key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  };

  const startLoading = (key) => setLoading(key, true);
  const stopLoading = (key) => setLoading(key, false);

  const withLoading = async (key, asyncFunction) => {
    startLoading(key);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading(key);
    }
  };

  const isLoading = (key) => Boolean(loadingStates[key]);

  return {
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
    isLoading,
  };
};