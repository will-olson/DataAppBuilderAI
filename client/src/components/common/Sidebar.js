// src/components/common/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const sidebarItems = [
    { 
      title: 'Dashboard', 
      icon: '📊', 
      link: '/dashboard' 
    },
    { 
      title: 'Segmentation', 
      icon: '👥', 
      link: '/segmentation' 
    },
    { 
      title: 'User Journey', 
      icon: '🛤️', 
      link: '/user-journey' 
    },
    { 
      title: 'Personalization', 
      icon: '🎯', 
      link: '/personalization' 
    },
    { 
      title: 'Churn Prediction', 
      icon: '⚠️', 
      link: '/churn-prediction' 
    },
    { 
      title: 'Referral Insights', 
      icon: '🔗', 
      link: '/referral-insights' 
    },
    { 
      title: 'Feature Usage', 
      icon: '🧩', 
      link: '/feature-usage' 
    }
  ];

  return (
    <aside className="main-sidebar">
      <div className="sidebar-menu">
        {sidebarItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.link} 
            className="sidebar-item"
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-title">{item.title}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;