# Sigma Framework Integration

This document describes the Sigma-compatible framework integration for the GrowthMarketer AI application.

## Overview

The Sigma Framework provides a comprehensive integration layer that enables the application to work seamlessly with Sigma's data platform while maintaining backward compatibility with standalone operation.

## Architecture

### Core Components

1. **Sigma Compatibility Layer** (`server/sigma/`)
   - Input Tables Management
   - Layout Elements System
   - Actions Framework
   - Execution Engine

2. **Database Abstraction Layer** (`server/database/`)
   - SQLite Adapter (standalone mode)
   - Mock Warehouse Adapter (testing mode)
   - Sigma Warehouse Adapter (production mode)

3. **Integration Module** (`server/sigma_integration.py`)
   - Flask app integration
   - Route registration
   - Configuration management

### Configuration Modes

The framework supports three distinct modes:

#### 1. Standalone Mode (`SIGMA_MODE=standalone`)
- Default mode for development and testing
- Uses local SQLite database
- Sigma features disabled
- Full backward compatibility

#### 2. Mock Warehouse Mode (`SIGMA_MODE=mock_warehouse`)
- Testing mode with mock data warehouse
- Sigma features enabled for testing
- Simulates real warehouse behavior
- No external dependencies

#### 3. Sigma Mode (`SIGMA_MODE=sigma`)
- Production mode with real Sigma integration
- Connects to actual data warehouse
- Full Sigma platform capabilities
- Requires warehouse credentials

## Quick Start

### 1. Environment Configuration

Set the appropriate environment variables:

```bash
# Standalone mode (default)
export SIGMA_MODE=standalone
export DATABASE_MODE=sqlite

# Mock warehouse mode (testing)
export SIGMA_MODE=mock_warehouse
export DATABASE_MODE=mock_warehouse

# Sigma mode (production)
export SIGMA_MODE=sigma
export DATABASE_MODE=real_warehouse
export SNOWFLAKE_ACCOUNT=your_account
export SNOWFLAKE_USER=your_user
export SNOWFLAKE_PASSWORD=your_password
export SNOWFLAKE_WAREHOUSE=your_warehouse
export SNOWFLAKE_DATABASE=your_database
export SNOWFLAKE_SCHEMA=your_schema
```

### 2. Running the Application

```bash
# Development mode (standalone)
python run.py

# Mock warehouse mode
SIGMA_MODE=mock_warehouse python run.py

# Sigma mode
SIGMA_MODE=sigma python run.py
```

### 3. Testing the Framework

```bash
# Run comprehensive tests
python test_sigma_complete.py

# Run demo
python sigma_demo.py
```

## API Endpoints

### Sigma Framework Status

```http
GET /api/sigma/status
```

Returns the current Sigma framework status and configuration.

### Sigma Capabilities

```http
GET /api/sigma/capabilities
```

Returns available Sigma framework capabilities.

### Database Health

```http
GET /api/database/health
```

Returns database adapter health status.

### Input Tables Management

```http
GET /api/sigma/input-tables
POST /api/sigma/input-tables
```

Manage Sigma input tables.

### Layout Elements Management

```http
GET /api/sigma/layout-elements
POST /api/sigma/layout-elements
```

Manage Sigma layout elements (containers, modals, tabs, forms, charts).

### Actions Management

```http
GET /api/sigma/actions
POST /api/sigma/actions
POST /api/sigma/actions/{action_id}/execute
```

Manage and execute Sigma actions.

## Features

### Input Tables

- **Table Creation**: Define table schemas with validation rules
- **Data Validation**: Built-in validation for common data types
- **Governance**: Data governance and metadata management
- **Multiple Sources**: Support for CSV, API, database, and empty tables

### Layout Elements

- **Containers**: Responsive grid-based containers
- **Modals**: Dynamic modal dialogs
- **Tabs**: Tabbed interface components
- **Forms**: Data input forms with validation
- **Charts**: Data visualization components

### Actions Framework

- **Navigation Actions**: Route navigation and page transitions
- **Data Operations**: CRUD operations on data sources
- **UI Interactions**: User interface state management
- **API Calls**: External service integration
- **Custom Actions**: User-defined action types

### Database Adapters

- **SQLite**: Local development and testing
- **Mock Warehouse**: Testing with simulated data
- **Real Warehouse**: Production Sigma integration

## Configuration

### Development Configuration

```python
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SIGMA_MODE = 'standalone'
    DATABASE_MODE = 'sqlite'
```

### Mock Warehouse Configuration

```python
class MockWarehouseConfig(Config):
    DEBUG = True
    SIGMA_MODE = 'mock_warehouse'
    DATABASE_MODE = 'mock_warehouse'
    MOCK_WAREHOUSE_CONFIG = {
        'enabled': True,
        'data_path': 'server/mock_warehouse/data',
        'schema_path': 'server/mock_warehouse/schemas',
        'auto_sync': True
    }
```

