import React, { useState, useEffect, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ pageStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkScreenSize = () => window.innerWidth <= 768;
    setIsMobile(checkScreenSize());

    const handleResize = () => {
      const mobile = checkScreenSize();
      setIsMobile(mobile);
      if (!mobile) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#ff9800' : 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '8px 12px',
    borderRadius: '5px',
    backgroundColor: isActive ? '#555' : 'transparent',
    transition: 'background-color 0.3s, color 0.3s',
  });

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="site-name">Mechanic Bano - Admin Panel</h1>
        
        {/* Hamburger Menu Button */}
        <button 
          className={`menu-toggle ${menuOpen ? 'nav-open' : ''}`}
          onClick={toggleMenu}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/videos" style={navLinkStyle}>Videos</NavLink>
          <NavLink to="/welcome-note" style={navLinkStyle}>Welcome Note</NavLink>
          
          {pageStatus?.pagecontrol && (
            <NavLink to="/page-control" style={navLinkStyle}>Page Control</NavLink>
          )}
          
          <NavLink to="/subscription-plans" style={navLinkStyle}>Subscription Plans</NavLink>
          <NavLink to="/users" style={navLinkStyle}>Users</NavLink>
          <NavLink to="/pending-subscriptions" style={navLinkStyle}>Pending Subscriptions</NavLink>
          <NavLink to="/upi-id" style={navLinkStyle}>UPI ID</NavLink>
        </div>
      </div>
    </nav>
  );
}
