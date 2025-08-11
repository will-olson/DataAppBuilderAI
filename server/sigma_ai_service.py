"""
Sigma AI Service

This service provides AI-powered assistance for building Sigma workbooks, dashboards, and data apps.
It leverages the predictive marketing AI insights and extends them to provide intelligent suggestions
for Sigma development workflows.
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import re
from dataclasses import dataclass, asdict
from enum import Enum

# Remove unnecessary imports - this service is standalone
# from predictive_marketing import (
#     generate_ai_insights,
#     analyze_marketing_data,
#     generate_recommendations,
#     predict_trends
# )

logger = logging.getLogger(__name__)

class SuggestionType(Enum):
    """Types of AI suggestions for Sigma workbooks"""
    VISUALIZATION = "visualization"
    INPUT_TABLE = "input_table"
    WORKFLOW = "workflow"
    LAYOUT = "layout"
    DATA_MODEL = "data_model"
    FILTER = "filter"
    ACTION = "action"
    NAVIGATION = "navigation"
    PERFORMANCE = "performance"
    BEST_PRACTICE = "best_practice"

class PriorityLevel(Enum):
    """Priority levels for AI suggestions"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

@dataclass
class SigmaComponent:
    """Represents a Sigma workbook component"""
    id: str
    name: str
    type: str
    description: str
    configuration: Dict[str, Any]
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

@dataclass
class AISuggestion:
    """Represents an AI-generated suggestion for Sigma development"""
    id: str
    type: SuggestionType
    title: str
    description: str
    items: List[str]
    priority: PriorityLevel
    implementation: str
    reasoning: str
    related_components: List[str]
    estimated_effort: str
    business_value: str
    created_at: datetime

