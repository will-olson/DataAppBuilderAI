# Sigma SDK Testing Guide

## Overview

The Sigma SDK Testing Suite provides comprehensive testing capabilities for the [Sigma Embed-SDK](https://github.com/sigmacomputing/embed-sdk) integration in your GrowthMarketer AI application. This guide covers all available testing features and how to use them effectively.

## Table of Contents

1. [Installation](#installation)
2. [Testing Components](#testing-components)
3. [Test Suites](#test-suites)
4. [Event Testing](#event-testing)
5. [Advanced Features](#advanced-features)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

## Installation

### Prerequisites

- Node.js 16+ 
- React 18+
- Material-UI (MUI) 5+

### Install Sigma SDK Packages

```bash
cd client
npm install @sigmacomputing/react-embed-sdk @sigmacomputing/embed-sdk
```

### Verify Installation

Check that the packages are properly installed:

```bash
npm list @sigmacomputing/react-embed-sdk @sigmacomputing/embed-sdk
```

## Testing Components

### 1. SigmaSDKTestingPage

The main testing interface that provides:

- **Test Configuration**: Configure iframe URLs, timeouts, and retry counts
- **Test Suites**: Organized test categories with individual test execution
- **Results Summary**: Visual representation of test outcomes
- **SDK Error Tracking**: Monitor and debug SDK-related errors

### 2. SigmaEventTester

Advanced event testing component that offers:

- **Real-time Event Monitoring**: Capture and display postMessage events
- **Message Testing**: Send custom messages to iframes
- **Event Statistics**: Track event counts and types
- **Export Functionality**: Download event logs for analysis

## Test Suites

### SDK Initialization Tests

#### SDK Load Test
- **Purpose**: Verify Sigma Embed SDK loads correctly
- **What it tests**: SDK initialization, iframe creation, error handling
- **Expected outcome**: SDK loads without errors and iframe is created

#### Iframe Creation Test
- **Purpose**: Ensure iframe element is properly mounted
- **What it tests**: DOM element creation, iframe properties
- **Expected outcome**: Iframe element exists and has correct properties

### Event Communication Tests

#### PostMessage Test
- **Purpose**: Validate postMessage communication with iframe
- **What it tests**: Message sending, iframe communication
- **Expected outcome**: Messages are sent successfully to iframe

#### Event Listener Test
- **Purpose**: Test event listener registration and response
- **What it tests**: Event listener setup, message reception
- **Expected outcome**: Event listeners are registered and can receive messages

### SDK Functionality Tests

#### Embed Methods Test
- **Purpose**: Discover available SDK methods
- **What it tests**: SDK API surface, method availability
- **Expected outcome**: List of available public methods

#### Configuration Test
- **Purpose**: Validate SDK configuration options
- **What it tests**: Configuration loading, parameter validation
- **Expected outcome**: Configuration is loaded and valid

### Integration Tests

#### Sigma Mode Integration Test
- **Purpose**: Test integration with Sigma mode system
- **What it tests**: API endpoints, configuration retrieval
- **Expected outcome**: Can communicate with Sigma backend

#### API Endpoints Test
- **Purpose**: Validate Sigma API endpoints
- **What it tests**: Endpoint availability, response handling
- **Expected outcome**: All endpoints respond correctly

## Event Testing

### Starting Event Monitoring

1. **Configure SDK Settings**:
   - Set iframe URL
   - Enable logging
   - Configure event capture options

2. **Start Listening**:
   - Click "Start Listening" button
   - Monitor real-time events
   - View event statistics

### Message Testing

#### Manual Message Sending

```javascript
// Example message structure
const message = {
  type: 'test',
  data: { key: 'value', timestamp: Date.now() },
  source: 'SigmaEventTester'
};

// Send to iframe
embed.iframe.contentWindow.postMessage(message, '*');
```

#### Auto-Send Configuration

- **Interval**: Set message sending frequency (ms)
- **Message Type**: Configure message type and data
- **Target Origin**: Specify postMessage target origin

### Event Types

#### PostMessage Events
- **Inbound**: Messages received from iframe
- **Outbound**: Messages sent to iframe
- **Cross-window**: Parent-child window communication

#### Window Events
- **Load**: Page load events
- **Error**: Error events
- **Resize**: Window resize events
- **Focus/Blur**: Focus management events

## Advanced Features

### Event Export

Export event logs for analysis:

```javascript
// Export events to JSON file
const exportEvents = () => {
  const dataStr = JSON.stringify(eventHistory, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sigma-events-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
```

### Debug Information

Access comprehensive debug information:

```javascript
// Log SDK debug info to console
console.log('SDK Debug Info:', { 
  embed, 
  isReady, 
  error, 
  testResults,
  events,
  sdkStatus 
});
```

### Configuration Management

Dynamic configuration updates:

```javascript
const [sdkConfig, setSdkConfig] = useState({
  url: 'https://app.sigmacomputing.com/example',
  enableLogging: true,
  captureAllEvents: true,
  timeout: 5000,
  retryCount: 3
});
```

## Troubleshooting

### Common Issues

#### SDK Not Loading

**Symptoms**: SDK status shows "error" or "loading"
**Solutions**:
- Check iframe URL accessibility
- Verify network connectivity
- Check browser console for errors
- Validate CORS settings

#### Events Not Capturing

**Symptoms**: Event count remains at 0
**Solutions**:
- Ensure event listening is started
- Check iframe communication
- Verify postMessage implementation
- Monitor browser console for errors

#### Test Failures

**Symptoms**: Tests show "error" or "warning" status
**Solutions**:
- Review test configuration
- Check API endpoint availability
- Verify Sigma mode settings
- Examine error details in test results

### Debug Steps

1. **Check Console Logs**: Look for SDK-related errors
2. **Verify Network**: Ensure API endpoints are accessible
3. **Test Configuration**: Validate SDK configuration
4. **Monitor Events**: Use event tester to capture real-time data
5. **Export Logs**: Download event logs for detailed analysis

## Best Practices

### Testing Strategy

1. **Start with Basic Tests**: Run initialization tests first
2. **Validate Communication**: Ensure postMessage works before advanced testing
3. **Monitor Performance**: Track test execution times
4. **Document Issues**: Record and categorize test failures
5. **Regular Validation**: Run tests after configuration changes

### Configuration Management

1. **Environment-Specific**: Use different URLs for dev/staging/prod
2. **Timeout Settings**: Adjust timeouts based on network conditions
3. **Retry Logic**: Implement appropriate retry strategies
4. **Logging Levels**: Configure logging based on debugging needs

### Event Handling

1. **Event Filtering**: Focus on relevant event types
2. **Data Validation**: Verify event data structure
3. **Error Handling**: Implement graceful error handling
4. **Performance Monitoring**: Track event processing performance

### Integration Testing

1. **API Validation**: Test all Sigma API endpoints
2. **Mode Switching**: Validate Sigma mode transitions
3. **Data Flow**: Verify data consistency across components
4. **Error Scenarios**: Test failure and recovery scenarios

## API Reference

### Test Suite Configuration

```javascript
const testSuites = [
  {
    name: 'Suite Name',
    tests: [
      {
        name: 'Test Name',
        description: 'Test description',
        run: async () => {
          // Test implementation
          return { status: 'success', message: 'Test passed' };
        }
      }
    ]
  }
];
```

### Event Handler

```javascript
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
  
  setEvents(prev => [event, ...prev.slice(0, 99)]);
  setEventCount(prev => prev + 1);
};
```

### SDK Integration

```javascript
const { embed, isReady, error } = useSigmaEmbed({
  url: sdkConfig.url,
  onLoad: () => {
    addEvent('SDK Loaded', 'success', 'Sigma Embed SDK loaded successfully');
  },
  onError: (err) => {
    addEvent('SDK Error', 'error', `Failed to load SDK: ${err.message}`);
  }
});
```

## Conclusion

The Sigma SDK Testing Suite provides comprehensive testing capabilities for validating your Sigma integration. By following this guide and implementing the recommended practices, you can ensure robust and reliable Sigma SDK functionality in your application.

For additional support, refer to:
- [Sigma Embed-SDK Documentation](https://github.com/sigmacomputing/embed-sdk)
- [Sigma Computing Platform](https://www.sigmacomputing.com/)
- [React Embed SDK](https://github.com/sigmacomputing/embed-sdk/tree/main/packages/react-embed-sdk) 