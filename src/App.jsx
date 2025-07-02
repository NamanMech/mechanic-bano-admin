import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import YouTubeVideoManagement from './YouTubeVideoManagement';
import YouTubePDFManagement from './YouTubePDFManagement';
import WelcomeNoteManagement from './WelcomeNoteManagement';

export default function App() {
  return (
    <Router>
      <header style={{ padding: '20px', backgroundColor: '#333', color: 'white' }}>
        <h1>Mechanic Bano - Admin Panel</h1>

        {/* Navigation */}
        <nav style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Videos</Link>
          <Link to="/pdfs" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>PDFs</Link>
          <Link to="/welcome" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Welcome Note</Link>
        </nav>
      </header>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<YouTubeVideoManagement />} />
          <Route path="/pdfs" element={<YouTubePDFManagement />} />
          <Route path="/welcome" element={<WelcomeNoteManagement />} />
        </Routes>
      </div>
    </Router>
  );
}
