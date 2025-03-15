// src/components/common/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="main-navbar">
      <div className="navbar-brand">
        <Link to="/">User Insights Platform</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/segmentation">Segmentation</Link>
        <Link to="/user-journey">User Journey</Link>
        <Link to="/personalization">Personalization</Link>
      </div>
      <div className="navbar-actions">
        {/* Add user profile or logout actions */}
        <button>Profile</button>
        <button>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;