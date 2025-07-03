import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import YouTubeVideoManagement from './pages/YouTubeVideoManagement';
import PDFManagement from './pages/PDFManagement';
import WelcomeNoteManagement from './pages/WelcomeNoteManagement';
import SiteNameManagement from './pages/SiteNameManagement';
import PageControlManagement from './pages/PageControlManagement';
import axios from 'axios';

export default function App() {
  const [pageStatus, setPageStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPageControl = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + 'pagecontrol');
      const statusMap = {};
      response.data.forEach(item => {
        statusMap[item.page] = item.enabled;
      });
      setPageStatus(statusMap);
    } catch (error) {
      alert('Error fetching page control');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageControl();
  }, []);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <Router>
      <header style={{ backgroundColor: '#333', color: 'white', padding: '15px' }}>
        <h1>Mechanic Bano - Admin Panel</h1>
        <nav style={{ marginTop: '10px' }}>
          <Link to="/" style={{ marginRight: '15px', color: 'white' }}>Home</Link>
          {pageStatus.videos && <Link to="/videos" style={{ marginRight: '15px', color: 'white' }}>Videos</Link>}
          {pageStatus.pdfs && <Link to="/pdfs" style={{ marginRight: '15px', color: 'white' }}>PDFs</Link>}
          {pageStatus.welcome && <Link to="/welcome" style={{ marginRight: '15px', color: 'white' }}>Welcome Note</Link>}
          {pageStatus.sitename && <Link to="/sitename" style={{ marginRight: '15px', color: 'white' }}>Site Name</Link>}
          <Link to="/pagecontrol" style={{ color: 'white' }}>Page Control</Link>
        </nav>
      </header>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {pageStatus.videos && <Route path="/videos" element={<YouTubeVideoManagement />} />}
          {pageStatus.pdfs && <Route path="/pdfs" element={<PDFManagement />} />}
          {pageStatus.welcome && <Route path="/welcome" element={<WelcomeNoteManagement />} />}
          {pageStatus.sitename && <Route path="/sitename" element={<SiteNameManagement />} />}
          <Route path="/pagecontrol" element={<PageControlManagement />} />
        </Routes>
      </div>
    </Router>
  );
}
