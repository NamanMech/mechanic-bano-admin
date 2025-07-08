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
    } catch (error) {
      toast.error('Failed to fetch page status');
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
      fetchPages();
    } catch (error) {
      toast.error('Toggle failed');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const formatPageName = (slug) => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Page Control Management</h2>
      <table className="page-control-table">
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
              <td>{formatPageName(page.page)}</td>
              <td>{page.enabled ? 'Enabled' : 'Disabled'}</td>
              <td>
                {page.page === 'pagecontrol' ? (
                  <button
                    style={{
                      ...styles.toggleBtn,
                      backgroundColor: '#7f8c8d',
                      cursor: 'not-allowed',
                    }}
                    disabled
                    title="This page cannot be disabled"
                  >
                    🔒 Locked
                  </button>
                ) : (
                  <button
                    onClick={() => togglePageStatus(page._id, page.enabled, page.page)}
                    style={{
                      ...styles.toggleBtn,
                      backgroundColor: page.enabled ? '#e67e22' : '#2ecc71',
                    }}
                  >
                    {page.enabled ? 'Disable' : 'Enable'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .page-control-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #2c3e50;
          color: white;
          margin-top: 20px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .page-control-table th,
        .page-control-table td {
          padding: 12px 16px;
          text-align: left;
        }

        .page-control-table th {
          background-color: #1f2a36;
          font-size: 16px;
        }

        .page-control-table td {
          font-size: 15px;
          border-top: 1px solid #3c4a5a;
        }

        @media (max-width: 600px) {
          .page-control-table th,
          .page-control-table td {
            padding: 10px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  heading: {
    textAlign: 'center',
    color: 'white',
    fontSize: '24px',
    marginBottom: '20px',
  },
  toggleBtn: {
    padding: '8px 14px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
