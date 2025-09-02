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

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'YouTube Videos', path: '/youtube' },
    { name: 'PDFs', path: '/pdfs' },
    { name: 'Welcome Note', path: '/welcome-note' },
    { name: 'Site Name', path: '/site-name' },
    { name: 'Page Control', path: '/page-control' },
    { name: 'Subscription Plans', path: '/subscription-plans' },
    { name: 'Users', path: '/users' },
    { name: 'Pending Subscriptions', path: '/pending-subscriptions' },
    { name: 'UPI Management', path: '/upi-management' },
  ];

  // Optionally filter pages based on pageStatus if required here

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <button
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen(!menuOpen)}
        className="menu-toggle-button"
        type="button"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '1.5rem',
          cursor: 'pointer',
          display: isMobile ? 'block' : 'none',
        }}
      >
        ☰
      </button>
      <ul
        id="primary-navigation"
        className="nav-links"
        style={{
          display: isMobile ? (menuOpen ? 'flex' : 'none') : 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '10px',
          margin: 0,
          padding: 0,
          listStyle: 'none',
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'center' : 'flex-start',
          alignItems: 'center',
        }}
      >
        {pages.map(({ name, path }) => (
          <li key={name} style={{ width: isMobile ? '100%' : 'auto', textAlign: isMobile ? 'center' : 'left' }}>
            <NavLink to={path} style={navLinkStyle} onClick={() => setMenuOpen(false)}>
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
