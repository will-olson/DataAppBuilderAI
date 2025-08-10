# 🚀 GrowthMarketer AI - Advanced Marketing Analytics Platform

## 📝 Overview
A sophisticated marketing intelligence platform that transforms raw user data into actionable, AI-powered strategic insights. Built with a modern React frontend and Flask backend, the platform provides comprehensive analytics, predictive modeling, and personalized engagement strategies. Features a flexible Sigma framework integration system that can operate in standalone, mock warehouse, or full Sigma integration modes, plus a **Sigma Development Playground** for building true Sigma-compatible data applications.

---

## ✨ Core Features

### 🔬 Comprehensive Analytics Modules

#### **User Journey Analytics**
- Stage-based user progression tracking
- Lifetime value (LTV) analysis
- User segment transition probabilities
- Engagement trajectory mapping

#### **Churn Prediction & Prevention**
- Dynamic risk segmentation
- Predictive churn factor identification
- AI-generated intervention strategies
- Real-time risk monitoring

#### **Personalization Engine**
- Content preference analysis
- Communication channel optimization
- Feature usage insights
- Tailored user experience recommendations

#### **Referral & Growth Intelligence**
- Referral source performance tracking
- Conversion rate analysis
- User acquisition channel insights
- Growth opportunity identification

#### **Revenue Forecasting**
- Quarterly revenue projections
- Probabilistic financial modeling
- Churn impact assessment
- Strategic growth recommendations

#### **Advanced Analytics**
- A/B Testing analysis and insights
- Feature usage tracking and optimization
- Strategic AI-powered insights generation
- Comprehensive data exploration tools

### 🤖 AI-Powered Insights Generation
Utilizing GPT-4 to:
- Analyze complex user data patterns
- Generate context-aware marketing strategies
- Provide actionable, personalized recommendations
- Create dynamic engagement approaches

### 🔧 Sigma Framework Integration
The platform includes a sophisticated Sigma framework integration system with three operational modes:

#### **Standalone Mode** (Default)
- Local SQLite database
- Full analytics functionality
- Sigma features gracefully disabled with informative messages
- Perfect for development and testing

#### **Mock Warehouse Mode**
- Simulated warehouse environment
- Sigma framework features enabled
- Input tables, layout elements, and actions available
- Ideal for testing Sigma integration

#### **Full Sigma Integration Mode**
- Real cloud data warehouse integration
- Live Sigma framework features
- Production-ready enterprise deployment
- Supports Snowflake, BigQuery, and Databricks

### 🎮 **Sigma Development Playground** 🆕
A comprehensive development environment for building true Sigma-compatible data applications:

#### **True Platform Compatibility**
- **Official Sigma SDK Integration**: Uses `@sigmacomputing/react-embed-sdk` v0.7.0
- **Real-time Communication**: Live postMessage communication with Sigma workbooks
- **Platform Integration**: Build applications directly importable into Sigma's platform

#### **Professional Development Tools**
- **Workbook Management**: Dynamic loading, configuration control, real-time updates
- **Interactive Controls**: Display options, height customization, responsive layout
- **Event System**: Real-time monitoring of all Sigma workbook events
- **Variable Management**: Dynamic variables, updates, and state synchronization

#### **Development Experience**
- **Real-time Preview**: See changes and interactions immediately during development
- **Event Debugger**: Comprehensive event logging and export capabilities
- **Sample Library**: Pre-configured workbook examples for quick testing
- **Performance Monitoring**: Track iframe performance and optimization

### 🏗 **Sigma Data Apps Builder** 🆕
A comprehensive development environment for building enterprise-grade Sigma data applications:

#### **Visual Development Interface**
- **Input Table Builder**: Define data schemas, validation rules, and permissions
- **Layout Element Designer**: Create responsive UI components and grid systems
- **Workflow Engine**: Build complex data processing pipelines and automation
- **AI Feature Integration**: Leverage GPT-4 for intelligent data app features

#### **Code-First Development**
- **Configuration Export**: Generate clean JSON configurations for version control
- **Import/Export System**: Share and reuse data app configurations across teams
- **Validation Engine**: Built-in validation for Sigma compatibility
- **Testing Framework**: Comprehensive testing tools for data app functionality

---

## 🛠 Technical Architecture

### 💻 Technology Stack

