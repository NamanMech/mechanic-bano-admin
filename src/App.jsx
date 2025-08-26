import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import YouTubeVideoManagement from './pages/YouTubeVideoManagement';
import PDFManagement from './pages/PDFManagement';
import WelcomeNoteManagement from './pages/WelcomeNoteManagement';
import SiteNameManagement from './pages/SiteNameManagement';
import PageControlManagement from './pages/PageControlManagement';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';
import axios from 'axios';
import UserManagement from './pages/UserManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [pageStatus, setPageStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPageStatus = async () => {
    try {
      // Remove any trailing slash from API_URL to avoid double slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      const response = await axios.get(`${baseUrl}/general?type=pagecontrol`);
      
      // Check if response structure matches expected format
      if (response.data && response.data.success) {
        const statusMap = {};
        (response.data.data ?? []).forEach(({ page, enabled }) => {
          statusMap[page] = enabled;
        });
        setPageStatus(statusMap);
      } else if (Array.isArray(response.data)) {
        // Handle case where API returns array directly
        const statusMap = {};
        response.data.forEach(({ page, enabled }) => {
          statusMap[page] = enabled;
        });
        setPageStatus(statusMap);
      } else {
        toast.error('Unexpected response structure from server');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      toast.error('Error fetching page control');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageStatus();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <Spinner />
      </div>
    );
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
          <Route path="/pagecontrol" element={<PageControlManagement fetchPageStatus={fetchPageStatus} />} />
          {pageStatus['subscription-plans'] && <Route path="/subscription-plans" element={<SubscriptionPlans />} />}
          {pageStatus.users && <Route path="/users" element={<UserManagement />} />}
        </Routes>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Router>
  );
}
