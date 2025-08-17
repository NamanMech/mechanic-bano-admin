import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SiteNameManagement() {
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchSiteName = async () => {
    try {
      const response = await axios.get(`${API_URL}general?type=sitename`);
      if (response.data && response.data.name) {
        setSiteName(response.data.name);
      }
    } catch (error) {
      toast.error('Error fetching site name');
    }
  };

  useEffect(() => {
    fetchSiteName();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_URL}general?type=sitename`, { name: siteName.trim() });
      toast.success('Site name updated successfully');
    } catch (error) {
      toast.error('Error updating site name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '450px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '12px' }}>Site Name Management</h1>
      <p style={{ fontWeight: 'bold', marginBottom: '24px' }}>
        Current Site Name: <span style={{ color: '#34495e' }}>{siteName || '-'}</span>
      </p>
      <form 
        onSubmit={handleSubmit} 
        style={{ display: 'grid', gap: '12px' }} 
        aria-label="Update Site Name form"
      >
        <label htmlFor="siteNameInput" style={{ fontWeight: '600' }}>
          Enter New Site Name
        </label>
        <input
          id="siteNameInput"
          type="text"
          placeholder="Enter New Site Name"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          required
          disabled={loading}
          style={{ padding: '8px 12px', fontSize: '16px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px', fontWeight: 'bold' }}>
          {loading ? 'Saving...' : 'Update Site Name'}
        </button>
      </form>
    </div>
  );
}
