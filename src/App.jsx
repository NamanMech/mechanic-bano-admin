// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import YouTubeVideoManagement from './pages/YouTubeVideoManagement';
import PDFManagement from './pages/PDFManagement';
import WelcomeNoteManagement from './pages/WelcomeNoteManagement';
import SiteNameManagement from './pages/SiteNameManagement';
import LogoManagement from './pages/LogoManagement';
import PageControlManagement from './pages/PageControlManagement';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Navbar from './components/Navbar';
import axios from 'axios';
import UserManagement from './pages/UserManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [pageStatus, setPageStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPageStatus = async () => {
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
    fetchPageStatus();
  }, []);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <Router>
      <Navbar pageStatus={pageStatus} />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {pageStatus.videos && <Route path="/videos" element={<YouTubeVideoManagement />} />}
          {pageStatus.pdfs && <Route path="/pdfs" element={<PDFManagement />} />}
          {pageStatus.welcome && <Route path="/welcome" element={<WelcomeNoteManagement />} />}
          {pageStatus.sitename && <Route path="/sitename" element={<SiteNameManagement />} />}
          {pageStatus.logo && <Route path="/logo" element={<LogoManagement />} />}
          <Route path="/pagecontrol" element={<PageControlManagement />} />
          <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Router>
  );
}
