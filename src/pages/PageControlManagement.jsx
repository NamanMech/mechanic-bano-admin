// src/pages/PageControlManagement.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PageControlManagement() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPages = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + 'pagecontrol');
      setPages(response.data);
    } catch (error) {
      alert('Error fetching pages');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const togglePage = async (pageName, currentStatus) => {
    setLoading(true);
    try {
      await axios.put(import.meta.env.VITE_API_URL + 'pagecontrol', {
        page: pageName,
        enabled: !currentStatus,
      });
      fetchPages();
    } catch (error) {
      alert('Error updating page status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Page Control Management</h1>
      {pages.map((page) => (
        <div key={page._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ marginRight: '15px', minWidth: '100px' }}>{page.page}</span>
          <button
            onClick={() => togglePage(page.page, page.enabled)}
            disabled={loading}
            style={{ backgroundColor: page.enabled ? '#4caf50' : '#f44336', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}
          >
            {page.enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      ))}
    </div>
  );
}
