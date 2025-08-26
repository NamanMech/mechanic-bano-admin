import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner'; // Import the Spinner component

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

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>Page Visibility Control</h2>
      {pages.length === 0 ? (
        <div className="page-control-error">
          <p className="no-data">No pages found or unable to load page data.</p>
          <button onClick={loadPages} className="btn-primary retry-button">
            Retry Loading Pages
          </button>
          <div className="debug-info">
            <p>API_URL: {API_URL}</p>
            <p>Endpoint being called: {API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL}/general?type=pagecontrol</p>
          </div>
        </div>
      ) : (
        <table
          className="custom-table"
          role="table"
          aria-label="Page visibility control table"
        >
          <thead>
            <tr>
              <th scope="col">Page</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page._id}>
                <td>{formatPageName(page.page)}</td>
                <td>
                  <span className={`status-icon ${page.enabled ? 'active' : 'inactive'}`}>
                    {page.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td>
                  {page.page === 'pagecontrol' ? (
                    <button
                      className="btn-primary locked-button"
                      disabled
                      aria-label={`${formatPageName(page.page)} page is locked and cannot be changed`}
                    >
                      Locked
                    </button>
                  ) : (
                    <button
                      onClick={() => togglePageStatus(page._id, page.enabled, page.page)}
                      className={page.enabled ? 'btn-delete' : 'btn-edit'}
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
