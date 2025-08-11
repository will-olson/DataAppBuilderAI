"""
Sigma API Client Service
Handles authentication, token management, and API calls to Sigma
"""

import requests
import time
import logging
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from flask import current_app

logger = logging.getLogger(__name__)

@dataclass
class SigmaCredentials:
    client_id: str
    client_secret: str
    base_url: str
    cloud_provider: str

class SigmaAPIClient:
    """Robust Sigma API client with token management and error handling"""
    
    def __init__(self, credentials: SigmaCredentials):
        self.credentials = credentials
        self.access_token = None
        self.token_expiry = 0
        self.rate_limit_last_call = 0
        
        # Check if we should use mock mode
        self.mock_mode = (
            credentials.client_id == 'your_client_id_here' or 
            credentials.client_secret == 'your_client_secret_here' or
            credentials.client_id == 'test_client_id_for_mock_mode' or
            credentials.client_secret == 'test_client_secret_for_mock_mode' or
            not credentials.client_id or 
            not credentials.client_secret
        )
        
        if self.mock_mode:
            logger.info("Sigma API Client running in MOCK MODE for testing")
    
    def _get_auth_headers(self) -> Dict[str, str]:
        """Get authentication headers with automatic token refresh"""
        if self._is_token_expired():
            self._refresh_token()
        
        return {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    
    def _is_token_expired(self) -> bool:
        """Check if current token is expired (with 5-minute buffer)"""
        return time.time() >= (self.token_expiry - 300)
    
    def _refresh_token(self) -> None:
        """Refresh access token with rate limiting"""
        if self.mock_mode:
            # Mock token for testing
            self.access_token = "mock_token_for_testing_purposes"
            self.token_expiry = time.time() + 3600  # 1 hour
            self.rate_limit_last_call = time.time()
            logger.info("Mock Sigma API token generated for testing")
            return
        
        # Respect 1 req/sec rate limit for auth
        current_time = time.time()
        if current_time - self.rate_limit_last_call < 1:
            time.sleep(1 - (current_time - self.rate_limit_last_call))
        
        try:
            response = requests.post(
                f"{self.credentials.base_url}/v2/auth/token",
                json={
                    'client_id': self.credentials.client_id,
                    'client_secret': self.credentials.client_secret
                },
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            self.access_token = data['access_token']
            self.token_expiry = time.time() + data['expires_in']
            self.rate_limit_last_call = time.time()
            
            logger.info("Sigma API token refreshed successfully")
            
        except Exception as e:
            logger.error(f"Failed to refresh Sigma API token: {e}")
            raise
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make authenticated request with retry logic and error handling"""
        if self.mock_mode:
            return self._mock_request(method, endpoint, **kwargs)
        
        max_retries = 3
        base_delay = 1
        
        for attempt in range(max_retries):
            try:
                headers = self._get_auth_headers()
                headers.update(kwargs.get('headers', {}))
                
                response = requests.request(
                    method=method,
                    url=f"{self.credentials.base_url}{endpoint}",
                    headers=headers,
                    **{k: v for k, v in kwargs.items() if k != 'headers'}
                )
                
                if response.status_code == 401:
                    # Token might be invalid, try refreshing
                    self.access_token = None
                    self._refresh_token()
                    continue
                
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.RequestException as e:
                if attempt == max_retries - 1:
                    raise
                
                delay = base_delay * (2 ** attempt)  # Exponential backoff
                logger.warning(f"Sigma API request failed (attempt {attempt + 1}): {e}. Retrying in {delay}s...")
                time.sleep(delay)
        
        raise Exception("Max retries exceeded for Sigma API request")
    
    def _mock_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Mock API responses for testing purposes"""
        logger.info(f"Mock Sigma API request: {method} {endpoint}")
        
        # Mock responses based on endpoint
        if endpoint == '/v2/users/me':
            return {
                'id': 'mock-user-123',
                'email': 'test@example.com',
                'name': 'Mock Test User',
                'role': 'admin',
                'organization': 'Mock Organization'
            }
        
        elif endpoint.startswith('/v2/connections'):
            return {
                'data': [
                    {
                        'id': 'mock-conn-1',
                        'name': 'Mock Snowflake Connection',
                        'type': 'snowflake',
                        'status': 'active',
                        'created_at': '2024-01-01T00:00:00Z'
                    },
                    {
                        'id': 'mock-conn-2',
                        'name': 'Mock BigQuery Connection',
                        'type': 'bigquery',
                        'status': 'active',
                        'created_at': '2024-01-02T00:00:00Z'
                    }
                ],
                'total': 2,
                'page': 1,
                'size': 50,
                'pages': 1
            }
        
        elif endpoint.startswith('/v2/workbooks'):
            return {
                'data': [
                    {
                        'id': 'mock-wb-1',
                        'name': 'Mock Sales Dashboard',
                        'description': 'A comprehensive sales analytics dashboard',
                        'status': 'published',
                        'created_at': '2024-01-01T00:00:00Z',
                        'updated_at': '2024-01-15T00:00:00Z'
                    },
                    {
                        'id': 'mock-wb-2',
                        'name': 'Mock Marketing Analytics',
                        'description': 'Marketing performance and ROI analysis',
                        'status': 'published',
                        'created_at': '2024-01-05T00:00:00Z',
                        'updated_at': '2024-01-20T00:00:00Z'
                    }
                ],
                'total': 2,
                'page': 1,
                'size': 50,
                'pages': 1
            }
        
        elif endpoint.startswith('/v2/workspaces'):
            return {
                'data': [
                    {
                        'id': 'mock-ws-1',
                        'name': 'Sales Team Workspace',
                        'description': 'Workspace for sales analytics and reporting',
                        'created_at': '2024-01-01T00:00:00Z'
                    },
                    {
                        'id': 'mock-ws-2',
                        'name': 'Marketing Team Workspace',
                        'description': 'Workspace for marketing analytics and insights',
                        'created_at': '2024-01-05T00:00:00Z'
                    }
                ],
                'total': 2,
                'page': 1,
                'size': 50,
                'pages': 1
            }
        
        elif endpoint.startswith('/v2/datasets'):
            return {
                'data': [
                    {
                        'id': 'mock-ds-1',
                        'name': 'Sales Transactions',
                        'description': 'Historical sales transaction data',
                        'type': 'table',
                        'created_at': '2024-01-01T00:00:00Z'
                    },
                    {
                        'id': 'mock-ds-2',
                        'name': 'Customer Demographics',
                        'description': 'Customer profile and demographic information',
                        'type': 'table',
                        'created_at': '2024-01-02T00:00:00Z'
                    }
                ],
                'total': 2,
                'page': 1,
                'size': 50,
                'pages': 1
            }
        
        elif endpoint.startswith('/v2/teams'):
            return {
                'data': [
                    {
                        'id': 'mock-team-1',
                        'name': 'Sales Team',
                        'description': 'Sales analytics and reporting team',
                        'member_count': 8,
                        'created_at': '2024-01-01T00:00:00Z'
                    },
                    {
                        'id': 'mock-team-2',
                        'name': 'Marketing Team',
                        'description': 'Marketing analytics and insights team',
                        'member_count': 6,
                        'created_at': '2024-01-05T00:00:00Z'
                    }
                ],
                'total': 2,
                'page': 1,
                'size': 50,
                'pages': 1
            }
        
        elif endpoint.startswith('/v2/members'):
            return {
                'data': [
                    {
                        'id': 'mock-member-1',
                        'email': 'sales@example.com',
                        'name': 'Sales Manager',
                        'role': 'viewer',
                        'team_id': 'mock-team-1',
                        'created_at': '2024-01-01T00:00:00Z'
                    },
                    {
                        'id': 'mock-member-2',
                        'email': 'marketing@example.com',
                        'name': 'Marketing Manager',
                        'role': 'editor',
                        'team_id': 'mock-team-2',
                        'created_at': '2024-01-05T00:00:00Z'
                    }
                ],
                'total': 2,
                'page': 1,
                'size': 50,
                'pages': 1
            }
        
        elif endpoint.startswith('/v2/workbooks/') and endpoint.endswith('/export'):
            return {
                'export_id': 'mock-export-123',
                'status': 'completed',
                'download_url': 'https://example.com/mock-export.csv',
                'created_at': '2024-01-15T00:00:00Z',
                'format': 'csv'
            }
        
        # Default mock response
        return {
            'message': 'Mock response for testing',
            'endpoint': endpoint,
            'method': method,
            'timestamp': '2024-01-15T00:00:00Z'
        }
    
    # Core API Methods
    def get_current_user(self) -> Dict[str, Any]:
        """Get current user information"""
        return self._make_request('GET', '/v2/users/me')
    
    def list_connections(self, page: int = 1, size: int = 50) -> Dict[str, Any]:
        """List connections with pagination"""
        return self._make_request('GET', f'/v2/connections?page={page}&size={size}')
    
    def list_workbooks(self, page: int = 1, size: int = 50) -> Dict[str, Any]:
        """List workbooks with pagination"""
        return self._make_request('GET', f'/v2/workbooks?page={page}&size={size}')
    
    def export_workbook(self, workbook_id: str, export_format: str = 'csv', 
                       oauth_overrides: Optional[List[Dict]] = None,
                       reject_default_tokens: bool = False) -> Dict[str, Any]:
        """Export workbook data with OAuth override support"""
        headers = {}
        
        if oauth_overrides:
            headers['x-sigma-oauth-overrides'] = str(oauth_overrides)
            headers['x-sigma-oauth-reject-default-tokens'] = str(reject_default_tokens).lower()
        
        return self._make_request('POST', f'/v2/workbooks/{workbook_id}/export', 
                                json={'format': {'type': export_format}},
                                headers=headers)
    
    def get_workbook_details(self, workbook_id: str) -> Dict[str, Any]:
        """Get detailed workbook information"""
        return self._make_request('GET', f'/v2/workbooks/{workbook_id}')
    
    def list_workspaces(self, page: int = 1, size: int = 50) -> Dict[str, Any]:
        """List workspaces with pagination"""
        return self._make_request('GET', f'/v2/workspaces?page={page}&size={size}')
    
    def list_datasets(self, page: int = 1, size: int = 50) -> Dict[str, Any]:
        """List datasets with pagination"""
        return self._make_request('GET', f'/v2/datasets?page={page}&size={size}')
    
    def list_teams(self, page: int = 1, size: int = 50) -> Dict[str, Any]:
        """List teams with pagination"""
        return self._make_request('GET', f'/v2/teams?page={page}&size={size}')
    
    def list_members(self, page: int = 1, size: int = 50) -> Dict[str, Any]:
        """List organization members with pagination"""
        return self._make_request('GET', f'/v2/members?page={page}&size={size}') 