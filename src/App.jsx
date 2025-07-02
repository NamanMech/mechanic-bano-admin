import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import YouTubeVideoManagement from './pages/YouTubeVideoManagement';
import PDFManagement from './pages/PDFManagement';

export default function App() {
  return (
    <Router>
      <header>
        <h1>Mechanic Bano Admin Panel</h1>
        <nav style={{ marginTop: '10px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>YouTube Videos</Link>
          <Link to="/pdf">PDF Management</Link>
        </nav>
      </header>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<YouTubeVideoManagement />} />
          <Route path="/pdf" element={<PDFManagement />} />
        </Routes>
      </div>
    </Router>
  );
}