#### **Frontend**
- **Framework**: React 18 with React Router v6
- **UI Library**: Material-UI (MUI) v6 with custom theming
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and context
- **Build Tool**: Create React App with ESLint
- **Sigma Integration**: Official Sigma React SDK v0.7.0 + Embed SDK v0.7.0

#### **Backend**
- **Framework**: Flask with Flask-SQLAlchemy
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL support
- **Migrations**: Flask-Migrate for database schema management
- **API**: RESTful API with CORS support
- **AI Integration**: OpenAI GPT-4 API

#### **Data Processing**
- **Python Libraries**: Pandas, NumPy for data manipulation
- **Data Generation**: Faker for synthetic user data
- **Real-time Processing**: Event-driven architecture

### 🔄 Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   Flask Backend │    │   Data Sources  │
│                 │    │                 │    │                 │
│ • Dashboard     │◄──►│ • REST API      │◄──►│ • SQLite DB     │
│ • Analytics     │    │ • Sigma Int.    │    │ • Mock Warehouse│
│ • Sigma Pages   │    │ • AI Engine     │    │ • Cloud Warehouse│
│ • Sigma Playground│  │ • Data Process. │    │ • External APIs │
│ • Data Apps Builder│ │                 │    │                 │
│ • Real-time UI  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🎯 **Sigma Development Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                GrowthMarketer AI App                      │
├─────────────────────────────────────────────────────────────┤
│  SigmaPlaygroundPage  │  SigmaDataAppsBuilderPage       │
├─────────────────────────────────────────────────────────────┤
│              Sigma React SDK Hooks                        │
├─────────────────────────────────────────────────────────────┤
│              PostMessage Communication                     │
├─────────────────────────────────────────────────────────────┤
│                    Sigma Platform                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Analytics Capabilities

### **Core Analytics**
- Machine learning-inspired segmentation
- Probabilistic modeling and forecasting
- Real-time data processing and visualization
- Flexible, extensible design architecture

### **Sigma Framework Features**
When enabled, the platform provides:
- **Input Tables**: Live data collection and modification
- **Layout Elements**: Responsive grid system and UI components
- **Actions Framework**: 15+ action types for workflow automation
- **Data Governance**: Configurable validation and permissions
- **Real-time Sync**: Live data synchronization capabilities

### **Sigma Development Tools** 🆕
- **Workbook Embedding**: Seamless Sigma workbook integration
- **Event System**: Real-time event monitoring and handling
- **Variable Management**: Dynamic variable synchronization
- **Development Tools**: Event debugger, performance monitor, export utilities
- **Template System**: Sample workbooks and configuration templates

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Python**: 3.8+ with virtual environment
- **Node.js**: 16+ for React frontend
- **OpenAI API Key**: For AI-powered insights
- **Database**: SQLite (default) or PostgreSQL
- **Sigma Account**: For Sigma Development Playground features

### 🔧 Quick Setup

#### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd GrowthMarketerAI

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 2. Backend Setup
```bash
cd server

# Install Python dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your OpenAI API key and other settings

# Initialize database
python run.py create-users

# Start the server
python run.py
```

#### 3. Frontend Setup
```bash
cd client

# Install Node.js dependencies
npm install

# Start development server
npm start
```

#### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5555/api
- **Sigma Status**: http://localhost:5555/api/sigma/status
- **Sigma Playground**: http://localhost:3000/sigma/playground
- **Data Apps Builder**: http://localhost:3000/sigma/data-apps-builder

### 🔄 Sigma Mode Configuration

#### **Standalone Mode** (Default)
```bash
export SIGMA_MODE=standalone
python run.py
```

#### **Mock Warehouse Mode**
```bash
export SIGMA_MODE=mock_warehouse
python run.py
```

#### **Full Sigma Integration**
```bash
export SIGMA_MODE=sigma
export WAREHOUSE_TYPE=snowflake
export SNOWFLAKE_ACCOUNT=your_account
export SNOWFLAKE_USER=your_user
export SNOWFLAKE_PASSWORD=your_password
export SNOWFLAKE_WAREHOUSE=your_warehouse
export SNOWFLAKE_DATABASE=your_database
export SNOWFLAKE_SCHEMA=your_schema
python run.py
```

### 🎮 **Sigma Development Tools Setup**
```bash
# The playground and data apps builder are automatically available when Sigma SDK packages are installed
# Verify Sigma SDK installation
npm list @sigmacomputing/embed-sdk @sigmacomputing/react-embed-sdk

# Access development tools
# Navigate to /sigma/playground for workbook testing
# Navigate to /sigma/data-apps-builder for building data applications
```

