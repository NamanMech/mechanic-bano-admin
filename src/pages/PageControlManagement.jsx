import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/pages/page-control-management.css';
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

  if (loading) return <Spinner />;

  if (!pages.length) return <p>No pages found or unable to load page data.</p>;

  return (
    <div className="container table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Page</th>
            <th className="text-center">Status</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td>{formatPageName(page.page)}</td>
              <td className="text-center">
                <span className={`status-badge ${page.enabled ? 'status-approved' : 'status-rejected'}`}>
                  {page.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </td>
              <td className="text-center">
                {page.page === 'pagecontrol' ? (
                  <button disabled className="btn-disabled" title="This page can't be disabled">
                    Protected
                  </button>
                ) : (
                  <button
                    onClick={() => togglePageStatus(page._id, page.enabled, page.page)}
                    className={`btn-action btn-${page.enabled ? 'disable' : 'enable'}`}
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
