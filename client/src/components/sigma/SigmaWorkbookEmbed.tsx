import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
  BookmarkAdd as BookmarkAddIcon
} from '@mui/icons-material';

import {
  useSigmaIframe,
  useWorkbookLoaded,
  useWorkbookError,
  useWorkbookDataLoaded,
  useVariableChange,
  useWorkbookCurrentVariables,
  useWorkbookBookmarkOnCreate,
  useWorkbookBookmarkOnChange,
  useWorkbookBookmarkOnUpdate,
  useWorkbookBookmarkOnDelete,
  useActionOutbound,
  updateWorkbookVariables,
  createWorkbookBookmark,
  updateWorkbookBookmark,
  deleteWorkbookBookmark,
  selectWorkbookBookmark,
  updateWorkbookFullscreen,
  updateWorkbookSelectedNodeId
} from '@sigmacomputing/react-embed-sdk';

import type {
  WorkbookBookmarkCreateEvent,
  WorkbookBookmarkOnChangeEvent,
  WorkbookBookmarkOnUpdateEvent,
  WorkbookBookmarkOnDeleteEvent,
  ActionOutboundEvent
} from '@sigmacomputing/embed-sdk';

interface SigmaWorkbookEmbedProps {
  workbookUrl: string;
  workbookId?: string;
  title?: string;
  height?: string | number;
  width?: string | number;
  showControls?: boolean;
  showVariables?: boolean;
  showBookmarks?: boolean;
  onWorkbookLoaded?: (workbook: any) => void;
  onError?: (error: any) => void;
  onVariableChange?: (variable: any) => void;
  onActionOutbound?: (action: any) => void;
}

/**
 * Sigma Workbook Embed Component
 * 
 * This component provides a complete interface for embedding and interacting with
 * Sigma workbooks using the official React SDK.
 */
