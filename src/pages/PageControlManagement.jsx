import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { toast } from 'react-toastify';

export default function PageControlManagement({ fetchPageStatus }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const loadPages = async () => {
    try {
      const response = await axios.get(`${API_URL}general?type=pagecontrol`);
      // Extract the data from the standardized response
      setPages(response.data.data || []);
    } catch (err) {
      toast.error('Error fetching pages');
      console.error('Error details:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePageStatus = async (id, currentStatus, pageName) => {
    if (pageName === 'pagecontrol') {
      toast.warning("This page can't be disabled");
      return;
    }
    
    const confirmToggle = window.confirm(
      `Are you sure you want to ${currentStatus ? 'disable' : 'enable'} "${formatPageName(pageName)}"?`
    );
    
    if (!confirmToggle) return;
    
    try {
      await axios.put(`${API_URL}general?type=pagecontrol&id=${id}`, {
        enabled: !currentStatus,
      });
      
      toast.success(`"${formatPageName(pageName)}" ${currentStatus ? 'disabled' : 'enabled'} successfully`);
      await loadPages();
      
      // Only call fetchPageStatus if it's provided as a prop
      if (fetchPageStatus && typeof fetchPageStatus === 'function') {
        await fetchPageStatus();
      }
    } catch (err) {
      toast.error('Failed to update page status');
      console.error('Error details:', err.response?.data || err.message);
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

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 style={styles.heading}>Page Visibility Control</h2>
      {pages.length === 0 ? (
        <p style={styles.noData}>No pages found or unable to load page data.</p>
      ) : (
        <table
          style={styles.table}
          role="table"
          aria-label="Page visibility control table"
        >
          <thead>
            <tr>
              <th style={styles.th} scope="col">Page</th>
              <th style={styles.th} scope="col">Status</th>
              <th style={styles.th} scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page._id}>
                <td style={styles.td}>{formatPageName(page.page)}</td>
                <td style={styles.td}>
                  <span style={{ 
                    color: page.enabled ? '#2ecc71' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {page.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td style={styles.td}>
                  {page.page === 'pagecontrol' ? (
                    <button
                      style={{ ...styles.button, backgroundColor: '#95a5a6', cursor: 'not-allowed' }}
                      disabled
                      aria-label={`${formatPageName(page.page)} page is locked and cannot be changed`}
                    >
                      Locked
                    </button>
                  ) : (
                    <button
                      onClick={() => togglePageStatus(page._id, page.enabled, page.page)}
                      style={{
                        ...styles.button,
                        backgroundColor: page.enabled ? '#e74c3c' : '#2ecc71',
                      }}
                      aria-pressed={page.enabled}
                      aria-label={`${page.enabled ? 'Disable' : 'Enable'} ${formatPageName(page.page)} page`}
                    >
                      {page.enabled ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
  noData: {
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: '16px',
    padding: '20px',
  },
};
