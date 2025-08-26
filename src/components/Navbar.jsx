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
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="site-name">Mechanic Bano - Admin Panel</h1>
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        )}
      </div>
      <nav className={`nav-links ${menuOpen ? 'nav-open' : ''} ${isMobile ? 'nav-mobile' : ''}`}>
        <NavLink to="/" style={navLinkStyle} onClick={() => isMobile && setMenuOpen(false)}>
          Home
        </NavLink>
        {pageStatus.videos && (
          <NavLink
            to="/videos"
            style={navLinkStyle}
            onClick={() => isMobile && setMenuOpen(false)}
          >
            Videos
          </NavLink>
        )}
        {pageStatus.pdfs && (
          <NavLink
            to="/pdfs"
            style={navLinkStyle}
            onClick={() => isMobile && setMenuOpen(false)}
          >
            PDFs
          </NavLink>
        )}
        {pageStatus.welcome && (
          <NavLink
            to="/welcome"
            style={navLinkStyle}
            onClick={() => isMobile && setMenuOpen(false)}
          >
            Welcome Note
          </NavLink>
        )}
        {pageStatus.sitename && (
          <NavLink
            to="/sitename"
            style={navLinkStyle}
            onClick={() => isMobile && setMenuOpen(false)}
          >
            Site Name
          </NavLink>
        )}
        {pageStatus.pagecontrol && (
          <NavLink
            to="/pagecontrol"
            style={navLinkStyle}
            onClick={() => isMobile && setMenuOpen(false)}
          >
            Page Control
          </NavLink>
        )}
        {pageStatus['subscription-plans'] && (
          <NavLink
            to="/subscription-plans"
            style={navLinkStyle}
            onClick={() => isMobile && setMenuOpen(false)}
          >
            Subscription Plans
          </NavLink>
        )}
        {pageStatus.users && (
          <NavLink
            to="/users"
            style={navLinkStyle}
            onClick={() => isMobile && setMenuOpen(false)}
          >
            Users
          </NavLink>
        )}
      </nav>
    </header>
  );
}
