import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiClient from '../services/api';

const SigmaContext = createContext();

const initialState = {
  sigmaMode: 'standalone',
  features: {
    input_tables: false,
    layout_elements: false,
    actions_framework: false,
    data_governance: false,
    real_time_sync: false
  },
  status: 'disabled',
  capabilities: {},
  inputTables: [],
  layoutElements: [],
  actions: [],
  loading: false,
  error: null
};

const sigmaReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_SIGMA_MODE':
      return { 
        ...state, 
        sigmaMode: action.payload.mode,
        features: action.payload.features || state.features,
        status: action.payload.mode === 'standalone' ? 'disabled' : 'active'
      };
    
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    
    case 'SET_CAPABILITIES':
      return { ...state, capabilities: action.payload };
    
    case 'SET_INPUT_TABLES':
      return { ...state, inputTables: action.payload };
    
    case 'SET_LAYOUT_ELEMENTS':
      return { ...state, layoutElements: action.payload };
    
    case 'SET_ACTIONS':
      return { ...state, actions: action.payload };
    
    case 'UPDATE_FEATURES':
      return { ...state, features: { ...state.features, ...action.payload } };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
};

export const SigmaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sigmaReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const updateSigmaMode = async (mode) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiClient.toggleSigmaMode(mode);
      
      if (result.status === 'success') {
        dispatch({ 
          type: 'SET_SIGMA_MODE', 
          payload: { mode: result.mode, features: result.features }
        });
        return result;
      } else {
        throw new Error(result.error || 'Failed to update Sigma mode');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchSigmaStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const status = await apiClient.getSigmaStatus();
      dispatch({ type: 'SET_STATUS', payload: status.status });
      dispatch({ type: 'SET_SIGMA_MODE', payload: { mode: status.mode, features: status.features } });
      
      return status;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchSigmaCapabilities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const capabilities = await apiClient.getSigmaCapabilities();
      dispatch({ type: 'SET_CAPABILITIES', payload: capabilities });
      
      return capabilities;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchInputTables = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tables = await apiClient.getSigmaInputTables();
      dispatch({ type: 'SET_INPUT_TABLES', payload: tables });
      
      return tables;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchLayoutElements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const elements = await apiClient.getSigmaLayoutElements();
      dispatch({ type: 'SET_LAYOUT_ELEMENTS', payload: elements });
      
      return elements;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchActions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const actions = await apiClient.getSigmaActions();
      dispatch({ type: 'SET_ACTIONS', payload: actions });
      
      return actions;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (actionId, parameters) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiClient.executeSigmaAction(actionId, parameters);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchSigmaStatus(),
        fetchSigmaCapabilities(),
        fetchInputTables(),
        fetchLayoutElements(),
        fetchActions()
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  // Initialize on mount
  useEffect(() => {
    fetchSigmaStatus();
  }, []);

  const value = {
    ...state,
    updateSigmaMode,
    fetchSigmaStatus,
    fetchSigmaCapabilities,
    fetchInputTables,
    fetchLayoutElements,
    fetchActions,
    executeAction,
    refreshAll,
    clearError,
    reset
  };

  return (
    <SigmaContext.Provider value={value}>
      {children}
    </SigmaContext.Provider>
  );
};

export const useSigma = () => {
  const context = useContext(SigmaContext);
  if (!context) {
    throw new Error('useSigma must be used within a SigmaProvider');
  }
  return context;
}; 