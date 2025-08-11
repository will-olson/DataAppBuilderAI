"""
Sigma AI API Routes

This module provides API endpoints for AI-assisted Sigma workbook development,
including suggestions, templates, and configuration generation.
"""

from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
import logging
import asyncio
from typing import Dict, Any, List
import json

# Import the Sigma AI service
import sys
import os
# Add the server root directory to the Python path
server_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
if server_root not in sys.path:
    sys.path.insert(0, server_root)

from sigma_ai_service import (
    sigma_ai_service,
    get_sigma_suggestions,
    generate_sigma_config,
    get_sigma_templates
)

logger = logging.getLogger(__name__)

# Create blueprint
sigma_ai_bp = Blueprint('sigma_ai', __name__, url_prefix='/api/sigma-ai')

@sigma_ai_bp.route('/suggestions', methods=['POST'])
# @login_required  # Temporarily disabled for development
def get_workbook_suggestions():
    """
    Get AI-powered suggestions for Sigma workbook development
    
    Request body:
    {
        "query": "How should I design a marketing dashboard?",
        "context": {
            "user_experience": "intermediate",
            "project_type": "dashboard",
            "target_audience": "marketing team",
            "data_sources": ["sales_data", "campaign_data"],
            "key_metrics": ["revenue", "conversions", "roas"]
        }
    }
    
    Returns:
    {
        "success": true,
        "suggestions": [...],
        "metadata": {...}
    }
    """
    try:
        # Handle case where no JSON data is sent
        if not request.data:
            return jsonify({
                'success': False,
                'error': 'No request data provided'
            }), 400
        
        # Try to parse JSON data
        try:
            data = request.get_json()
        except Exception as json_error:
            return jsonify({
                'success': False,
                'error': 'Invalid JSON data provided'
            }), 400
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No request data provided'
            }), 400
        
        query = data.get('query', '').strip()
        if not query:
            return jsonify({
                'success': False,
                'error': 'Query is required'
            }), 400
        
        context = data.get('context', {})
        user_experience = context.get('user_experience', 'intermediate')
        project_type = context.get('project_type', 'dashboard')
        
        # Get AI suggestions
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            suggestions = loop.run_until_complete(
                get_sigma_suggestions(query, context)
            )
        finally:
            loop.close()
        
        # Process suggestions for JSON serialization
        processed_suggestions = []
        for suggestion in suggestions:
            processed_suggestion = {
                'id': suggestion['id'],
                'type': suggestion['type'],
                'title': suggestion['title'],
                'description': suggestion['description'],
                'items': suggestion['items'],
                'priority': suggestion['priority'],
                'implementation': suggestion['implementation'],
                'reasoning': suggestion['reasoning'],
                'related_components': suggestion['related_components'],
                'estimated_effort': suggestion['estimated_effort'],
                'business_value': suggestion['business_value'],
                'created_at': suggestion['created_at']
            }
            processed_suggestions.append(processed_suggestion)
        
        return jsonify({
            'success': True,
            'suggestions': processed_suggestions,
            'metadata': {
                'query': query,
                'context': context,
                'total_suggestions': len(processed_suggestions),
                'generated_at': suggestions[0]['created_at'] if suggestions else None
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting workbook suggestions: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to generate suggestions: {str(e)}'
        }), 500

@sigma_ai_bp.route('/templates', methods=['GET'])
# @login_required  # Temporarily disabled for development
def list_workbook_templates():
    """
    Get available Sigma workbook templates
    
    Returns:
    {
        "success": true,
        "templates": [...],
        "metadata": {...}
    }
    """
    try:
        # Get available templates
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            templates = loop.run_until_complete(get_sigma_templates())
        finally:
            loop.close()
        
        # Process templates for JSON serialization
        processed_templates = []
        for template in templates:
            processed_template = {
                'id': template['id'],
                'name': template['name'],
                'description': template['description'],
                'category': template['category'],
                'components': template['components'],
                'metadata': template['metadata'],
                'created_at': template['created_at'],
                'updated_at': template['updated_at']
            }
            processed_templates.append(processed_template)
        
        return jsonify({
            'success': True,
            'templates': processed_templates,
            'metadata': {
                'total_templates': len(processed_templates),
                'categories': list(set(t['category'] for t in processed_templates))
            }
        })
        
    except Exception as e:
        logger.error(f"Error listing workbook templates: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to list templates: {str(e)}'
        }), 500

