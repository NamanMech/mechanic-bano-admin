// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ pageStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <header>
      <div style={styles.headerContainer}>
        <h1 style={styles.siteName}>Mechanic Bano - Admin Panel</h1>
        {isMobile && (
          <button onClick={toggleMenu} style={styles.menuButton}>
            ☰
          </button>
        )}
      </div>

      <nav style={{ ...styles.navLinks, ...(isMobile ? { display: menuOpen ? 'flex' : 'none', flexDirection: 'column' } : { display: 'flex', flexDirection: 'row' }) }}>
        <Link to="/" style={styles.link} onClick={() => isMobile && setMenuOpen(false)}>Home</Link>
        {pageStatus.videos && <Link to="/videos" style={styles.link} onClick={() => isMobile && setMenuOpen(false)}>Videos</Link>}
        {pageStatus.pdfs && <Link to="/pdfs" style={styles.link} onClick={() => isMobile && setMenuOpen(false)}>PDFs</Link>}
        {pageStatus.welcome && <Link to="/welcome" style={styles.link} onClick={() => isMobile && setMenuOpen(false)}>Welcome Note</Link>}
        {pageStatus.sitename && <Link to="/sitename" style={styles.link} onClick={() => isMobile && setMenuOpen(false)}>Site Name</Link>}
        {pageStatus.logo && <Link to="/logo" style={styles.link} onClick={() => isMobile && setMenuOpen(false)}>Logo</Link>}
        <Link to="/pagecontrol" style={styles.link} onClick={() => isMobile && setMenuOpen(false)}>Page Control</Link>
      </nav>
    </header>
  );
}

const styles = {
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    color: 'white',
    padding: '15px',
  },
  siteName: {
    fontSize: '20px',
  },
  menuButton: {
    fontSize: '24px',
    background: 'none',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  navLinks: {
    backgroundColor: '#444',
    padding: '10px',
    gap: '15px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};
