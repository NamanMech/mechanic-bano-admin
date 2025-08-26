import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PageControlManagement({ fetchPageStatus }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const loadPages = async () => {
    try {
      // Remove any trailing slash from API_URL to avoid double slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      const response = await axios.get(`${baseUrl}/general?type=pagecontrol`);
      
      // Check if response structure matches expected format
      if (response.data && response.data.success) {
        setPages(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        // Handle case where API returns array directly
        setPages(response.data);
      } else {
        toast.error('Unexpected response format from server');
        console.error('Unexpected response:', response);
      }
    } catch (err) {
      toast.error('Error fetching pages. Check console for details.');
      console.error('Error details:', err.response?.data || err.message);
      console.error('Full error:', err);
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
      // Remove any trailing slash from API_URL to avoid double slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      await axios.put(`${baseUrl}/general?type=pagecontrol&id=${id}`, {
        enabled: !currentStatus,
      });
      
      toast.success(`"${formatPageName(pageName)}" ${currentStatus ? 'disabled' : 'enabled'} successfully`);
      await loadPages();
      
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

  if (loading) return <div className="spinner">Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Page Visibility Control</h2>
      {pages.length === 0 ? (
        <div style={styles.errorContainer}>
          <p style={styles.noData}>No pages found or unable to load page data.</p>
          <button onClick={loadPages} style={styles.retryButton}>
            Retry Loading Pages
          </button>
          <div style={styles.debugInfo}>
            <p>API_URL: {API_URL}</p>
            <p>Endpoint being called: {API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL}/general?type=pagecontrol</p>
          </div>
        </div>
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
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
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
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  noData: {
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: '16px',
    padding: '20px',
    backgroundColor: '#2c3e50',
    borderRadius: '8px',
    margin: '20px 0',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '20px',
  },
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '10px 0',
  },
  debugInfo: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '5px',
    textAlign: 'left',
    fontSize: '14px',
  }
};
