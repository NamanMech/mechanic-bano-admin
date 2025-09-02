import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function PageControlManagement({ fetchPageStatus }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  const formatPageName = (page) =>
    page
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

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
      toast.error('Error fetching pages.');
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
      await axios.put(`${getBaseUrl()}/general?type=pagecontrol&id=${id}`, {
        enabled: !currentStatus,
      });
      toast.success(
        `"${formatPageName(pageName)}" ${currentStatus ? 'disabled' : 'enabled'} successfully`
      );
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

  if (loading) return <Spinner />;

  if (pages.length === 0)
    return <p>No pages found or unable to load page data.</p>;

  return (
    <div className="container" style={{ overflowX: 'auto' }}>
      <table className="custom-table" style={{ width: '100%', minWidth: '300px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '12px' }}>Page</th>
            <th style={{ textAlign: 'center', padding: '12px' }}>Status</th>
            <th style={{ textAlign: 'center', padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id} style={{ borderBottom: '1px solid #444' }}>
              <td style={{ padding: '12px' }}>{formatPageName(page.page)}</td>
              <td style={{ textAlign: 'center', padding: '12px' }}>
                {page.enabled ? (
                  <span
                    style={{
                      color: 'white',
                      backgroundColor: '#28a745',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      userSelect: 'none',
                      display: 'inline-block',
                      minWidth: '50px',
                    }}
                  >
                    Enabled
                  </span>
                ) : (
                  <span
                    style={{
                      color: 'white',
                      backgroundColor: '#dc3545',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      userSelect: 'none',
                      display: 'inline-block',
                      minWidth: '50px',
                    }}
                  >
                    Disabled
                  </span>
                )}
              </td>
              <td style={{ textAlign: 'center', padding: '12px' }}>
                {page.page === 'pagecontrol' ? (
                  <button
                    disabled
                    style={{
                      cursor: 'not-allowed',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      border: 'none',
                      fontWeight: '600',
                    }}
                    title="This page can't be disabled"
                  >
                    Protected
                  </button>
                ) : (
                  <button
                    onClick={() => togglePageStatus(page._id, page.enabled, page.page)}
                    style={{
                      backgroundColor: page.enabled ? '#dc3545' : '#28a745',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                    }}
                    aria-label={`${
                      page.enabled ? 'Disable' : 'Enable'
                    } ${formatPageName(page.page)} page`}
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