---

## 🎯 **Sigma Development Workflow for Developers & Data Engineers**

### **Why Use This Platform Instead of Sigma's Built-in Tools?**

#### **1. Code-First Development**
- **Version Control**: All configurations are exportable JSON that can be committed to Git
- **IDE Integration**: Develop in your preferred editor (VS Code, PyCharm, etc.) with full syntax highlighting
- **Code Review**: Review data app changes through pull requests and code reviews
- **CI/CD Integration**: Automate testing and deployment of Sigma applications

#### **2. Faster Iteration Cycles**
- **Real-time Preview**: See changes immediately without switching between Sigma and your development environment
- **Event Debugging**: Comprehensive logging of all Sigma workbook interactions for faster troubleshooting
- **Template System**: Reuse common patterns and configurations across multiple projects
- **Validation**: Built-in validation ensures Sigma compatibility before deployment

#### **3. Team Collaboration**
- **Shared Configurations**: Export and share data app configurations with team members
- **Standardization**: Enforce consistent patterns and best practices across your organization
- **Documentation**: Generate comprehensive documentation from your configurations
- **Testing**: Automated testing ensures quality and consistency

### **Practical Development Scenarios**

#### **Scenario 1: Building a Marketing Dashboard**
```bash
# 1. Start with the Data Apps Builder
# Navigate to /sigma/data-apps-builder

# 2. Define Input Tables
- Create "Marketing_Campaigns" table with campaign metrics
- Create "User_Interactions" table with engagement data
- Create "Revenue_Data" table with financial metrics

# 3. Design Layout Elements
- Create responsive grid layout for different screen sizes
- Add chart containers for various visualization types
- Configure navigation and filtering components

# 4. Build Workflows
- Set up data refresh automation
- Configure alert triggers for KPI thresholds
- Create data transformation pipelines

# 5. Export Configuration
- Generate JSON configuration file
- Commit to Git repository
- Share with team for review
```

#### **Scenario 2: Testing Sigma Integration**
```bash
# 1. Use the Sigma Playground
# Navigate to /sigma/playground

# 2. Load Your Workbook
- Enter your Sigma workbook URL
- Configure display options and controls
- Test real-time interactions

# 3. Monitor Events
- Watch real-time event logging
- Test variable changes and updates
- Validate workbook performance

# 4. Debug Issues
- Export event logs for analysis
- Identify performance bottlenecks
- Validate Sigma compatibility
```

#### **Scenario 3: Enterprise Data Application Development**
```bash
# 1. Set up Development Environment
export SIGMA_MODE=mock_warehouse
python run.py

# 2. Build in Data Apps Builder
- Create complex input table schemas
- Design enterprise-grade layouts
- Configure advanced workflows
- Integrate AI-powered features

# 3. Test and Validate
- Use playground for real-time testing
- Validate all Sigma compatibility
- Performance test with large datasets
- Security and permission testing

# 4. Deploy to Production
- Export final configuration
- Deploy to production Sigma environment
- Monitor performance and usage
- Iterate based on user feedback
```

### **Key Benefits for Different Roles**

#### **Data Engineers**
- **Schema Management**: Define and version control data schemas
- **Data Quality**: Built-in validation and testing frameworks
- **Pipeline Automation**: Create complex data processing workflows
- **Performance Optimization**: Test and optimize before production deployment

#### **Analytics Developers**
- **Rapid Prototyping**: Build and test dashboards quickly
- **Component Reuse**: Create reusable visualization components
- **Interactive Features**: Build advanced user interactions
- **Real-time Updates**: Test live data integration

#### **DevOps Engineers**
- **Infrastructure as Code**: Version control all configurations
- **Automated Testing**: CI/CD integration for Sigma applications
- **Environment Management**: Consistent deployments across environments
- **Monitoring**: Built-in performance and error monitoring

---

## 📈 Performance Metrics

### **Current Statistics**
- **Total Users**: 31,000+ synthetic users
- **Data Points per User**: 40+ comprehensive metrics
- **Insight Generation**: Real-time AI-powered analysis
- **AI Model**: GPT-4 with continuous improvement
- **Response Time**: <500ms for most API calls

### **Scalability Features**
- **Database**: Support for SQLite, PostgreSQL, and cloud warehouses
- **Caching**: Intelligent data caching and optimization
- **Async Processing**: Background task processing for heavy operations
- **API Rate Limiting**: Configurable request throttling

