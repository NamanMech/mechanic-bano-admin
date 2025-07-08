import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ pageStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMenuOpen(false); // Close menu when resizing to desktop
      }
    };

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
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
    <header style={styles.headerWrapper}>
      <div style={styles.headerContainer}>
        <h1 style={styles.siteName}>Mechanic Bano - Admin Panel</h1>
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.menuButton}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        )}
      </div>

      {(menuOpen || !isMobile) && (
        <nav
          style={{
            ...styles.navLinks,
            ...(isMobile
              ? { flexDirection: 'column', animation: 'slideDown 0.3s ease-in-out' }
              : { flexDirection: 'row' }),
          }}
        >
          <NavLink to="/" style={navLinkStyle} onClick={() => isMobile && setMenuOpen(false)}>
            Home
          </NavLink>
          {pageStatus.youtube && (
  <NavLink to="/YouTubeVideoManagement" style={navLinkStyle} onClick={() => isMobile && setMenuOpen(false)}>
    YouTube Videos
  </NavLink>
)}
{pageStatus.pdf && (
  <NavLink to="/PDFManagement" style={navLinkStyle} onClick={() => isMobile && setMenuOpen(false)}>
    PDF Files
  </NavLink>
)}
          {pageStatus.welcome && (
            <NavLink to="/welcome" style={navLinkStyle} onClick={() => isMobile && setMenuOpen(false)}>
              Welcome Note
            </NavLink>
          )}
          {pageStatus.sitename && (
            <NavLink to="/sitename" style={navLinkStyle} onClick={() => isMobile && setMenuOpen(false)}>
              Site Name
            </NavLink>
          )}
          <NavLink to="/pagecontrol" style={navLinkStyle} onClick={() => isMobile && setMenuOpen(false)}>
            Page Control
          </NavLink>
          <NavLink to="/subscription-plans" style={navLinkStyle} onClick={() => isMobile && setMenuOpen(false)}>
            Subscription Plans
          </NavLink>
          <NavLink to="/users" style={navLinkStyle} onClick={() => isMobile && setMenuOpen(false)}>
            Users
          </NavLink>
        </nav>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}

const styles = {
  headerWrapper: {
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    backgroundColor: '#2c3e50',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
  },
  siteName: {
    fontSize: '20px',
    color: 'white',
  },
  menuButton: {
    fontSize: '24px',
    background: 'none',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  navLinks: {
    backgroundColor: '#34495e',
    padding: '10px',
    display: 'flex',
    gap: '10px',
  },
};
