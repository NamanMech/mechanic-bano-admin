import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

export default function WelcomeNoteManagement() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Normalize base API URL to avoid trailing slashes issues
  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  useEffect(() => {
    if (!API_URL) {
      showErrorToast('API URL is not configured');
    } else {
      fetchNote();
    }
  }, [API_URL]);

  const fetchNote = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/welcome`, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data) {
        setTitle(response.data.title || '');
        setMessage(response.data.message || '');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.code === 'NETWORK_ERROR') {
        showErrorToast('Network error. Please check your connection.');
      } else if (error.code === 'ECONNABORTED') {
        showErrorToast('Request timeout. Please try again.');
      } else {
        showErrorToast('Error fetching welcome note');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${getBaseUrl()}/welcome`,
        { title: title.trim(), message: message.trim() },
        { timeout: 10000, headers: { 'Content-Type': 'application/json' } }
      );
      showSuccessToast('Welcome note updated successfully');
    } catch (error) {
      console.error('Save error:', error);
      if (error.response?.status === 400) {
        showErrorToast('Invalid data. Please check your inputs.');
      } else if (error.code === 'NETWORK_ERROR') {
        showErrorToast('Network error. Please check your connection.');
      } else {
        showErrorToast('Error saving welcome note');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-container">
        <div className="container">
          <h1 className="page-title">Welcome Note Management</h1>
          <div className="welcome-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="page-title">Welcome Note Management</h1>
        <div className="welcome-card">
          <form onSubmit={handleSubmit} className="form" aria-label="Update Welcome Note Form">
            <div className="input-group">
              <label htmlFor="welcome-title">Welcome Note Title</label>
              <input
                id="welcome-title"
                type="text"
                placeholder="Welcome Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="welcome-message">Welcome Note Message</label>
              <textarea
                id="welcome-message"
                placeholder="Welcome Note Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loading}
                rows={6}
              />
            </div>
            <button type="submit" className="btn-primary save-button" disabled={loading}>
              {loading ? <Spinner /> : 'Update Welcome Note'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
