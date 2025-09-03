import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import '../styles/pages/site-name-management.css';

export default function SiteNameManagement() {
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  const fetchSiteName = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/general?type=sitename`);
      if (response.data && response.data.success && response.data.data && response.data.data.name) {
        setSiteName(response.data.data.name);
      } else if (response.data && response.data.name) {
        setSiteName(response.data.name);
      } else {
        console.error('Unexpected response structure:', response);
        setSiteName('Mechanic Bano'); // Default fallback
      }
    } catch (error) {
      toast.error('Error fetching site name');
      console.error('Error details:', error.response?.data || error.message);
      setSiteName('Mechanic Bano'); // Default fallback on error
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSiteName();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!siteName.trim()) {
      toast.error('Site name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${getBaseUrl()}/general?type=sitename`, { name: siteName.trim() });
      toast.success('Site name updated successfully');
    } catch (error) {
      toast.error('Error updating site name');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner message="Loading site name..." />;

  return (
    <div className="container site-name-management">
      <h1>Site Name Management</h1>
      <p className="current-site-name">
        Current Site Name: <span>{siteName || '-'}</span>
      </p>
      <form onSubmit={handleSubmit} className="site-name-form" aria-label="Update Site Name form">
        <label htmlFor="siteNameInput">Enter New Site Name</label>
        <input
          id="siteNameInput"
          type="text"
          placeholder="Enter New Site Name"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Update Site Name'}
        </button>
      </form>
    </div>
  );
}
