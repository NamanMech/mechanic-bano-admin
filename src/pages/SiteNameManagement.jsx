import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SiteNameManagement() {
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSiteName = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + 'sitename');
      if (response.data && response.data.name) {
        setSiteName(response.data.name); // ✅ Correct here
      }
    } catch (error) {
      alert('Error fetching site name');
    }
  };

  useEffect(() => {
    fetchSiteName();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(import.meta.env.VITE_API_URL + 'sitename', { name: siteName });
      alert('Site name updated successfully');
    } catch (error) {
      alert('Error updating site name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Site Name Management</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Enter Site Name"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Update Site Name'}
        </button>
      </form>
    </div>
  );
}
