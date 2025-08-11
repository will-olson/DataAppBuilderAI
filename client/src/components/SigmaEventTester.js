import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  useTheme,
  Container,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Send as SendIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Import Sigma SDK
import { useSigmaIframe, useWorkbookLoaded, useWorkbookError } from '@sigmacomputing/react-embed-sdk';

const SigmaEventTester = () => {
  const theme = useTheme();
  
  // State for event testing
  const [events, setEvents] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [eventHistory, setEventHistory] = useState([]);
  
  // State for message testing
  const [messageType, setMessageType] = useState('test');
  const [messageData, setMessageData] = useState('{"key": "value"}');
  const [targetOrigin, setTargetOrigin] = useState('*');
  const [autoSend, setAutoSend] = useState(false);
  const [sendInterval, setSendInterval] = useState(1000);
  
  // State for SDK integration
  const [sdkConfig, setSdkConfig] = useState({
    url: 'https://app.sigmacomputing.com/example',
    enableLogging: true,
    captureAllEvents: true
  });
  
  // Refs
  const eventListenerRef = useRef(null);
  const autoSendIntervalRef = useRef(null);
  
  // Initialize Sigma Embed SDK using the correct hook
  const { iframeRef, loading, error } = useSigmaIframe();
  
  // Use workbook event hooks
  useWorkbookLoaded(iframeRef, (event) => {
    addEvent('Workbook Loaded', 'success', 'Workbook loaded successfully', event);
  });
  
  useWorkbookError(iframeRef, (event) => {
    addEvent('Workbook Error', 'error', `Workbook error: ${event.message}`, event);
  });

  // Event handling
  const addEvent = (type, level, message, data = null) => {
    const event = {
      id: Date.now(),
      type,
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      count: eventCount + 1
    };
    
    setEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
    setEventCount(prev => prev + 1);
    setEventHistory(prev => [...prev, event]);
    
    // Log to console if enabled
    if (sdkConfig.enableLogging) {
      console.log(`[Sigma Event] ${type}:`, { level, message, data });
    }
  };

  // Start event listening
  const startListening = () => {
    if (isListening) return;
    
    setIsListening(true);
    
    // Create event listener for postMessage events
    eventListenerRef.current = (event) => {
      try {
        // Parse event data
        let parsedData = event.data;
        let eventType = 'unknown';
        let eventMessage = 'Message received';
        
        if (typeof event.data === 'string') {
          try {
            parsedData = JSON.parse(event.data);
          } catch (e) {
            parsedData = event.data;
          }
        }
        
        // Determine event type
        if (parsedData && typeof parsedData === 'object') {
          if (parsedData.type) {
            eventType = parsedData.type;
          }
          if (parsedData.message) {
            eventMessage = parsedData.message;
          }
        }
        
        // Add to events
        addEvent(
          eventType,
          'info',
          eventMessage,
          {
            origin: event.origin,
            source: event.source?.location?.href || 'unknown',
            data: parsedData,
            originalEvent: event
          }
        );
      } catch (err) {
        addEvent('Event Parse Error', 'error', `Failed to parse event: ${err.message}`);
      }
    };
    
    // Add event listener
    window.addEventListener('message', eventListenerRef.current);
    
    // Also listen for other types of events if captureAllEvents is enabled
    if (sdkConfig.captureAllEvents) {
      const eventTypes = ['load', 'error', 'resize', 'scroll', 'focus', 'blur'];
      eventTypes.forEach(eventType => {
        window.addEventListener(eventType, (e) => {
          addEvent(`Window ${eventType}`, 'info', `${eventType} event triggered`, {
            target: e.target?.tagName || 'unknown',
            timestamp: e.timeStamp
          });
        });
      });
    }
    
    addEvent('Event Listening Started', 'success', 'Started listening for postMessage events');
  };

  // Stop event listening
  const stopListening = () => {
    if (!isListening) return;
    
    setIsListening(false);
    
    // Remove event listener
    if (eventListenerRef.current) {
      window.removeEventListener('message', eventListenerRef.current);
      eventListenerRef.current = null;
    }
    
    // Stop auto-send if running
    if (autoSendIntervalRef.current) {
      clearInterval(autoSendIntervalRef.current);
      autoSendIntervalRef.current = null;
    }
    
    addEvent('Event Listening Stopped', 'warning', 'Stopped listening for events');
  };

  // Send test message
  const sendMessage = () => {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(messageData);
      } catch (e) {
        parsedData = messageData;
      }
      
      const message = {
        type: messageType,
        data: parsedData,
        timestamp: Date.now(),
        source: 'SigmaEventTester'
      };
      
      // Send via postMessage if iframe is available
      if (iframeRef && iframeRef.contentWindow) {
        iframeRef.contentWindow.postMessage(message, targetOrigin);
        addEvent('Message Sent', 'success', `Sent ${messageType} message`, message);
      } else {
        // Fallback to window postMessage
        window.postMessage(message, targetOrigin);
        addEvent('Message Sent (Fallback)', 'warning', `Sent ${messageType} message via window`, message);
      }
      
      // Also send to parent window for testing
      if (window.parent !== window) {
        window.parent.postMessage(message, targetOrigin);
        addEvent('Message Sent to Parent', 'info', `Sent ${messageType} message to parent window`, message);
      }
      
    } catch (err) {
      addEvent('Message Send Error', 'error', `Failed to send message: ${err.message}`);
    }
  };

  // Start auto-send
  const startAutoSend = () => {
    if (autoSendIntervalRef.current) return;
    
    autoSendIntervalRef.current = setInterval(() => {
      sendMessage();
    }, sendInterval);
    
    addEvent('Auto-Send Started', 'info', `Auto-sending messages every ${sendInterval}ms`);
  };

  // Stop auto-send
  const stopAutoSend = () => {
    if (autoSendIntervalRef.current) {
      clearInterval(autoSendIntervalRef.current);
      autoSendIntervalRef.current = null;
      addEvent('Auto-Send Stopped', 'warning', 'Stopped auto-sending messages');
    }
  };

  // Clear events
  const clearEvents = () => {
    setEvents([]);
    setEventCount(0);
    addEvent('Events Cleared', 'info', 'All events cleared');
  };

  // Export events
  const exportEvents = () => {
    const dataStr = JSON.stringify(eventHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sigma-events-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    addEvent('Events Exported', 'success', `Exported ${eventHistory.length} events`);
  };

  // Get event level color
  const getEventLevelColor = (level) => {
    switch (level) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  // Get event level icon
  const getEventLevelIcon = (level) => {
    switch (level) {
      case 'success': return <SuccessIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (autoSendIntervalRef.current) {
        clearInterval(autoSendIntervalRef.current);
      }
    };
  }, []);

  // Auto-send effect
  useEffect(() => {
    if (autoSend && isListening) {
      startAutoSend();
    } else {
      stopAutoSend();
    }
  }, [autoSend, isListening, sendInterval]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Sigma Event Tester
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Advanced event testing and monitoring for Sigma Embed SDK integration. 
        Test postMessage communication, monitor events, and validate SDK functionality.
      </Typography>

      {/* SDK Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">
              <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              SDK Status & Configuration
            </Typography>
            <Box display="flex" gap={1}>
              <Chip 
                label={`SDK: ${loading ? 'Loading' : 'Ready'}`}
                color={loading ? 'warning' : 'success'}
              />
              <Chip 
                label={`Events: ${eventCount}`}
                color="info"
              />
              <Chip 
                label={`Listening: ${isListening ? 'ON' : 'OFF'}`}
                color={isListening ? 'success' : 'default'}
              />
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Iframe URL"
                value={sdkConfig.url}
                onChange={(e) => setSdkConfig(prev => ({ ...prev, url: e.target.value }))}
                margin="normal"
                helperText="URL for Sigma iframe"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={sdkConfig.enableLogging}
                    onChange={(e) => setSdkConfig(prev => ({ ...prev, enableLogging: e.target.checked }))}
                  />
                }
                label="Enable Logging"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={sdkConfig.captureAllEvents}
                    onChange={(e) => setSdkConfig(prev => ({ ...prev, captureAllEvents: e.target.checked }))}
                  />
                }
                label="Capture All Events"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Event Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <PlayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Event Controls
          </Typography>
          
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={startListening}
              disabled={isListening}
              color="success"
            >
              Start Listening
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<StopIcon />}
              onClick={stopListening}
              disabled={!isListening}
              color="error"
            >
              Stop Listening
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearEvents}
              color="info"
            >
              Clear Events
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportEvents}
              disabled={eventHistory.length === 0}
              color="secondary"
            >
              Export Events
            </Button>
          </Stack>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              SDK Error: {error.message}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Message Testing */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <MessageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Message Testing
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Message Type"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                margin="normal"
                helperText="Type of message to send"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Target Origin"
                value={targetOrigin}
                onChange={(e) => setTargetOrigin(e.target.value)}
                margin="normal"
                helperText="Target origin for postMessage"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Send Interval (ms)"
                type="number"
                value={sendInterval}
                onChange={(e) => setSendInterval(parseInt(e.target.value))}
                margin="normal"
                disabled={!autoSend}
                helperText="Interval for auto-send"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSend}
                    onChange={(e) => setAutoSend(e.target.checked)}
                    disabled={!isListening}
                  />
                }
                label="Auto-Send"
              />
            </Grid>
          </Grid>
          
          <TextField
            fullWidth
            label="Message Data (JSON)"
            value={messageData}
            onChange={(e) => setMessageData(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            helperText="JSON data to send with message"
          />
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={sendMessage}
              disabled={!isListening}
              sx={{ mr: 1 }}
            >
              Send Message
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setMessageData('{"key": "value", "timestamp": ' + Date.now() + '}');
              }}
              color="info"
            >
              Update Timestamp
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Test Iframe */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Test Iframe
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This iframe is used for testing Sigma SDK events and communication. The iframe will load the configured URL
            and enable event testing and postMessage communication.
          </Typography>
          
          <Box sx={{ position: 'relative', minHeight: 300, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            {loading && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1
                }}
              >
                <Typography>Loading Sigma iframe...</Typography>
              </Box>
            )}
            
            {error && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  color: 'error.main'
                }}
              >
                <Typography color="error">Error loading iframe: {error.message}</Typography>
              </Box>
            )}
            
            <iframe
              ref={iframeRef}
              src={sdkConfig.url}
              style={{
                width: '100%',
                height: '300px',
                border: 'none',
                opacity: loading || error ? 0.3 : 1,
                transition: 'opacity 0.3s ease'
              }}
              title="Sigma Test Iframe"
              allow="fullscreen"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Event Display */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Live Events ({events.length})
                </Typography>
                <Chip 
                  label={isListening ? 'LIVE' : 'PAUSED'}
                  color={isListening ? 'success' : 'default'}
                  variant={isListening ? 'filled' : 'outlined'}
                />
              </Box>
              
              <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
                <List dense>
                  {events.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary="No events yet"
                        secondary="Start listening to see events here"
                      />
                    </ListItem>
                  ) : (
                    events.map((event) => (
                      <ListItem key={event.id} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {getEventLevelIcon(event.level)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle2">
                                {event.type}
                              </Typography>
                              <Chip
                                label={event.level}
                                color={getEventLevelColor(event.level)}
                                size="small"
                              />
                              <Typography variant="caption" color="text.secondary">
                                #{event.count}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {event.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </Typography>
                              {event.data && (
                                <Paper variant="outlined" sx={{ p: 1, mt: 1, bgcolor: 'grey.50' }}>
                                  <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                                    {JSON.stringify(event.data, null, 2)}
                                  </Typography>
                                </Paper>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Event Statistics
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h4" color="primary.main">
                    {eventCount}
                  </Typography>
                  <Typography variant="body2">Total Events</Typography>
                </Box>
                
                <Divider />
                
                <Box>
                  <Typography variant="h6" color="success.main">
                    {events.filter(e => e.level === 'success').length}
                  </Typography>
                  <Typography variant="body2">Success Events</Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" color="error.main">
                    {events.filter(e => e.level === 'error').length}
                  </Typography>
                  <Typography variant="body2">Error Events</Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" color="warning.main">
                    {events.filter(e => e.level === 'warning').length}
                  </Typography>
                  <Typography variant="body2">Warning Events</Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" color="info.main">
                    {events.filter(e => e.level === 'info').length}
                  </Typography>
                  <Typography variant="body2">Info Events</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SigmaEventTester; 