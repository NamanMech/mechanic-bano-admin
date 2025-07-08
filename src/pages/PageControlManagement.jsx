import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PageControlManagement() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPages = async () => {
    try {
      const res = await axios.get(`${API_URL}general?type=pagecontrol`);
      setPages(res.data);
    } catch (err) {
      toast.error('Failed to load page controls');
    } finally {
      setLoading(false);
    }
  };

  const togglePageStatus = async (id, currentStatus, pageName) => {
    if (pageName === 'pagecontrol') {
      toast.warning('This page cannot be disabled');
      return;
    }

    try {
      await axios.put(`${API_URL}general?type=pagecontrol&id=${id}`, {
        enabled: !currentStatus,
      });
      toast.success('Page status updated');
      fetchPages();
    } catch (err) {
      toast.error('Error updating page status');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Page Control Management</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Page Name</th>
            <th>Status</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td>{page.page}</td>
              <td>{page.enabled ? 'Enabled' : 'Disabled'}</td>
              <td>
                <button
                  onClick={() => togglePageStatus(page._id, page.enabled, page.page)}
                  style={{
                    ...styles.toggleBtn,
                    backgroundColor: page.page === 'pagecontrol'
                      ? '#7f8c8d'
                      : page.enabled
                      ? '#e67e22'
                      : '#2ecc71',
                    cursor: page.page === 'pagecontrol' ? 'not-allowed' : 'pointer',
                  }}
                  disabled={page.page === 'pagecontrol'}
                >
                  {page.page === 'pagecontrol'
                    ? 'Locked'
                    : page.enabled
                    ? 'Disable'
                    : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#2c3e50',
    color: '#fff',
  },
  toggleBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
  },
};
