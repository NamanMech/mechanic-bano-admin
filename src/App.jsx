// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import YouTubeVideoManagement from './pages/YouTubeVideoManagement';
import PDFManagement from './pages/PDFManagement';
import WelcomeNoteManagement from './pages/WelcomeNoteManagement';
import SiteNameManagement from './pages/SiteNameManagement';
import PageControlManagement from './pages/PageControlManagement'; // ✅ Import added

export default function App() {
  return (
    <Router>
      <header style={{ backgroundColor: '#333', color: 'white', padding: '15px' }}>
        <h1>Mechanic Bano - Admin Panel</h1>
        <nav style={{ marginTop: '10px' }}>
          <Link to="/" style={{ marginRight: '15px', color: 'white' }}>Home</Link>
          <Link to="/videos" style={{ marginRight: '15px', color: 'white' }}>Videos</Link>
          <Link to="/pdfs" style={{ marginRight: '15px', color: 'white' }}>PDFs</Link>
          <Link to="/welcome" style={{ marginRight: '15px', color: 'white' }}>Welcome Note</Link>
          <Link to="/sitename" style={{ marginRight: '15px', color: 'white' }}>Site Name</Link>
          <Link to="/pagecontrol" style={{ color: 'white' }}>Page Control</Link> {/* ✅ New Link */}
        </nav>
      </header>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<YouTubeVideoManagement />} />
          <Route path="/pdfs" element={<PDFManagement />} />
          <Route path="/welcome" element={<WelcomeNoteManagement />} />
          <Route path="/sitename" element={<SiteNameManagement />} />
          <Route path="/pagecontrol" element={<PageControlManagement />} /> {/* ✅ New Route */}
        </Routes>
      </div>
    </Router>
  );
}
