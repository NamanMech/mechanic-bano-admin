import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PageControlManagement() {
  const [pages, setPages] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPages = async () => {
    try {
      const response = await axios.get(`${API_URL}general?type=pagecontrol`);
      setPages(response.data);
    } catch (error) {
      toast.error('Error fetching pages');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const togglePage = async (id, currentStatus) => {
    setLoadingId(id);
    try {
      await axios.put(`${API_URL}general?type=pagecontrol&id=${id}`, {
        enabled: !currentStatus,
      });
      toast.success('Page status updated successfully');
      fetchPages();
    } catch (error) {
      toast.error('Error updating page status');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Page Control Management</h1>
      {pages.length === 0 ? (
        <p>No pages found.</p>
      ) : (
        pages.map((page) => (
          <div key={page._id} style={{ marginBottom: '10px' }}>
            <span style={{ marginRight: '10px' }}>{page.page}</span>
            <button
              onClick={() => togglePage(page._id, page.enabled)}
              disabled={loadingId === page._id}
            >
              {loadingId === page._id ? 'Updating...' : page.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
