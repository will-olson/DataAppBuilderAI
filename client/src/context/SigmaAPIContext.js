import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import apiClient from '../services/api';

const SigmaAPIContext = createContext();

const initialState = {
  // Connection status
  apiStatus: 'disconnected',
  connectionInfo: null,
  
  // Credentials management
  credentials: null,
  
  // Data collections
  connections: [],
  workbooks: [],
  workspaces: [],
  datasets: [],
  teams: [],
  members: [],
  
  // Pagination state
  pagination: {
    connections: { page: 1, size: 50, total: 0 },
    workbooks: { page: 1, size: 50, total: 0 },
    workspaces: { page: 1, size: 50, total: 0 },
    datasets: { page: 1, size: 50, total: 0 },
    teams: { page: 1, size: 50, total: 0 },
    members: { page: 1, size: 50, total: 0 }
  },
  
  // UI state
  loading: false,
  error: null,
  
  // OAuth override configuration
  oauthOverrides: [],
  rejectDefaultTokens: false
};

const sigmaAPIReducer = (state, action) => {
  switch (action.type) {
    case 'SET_API_STATUS':
      return { ...state, apiStatus: action.payload };
    
    case 'SET_CONNECTION_INFO':
      return { ...state, connectionInfo: action.payload };
    
    case 'SET_CREDENTIALS':
      return { ...state, credentials: action.payload };
    
    case 'SET_CONNECTIONS':
      return { ...state, connections: action.payload };
    
    case 'SET_WORKBOOKS':
      return { ...state, workbooks: action.payload };
    
    case 'SET_WORKSPACES':
      return { ...state, workspaces: action.payload };
    
    case 'SET_DATASETS':
      return { ...state, datasets: action.payload };
    
    case 'SET_TEAMS':
      return { ...state, teams: action.payload };
    
    case 'SET_MEMBERS':
      return { ...state, members: action.payload };
    
    case 'UPDATE_PAGINATION':
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_OAUTH_OVERRIDES':
      return { ...state, oauthOverrides: action.payload };
    
    case 'SET_REJECT_DEFAULT_TOKENS':
      return { ...state, rejectDefaultTokens: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const SigmaAPIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sigmaAPIReducer, initialState);

  // Check API connection status
  const checkAPIStatus = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const status = await apiClient.getSigmaStatus();
      
      if (status.status === 'connected') {
        dispatch({ type: 'SET_API_STATUS', payload: 'connected' });
        dispatch({ type: 'SET_CONNECTION_INFO', payload: status });
      } else if (status.status === 'disabled') {
        dispatch({ type: 'SET_API_STATUS', payload: 'disabled' });
        dispatch({ type: 'SET_ERROR', payload: status.message });
      } else {
        dispatch({ type: 'SET_API_STATUS', payload: 'error' });
        dispatch({ type: 'SET_ERROR', payload: status.message });
      }
    } catch (error) {
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Get current credentials configuration
  const fetchCredentials = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const config = await apiClient.getSigmaConfig();
      dispatch({ type: 'SET_CREDENTIALS', payload: config });
      
      return config;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Update credentials
  const updateCredentials = useCallback(async (credentialsData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await apiClient.updateSigmaCredentials(credentialsData);
      
      // Refresh credentials after update
      await fetchCredentials();
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchCredentials]);

  // Test credentials
  const testCredentials = useCallback(async (credentialsData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await apiClient.testSigmaCredentials(credentialsData);
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch connections with pagination
  const fetchConnections = useCallback(async (page = 1, size = 50) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await apiClient.getSigmaConnections(page, size);
      dispatch({ type: 'SET_CONNECTIONS', payload: result.data || [] });
      dispatch({ 
        type: 'UPDATE_PAGINATION', 
        payload: { connections: { page, size, total: result.total || 0 } }
      });
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch workbooks with pagination
  const fetchWorkbooks = useCallback(async (page = 1, size = 50) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await apiClient.getSigmaWorkbooks(page, size);
      dispatch({ type: 'SET_WORKBOOKS', payload: result.data || [] });
      dispatch({ 
        type: 'UPDATE_PAGINATION', 
        payload: { workbooks: { page, size, total: result.total || 0 } }
      });
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch workspaces with pagination
  const fetchWorkspaces = useCallback(async (page = 1, size = 50) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await apiClient.getSigmaWorkspaces(page, size);
      dispatch({ type: 'SET_WORKSPACES', payload: result.data || [] });
      dispatch({ 
        type: 'UPDATE_PAGINATION', 
        payload: { workspaces: { page, size, total: result.total || 0 } }
      });
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Fetch datasets with pagination
  const fetchDatasets = useCallback(async (page = 1, size = 50) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await apiClient.getSigmaDatasets(page, size);
      dispatch({ type: 'SET_DATASETS', payload: result.data || [] });
      dispatch({ 
        type: 'UPDATE_PAGINATION', 
        payload: { datasets: { page, size, total: result.total || 0 } }
      });
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Export workbook with OAuth overrides
  const exportWorkbook = useCallback(async (workbookId, format = 'csv', options = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const exportData = {
        format,
        oauth_overrides: state.oauthOverrides,
        reject_default_tokens: state.rejectDefaultTokens,
        ...options
      };
      
      const result = await apiClient.exportSigmaWorkbook(workbookId, exportData);
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.oauthOverrides, state.rejectDefaultTokens]);

  // OAuth override management
  const addOAuthOverride = useCallback((connectionId, token) => {
    const newOverride = { conn_id: connectionId, token };
    const updatedOverrides = [...state.oauthOverrides, newOverride];
    dispatch({ type: 'SET_OAUTH_OVERRIDES', payload: updatedOverrides });
  }, [state.oauthOverrides]);

  const removeOAuthOverride = useCallback((connectionId) => {
    const updatedOverrides = state.oauthOverrides.filter(
      override => override.conn_id !== connectionId
    );
    dispatch({ type: 'SET_OAUTH_OVERRIDES', payload: updatedOverrides });
  }, [state.oauthOverrides]);

  const clearOAuthOverrides = useCallback(() => {
    dispatch({ type: 'SET_OAUTH_OVERRIDES', payload: [] });
  }, []);

  // Initialize API connection on mount
  useEffect(() => {
    checkAPIStatus();
    fetchCredentials();
  }, [checkAPIStatus, fetchCredentials]);

  const value = {
    ...state,
    checkAPIStatus,
    fetchCredentials,
    updateCredentials,
    testCredentials,
    fetchConnections,
    fetchWorkbooks,
    fetchWorkspaces,
    fetchDatasets,
    exportWorkbook,
    addOAuthOverride,
    removeOAuthOverride,
    clearOAuthOverrides,
    setRejectDefaultTokens: (value) => dispatch({ type: 'SET_REJECT_DEFAULT_TOKENS', payload: value }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return (
    <SigmaAPIContext.Provider value={value}>
      {children}
    </SigmaAPIContext.Provider>
  );
};

export const useSigmaAPI = () => {
  const context = useContext(SigmaAPIContext);
  if (!context) {
    throw new Error('useSigmaAPI must be used within a SigmaAPIProvider');
  }
  return context;
}; 