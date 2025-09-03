import React, { useState, useLayoutEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/components/navbar.css';

export default function Navbar({ pageStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

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
    display: 'block',
  });

  const pages = [
    { name: 'Home', path: '/', key: 'home' },
    { name: 'YouTube Videos', path: '/videos', key: 'videos' },
    { name: 'PDFs', path: '/pdfs', key: 'pdfs' },
    { name: 'Welcome Note', path: '/welcome', key: 'welcome' },
    { name: 'Site Name', path: '/sitename', key: 'sitename' },
    { name: 'Page Control', path: '/pagecontrol', key: 'pagecontrol' },
    { name: 'Subscription Plans', path: '/subscription-plans', key: 'subscription-plans' },
    { name: 'Users', path: '/users', key: 'users' },
    { name: 'Pending Subscriptions', path: '/pending-subscriptions', key: 'pending-subscriptions' },
    { name: 'UPI Management', path: '/upi', key: 'upi' },
  ];

  const visiblePages = pages.filter((page) => pageStatus[page.key] !== false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="nav-brand">
        <h2>Mechanic Bano Admin</h2>
      </div>
      <button
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen(!menuOpen)}
        className="menu-toggle-button"
        type="button"
      >
        ☰
      </button>
      <ul
        id="primary-navigation"
        className={`nav-links ${menuOpen && isMobile ? 'open' : ''}`}
        data-mobile={isMobile ? 'true' : 'false'}
      >
        {visiblePages.map(({ name, path, key }) => (
          <li key={key} className="nav-item">
            <NavLink
              to={path}
              style={navLinkStyle}
              onClick={() => setMenuOpen(false)}
              state={{ from: location.pathname }}
              end={path === '/'}
            >
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