const SigmaWorkbookEmbed: React.FC<SigmaWorkbookEmbedProps> = ({
  workbookUrl,
  workbookId,
  title = 'Sigma Workbook',
  height = 600,
  width = '100%',
  showControls = true,
  showVariables = true,
  showBookmarks = true,
  onWorkbookLoaded,
  onError,
  onVariableChange,
  onActionOutbound
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Sigma SDK hooks
  const { loading, error: iframeError } = useSigmaIframe(workbookUrl, iframeRef);
  
  // Workbook lifecycle events
  const workbookLoaded = useWorkbookLoaded(iframeRef);
  const workbookError = useWorkbookError(iframeRef);
  const dataLoaded = useWorkbookDataLoaded(iframeRef);
  
  // User interaction events
  const variableChange = useVariableChange(iframeRef);
  const currentVariables = useWorkbookCurrentVariables(iframeRef);
  const actionOutbound = useActionOutbound(iframeRef);
  
  // Bookmark events
  const bookmarkCreate = useWorkbookBookmarkOnCreate(iframeRef);
  const bookmarkChange = useWorkbookBookmarkOnChange(iframeRef);
  const bookmarkUpdate = useWorkbookBookmarkOnUpdate(iframeRef);
  const bookmarkDelete = useWorkbookBookmarkOnDelete(iframeRef);
  
  // Local state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
  const [showVariableEditor, setShowVariableEditor] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [selectedBookmark, setSelectedBookmark] = useState<string | null>(null);
  const [workbookState, setWorkbookState] = useState<any>(null);

  // Handle workbook loaded
  useEffect(() => {
    if (workbookLoaded && onWorkbookLoaded) {
      onWorkbookLoaded(workbookLoaded);
      setWorkbookState(workbookLoaded);
    }
  }, [workbookLoaded, onWorkbookLoaded]);

  // Handle workbook error
  useEffect(() => {
    if (workbookError && onError) {
      onError(workbookError);
    }
  }, [workbookError, onError]);

  // Handle variable changes
  useEffect(() => {
    if (variableChange && onVariableChange) {
      onVariableChange(variableChange);
    }
  }, [variableChange, onVariableChange]);

  // Handle action outbound
  useEffect(() => {
    if (actionOutbound && onActionOutbound) {
      onActionOutbound(actionOutbound);
    }
  }, [actionOutbound, onActionOutbound]);

  // Handle bookmark events
  useEffect(() => {
    if (bookmarkCreate) {
      setBookmarks(prev => [...prev, bookmarkCreate.bookmark]);
    }
  }, [bookmarkCreate]);

  useEffect(() => {
    if (bookmarkChange) {
      setBookmarks(prev => prev.map(b => 
        b.id === bookmarkChange.bookmark.id ? bookmarkChange.bookmark : b
      ));
    }
  }, [bookmarkChange]);

  useEffect(() => {
    if (bookmarkUpdate) {
      setBookmarks(prev => prev.map(b => 
        b.id === bookmarkUpdate.bookmark.id ? bookmarkUpdate.bookmark : b
      ));
    }
  }, [bookmarkUpdate]);

  useEffect(() => {
    if (bookmarkDelete) {
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkDelete.bookmark.id));
    }
  }, [bookmarkDelete]);

  // Handle current variables
  useEffect(() => {
    if (currentVariables) {
      setCustomVariables(currentVariables.variables || {});
    }
  }, [currentVariables]);

  // Callback functions
  const handleFullscreenToggle = useCallback(async () => {
    if (!iframeRef.current) return;
    
    try {
      if (isFullscreen) {
        await updateWorkbookFullscreen(iframeRef, null);
        setIsFullscreen(false);
      } else {
        await updateWorkbookFullscreen(iframeRef, 'current');
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
  }, [isFullscreen]);

  const handleVariableUpdate = useCallback(async (variables: Record<string, string>) => {
    if (!iframeRef.current) return;
    
    try {
      await updateWorkbookVariables(iframeRef, variables);
      setCustomVariables(variables);
    } catch (error) {
      console.error('Failed to update variables:', error);
    }
  }, []);

  const handleBookmarkCreate = useCallback(async (bookmark: WorkbookBookmarkCreateEvent) => {
    if (!iframeRef.current) return;
    
    try {
      await createWorkbookBookmark(iframeRef, bookmark);
    } catch (error) {
      console.error('Failed to create bookmark:', error);
    }
  }, []);

  const handleBookmarkSelect = useCallback(async (bookmarkId: string | null) => {
    if (!iframeRef.current) return;
    
    try {
      await selectWorkbookBookmark(iframeRef, bookmarkId);
      setSelectedBookmark(bookmarkId);
    } catch (error) {
      console.error('Failed to select bookmark:', error);
    }
  }, []);

  const handleBookmarkDelete = useCallback(async (bookmarkId: string) => {
    if (!iframeRef.current) return;
    
    try {
      await deleteWorkbookBookmark(iframeRef, bookmarkId);
      if (selectedBookmark === bookmarkId) {
        setSelectedBookmark(null);
      }
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  }, [selectedBookmark]);

  const handleRefresh = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = workbookUrl;
    }
  }, [workbookUrl]);

  // Render loading state
  if (loading) {
    return (
      <Card sx={{ height, width }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading Sigma Workbook...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (iframeError || workbookError) {
    return (
      <Card sx={{ height, width }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Failed to Load Workbook
            </Typography>
            <Typography variant="body2" gutterBottom>
              {iframeError?.message || workbookError?.message || 'An error occurred while loading the workbook.'}
            </Typography>
            <Button onClick={handleRefresh} sx={{ mt: 1 }}>
              Retry
            </Button>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height, width }}>
      <CardContent sx={{ p: 0, height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs>
              <Typography variant="h6">{title}</Typography>
              {workbookId && (
                <Typography variant="caption" color="text.secondary">
                  ID: {workbookId}
                </Typography>
              )}
            </Grid>
            
            {showControls && (
              <Grid item>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Refresh Workbook">
                    <IconButton onClick={handleRefresh} size="small">
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                    <IconButton onClick={handleFullscreenToggle} size="small">
                      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                  </Tooltip>
                  
                  {showVariables && (
                    <Tooltip title="Variable Settings">
                      <IconButton 
                        onClick={() => setShowVariableEditor(!showVariableEditor)} 
                        size="small"
                      >
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Variable Editor */}
        {showVariables && showVariableEditor && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Workbook Variables
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(customVariables).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    label={key}
                    value={value}
                    onChange={(e) => {
                      const newVars = { ...customVariables, [key]: e.target.value };
                      handleVariableUpdate(newVars);
                    }}
                    size="small"
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Bookmark Controls */}
        {showBookmarks && bookmarks.length > 0 && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Bookmarks
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {bookmarks.map((bookmark) => (
                <Chip
                  key={bookmark.id}
                  label={bookmark.name}
                  onClick={() => handleBookmarkSelect(bookmark.id)}
                  onDelete={() => handleBookmarkDelete(bookmark.id)}
                  color={selectedBookmark === bookmark.id ? 'primary' : 'default'}
                  variant={selectedBookmark === bookmark.id ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Workbook Status */}
        {workbookState && (
          <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label="Workbook Loaded" 
                color="success" 
                size="small" 
                variant="outlined"
              />
              {dataLoaded && (
                <Chip 
                  label="Data Loaded" 
                  color="info" 
                  size="small" 
                  variant="outlined"
                />
              )}
              {Object.keys(customVariables).length > 0 && (
                <Chip 
                  label={`${Object.keys(customVariables).length} Variables`}
                  color="secondary" 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}

        {/* Sigma Workbook Iframe */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <iframe
            ref={iframeRef}
            src={workbookUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              minHeight: '400px'
            }}
            title={title}
            allow="fullscreen"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SigmaWorkbookEmbed; 