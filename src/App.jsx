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
import PendingSubscriptions from './pages/PendingSubscriptions';
import UPIManagement from './pages/UPIManagement';
import { getApiUrl, handleApiError } from './utils/api';

export default function App() {
  const [pageStatus, setPageStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPageStatus = async () => {
    try {
      const response = await axios.get(getApiUrl('general?type=pagecontrol'));
      
      if (response.data && response.data.success) {
        const statusMap = {};
        (response.data.data ?? []).forEach(({ page, enabled }) => {
          statusMap[page] = enabled;
        });
        setPageStatus(statusMap);
      } else if (Array.isArray(response.data)) {
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
      const errorMessage = handleApiError(error, 'Error fetching page control');
      toast.error(errorMessage);
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
          <Route path="/pending-subscriptions" element={<PendingSubscriptions />} />
          <Route path="/upi" element={<UPIManagement />} />
        </Routes>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Router>
  );
}