@sigma_ai_bp.route('/templates/<template_name>', methods=['GET'])
# @login_required  # Temporarily disabled for development
def get_workbook_template(template_name: str):
    """
    Get a specific Sigma workbook template
    
    Args:
        template_name: Name of the template to retrieve
        
    Returns:
    {
        "success": true,
        "template": {...},
        "metadata": {...}
    }
    """
    try:
        # Get specific template
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            template = loop.run_until_complete(
                sigma_ai_service.get_workbook_template(template_name)
            )
        finally:
            loop.close()
        
        if not template:
            return jsonify({
                'success': False,
                'error': f'Template "{template_name}" not found'
            }), 404
        
        # Process template for JSON serialization
        processed_template = {
            'id': template.id,
            'name': template.name,
            'description': template.description,
            'category': template.category,
            'components': template.components,
            'configuration': template.configuration,
            'metadata': template.metadata,
            'created_at': template.created_at.isoformat(),
            'updated_at': template.updated_at.isoformat()
        }
        
        return jsonify({
            'success': True,
            'template': processed_template,
            'metadata': {
                'template_name': template_name,
                'retrieved_at': processed_template['updated_at']
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting workbook template {template_name}: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to get template: {str(e)}'
        }), 500

@sigma_ai_bp.route('/generate-config', methods=['POST'])
# @login_required  # Temporarily disabled for development
def generate_workbook_configuration():
    """
    Generate a complete Sigma workbook configuration based on requirements
    
    Request body:
    {
        "requirements": {
            "title": "Marketing Performance Dashboard",
            "description": "Dashboard for tracking marketing KPIs",
            "type": "dashboard",
            "target_audience": "marketing team",
            "data_sources": ["sales_data", "campaign_data"],
            "key_metrics": ["revenue", "conversions", "roas"],
            "visualizations": ["charts", "tables", "maps"],
            "interactions": ["filters", "drill-downs", "actions"]
        },
        "template_name": "marketing_dashboard"  # Optional
    }
    
    Returns:
    {
        "success": true,
        "configuration": {...},
        "metadata": {...}
    }
    """
    try:
        # Handle case where no JSON data is sent
        if not request.data:
            return jsonify({
                'success': False,
                'error': 'No request data provided'
            }), 400
        
        # Try to parse JSON data
        try:
            data = request.get_json()
        except Exception as json_error:
            return jsonify({
                'success': False,
                'error': 'Invalid JSON data provided'
            }), 400
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No request data provided'
            }), 400
        
        requirements = data.get('requirements', {})
        if not requirements:
            return jsonify({
                'success': False,
                'error': 'Requirements are required'
            }), 400
        
        template_name = data.get('template_name')
        
        # Generate workbook configuration
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            config = loop.run_until_complete(
                generate_sigma_config(requirements, template_name)
            )
        finally:
            loop.close()
        
        if 'error' in config:
            return jsonify({
                'success': False,
                'error': config['error']
            }), 500
        
        return jsonify({
            'success': True,
            'configuration': config,
            'metadata': {
                'requirements': requirements,
                'template_used': template_name,
                'generated_at': config.get('metadata', {}).get('generated_at'),
                'total_components': len(config.get('workbook', {}).get('components', []))
            }
        })
        
    except Exception as e:
        logger.error(f"Error generating workbook configuration: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to generate configuration: {str(e)}'
        }), 500

