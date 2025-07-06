// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ pageStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navLinkStyle = (path) => ({
    color: location.pathname === path ? '#ff9800' : 'white', // Active link color
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '8px 12px',
    borderRadius: '5px',
    backgroundColor: location.pathname === path ? '#555' : 'transparent',
    transition: 'background-color 0.3s, color 0.3s',
  });

  return (
    <header style={styles.headerWrapper}>
      <div style={styles.headerContainer}>
        <h1 style={styles.siteName}>Mechanic Bano - Admin Panel</h1>
        {isMobile && (
          <button onClick={toggleMenu} style={styles.menuButton}>
            ☰
          </button>
        )}
      </div>

      <nav style={{
        ...styles.navLinks,
        ...(isMobile
          ? {
            display: menuOpen ? 'flex' : 'none',
            flexDirection: 'column',
            animation: menuOpen ? 'slideDown 0.3s ease-in-out' : ''
          }
          : { display: 'flex', flexDirection: 'row' })
      }}>
        <Link to="/" style={navLinkStyle('/')} onClick={() => isMobile && setMenuOpen(false)}>Home</Link>
        {pageStatus.videos && <Link to="/videos" style={navLinkStyle('/videos')} onClick={() => isMobile && setMenuOpen(false)}>Videos</Link>}
        {pageStatus.pdfs && <Link to="/pdfs" style={navLinkStyle('/pdfs')} onClick={() => isMobile && setMenuOpen(false)}>PDFs</Link>}
        {pageStatus.welcome && <Link to="/welcome" style={navLinkStyle('/welcome')} onClick={() => isMobile && setMenuOpen(false)}>Welcome Note</Link>}
        {pageStatus.sitename && <Link to="/sitename" style={navLinkStyle('/sitename')} onClick={() => isMobile && setMenuOpen(false)}>Site Name</Link>}
        {pageStatus.logo && <Link to="/logo" style={navLinkStyle('/logo')} onClick={() => isMobile && setMenuOpen(false)}>Logo</Link>}
        <Link to="/pagecontrol" style={navLinkStyle('/pagecontrol')} onClick={() => isMobile && setMenuOpen(false)}>Page Control</Link>

        {/* ✅ New Subscription Plans Link */}
        <Link to="/subscription-plans" style={navLinkStyle('/subscription-plans')} onClick={() => isMobile && setMenuOpen(false)}>Subscription Plans</Link>
      </nav>

      {/* Mobile animation style */}
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
    gap: '10px',
  },
};
