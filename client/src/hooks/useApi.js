import { useState, useCallback, useRef, useEffect } from 'react';
import apiClient from '../services/api';

const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const {
    onSuccess,
    onError,
    autoExecute = false,
    initialData = null
  } = options;

  // Initialize with initial data if provided
  if (initialData && !data) {
    setData(initialData);
  }

  const execute = useCallback(async (...args) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args, abortControllerRef.current.signal);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  // Auto-execute on mount if specified
  useEffect(() => {
    if (autoExecute) {
      execute();
    }
    
    // Cleanup function to cancel any pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoExecute]); // Remove execute from dependencies to prevent infinite loops

  return {
    data,
    loading,
    error,
    execute,
    reset,
    cancel,
    setData
  };
};

export default useApi;

export const useSigmaMode = () => {
  const [sigmaMode, setSigmaMode] = useState('standalone');
  const { loading, error, executeApiCall } = useApi();

  const toggleMode = useCallback(async (mode) => {
    try {
      const result = await executeApiCall(apiClient.toggleSigmaMode, mode);
      if (result.status === 'success') {
        setSigmaMode(mode);
      }
      return result;
    } catch (err) {
      console.error('Error toggling Sigma mode:', err);
      throw err;
    }
  }, [executeApiCall]);

  const getCurrentConfig = useCallback(async () => {
    try {
      const config = await executeApiCall(apiClient.getSigmaConfig);
      setSigmaMode(config.sigma_mode || 'standalone');
      return config;
    } catch (err) {
      console.error('Error getting Sigma config:', err);
      throw err;
    }
  }, [executeApiCall]);

  return {
    sigmaMode,
    toggleMode,
    getCurrentConfig,
    loading,
    error,
  };
};

export const useAnalytics = () => {
  const { loading, error, executeApiCall } = useApi();

  const getUserSegments = useCallback(async () => {
    return executeApiCall(apiClient.getUserSegments);
  }, [executeApiCall]);

  const getUserJourney = useCallback(async () => {
    return executeApiCall(apiClient.getUserJourney);
  }, [executeApiCall]);

  const getPersonalizationData = useCallback(async () => {
    return executeApiCall(apiClient.getPersonalizationData);
  }, [executeApiCall]);

  const getChurnPrediction = useCallback(async () => {
    return executeApiCall(apiClient.getChurnPrediction);
  }, [executeApiCall]);

  const getReferralInsights = useCallback(async () => {
    return executeApiCall(apiClient.getReferralInsights);
  }, [executeApiCall]);

  const getFeatureUsage = useCallback(async () => {
    return executeApiCall(apiClient.getFeatureUsage);
  }, [executeApiCall]);

  const getRevenueForecast = useCallback(async () => {
    return executeApiCall(apiClient.getRevenueForecast);
  }, [executeApiCall]);

  const getRawUserData = useCallback(async (limit = 100, offset = 0) => {
    return executeApiCall(apiClient.getRawUserData, limit, offset);
  }, [executeApiCall]);

  return {
    getUserSegments,
    getUserJourney,
    getPersonalizationData,
    getChurnPrediction,
    getReferralInsights,
    getFeatureUsage,
    getRevenueForecast,
    getRawUserData,
    loading,
    error,
  };
}; 