@sigma_ai_bp.route('/analyze-requirements', methods=['POST'])
# @login_required  # Temporarily disabled for development
def analyze_workbook_requirements():
    """
    Analyze workbook requirements and provide AI insights
    
    Request body:
    {
        "requirements": {
            "title": "Sales Dashboard",
            "description": "Dashboard for sales team",
            "type": "dashboard",
            "target_audience": "sales team"
        }
    }
    
    Returns:
    {
        "success": true,
        "analysis": {
            "complexity_score": 7.5,
            "estimated_effort": "3-5 days",
            "recommended_components": [...],
            "potential_challenges": [...],
            "best_practices": [...]
        },
        "metadata": {...}
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No request data provided'
            }), 400
        
        requirements = data.get('requirements', {})
        if not requirements:
            return jsonify({
                'success': False,
                'error': 'Requirements are required'
            }), 400
        
        # Analyze requirements using AI
        query = f"Analyze requirements for {requirements.get('title', 'workbook')}"
        context = {
            'user_experience': 'intermediate',
            'project_type': requirements.get('type', 'dashboard'),
            'target_audience': requirements.get('target_audience', 'users'),
            **requirements
        }
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            suggestions = loop.run_until_complete(
                get_sigma_suggestions(query, context)
            )
        finally:
            loop.close()
        
        # Analyze complexity and provide insights
        complexity_score = min(10, len(suggestions) * 0.8 + 3)  # Simple scoring algorithm
        
        # Estimate effort based on complexity and components
        if complexity_score < 4:
            estimated_effort = "1-2 days"
        elif complexity_score < 7:
            estimated_effort = "3-5 days"
        else:
            estimated_effort = "1-2 weeks"
        
        # Extract recommended components from suggestions
        recommended_components = []
        for suggestion in suggestions[:5]:
            if suggestion['type'] in ['visualization', 'input_table', 'workflow']:
                recommended_components.append({
                    'type': suggestion['type'],
                    'name': suggestion['title'],
                    'priority': suggestion['priority'],
                    'effort': suggestion['estimated_effort']
                })
        
        # Identify potential challenges
        potential_challenges = []
        if requirements.get('type') == 'dashboard' and len(recommended_components) > 5:
            potential_challenges.append("Dashboard may become cluttered with too many components")
        if 'real-time' in requirements.get('description', '').lower():
            potential_challenges.append("Real-time data updates may impact performance")
        if 'mobile' in requirements.get('target_audience', '').lower():
            potential_challenges.append("Mobile responsiveness requires careful layout planning")
        
        # Extract best practices from suggestions
        best_practices = []
        for suggestion in suggestions:
            if suggestion['type'] == 'best_practice':
                best_practices.extend(suggestion['items'][:3])  # Top 3 items
        
        analysis = {
            'complexity_score': round(complexity_score, 1),
            'estimated_effort': estimated_effort,
            'recommended_components': recommended_components,
            'potential_challenges': potential_challenges,
            'best_practices': best_practices[:5],  # Top 5 best practices
            'total_suggestions': len(suggestions)
        }
        
        return jsonify({
            'success': True,
            'analysis': analysis,
            'metadata': {
                'requirements': requirements,
                'analyzed_at': suggestions[0]['created_at'] if suggestions else None,
                'ai_model': 'Sigma AI Service v1.0'
            }
        })
        
    except Exception as e:
        logger.error(f"Error analyzing workbook requirements: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to analyze requirements: {str(e)}'
        }), 500

@sigma_ai_bp.route('/optimize-workbook', methods=['POST'])
# @login_required  # Temporarily disabled for development
def optimize_workbook():
    """
    Provide optimization suggestions for existing Sigma workbooks
    
    Request body:
    {
        "workbook_config": {
            "components": [...],
            "layout": {...},
            "performance_metrics": {...}
        },
        "optimization_focus": ["performance", "usability", "maintainability"]
    }
    
    Returns:
    {
        "success": true,
        "optimizations": [...],
        "metadata": {...}
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No request data provided'
            }), 400
        
        workbook_config = data.get('workbook_config', {})
        optimization_focus = data.get('optimization_focus', ['performance'])
        
        if not workbook_config:
            return jsonify({
                'success': False,
                'error': 'Workbook configuration is required'
            }), 400
        
        # Generate optimization suggestions
        query = f"Optimize workbook for {', '.join(optimization_focus)}"
        context = {
            'workbook_config': workbook_config,
            'optimization_focus': optimization_focus,
            'project_type': 'optimization'
        }
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            suggestions = loop.run_until_complete(
                get_sigma_suggestions(query, context)
            )
        finally:
            loop.close()
        
        # Filter optimization suggestions
        optimization_suggestions = []
        for suggestion in suggestions:
            if suggestion['type'] in ['performance', 'best_practice']:
                optimization_suggestions.append({
                    'id': suggestion['id'],
                    'title': suggestion['title'],
                    'description': suggestion['description'],
                    'type': suggestion['type'],
                    'priority': suggestion['priority'],
                    'implementation': suggestion['implementation'],
                    'estimated_effort': suggestion['estimated_effort'],
                    'business_value': suggestion['business_value']
                })
        
        return jsonify({
            'success': True,
            'optimizations': optimization_suggestions,
            'metadata': {
                'workbook_components': len(workbook_config.get('components', [])),
                'optimization_focus': optimization_focus,
                'total_optimizations': len(optimization_suggestions),
                'generated_at': suggestions[0]['created_at'] if suggestions else None
            }
        })
        
    except Exception as e:
        logger.error(f"Error optimizing workbook: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to optimize workbook: {str(e)}'
        }), 500

@sigma_ai_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for the Sigma AI service
    
    Returns:
    {
        "success": true,
        "status": "healthy",
        "service": "Sigma AI Service",
        "version": "1.0.0"
    }
    """
    try:
        # Simple health check - try to get a basic suggestion
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            suggestions = loop.run_until_complete(
                get_sigma_suggestions("test", {})
            )
        finally:
            loop.close()
        
        return jsonify({
            'success': True,
            'status': 'healthy',
            'service': 'Sigma AI Service',
            'version': '1.0.0',
            'ai_working': len(suggestions) > 0,
            'timestamp': suggestions[0]['created_at'] if suggestions else None
        })
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'success': False,
            'status': 'unhealthy',
            'service': 'Sigma AI Service',
            'version': '1.0.0',
            'error': str(e)
        }), 500

# Error handlers
@sigma_ai_bp.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@sigma_ai_bp.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

# Register the blueprint
def init_app(app):
    """Initialize the Sigma AI blueprint with the Flask app"""
    app.register_blueprint(sigma_ai_bp)
    logger.info("Sigma AI blueprint registered successfully") 