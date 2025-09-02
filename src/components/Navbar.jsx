import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar" style={{ backgroundColor: '#282c34', padding: '10px 20px', color: 'white', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="navbar-container">
        <div className="site-name" style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Mechanic Bano
        </div>

        {/* Hamburger icon */}
        <div className="menu-toggle mobile-only" onClick={toggleMenu} aria-label="Toggle navigation menu" role="button" tabIndex={0} onKeyPress={e => e.key === 'Enter' && toggleMenu()}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Nav links */}
        <div className={`nav-links desktop-only ${menuOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '15px' }}>
          <NavLink to="/" activeClassName="active" style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Home</NavLink>
          <NavLink to="/videos" activeClassName="active" style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Videos</NavLink>
          <NavLink to="/welcome-note" activeClassName="active" style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Welcome Note</NavLink>
          <NavLink to="/page-control" activeClassName="active" style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Page Control</NavLink>
          <NavLink to="/users" activeClassName="active" style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Users</NavLink>
          <NavLink to="/subscription" activeClassName="active" style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Subscription</NavLink>
          <NavLink to="/pending-subscriptions" activeClassName="active" style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Pending Subscriptions</NavLink>
          <NavLink to="/upi" activeClassName="active" style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>UPI ID</NavLink>
        </div>

        {/* Mobile Nav links (hidden by default) */}
        <div className={`nav-links mobile-only ${menuOpen ? 'open' : ''}`} style={{ display: menuOpen ? 'flex' : 'none', flexDirection: 'column', gap: '10px' }}>
          <NavLink to="/" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Home</NavLink>
          <NavLink to="/videos" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Videos</NavLink>
          <NavLink to="/welcome-note" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Welcome Note</NavLink>
          <NavLink to="/page-control" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Page Control</NavLink>
          <NavLink to="/users" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Users</NavLink>
          <NavLink to="/subscription" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Subscription</NavLink>
          <NavLink to="/pending-subscriptions" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>Pending Subscriptions</NavLink>
          <NavLink to="/upi" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ color: isActive ? '#ffa726' : 'white', textDecoration: 'none' })}>UPI ID</NavLink>
        </div>
      </div>
    </nav>
  );
}