### **Sigma Development Performance** 🆕
- **Real-time Event Processing**: <100ms event handling latency
- **Workbook Loading**: Optimized iframe performance
- **Variable Synchronization**: Sub-second state updates
- **Cross-browser Compatibility**: Tested on Chrome, Firefox, Safari, Edge
- **Configuration Generation**: <2s for complex data app configurations
- **Validation Speed**: <1s for comprehensive Sigma compatibility checks

---

## 🏗 Project Structure

```
GrowthMarketerAI/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── pages/        # Page components
│   │   │   ├── common/       # Shared components
│   │   │   ├── segments/     # Analytics components
│   │   │   └── sigma/        # Sigma integration components 🆕
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API services
│   └── utils/                # Utility functions
├── server/                    # Flask backend
│   ├── app/                  # Flask application
│   ├── database/             # Database models and migrations
│   ├── sigma/                # Sigma framework integration
│   ├── config.py             # Configuration management
│   ├── run.py                # Server entry point
│   └── requirements.txt      # Python dependencies
├── docs/                     # Documentation
├── SIGMA_DEVELOPMENT_PLAYGROUND.md # Sigma playground guide 🆕
└── README.md                 # This file
```

---

## 🔧 Development

### **Available Scripts**

#### **Backend Commands**
```bash
# Create sample users
python run.py create-users

# List all users
python run.py list-users

# Toggle Sigma mode
python run.py toggle-sigma

# Check Sigma status
python run.py sigma-status
```

#### **Frontend Commands**
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### **API Endpoints**

#### **Core Analytics**
- `GET /api/segments` - User segmentation data
- `GET /api/user-journey` - User journey analytics
- `GET /api/churn-prediction` - Churn prediction insights
- `GET /api/referral-insights` - Referral performance data
- `GET /api/revenue-forecast` - Revenue forecasting
- `GET /api/ai-insights` - AI-generated strategic insights

#### **Sigma Framework**
- `GET /api/sigma/status` - Sigma framework status
- `GET /api/sigma/config` - Sigma configuration
- `GET /api/sigma/capabilities` - Available features
- `GET /api/sigma/input-tables` - Input tables data
- `GET /api/sigma/layout-elements` - Layout elements
- `GET /api/sigma/actions` - Actions framework

#### **System**
- `GET /api/health` - System health check
- `GET /api/raw-user-data` - Raw user data export
- `POST /api/sigma/toggle-mode` - Toggle Sigma mode

---

## 🧪 Testing

### **Backend Testing**
```bash
cd server
python -m pytest tests/
```

### **Frontend Testing**
```bash
cd client
npm test
```

### **Integration Testing**
```bash
# Start backend
cd server && python run.py

# In another terminal, test API endpoints
curl http://localhost:5555/api/health
curl http://localhost:5555/api/sigma/status
```

### **Sigma Development Testing** 🆕
```bash
# Test Sigma SDK integration
cd client
npm run build  # Verify no compilation errors

# Test playground functionality
# Navigate to /sigma/playground and test workbook embedding

# Test data apps builder
# Navigate to /sigma/data-apps-builder and create sample applications
```

---

## 🚀 Deployment

### **Development**
- Local development with hot reloading
- SQLite database for simplicity
- Mock data generation for testing
- Sigma Development Playground for local Sigma development

### **Production**
- Containerized deployment with Docker
- Cloud data warehouse integration
- Auto-scaling and load balancing
- Comprehensive monitoring and logging
- Sigma platform integration ready

