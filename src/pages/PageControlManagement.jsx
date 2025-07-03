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
      await axios.put(import.meta.env.VITE_API_URL + 'pagecontrol', { page: pageName, enabled: !currentStatus });
      fetchPages();
    } catch (error) {
      alert('Error updating page status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Page Control Management</h1>
      {pages.map((page) => (
        <div key={page._id} style={{ marginBottom: '10px' }}>
          <span style={{ marginRight: '10px' }}>{page.page}</span>
          <button onClick={() => togglePage(page.page, page.enabled)} disabled={loading}>
            {page.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      ))}
    </div>
  );
}
