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
import UserManagement from './pages/UserManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PendingSubscriptions from './pages/PendingSubscriptions';
import UPIManagement from './pages/UPIManagement';
import { getApiUrl, handleApiError } from './utils/api';

export default function App() {
  const [pageStatus, setPageStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  const fetchPageStatus = async () => {
    try {
      const response = await fetch(getApiUrl('general?type=pagecontrol'));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.success) {
        const statusMap = {};
        (data.data || []).forEach(({ page, enabled }) => {
          statusMap[page] = enabled;
        });
        setPageStatus(statusMap);
        setApiStatus('connected');
      } else if (Array.isArray(data)) {
        const statusMap = {};
        data.forEach(({ page, enabled }) => {
          statusMap[page] = enabled;
        });
        setPageStatus(statusMap);
        setApiStatus('connected');
      } else {
        toast.error('Unexpected response structure from server');
        console.error('Unexpected response:', data);
        setApiStatus('error');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error fetching page control');
      toast.error(errorMessage);
      setApiStatus('error');
      console.error('API Connection Error:', error);
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

  if (apiStatus === 'error') {
    return (
      <div className="error-container">
        <h1>Connection Error</h1>
        <p>Could not connect to the server. Please check:</p>
        <ul>
          <li>API server is running</li>
          <li>API URL is correctly configured</li>
          <li>Network connection is active</li>
        </ul>
        <button onClick={fetchPageStatus} className="btn-primary">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <Router>
      <Navbar pageStatus={pageStatus} />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<YouTubeVideoManagement />} />
          <Route path="/pdfs" element={<PDFManagement />} />
          <Route path="/welcome" element={<WelcomeNoteManagement />} />
          <Route path="/sitename" element={<SiteNameManagement />} />
          <Route path="/pagecontrol" element={<PageControlManagement fetchPageStatus={fetchPageStatus} />} />
          <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/pending-subscriptions" element={<PendingSubscriptions />} />
          <Route path="/upi" element={<UPIManagement />} />
        </Routes>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Router>
  );
}
