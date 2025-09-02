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

export default function App() {
  const [pageStatus, setPageStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPageStatus = async () => {
    try {
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      const response = await axios.get(`${baseUrl}/general?type=pagecontrol`);
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
    return <Spinner />;
  }

  return (
    <Router>
      <Navbar pageStatus={pageStatus} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        {pageStatus['youtube'] !== false && <Route path="/youtube" element={<YouTubeVideoManagement />} />}
        {pageStatus['pdf'] !== false && <Route path="/pdf" element={<PDFManagement />} />}
        {pageStatus['welcome'] !== false && <Route path="/welcome" element={<WelcomeNoteManagement />} />}
        {pageStatus['site-name'] !== false && <Route path="/sitename" element={<SiteNameManagement />} />}
        {pageStatus['pagecontrol'] !== false && <Route path="/pagecontrol" element={<PageControlManagement fetchPageStatus={fetchPageStatus} />} />}
        {pageStatus['subscription'] !== false && <Route path="/subscription" element={<SubscriptionPlans />} />}
        {pageStatus['user'] !== false && <Route path="/user" element={<UserManagement />} />}
        {pageStatus['pending-subscriptions'] !== false && <Route path="/pending-subscriptions" element={<PendingSubscriptions />} />}
        {pageStatus['upi'] !== false && <Route path="/upi" element={<UPIManagement />} />}
      </Routes>
    </Router>
  );
}