@dataclass
class WorkbookTemplate:
    """Represents a Sigma workbook template"""
    id: str
    name: str
    description: str
    category: str
    components: List[SigmaComponent]
    configuration: Dict[str, Any]
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class SigmaAIService:
    """
    AI service for Sigma workbook development assistance
    """
    
    def __init__(self):
        self.suggestion_patterns = self._initialize_patterns()
        self.component_templates = self._initialize_component_templates()
        self.best_practices = self._initialize_best_practices()
        
    def _initialize_patterns(self) -> Dict[str, List[str]]:
        """Initialize pattern matching for different types of queries"""
        return {
            'dashboard': [
                'dashboard', 'visualization', 'chart', 'graph', 'metric', 'kpi',
                'performance', 'monitoring', 'tracking', 'overview'
            ],
            'input_table': [
                'input', 'table', 'form', 'data entry', 'collection', 'user input',
                'submission', 'entry', 'capture', 'gather'
            ],
            'workflow': [
                'workflow', 'action', 'automation', 'process', 'step', 'flow',
                'navigation', 'button', 'trigger', 'sequence'
            ],
            'layout': [
                'layout', 'design', 'arrangement', 'organization', 'structure',
                'container', 'section', 'group', 'arrange'
            ],
            'data_model': [
                'data model', 'schema', 'table structure', 'columns', 'fields',
                'relationships', 'joins', 'data types', 'validation'
            ],
            'filter': [
                'filter', 'parameter', 'variable', 'selection', 'criteria',
                'condition', 'constraint', 'limit', 'scope'
            ]
        }
    
    def _initialize_component_templates(self) -> Dict[str, Dict[str, Any]]:
        """Initialize reusable component templates"""
        return {
            'marketing_dashboard': {
                'name': 'Marketing Performance Dashboard',
                'description': 'Comprehensive dashboard for tracking marketing KPIs and performance metrics',
                'components': [
                    {
                        'type': 'visualization',
                        'name': 'Revenue Trend Chart',
                        'chart_type': 'line',
                        'data_source': 'marketing_revenue',
                        'metrics': ['revenue', 'growth_rate']
                    },
                    {
                        'type': 'visualization',
                        'name': 'Campaign Performance Table',
                        'chart_type': 'table',
                        'data_source': 'campaign_data',
                        'metrics': ['campaign_name', 'clicks', 'conversions', 'roas']
                    },
                    {
                        'type': 'input_table',
                        'name': 'Campaign Input Form',
                        'columns': ['campaign_name', 'budget', 'start_date', 'end_date', 'target_audience']
                    }
                ]
            },
            'data_collection_app': {
                'name': 'Data Collection Application',
                'description': 'Interactive app for collecting and managing user data',
                'components': [
                    {
                        'type': 'input_table',
                        'name': 'User Registration Form',
                        'columns': ['first_name', 'last_name', 'email', 'company', 'role', 'interests']
                    },
                    {
                        'type': 'workflow',
                        'name': 'Data Validation Workflow',
                        'steps': ['input_validation', 'duplicate_check', 'approval_process', 'data_export']
                    }
                ]
            },
            'analytics_report': {
                'name': 'Analytics Report',
                'description': 'Detailed analytical report with interactive elements',
                'components': [
                    {
                        'type': 'visualization',
                        'name': 'Multi-dimensional Analysis',
                        'chart_type': 'pivot_table',
                        'data_source': 'analytics_data',
                        'dimensions': ['date', 'region', 'product', 'channel']
                    },
                    {
                        'type': 'filter',
                        'name': 'Dynamic Filters',
                        'filters': ['date_range', 'region_selector', 'product_category', 'channel_type']
                    }
                ]
            }
        }
    
    def _initialize_best_practices(self) -> Dict[str, List[str]]:
        """Initialize Sigma development best practices"""
        return {
            'performance': [
                'Use data source filters to limit data processing',
                'Implement lazy loading for large datasets',
                'Use calculated columns sparingly',
                'Optimize table relationships and joins',
                'Implement proper indexing strategies'
            ],
            'usability': [
                'Design for mobile-first responsive layouts',
                'Use consistent color schemes and typography',
                'Implement intuitive navigation patterns',
                'Provide clear data labels and descriptions',
                'Use appropriate chart types for data visualization'
            ],
            'data_governance': [
                'Implement proper data validation rules',
                'Use consistent naming conventions',
                'Document data sources and transformations',
                'Implement access control and permissions',
                'Maintain data lineage and audit trails'
            ],
            'maintenance': [
                'Use modular component design',
                'Implement version control for configurations',
                'Regular performance monitoring and optimization',
                'Document workbook structure and dependencies',
                'Plan for scalability and future enhancements'
            ]
        }
    
    async def generate_workbook_suggestions(
        self, 
        query: str, 
        context: Dict[str, Any] = None,
        user_experience: str = 'intermediate',
        project_type: str = 'dashboard'
    ) -> List[AISuggestion]:
        """
        Generate AI-powered suggestions for Sigma workbook development
        
        Args:
            query: User's question or request
            context: Additional context about the project
            user_experience: User's experience level (beginner, intermediate, advanced)
            project_type: Type of project being built
            
        Returns:
            List of AI suggestions
        """
        try:
            suggestions = []
            query_lower = query.lower()
            
            # Analyze query patterns to determine suggestion types
            detected_types = self._detect_query_types(query_lower)
            
            # Generate suggestions based on detected types
            for suggestion_type in detected_types:
                type_suggestions = await self._generate_type_specific_suggestions(
                    suggestion_type, query, context, user_experience, project_type
                )
                suggestions.extend(type_suggestions)
            
            # Add general best practices if no specific suggestions
            if not suggestions:
                suggestions.extend(await self._generate_best_practice_suggestions(
                    query, context, user_experience, project_type
                ))
            
            # Add performance and optimization suggestions
            if any(word in query_lower for word in ['performance', 'optimization', 'speed', 'efficiency']):
                suggestions.extend(await self._generate_performance_suggestions(context))
            
            # Sort suggestions by priority and relevance
            suggestions = self._rank_suggestions(suggestions, query, context)
            
            return suggestions[:10]  # Limit to top 10 suggestions
            
        except Exception as e:
            logger.error(f"Error generating workbook suggestions: {str(e)}")
            return [self._create_error_suggestion(str(e))]
    
    def _detect_query_types(self, query: str) -> List[SuggestionType]:
        """Detect which types of suggestions are relevant based on the query"""
        detected_types = []
        
        # Map pattern keys to SuggestionType enum values
        pattern_to_type = {
            'dashboard': SuggestionType.VISUALIZATION,
            'input_table': SuggestionType.INPUT_TABLE,
            'workflow': SuggestionType.WORKFLOW,
            'layout': SuggestionType.LAYOUT,
            'data_model': SuggestionType.DATA_MODEL,
            'filter': SuggestionType.FILTER
        }
        
        for suggestion_type, patterns in self.suggestion_patterns.items():
            if any(pattern in query.lower() for pattern in patterns):
                if suggestion_type in pattern_to_type:
                    detected_types.append(pattern_to_type[suggestion_type])
        
        # Always add best practice suggestions
        detected_types.append(SuggestionType.BEST_PRACTICE)
        
        return detected_types
    
    async def _generate_type_specific_suggestions(
        self, 
        suggestion_type: SuggestionType, 
        query: str, 
        context: Dict[str, Any],
        user_experience: str,
        project_type: str
    ) -> List[AISuggestion]:
        """Generate suggestions for a specific type"""
        suggestions = []
        
        if suggestion_type == SuggestionType.VISUALIZATION:
            suggestions.extend(await self._generate_visualization_suggestions(query, context, project_type))
        elif suggestion_type == SuggestionType.INPUT_TABLE:
            suggestions.extend(await self._generate_input_table_suggestions(query, context, project_type))
        elif suggestion_type == SuggestionType.WORKFLOW:
            suggestions.extend(await self._generate_workflow_suggestions(query, context, project_type))
        elif suggestion_type == SuggestionType.LAYOUT:
            suggestions.extend(await self._generate_layout_suggestions(query, context, project_type))
        elif suggestion_type == SuggestionType.DATA_MODEL:
            suggestions.extend(await self._generate_data_model_suggestions(query, context, project_type))
        elif suggestion_type == SuggestionType.FILTER:
            suggestions.extend(await self._generate_filter_suggestions(query, context, project_type))
        
        return suggestions
    
    async def _generate_visualization_suggestions(
        self, 
        query: str, 
        context: Dict[str, Any], 
        project_type: str
    ) -> List[AISuggestion]:
        """Generate visualization-specific suggestions"""
        suggestions = []
        
        # Marketing dashboard visualizations
        if 'marketing' in query.lower() or project_type == 'marketing_dashboard':
            suggestions.append(AISuggestion(
                id=f"viz_{datetime.now().timestamp()}",
                type=SuggestionType.VISUALIZATION,
                title="Marketing Performance Visualizations",
                description="Recommended chart types for marketing dashboards based on best practices",
                items=[
                    "Line charts for trend analysis (revenue, conversions over time)",
                    "Bar charts for campaign comparison (performance by channel, region)",
                    "Pie charts for composition analysis (traffic sources, customer segments)",
                    "Scatter plots for correlation analysis (budget vs. performance)",
                    "Heat maps for geographic performance visualization"
                ],
                priority=PriorityLevel.HIGH,
                implementation="In Sigma, use the Chart Builder with these configurations:\n1. Select appropriate chart type\n2. Configure data sources and metrics\n3. Set up proper axis labels and legends\n4. Apply consistent color schemes\n5. Enable interactive features",
                reasoning="Marketing data benefits from multiple visualization types to show different aspects of performance",
                related_components=["revenue_chart", "campaign_table", "geographic_map"],
                estimated_effort="2-4 hours",
                business_value="Improved data comprehension and decision-making",
                created_at=datetime.now()
            ))
        
        # General visualization suggestions
        suggestions.append(AISuggestion(
            id=f"viz_gen_{datetime.now().timestamp()}",
            type=SuggestionType.VISUALIZATION,
            title="Chart Type Selection Guide",
            description="Choose the right chart type based on your data and goals",
            items=[
                "Use bar charts for comparing categories or discrete values",
                "Use line charts for showing trends over time",
                "Use pie charts for showing parts of a whole (limit to 5-7 segments)",
                "Use scatter plots for showing relationships between two variables",
                "Use tables for detailed data with multiple dimensions"
            ],
            priority=PriorityLevel.MEDIUM,
            implementation="Follow Sigma's chart selection wizard and consider your audience's data literacy level",
            reasoning="Proper chart selection improves data comprehension and user experience",
            related_components=["chart_builder", "data_source"],
            estimated_effort="1-2 hours",
            business_value="Better data communication and user engagement",
            created_at=datetime.now()
        ))
        
        return suggestions
    
    async def _generate_input_table_suggestions(
        self, 
        query: str, 
        context: Dict[str, Any], 
        project_type: str
    ) -> List[AISuggestion]:
        """Generate input table suggestions"""
        suggestions = []
        
        suggestions.append(AISuggestion(
            id=f"input_{datetime.now().timestamp()}",
            type=SuggestionType.INPUT_TABLE,
            title="Input Table Best Practices",
            description="Design effective input tables for data collection and user interaction",
            items=[
                "Define clear column types (text, number, date, checkbox, dropdown)",
                "Implement data validation rules and constraints",
                "Use descriptive column names and add help text",
                "Include required field indicators and error messages",
                "Add computed columns for derived data and calculations"
            ],
            priority=PriorityLevel.HIGH,
            implementation="In Sigma:\n1. Go to Add Element > Input Tables\n2. Configure column properties and validation\n3. Set up user permissions and access control\n4. Test with sample data before deployment",
            reasoning="Well-designed input tables improve data quality and user experience",
            related_components=["input_table", "validation_rules", "user_permissions"],
            estimated_effort="3-5 hours",
            business_value="Improved data quality and user adoption",
            created_at=datetime.now()
        ))
        
        return suggestions
    
    async def _generate_workflow_suggestions(
        self, 
        query: str, 
        context: Dict[str, Any], 
        project_type: str
    ) -> List[AISuggestion]:
        """Generate workflow and action suggestions"""
        suggestions = []
        
        suggestions.append(AISuggestion(
            id=f"workflow_{datetime.now().timestamp()}",
            type=SuggestionType.WORKFLOW,
            title="Workflow Automation Strategies",
            description="Implement effective workflows to automate user interactions and processes",
            items=[
                "Use button-triggered actions for user-initiated processes",
                "Implement conditional logic for dynamic workflows",
                "Create navigation flows between different workbook sections",
                "Set up data refresh triggers for real-time updates",
                "Add user input validation and error handling"
            ],
            priority=PriorityLevel.HIGH,
            implementation="In Sigma Actions panel:\n1. Configure button actions and triggers\n2. Set up conditional logic and branching\n3. Create navigation flows and state management\n4. Test workflows with different user scenarios",
            reasoning="Automated workflows improve user experience and reduce manual steps",
            related_components=["actions", "buttons", "navigation", "conditional_logic"],
            estimated_effort="4-6 hours",
            business_value="Improved user experience and process efficiency",
            created_at=datetime.now()
        ))
        
        return suggestions
    
    async def _generate_layout_suggestions(
        self, 
        query: str, 
        context: Dict[str, Any], 
        project_type: str
    ) -> List[AISuggestion]:
        """Generate layout and design suggestions"""
        suggestions = []
        
        suggestions.append(AISuggestion(
            id=f"layout_{datetime.now().timestamp()}",
            type=SuggestionType.LAYOUT,
            title="Layout Design Principles",
            description="Create effective layouts that improve usability and visual appeal",
            items=[
                "Use containers to group related elements logically",
                "Implement consistent spacing and alignment throughout",
                "Create visual hierarchy with size and positioning",
                "Use tabs for organizing complex content sections",
                "Implement responsive design for different screen sizes"
            ],
            priority=PriorityLevel.MEDIUM,
            implementation="In Sigma Layout Elements:\n1. Use containers and sections for organization\n2. Apply consistent spacing and alignment\n3. Create visual hierarchy with element sizing\n4. Test layout on different devices and screen sizes",
            reasoning="Good layout design improves user experience and information comprehension",
            related_components=["containers", "sections", "tabs", "responsive_design"],
            estimated_effort="2-3 hours",
            business_value="Better user experience and professional appearance",
            created_at=datetime.now()
        ))
        
        return suggestions
    
    async def _generate_data_model_suggestions(
        self, 
        query: str, 
        context: Dict[str, Any], 
        project_type: str
    ) -> List[AISuggestion]:
        """Generate data model and structure suggestions"""
        suggestions = []
        
        suggestions.append(AISuggestion(
            id=f"data_model_{datetime.now().timestamp()}",
            type=SuggestionType.DATA_MODEL,
            title="Data Model Design",
            description="Design effective data models for your Sigma workbooks",
            items=[
                "Start with a clear understanding of your data sources",
                "Define proper table relationships and joins",
                "Use consistent naming conventions for tables and columns",
                "Implement data validation and quality checks",
                "Plan for scalability and future data growth"
            ],
            priority=PriorityLevel.HIGH,
            implementation="In Sigma:\n1. Review and understand your data sources\n2. Set up proper table relationships\n3. Use consistent naming conventions\n4. Test data connections and performance\n5. Document your data model structure",
            reasoning="A well-designed data model is the foundation for effective workbooks",
            related_components=["data_sources", "table_relationships", "naming_conventions"],
            estimated_effort="3-5 hours",
            business_value="Improved performance and maintainability",
            created_at=datetime.now()
        ))
        
        return suggestions
    
    async def _generate_filter_suggestions(
        self, 
        query: str, 
        context: Dict[str, Any], 
        project_type: str
    ) -> List[AISuggestion]:
        """Generate filter and parameter suggestions"""
        suggestions = []
        
        suggestions.append(AISuggestion(
            id=f"filter_{datetime.now().timestamp()}",
            type=SuggestionType.FILTER,
            title="Dynamic Filtering Strategies",
            description="Implement effective filtering to improve data exploration and user experience",
            items=[
                "Use global filters for workbook-wide parameter control",
                "Implement cascading filters for dependent selections",
                "Add date range filters for time-based analysis",
                "Create user-specific filters based on permissions",
                "Use filter presets for common analysis scenarios"
            ],
            priority=PriorityLevel.MEDIUM,
            implementation="In Sigma:\n1. Set up global parameters and variables\n2. Configure filter dependencies and cascading\n3. Implement user permission-based filtering\n4. Create filter presets and default values",
            reasoning="Effective filtering improves data exploration and user productivity",
            related_components=["parameters", "variables", "filters", "permissions"],
            estimated_effort="2-4 hours",
            business_value="Improved data exploration and user productivity",
            created_at=datetime.now()
        ))
        
        return suggestions
    
    async def _generate_best_practice_suggestions(
        self, 
        query: str, 
        context: Dict[str, Any], 
        user_experience: str,
        project_type: str
    ) -> List[AISuggestion]:
        """Generate general best practice suggestions"""
        suggestions = []
        
        # Experience-based suggestions
        if user_experience == 'beginner':
            suggestions.append(AISuggestion(
                id=f"bp_beginner_{datetime.now().timestamp()}",
                type=SuggestionType.BEST_PRACTICE,
                title="Getting Started with Sigma",
                description="Essential best practices for Sigma beginners",
                items=[
                    "Start with simple workbooks and gradually add complexity",
                    "Use Sigma's built-in templates and examples",
                    "Test your workbooks with sample data first",
                    "Document your workbook structure and purpose",
                    "Join Sigma community forums for support and learning"
                ],
                priority=PriorityLevel.HIGH,
                implementation="Follow Sigma's learning path:\n1. Complete basic tutorials\n2. Practice with sample data\n3. Build simple workbooks first\n4. Gradually add advanced features",
                reasoning="Starting simple helps build confidence and understanding",
                related_components=["templates", "tutorials", "sample_data"],
                estimated_effort="1-2 hours",
                business_value="Faster learning curve and reduced errors",
                created_at=datetime.now()
            ))
        
        # Project type specific suggestions
        if project_type == 'dashboard':
            suggestions.append(AISuggestion(
                id=f"bp_dashboard_{datetime.now().timestamp()}",
                type=SuggestionType.BEST_PRACTICE,
                title="Dashboard Design Principles",
                description="Best practices for creating effective dashboards",
                items=[
                    "Focus on key metrics and KPIs that matter most",
                    "Use consistent visual design and color schemes",
                    "Implement proper data refresh and update mechanisms",
                    "Design for different user roles and access levels",
                    "Include drill-down capabilities for detailed analysis"
                ],
                priority=PriorityLevel.MEDIUM,
                implementation="Apply dashboard design principles:\n1. Identify key metrics and KPIs\n2. Design consistent visual elements\n3. Implement proper data refresh\n4. Test with target users",
                reasoning="Well-designed dashboards improve decision-making and user adoption",
                related_components=["kpis", "visual_design", "data_refresh", "user_roles"],
                estimated_effort="3-4 hours",
                business_value="Better decision-making and user adoption",
                created_at=datetime.now()
            ))
        
        return suggestions
    
    async def _generate_performance_suggestions(self, context: Dict[str, Any]) -> List[AISuggestion]:
        """Generate performance and optimization suggestions"""
        suggestions = []
        
        suggestions.append(AISuggestion(
            id=f"perf_{datetime.now().timestamp()}",
            type=SuggestionType.PERFORMANCE,
            title="Performance Optimization",
            description="Optimize your Sigma workbooks for better performance",
            items=[
                "Use data source filters to limit data processing",
                "Implement lazy loading for large datasets",
                "Optimize table relationships and joins",
                "Use calculated columns sparingly",
                "Monitor and analyze performance metrics"
            ],
            priority=PriorityLevel.MEDIUM,
            implementation="Performance optimization steps:\n1. Review data source filters and limits\n2. Optimize table relationships\n3. Minimize calculated columns\n4. Test with realistic data volumes\n5. Monitor performance metrics",
            reasoning="Performance optimization improves user experience and scalability",
            related_components=["data_filters", "table_relationships", "calculated_columns"],
            estimated_effort="2-4 hours",
            business_value="Improved user experience and scalability",
            created_at=datetime.now()
        ))
        
        return suggestions
    
    def _rank_suggestions(
        self, 
        suggestions: List[AISuggestion], 
        query: str, 
        context: Dict[str, Any]
    ) -> List[AISuggestion]:
        """Rank suggestions by relevance and priority"""
        def score_suggestion(suggestion: AISuggestion) -> float:
            score = 0.0
            
            # Priority scoring
            priority_scores = {
                PriorityLevel.CRITICAL: 100,
                PriorityLevel.HIGH: 80,
                PriorityLevel.MEDIUM: 60,
                PriorityLevel.LOW: 40,
                PriorityLevel.INFO: 20
            }
            score += priority_scores.get(suggestion.priority, 0)
            
            # Query relevance scoring
            query_words = set(query.lower().split())
            title_words = set(suggestion.title.lower().split())
            description_words = set(suggestion.description.lower().split())
            
            title_match = len(query_words.intersection(title_words)) / len(query_words) if query_words else 0
            description_match = len(query_words.intersection(description_words)) / len(query_words) if query_words else 0
            
            score += title_match * 50 + description_match * 30
            
            # Recency scoring (newer suggestions get slight boost)
            age_hours = (datetime.now() - suggestion.created_at).total_seconds() / 3600
            if age_hours < 24:
                score += 10
            
            return score
        
        # Sort by score (highest first)
        suggestions.sort(key=score_suggestion, reverse=True)
        return suggestions
    
    def _create_error_suggestion(self, error_message: str) -> AISuggestion:
        """Create an error suggestion when something goes wrong"""
        return AISuggestion(
            id=f"error_{datetime.now().timestamp()}",
            type=SuggestionType.BEST_PRACTICE,
            title="Error in Suggestion Generation",
            description="There was an error generating AI suggestions",
            items=[
                "Please try rephrasing your question",
                "Check that your query is clear and specific",
                "Contact support if the issue persists"
            ],
            priority=PriorityLevel.INFO,
            implementation="Error details: " + error_message,
            reasoning="Technical error occurred during suggestion generation",
            related_components=[],
            estimated_effort="N/A",
            business_value="N/A",
            created_at=datetime.now()
        )
    
    async def get_workbook_template(
        self, 
        template_name: str
    ) -> Optional[WorkbookTemplate]:
        """Get a specific workbook template"""
        if template_name in self.component_templates:
            template_data = self.component_templates[template_name]
            return WorkbookTemplate(
                id=template_name,
                name=template_data['name'],
                description=template_data['description'],
                category=template_name.split('_')[0],
                components=template_data['components'],
                configuration={},
                metadata={'source': 'ai_service'},
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        return None
    
    async def list_workbook_templates(self) -> List[WorkbookTemplate]:
        """List all available workbook templates"""
        templates = []
        for template_name, template_data in self.component_templates.items():
            template = await self.get_workbook_template(template_name)
            if template:
                templates.append(template)
        return templates
    
    async def generate_workbook_config(
        self, 
        requirements: Dict[str, Any],
        template_name: str = None
    ) -> Dict[str, Any]:
        """
        Generate a complete workbook configuration based on requirements
        
        Args:
            requirements: User requirements for the workbook
            template_name: Optional template to use as a starting point
            
        Returns:
            Complete workbook configuration
        """
        try:
            config = {
                'metadata': {
                    'generated_by': 'Sigma AI Service',
                    'generated_at': datetime.now().isoformat(),
                    'version': '1.0.0',
                    'requirements': requirements
                },
                'workbook': {
                    'title': requirements.get('title', 'AI-Generated Workbook'),
                    'description': requirements.get('description', ''),
                    'type': requirements.get('type', 'dashboard'),
                    'target_audience': requirements.get('target_audience', ''),
                    'components': [],
                    'layout': {},
                    'variables': {},
                    'actions': []
                }
            }
            
            # Use template if specified
            if template_name:
                template = await self.get_workbook_template(template_name)
                if template:
                    config['workbook']['components'] = template.components
                    config['workbook']['description'] = template.description
            
            # Generate AI suggestions for the requirements
            query = f"Build a {requirements.get('type', 'dashboard')} for {requirements.get('target_audience', 'users')}"
            suggestions = await self.generate_workbook_suggestions(query, requirements)
            
            # Apply suggestions to configuration
            for suggestion in suggestions[:5]:  # Top 5 suggestions
                config = self._apply_suggestion_to_config(config, suggestion)
            
            return config
            
        except Exception as e:
            logger.error(f"Error generating workbook config: {str(e)}")
            return {
                'error': str(e),
                'metadata': {
                    'generated_by': 'Sigma AI Service',
                    'generated_at': datetime.now().isoformat(),
                    'error': True
                }
            }
    
    def _apply_suggestion_to_config(
        self, 
        config: Dict[str, Any], 
        suggestion: AISuggestion
    ) -> Dict[str, Any]:
        """Apply an AI suggestion to the workbook configuration"""
        try:
            if suggestion.type == SuggestionType.VISUALIZATION:
                # Add visualization component
                viz_component = {
                    'id': f"viz_{suggestion.id}",
                    'type': 'visualization',
                    'name': suggestion.title,
                    'description': suggestion.description,
                    'configuration': {
                        'chart_type': 'auto',
                        'data_source': 'default',
                        'metrics': suggestion.items[:3]  # First 3 items as metrics
                    }
                }
                config['workbook']['components'].append(viz_component)
                
            elif suggestion.type == SuggestionType.INPUT_TABLE:
                # Add input table component
                input_component = {
                    'id': f"input_{suggestion.id}",
                    'type': 'input_table',
                    'name': suggestion.title,
                    'description': suggestion.description,
                    'configuration': {
                        'columns': suggestion.items[:5],  # First 5 items as columns
                        'validation_rules': [],
                        'permissions': 'all_users'
                    }
                }
                config['workbook']['components'].append(input_component)
                
            elif suggestion.type == SuggestionType.WORKFLOW:
                # Add workflow component
                workflow_component = {
                    'id': f"workflow_{suggestion.id}",
                    'type': 'workflow',
                    'name': suggestion.title,
                    'description': suggestion.description,
                    'configuration': {
                        'steps': suggestion.items,
                        'triggers': ['user_action'],
                        'conditions': []
                    }
                }
                config['workbook']['components'].append(workflow_component)
            
            # Add implementation notes
            if 'implementation_notes' not in config['metadata']:
                config['metadata']['implementation_notes'] = []
            
            config['metadata']['implementation_notes'].append({
                'suggestion_id': suggestion.id,
                'type': suggestion.type.value,
                'implementation': suggestion.implementation,
                'priority': suggestion.priority.value
            })
            
        except Exception as e:
            logger.error(f"Error applying suggestion to config: {str(e)}")
        
        return config

def serialize_for_json(obj):
    """Custom serialization function to handle enums and datetimes"""
    if isinstance(obj, Enum):
        return obj.value
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {key: serialize_for_json(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize_for_json(item) for item in obj]
    else:
        return obj

# Global instance
sigma_ai_service = SigmaAIService()

# Convenience functions for external use
async def get_sigma_suggestions(query: str, context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """Get AI suggestions for Sigma workbook development"""
    suggestions = await sigma_ai_service.generate_workbook_suggestions(query, context)
    # Use custom serialization to handle enums and datetimes
    serialized_suggestions = []
    for suggestion in suggestions:
        suggestion_dict = asdict(suggestion)
        serialized_suggestion = serialize_for_json(suggestion_dict)
        serialized_suggestions.append(serialized_suggestion)
    return serialized_suggestions

async def generate_sigma_config(requirements: Dict[str, Any], template_name: str = None) -> Dict[str, Any]:
    """Generate a complete Sigma workbook configuration"""
    return await sigma_ai_service.generate_workbook_config(requirements, template_name)

async def get_sigma_templates() -> List[Dict[str, Any]]:
    """Get available Sigma workbook templates"""
    templates = await sigma_ai_service.list_workbook_templates()
    # Use custom serialization to handle enums and datetimes
    serialized_templates = []
    for template in templates:
        template_dict = asdict(template)
        serialized_template = serialize_for_json(template_dict)
        serialized_templates.append(serialized_template)
    return serialized_templates 