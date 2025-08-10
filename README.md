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
│ • Real-time UI  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🎯 **Sigma Playground Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                GrowthMarketer AI App                      │
├─────────────────────────────────────────────────────────────┤
│  SigmaPlaygroundPage  │  SigmaWorkbookEmbed             │
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

### **Sigma Development Playground Features** 🆕
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

### 🎮 **Sigma Development Playground Setup**
```bash
# The playground is automatically available when Sigma SDK packages are installed
# Verify Sigma SDK installation
npm list @sigmacomputing/embed-sdk @sigmacomputing/react-embed-sdk

# Access playground features
# Navigate to /sigma/playground in your browser
```

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

### **Sigma Playground Performance** 🆕
- **Real-time Event Processing**: <100ms event handling latency
- **Workbook Loading**: Optimized iframe performance
- **Variable Synchronization**: Sub-second state updates
- **Cross-browser Compatibility**: Tested on Chrome, Firefox, Safari, Edge

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
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
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

### **Sigma Playground Testing** 🆕
```bash
# Test Sigma SDK integration
cd client
npm run build  # Verify no compilation errors

# Test playground functionality
# Navigate to /sigma/playground and test workbook embedding
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

# Sigma Playground (optional)
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
- Cloud warehouse integration
- Real-time collaboration features
- Advanced AI workflows
- Enterprise deployment support

### **Phase 4** 📋 Planned
- Multi-tenant architecture
- Advanced security features
- Performance optimization
- Global deployment
- **Enhanced Sigma Playground**: Advanced collaboration features, enterprise tools

---

## 🎮 **Sigma Development Playground Highlights** 🆕

The **Sigma Development Playground** represents a significant advancement in Sigma application development:

### **Key Capabilities**
- **True Platform Compatibility**: Official Sigma SDK integration instead of mock implementations
- **Real-time Development**: Live Sigma platform communication during development
- **Professional Tools**: Industry-standard Sigma development environment
- **Production Ready**: Build applications directly importable into Sigma's platform

### **Developer Benefits**
- **Faster Development**: Eliminate Sigma integration issues with official SDK
- **Real-time Testing**: Test Sigma compatibility before production deployment
- **Best Practices**: Learn and implement proper Sigma development patterns
- **Future-Proof**: Automatic updates with Sigma platform changes

### **Getting Started with the Playground**
1. **Access**: Navigate to `/sigma/playground` in your browser
2. **Load Sample**: Start with pre-configured workbook examples
3. **Configure**: Customize display and behavior options
4. **Monitor**: Watch real-time event logging and variable changes
5. **Export**: Download configurations and event logs for analysis

For comprehensive playground documentation, see `SIGMA_DEVELOPMENT_PLAYGROUND.md`.

---

*Built with ❤️ by the GrowthMarketer AI Team*

