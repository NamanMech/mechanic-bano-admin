// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ pageStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div style={styles.headerContainer}>
        <h1 style={styles.siteName}>Mechanic Bano - Admin Panel</h1>
        <button onClick={toggleMenu} style={styles.menuButton}>
          ☰
        </button>
      </div>

      <nav style={{ ...styles.navLinks, display: menuOpen ? 'flex' : 'none' }}>
        <Link to="/" style={styles.link} onClick={() => setMenuOpen(false)}>Home</Link>
        {pageStatus.videos && <Link to="/videos" style={styles.link} onClick={() => setMenuOpen(false)}>Videos</Link>}
        {pageStatus.pdfs && <Link to="/pdfs" style={styles.link} onClick={() => setMenuOpen(false)}>PDFs</Link>}
        {pageStatus.welcome && <Link to="/welcome" style={styles.link} onClick={() => setMenuOpen(false)}>Welcome Note</Link>}
        {pageStatus.sitename && <Link to="/sitename" style={styles.link} onClick={() => setMenuOpen(false)}>Site Name</Link>}
        {pageStatus.logo && <Link to="/logo" style={styles.link} onClick={() => setMenuOpen(false)}>Logo</Link>}
        <Link to="/pagecontrol" style={styles.link} onClick={() => setMenuOpen(false)}>Page Control</Link>
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
    flexDirection: 'column',
    backgroundColor: '#444',
    padding: '10px',
  },
  link: {
    marginBottom: '10px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};
