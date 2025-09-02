import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function PageControlManagement({ fetchPageStatus }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Helper: Remove trailing slash to avoid double slashes
  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  // Format page name for display
  const formatPageName = (page) =>
    page.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  // Fetch pages with page control status
  const loadPages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/general?type=pagecontrol`);
      if (response.data && response.data.success) {
        setPages(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setPages(response.data);
      } else {
        toast.error('Unexpected response format from server');
        console.error('Unexpected response:', response);
      }
    } catch (err) {
      toast.error('Error fetching pages. Check console for details.');
      console.error('Error details:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle page status on/off
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
      await axios.put(`${getBaseUrl()}/general?type=pagecontrol&id=${id}`, {
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

  useEffect(() => {
    loadPages();
  }, []);

  if (loading)
    return (
      <div className="spinner-container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <Spinner message="Loading pages..." />
      </div>
    );

  if (!pages.length)
    return (
      <p className="text-center" style={{ marginTop: '20px' }}>
        No pages found or unable to load page data.
      </p>
    );

  return (
    <div className="page-control-management">
      <table className="custom-table" aria-label="Page Control Management Table" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th scope="col">Page</th>
            <th scope="col">Status</th>
            <th scope="col" style={{ minWidth: '120px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id || page.id || page.page}>
              <td>{formatPageName(page.page)}</td>
              <td style={{ color: page.enabled ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                {page.enabled ? 'Enabled' : 'Disabled'}
              </td>
              <td>
                {page.page === 'pagecontrol' ? (
                  <button type="button" disabled aria-label={`Cannot disable page control`}>
                    Locked
                  </button>
                ) : (
                  <button
                    type="button"
                    className={page.enabled ? 'btn-danger' : 'btn-success'}
                    onClick={() => togglePageStatus(page._id || page.id, page.enabled, page.page)}
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
    </div>
  );
}
