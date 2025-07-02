import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home.jsx';
import YouTubeVideoManagement from './pages/YouTubeVideoManagement.jsx';
import PDFManagement from './pages/PDFManagement.jsx';
import WelcomeNoteManagement from './pages/WelcomeNoteManagement.jsx';
import SiteNameManagement from './SiteNameManagement';

export default function App() {
  return (
    <Router>
      <header style={{ padding: '20px', backgroundColor: '#007bff', color: 'white' }}>
        <h1>Mechanic Bano Admin Panel</h1>
        <nav style={{ marginTop: '10px' }}>
          <Link to="/" style={{ marginRight: '15px', color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/videos" style={{ marginRight: '15px', color: 'white', textDecoration: 'none' }}>Manage Videos</Link>
          <Link to="/pdfs" style={{ marginRight: '15px', color: 'white', textDecoration: 'none' }}>Manage PDFs</Link>
          <Link to="/welcome-note" style={{ color: 'white', textDecoration: 'none' }}>Manage Welcome Note</Link>
        </nav>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<YouTubeVideoManagement />} />
          <Route path="/pdfs" element={<PDFManagement />} />
          <Route path="/welcome-note" element={<WelcomeNoteManagement />} />
          <Route path="/sitename" element={<SiteNameManagement />} />
        </Routes>
      </div>
    </Router>
  );
}
