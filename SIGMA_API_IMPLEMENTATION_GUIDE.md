# Sigma API Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [API Endpoints](#api-endpoints)
6. [Testing Guide](#testing-guide)
7. [Configuration](#configuration)
8. [Troubleshooting](#troubleshooting)
9. [Development Workflow](#development-workflow)

## Overview

This document provides a comprehensive guide to the robust Sigma API integration that has been implemented in the GrowthMarketer AI application. The integration provides programmatic access to Sigma's analytics platform with enterprise-grade features including:

- **Robust Authentication**: Automatic token refresh, rate limiting, and retry logic
- **OAuth Override Support**: Fine-grained access control with OAuth override tokens
- **Comprehensive Data Management**: Connections, workbooks, workspaces, datasets, teams, and members
- **Advanced Pagination**: Configurable page sizes with API limit compliance
- **Error Handling**: Exponential backoff, request ID tracking, and graceful degradation
- **Real-time Monitoring**: Live connection status and health checks
- **Responsive UI**: Modern, mobile-friendly interface for all operations

## Architecture

### Backend Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Flask Application                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Sigma API     │  │   Sigma API     │  │   Flask     │ │
│  │   Routes        │  │   Client        │  │   App       │ │
│  │   (Blueprint)   │  │   Service       │  │   Factory   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Configuration │  │   Error         │  │   Logging   │ │
│  │   Management    │  │   Handling      │  │   System    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Sigma API     │  │   Sigma API     │  │   API       │ │
│  │   Context       │  │   Dashboard     │  │   Client    │ │
│  │   (State Mgmt)  │  │   (Main UI)     │  │   Service   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Connection    │  │   OAuth         │  │   Manager   │ │
│  │   Manager       │  │   Manager       │  │   Components│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Backend Implementation

### Core Components

#### 1. Sigma API Client Service (`server/services/sigma_api_client.py`)
**Purpose**: Handles all Sigma API interactions with robust error handling and token management.

**Key Features**:
- **Token Management**: Automatic refresh with 5-minute buffer, rate limiting (1 req/sec)
- **Retry Logic**: Exponential backoff with 3 attempts maximum
- **Error Handling**: 401 response handling with automatic token refresh
- **Request Management**: Comprehensive HTTP method support with custom headers

**Methods Implemented**:
```python
# Authentication & User Management
get_current_user() -> Dict[str, Any]

# Data Management
list_connections(page: int, size: int) -> Dict[str, Any]
list_workbooks(page: int, size: int) -> Dict[str, Any]
list_workspaces(page: int, size: int) -> Dict[str, Any]
list_datasets(page: int, size: int) -> Dict[str, Any]
list_teams(page: int, size: int) -> Dict[str, Any]
list_members(page: int, size: int) -> Dict[str, Any]

# Workbook Operations
get_workbook_details(workbook_id: str) -> Dict[str, Any]
export_workbook(workbook_id: str, export_format: str, 
               oauth_overrides: Optional[List[Dict]], 
               reject_default_tokens: bool) -> Dict[str, Any]
```

#### 2. Sigma API Routes (`server/routes/sigma_api.py`)
**Purpose**: RESTful API endpoints for Sigma integration with comprehensive error handling.

**Endpoints Implemented**:
```python
# Status & Configuration
GET  /api/sigma/status          # Connection status
GET  /api/sigma/config          # Configuration info

# Data Endpoints
GET  /api/sigma/connections     # List connections
GET  /api/sigma/workbooks       # List workbooks
GET  /api/sigma/workspaces      # List workspaces
GET  /api/sigma/datasets        # List datasets
GET  /api/sigma/teams           # List teams
GET  /api/sigma/members         # List members

# Workbook Operations
GET  /api/sigma/workbooks/{id}  # Get workbook details
POST /api/sigma/workbooks/{id}/export  # Export workbook
```

#### 3. Configuration Management (`server/config.py`)
**Purpose**: Centralized configuration with environment variable support and cloud provider mapping.

**Configuration Options**:
```python
# Sigma API Configuration
SIGMA_API_ENABLED = os.environ.get('SIGMA_API_ENABLED', 'false').lower() == 'true'
SIGMA_API_CLIENT_ID = os.environ.get('SIGMA_API_CLIENT_ID')
SIGMA_API_CLIENT_SECRET = os.environ.get('SIGMA_API_CLIENT_SECRET')
SIGMA_API_BASE_URL = os.environ.get('SIGMA_API_BASE_URL')
SIGMA_API_CLOUD_PROVIDER = os.environ.get('SIGMA_API_CLOUD_PROVIDER', 'AWS-US (West)')

# Cloud Provider Mapping
SIGMA_API_URLS = {
    'AWS-US (West)': 'https://aws-api.sigmacomputing.com',
    'AWS-US (East)': 'https://api.us-a.aws.sigmacomputing.com',
    'AWS-CA': 'https://api.ca.aws.sigmacomputing.com',
    'AWS-EU': 'https://api.eu.aws.sigmacomputing.com',
    'AWS-UK': 'https://api.uk.aws.sigmacomputing.com',
    'AWS-AU': 'https://api.au.aws.sigmacomputing.com',
    'Azure-US': 'https://api.us.azure.sigmacomputing.com',
    'Azure-EU': 'https://api.eu.azure.sigmacomputing.com',
    'Azure-CA': 'https://api.ca.azure.sigmacomputing.com',
    'Azure-UK': 'https://api.uk.azure.sigmacomputing.com',
    'GCP': 'https://api.sigmacomputing.com'
}
```

## Frontend Implementation

### Core Components

#### 1. Sigma API Context (`client/src/context/SigmaAPIContext.js`)
**Purpose**: Centralized state management for Sigma API operations with React hooks.

**State Management**:
```javascript
const initialState = {
  // Connection status
  apiStatus: 'disconnected' | 'connected' | 'error' | 'disabled',
  connectionInfo: null,
  
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
    // ... other resources
  },
  
  // OAuth configuration
  oauthOverrides: [],
  rejectDefaultTokens: false
};
```

**Key Methods**:
```javascript
// Connection Management
checkAPIStatus() -> Promise<void>
fetchConnections(page, size) -> Promise<Object>
fetchWorkbooks(page, size) -> Promise<Object>
fetchWorkspaces(page, size) -> Promise<Object>
fetchDatasets(page, size) -> Promise<Object>

// OAuth Management
addOAuthOverride(connectionId, token) -> void
removeOAuthOverride(connectionId) -> void
clearOAuthOverrides() -> void
setRejectDefaultTokens(value) -> void

// Workbook Operations
exportWorkbook(workbookId, format, options) -> Promise<Object>
```

#### 2. Sigma API Dashboard (`client/src/components/SigmaAPI/SigmaAPIDashboard.js`)
**Purpose**: Main interface for Sigma API management with tabbed navigation.

**Features**:
- **Real-time Status**: Live connection monitoring with visual indicators
- **Tabbed Interface**: Connections, Workbooks, Workspaces, Datasets, OAuth
- **Responsive Design**: Mobile-friendly layout with adaptive components
- **Error Handling**: User-friendly error messages with retry options

#### 3. Connection Manager (`client/src/components/SigmaAPI/SigmaConnectionManager.js`)
**Purpose**: Comprehensive connection management with pagination and filtering.

**Features**:
- **Grid Layout**: Card-based connection display with hover effects
- **Pagination**: Configurable page sizes (25, 50, 100, 500, 1000)
- **Connection Cards**: Detailed information with action buttons
- **Status Indicators**: Visual status representation (active, inactive, unknown)

#### 4. OAuth Manager (`client/src/components/SigmaAPI/SigmaOAuthManager.js`)
**Purpose**: OAuth override token management for fine-grained access control.

**Features**:
- **Token Management**: Add, remove, and clear OAuth overrides
- **Configuration**: Toggle default token rejection
- **Security**: Password field for token input
- **Documentation**: Built-in help and use case explanations

#### 5. API Client Service (`client/src/services/api.js`)
**Purpose**: HTTP client for Sigma API endpoints with error handling.

**Methods**:
```javascript
// Sigma API Methods
getSigmaAPIStatus() -> Promise<Object>
getSigmaConnections(page, size) -> Promise<Object>
getSigmaWorkbooks(page, size) -> Promise<Object>
getSigmaWorkbook(workbookId) -> Promise<Object>
exportSigmaWorkbook(workbookId, exportData) -> Promise<Object>
getSigmaWorkspaces(page, size) -> Promise<Object>
getSigmaDatasets(page, size) -> Promise<Object>
getSigmaTeams(page, size) -> Promise<Object>
getSigmaMembers(page, size) -> Promise<Object>
getSigmaConfig() -> Promise<Object>
```

## API Endpoints

### Complete Endpoint Reference

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| `GET` | `/api/sigma/status` | Connection status | None | Status object |
| `GET` | `/api/sigma/config` | Configuration info | None | Config object |
| `GET` | `/api/sigma/connections` | List connections | `page`, `size` | Connections array |
| `GET` | `/api/sigma/workbooks` | List workbooks | `page`, `size` | Workbooks array |
| `GET` | `/api/sigma/workspaces` | List workspaces | `page`, `size` | Workspaces array |
| `GET` | `/api/sigma/datasets` | List datasets | `page`, `size` | Datasets array |
| `GET` | `/api/sigma/teams` | List teams | `page`, `size` | Teams array |
| `GET` | `/api/sigma/members` | List members | `page`, `size` | Members array |
| `GET` | `/api/sigma/workbooks/{id}` | Get workbook | `workbook_id` | Workbook object |
| `POST` | `/api/sigma/workbooks/{id}/export` | Export workbook | `workbook_id`, body | Export result |

### Response Formats

#### Connection Status Response
```json
{
  "status": "connected" | "disabled" | "error",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "base_url": "https://api.sigmacomputing.com",
  "cloud_provider": "AWS-US (West)"
}
```

#### Paginated Response
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "size": 50,
  "pages": 3
}
```

#### Error Response
```json
{
  "error": "Error message",
  "status": "error"
}
```

## Testing Guide

### Prerequisites

1. **Sigma Account**: Active Sigma account with Admin permissions
2. **API Credentials**: Client ID and secret from Sigma Developer Access
3. **Environment Setup**: Backend and frontend running locally

### Backend Testing

#### 1. Environment Configuration
```bash
# Set required environment variables
export SIGMA_API_ENABLED=true
export SIGMA_API_CLIENT_ID=your_client_id_here
export SIGMA_API_CLIENT_SECRET=your_client_secret_here
export SIGMA_API_CLOUD_PROVIDER="AWS-US (West)"

# Optional: Override base URL
export SIGMA_API_BASE_URL=https://your-custom-url.com
```

#### 2. Start Backend Server
```bash
cd server
python -m flask run --port=5555
```

#### 3. Test API Endpoints
```bash
# Test connection status
curl http://localhost:5555/api/sigma/status

# Test connections listing
curl "http://localhost:5555/api/sigma/connections?page=1&size=10"

# Test configuration
curl http://localhost:5555/api/sigma/config
```

#### 4. Verify Logs
Check backend logs for:
- Sigma API routes registration
- Token refresh operations
- API request/response logging
- Error handling and retries

### Frontend Testing

#### 1. Start Frontend Application
```bash
cd client
npm start
```

#### 2. Navigate to Demo Page
```
http://localhost:3000/sigma-api-demo
```

#### 3. Test Dashboard Components

**Connection Status Testing**:
1. Verify connection status indicator
2. Check cloud provider and base URL display
3. Test retry functionality for failed connections

**Connection Management Testing**:
1. Navigate to Connections tab
2. Test pagination controls
3. Verify connection card display
4. Test page size changes

**OAuth Management Testing**:
1. Navigate to OAuth Overrides tab
2. Add a test OAuth override
3. Toggle "Reject default tokens" option
4. Remove and clear overrides

**Pagination Testing**:
1. Test different page sizes (25, 50, 100, 500, 1000)
2. Verify page navigation (First, Previous, Next, Last)
3. Check pagination summary information

#### 4. Browser Developer Tools Testing

**Network Tab**:
- Monitor API requests to `/api/sigma/*` endpoints
- Verify request headers and authentication
- Check response status codes and data

**Console Tab**:
- Monitor API client logging
- Check for error messages
- Verify state updates

**Application Tab**:
- Check React component state
- Verify context provider functionality
- Monitor Redux-like state changes

### Integration Testing

#### 1. End-to-End Workflow
```bash
# 1. Configure backend
export SIGMA_API_ENABLED=true
export SIGMA_API_CLIENT_ID=your_id
export SIGMA_API_CLIENT_SECRET=your_secret

# 2. Restart backend
# 3. Start frontend
# 4. Navigate to demo page
# 5. Verify connection status
# 6. Test data fetching
# 7. Test OAuth overrides
# 8. Test pagination
```

#### 2. Error Scenario Testing
```bash
# Test invalid credentials
export SIGMA_API_CLIENT_ID=invalid_id
export SIGMA_API_CLIENT_SECRET=invalid_secret

# Test disabled API
export SIGMA_API_ENABLED=false

# Test network failures
# Disconnect network temporarily
```

#### 3. Performance Testing
```bash
# Test large datasets
# Use page size 1000 for connections
# Monitor response times
# Check memory usage
```

## Configuration

### Environment Variables

#### Required Variables
```bash
SIGMA_API_ENABLED=true
SIGMA_API_CLIENT_ID=your_client_id
SIGMA_API_CLIENT_SECRET=your_client_secret
```

#### Optional Variables
```bash
SIGMA_API_CLOUD_PROVIDER="AWS-US (West)"
SIGMA_API_BASE_URL=https://custom-url.com
```

### Cloud Provider Options

| Provider | Base URL | Use Case |
|----------|----------|----------|
| `AWS-US (West)` | `https://aws-api.sigmacomputing.com` | Default, US West Coast |
| `AWS-US (East)` | `https://api.us-a.aws.sigmacomputing.com` | US East Coast |
| `AWS-EU` | `https://api.eu.aws.sigmacomputing.com` | European Union |
| `AWS-UK` | `https://api.uk.aws.sigmacomputing.com` | United Kingdom |
| `Azure-US` | `https://api.us.azure.sigmacomputing.com` | Azure US |
| `GCP` | `https://api.sigmacomputing.com` | Google Cloud Platform |

### Configuration Validation

```python
# Backend validation
if not current_app.config.get('SIGMA_API_ENABLED'):
    return jsonify({'status': 'disabled', 'message': 'Sigma API not enabled'})

if not current_app.config.get('SIGMA_API_CLIENT_ID'):
    return jsonify({'status': 'error', 'message': 'Client ID not configured'})

if not current_app.config.get('SIGMA_API_CLIENT_SECRET'):
    return jsonify({'status': 'error', 'message': 'Client secret not configured'})
```

## Troubleshooting

### Common Issues

#### 1. Connection Failed
**Symptoms**: Status shows "error" or "disconnected"
**Solutions**:
- Verify environment variables are set correctly
- Check Sigma API credentials validity
- Verify cloud provider configuration
- Check network connectivity to Sigma API

#### 2. Authentication Errors
**Symptoms**: 401 responses, token refresh failures
**Solutions**:
- Verify client ID and secret are correct
- Check if credentials have expired
- Verify API permissions in Sigma
- Check rate limiting (1 req/sec for auth)

#### 3. Pagination Issues
**Symptoms**: Empty results, incorrect page counts
**Solutions**:
- Verify page size is within limits (1-1000)
- Check if data exists for requested page
- Verify pagination parameters are integers
- Check API response format

#### 4. OAuth Override Issues
**Symptoms**: Export failures, permission errors
**Solutions**:
- Verify connection IDs are correct
- Check OAuth token validity
- Verify token format and encoding
- Check "reject default tokens" setting

### Debug Mode

#### Backend Debug
```python
# Enable detailed logging
logging.basicConfig(level=logging.DEBUG)

# Add request/response logging
logger.debug(f"Request: {method} {endpoint}")
logger.debug(f"Response: {response.status_code} {response.text}")
```

#### Frontend Debug
```javascript
// Enable API client logging
console.log('API Request:', url, config);
console.log('API Response:', data);

// Enable context logging
console.log('Sigma API State:', state);
console.log('Sigma API Actions:', actions);
```

### Health Checks

#### Backend Health
```bash
curl http://localhost:5555/api/health
```

#### Sigma API Health
```bash
curl http://localhost:5555/api/sigma/status
```

## Development Workflow

### Adding New Endpoints

#### 1. Backend Implementation
```python
# Add method to SigmaAPIClient
def new_operation(self, param1: str, param2: int) -> Dict[str, Any]:
    return self._make_request('POST', '/v2/new-endpoint', 
                            json={'param1': param1, 'param2': param2})

# Add route to sigma_api.py
@sigma_api.route('/api/sigma/new-operation', methods=['POST'])
def new_operation():
    try:
        data = request.get_json()
        client = get_sigma_client()
        result = client.new_operation(data['param1'], data['param2'])
        return jsonify(result)
    except Exception as e:
        logger.error(f"Failed to perform new operation: {e}")
        return jsonify({'error': str(e)}), 500
```

#### 2. Frontend Implementation
```javascript
// Add to API client
async newOperation(param1, param2) {
    return this.request('/api/sigma/new-operation', {
        method: 'POST',
        body: JSON.stringify({ param1, param2 })
    });
}

// Add to context
const newOperation = useCallback(async (param1, param2) => {
    try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const result = await apiClient.newOperation(param1, param2);
        // Handle result
        return result;
    } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
    } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
    }
}, []);

// Add to context value
const value = {
    ...state,
    newOperation,
    // ... other methods
};
```

### Testing New Features

#### 1. Unit Testing
```python
# Test SigmaAPIClient methods
def test_new_operation():
    client = SigmaAPIClient(mock_credentials)
    result = client.new_operation("test", 123)
    assert result is not None
```

#### 2. Integration Testing
```bash
# Test new endpoint
curl -X POST http://localhost:5555/api/sigma/new-operation \
  -H "Content-Type: application/json" \
  -d '{"param1": "test", "param2": 123}'
```

#### 3. Frontend Testing
```javascript
// Test new operation in browser console
const result = await apiClient.newOperation("test", 123);
console.log('Result:', result);
```

## Conclusion

This Sigma API implementation provides a robust, production-ready foundation for integrating with Sigma's analytics platform. The architecture supports:

- **Scalability**: Efficient pagination and resource management
- **Reliability**: Comprehensive error handling and retry logic
- **Security**: OAuth override support and secure credential management
- **Maintainability**: Clean separation of concerns and comprehensive logging
- **User Experience**: Responsive, intuitive interface with real-time feedback

The implementation follows industry best practices and provides a solid foundation for building advanced Sigma integrations. All components are thoroughly tested and ready for production deployment.

For additional support or feature requests, refer to the Sigma API documentation and the implementation source code. 