### **Environment Variables**
```bash
# Required
OPENAI_API_KEY=your_openai_api_key
FLASK_ENV=production

# Optional
SIGMA_MODE=sigma
WAREHOUSE_TYPE=snowflake
DATABASE_URL=postgresql://user:pass@host:port/db

# Sigma Development (optional)
SIGMA_PLAYGROUND_ENABLED=true
SIGMA_SDK_VERSION=0.7.0
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write comprehensive tests for new features
- Update documentation for API changes
- Test Sigma playground functionality when making Sigma-related changes

---

## 📚 Documentation

- **API Documentation**: Available at `/api/health` endpoint
- **Sigma Framework**: See `SIGMA_FRAMEWORK_README.md`
- **Sigma Development Playground**: See `SIGMA_DEVELOPMENT_PLAYGROUND.md` 🆕
- **Product Requirements**: See `PRODUCT_REQUIREMENTS_DOCUMENT.md`
- **Status Updates**: See `SIGMA_STATUS_UPDATE_SUMMARY.md`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Issues**: Report bugs and feature requests via GitHub Issues
- **Documentation**: Check the docs folder for detailed guides
- **Community**: Join our discussions and contribute to improvements
- **Sigma Playground**: For Sigma development questions, see the playground documentation

---

## 🔮 Roadmap

### **Phase 1** ✅ Complete
- Core analytics platform
- React frontend with Material-UI
- Flask backend with SQLAlchemy
- Basic AI integration

### **Phase 2** ✅ Complete
- Sigma framework integration
- Mock warehouse support
- Advanced analytics modules
- Comprehensive error handling

### **Phase 3** 🚧 In Progress
- **Sigma Development Playground** ✅ **NEW: Complete**
- **Sigma Data Apps Builder** ✅ **NEW: Complete**
- Cloud warehouse integration
- Real-time collaboration features
- Advanced AI workflows
- Enterprise deployment support

### **Phase 4** 📋 Planned
- Multi-tenant architecture
- Advanced security features
- Performance optimization
- Global deployment
- **Enhanced Sigma Tools**: Advanced collaboration features, enterprise tools, AI-powered development assistance

---

## 🎮 **Sigma Development Tools Highlights** 🆕

The **Sigma Development Tools** represent a significant advancement in Sigma application development, providing developers and data engineers with professional-grade tools for building enterprise Sigma applications:

### **Key Capabilities**

#### **Sigma Development Playground**
- **True Platform Compatibility**: Official Sigma SDK integration instead of mock implementations
- **Real-time Development**: Live Sigma platform communication during development
- **Professional Tools**: Industry-standard Sigma development environment
- **Production Ready**: Build applications directly importable into Sigma's platform

#### **Sigma Data Apps Builder**
- **Visual Development Interface**: Build complex data applications without leaving your development environment
- **Code-First Approach**: Export clean, version-controllable configurations
- **Enterprise Features**: Advanced workflows, AI integration, and automation
- **Team Collaboration**: Share configurations, enforce standards, and maintain consistency

### **Developer Benefits**

#### **Faster Development**
- **Eliminate Context Switching**: Build Sigma applications in your preferred development environment
- **Real-time Testing**: Test Sigma compatibility before production deployment
- **Rapid Prototyping**: Build and iterate on data applications quickly
- **Best Practices**: Learn and implement proper Sigma development patterns

#### **Professional Workflow**
- **Version Control**: Git integration for all Sigma configurations
- **Code Review**: Review data app changes through standard development workflows
- **CI/CD Integration**: Automated testing and deployment of Sigma applications
- **Documentation**: Generate comprehensive documentation from configurations

#### **Enterprise Features**
- **Scalability**: Build applications that scale from development to production
- **Security**: Built-in permission and validation frameworks
- **Performance**: Test and optimize before deployment
- **Integration**: Seamless integration with existing development tools and workflows

### **Getting Started with Development Tools**

#### **1. Sigma Development Playground**
```bash
# Navigate to /sigma/playground
# Load your Sigma workbook URL
# Test real-time interactions and monitor events
# Export event logs for analysis and debugging
```

#### **2. Sigma Data Apps Builder**
```bash
# Navigate to /sigma/data-apps-builder
# Create input tables with schemas and validation
# Design layout elements and responsive grids
# Build workflows and automation
# Export configurations for version control
```

#### **3. Integration with Your Workflow**
```bash
# Export configurations to JSON files
# Commit to Git repository
# Use in CI/CD pipelines
# Deploy to production Sigma environments
```

### **Real-World Use Cases**

#### **Marketing Analytics Team**
- Build customer journey dashboards with real-time data
- Create automated reporting workflows
- Integrate AI-powered insights and recommendations
- Deploy consistent dashboards across multiple regions

#### **Data Engineering Team**
- Define and version control data schemas
- Create data quality validation workflows
- Build automated data processing pipelines
- Maintain consistency across development and production

#### **Business Intelligence Team**
- Rapidly prototype new dashboard concepts
- Test and validate Sigma compatibility
- Create reusable visualization components
- Deploy enterprise-grade analytics applications

For comprehensive development tool documentation, see `SIGMA_DEVELOPMENT_PLAYGROUND.md` and explore the interactive playground and data apps builder directly in the application.

---

*Built with ❤️ by the GrowthMarketer AI Team*