### Sigma Configuration

```python
class SigmaConfig(Config):
    DEBUG = False
    SIGMA_MODE = 'sigma'
    DATABASE_MODE = 'real_warehouse'
    SIGMA_INTEGRATION_CONFIG = {
        'enabled': True,
        'warehouse_type': 'snowflake',
        'warehouse_config': {
            'account': os.environ.get('SNOWFLAKE_ACCOUNT'),
            'user': os.environ.get('SNOWFLAKE_USER'),
            'password': os.environ.get('SNOWFLAKE_PASSWORD'),
            'warehouse': os.environ.get('SNOWFLAKE_WAREHOUSE'),
            'database': os.environ.get('SNOWFLAKE_DATABASE'),
            'schema': os.environ.get('SNOWFLAKE_SCHEMA')
        }
    }
```

## Data Models

### Sigma Input Tables Schema

```json
{
  "sigma_input_tables": {
    "columns": [
      {"name": "id", "type": "VARCHAR", "length": 36, "primary_key": true},
      {"name": "type", "type": "VARCHAR", "length": 50},
      {"name": "columns", "type": "JSON"},
      {"name": "validation_rules", "type": "JSON"},
      {"name": "governance_config", "type": "JSON"},
      {"name": "metadata", "type": "JSON"},
      {"name": "created_at", "type": "TIMESTAMP"},
      {"name": "updated_at", "type": "TIMESTAMP"},
      {"name": "status", "type": "VARCHAR", "length": 20}
    ]
  }
}
```

### Layout Elements Schema

```json
{
  "sigma_layout_elements": {
    "columns": [
      {"name": "id", "type": "VARCHAR", "length": 36, "primary_key": true},
      {"name": "type", "type": "VARCHAR", "length": 50},
      {"name": "config", "type": "JSON"},
      {"name": "parent_id", "type": "VARCHAR", "length": 36},
      {"name": "nesting_level", "type": "INTEGER"}
    ]
  }
}
```

## Testing

### Running Tests

```bash
# Run all tests
python test_sigma_complete.py

# Run specific test file
python test_sigma_framework.py
```

### Test Coverage

- Configuration loading and validation
- Sigma framework components
- Database adapters
- Flask integration
- Mock warehouse functionality
- API endpoints

## Development

### Adding New Features

1. **Extend the Sigma Layer**: Add new capabilities to the compatibility layer
2. **Update Database Adapters**: Implement new features in database adapters
3. **Add API Endpoints**: Register new routes in the integration module
4. **Update Tests**: Add comprehensive tests for new functionality

### Code Structure

```
server/
├── sigma/                    # Sigma compatibility layer
│   ├── __init__.py          # Main compatibility class
│   ├── input_tables.py      # Input tables management
│   ├── layout_elements.py   # Layout elements system
│   └── actions.py           # Actions framework
├── database/                 # Database abstraction layer
│   ├── __init__.py          # Abstract base classes
│   ├── sqlite_adapter.py    # SQLite implementation
│   ├── mock_warehouse.py    # Mock warehouse implementation
│   └── sigma_adapter.py     # Sigma warehouse implementation
├── sigma_integration.py      # Flask integration module
├── config.py                 # Configuration management
└── app/                      # Main Flask application
    └── __init__.py          # App factory with Sigma integration
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed and paths are correct
2. **Configuration Issues**: Verify environment variables and configuration files
3. **Database Connection**: Check database credentials and connection settings
4. **Sigma Integration**: Verify Sigma platform access and permissions

### Debug Mode

Enable debug mode for detailed logging:

```bash
export FLASK_DEBUG=1
export FLASK_ENV=development
```

### Logging

The framework provides comprehensive logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Performance Considerations

### Standalone Mode
- Fast startup and operation
- No external dependencies
- Suitable for development and testing

### Mock Warehouse Mode
- Simulated warehouse behavior
- Good for testing and validation
- Minimal performance impact

### Sigma Mode
- Real-time warehouse integration
- Network latency considerations
- Connection pooling and caching

## Security

### Data Validation
- Input validation for all user data
- SQL injection prevention
- XSS protection

### Authentication
- User authentication and authorization
- Role-based access control
- Secure credential management

### Data Governance
- Data lineage tracking
- Audit logging
- Compliance monitoring

## Future Enhancements

### Planned Features
- Real-time data synchronization
- Advanced analytics integration
- Machine learning capabilities
- Enhanced visualization components

### Roadmap
- Q1: Core framework stabilization
- Q2: Advanced analytics features
- Q3: Machine learning integration
- Q4: Enterprise features

## Support

### Documentation
- This README
- API documentation
- Code examples
- Troubleshooting guide

### Community
- GitHub issues
- Developer forums
- Code contributions
- Feature requests

## License

This framework is part of the GrowthMarketer AI application and follows the same licensing terms. 