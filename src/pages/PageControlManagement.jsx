import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PageControlManagement({ fetchPageStatus }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const loadPages = async () => {
    try {
      const response = await axios.get(`${API_URL}general?type=pagecontrol`);
      setPages(response.data);
    } catch (err) {
      toast.error('Error fetching pages');
    } finally {
      setLoading(false);
    }
  };

  const togglePageStatus = async (id, currentStatus, pageName) => {
    try {
      await axios.put(`${API_URL}general?type=pagecontrol&id=${id}`, {
        enabled: !currentStatus,
      });
      toast.success(`"${formatPageName(pageName)}" ${currentStatus ? 'disabled' : 'enabled'} successfully`);
      await loadPages();           // refresh table
      await fetchPageStatus();     // refresh navbar
    } catch (err) {
      toast.error('Failed to update page status');
    }
  };

  const formatPageName = (page) => {
    return page
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  useEffect(() => {
    loadPages();
  }, []);

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <h2 style={styles.heading}>Page Visibility Control</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Page</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => (
            <tr key={page._id}>
              <td style={styles.td}>{formatPageName(page.page)}</td>
              <td style={styles.td}>{page.enabled ? 'Enabled' : 'Disabled'}</td>
              <td style={styles.td}>
                <button
                  onClick={() => togglePageStatus(page._id, page.enabled, page.page)}
                  style={{
                    ...styles.button,
                    backgroundColor: page.enabled ? '#e74c3c' : '#2ecc71',
                  }}
                >
                  {page.enabled ? 'Disable' : 'Enable'}
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
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#ff9800',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#2c3e50',
    color: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    padding: '12px 16px',
    backgroundColor: '#34495e',
    textAlign: 'left',
    borderBottom: '1px solid #444',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #444',
  },
  button: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
