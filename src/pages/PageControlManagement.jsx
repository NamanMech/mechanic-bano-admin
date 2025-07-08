import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function PageControlManagement() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPages = async () => {
    try {
      const response = await axios.get(`${API_URL}general?type=pagecontrol`);
      setPages(response.data);
    } catch (error) {
      toast.error('Failed to load page controls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const togglePageStatus = async (id, currentStatus, pageName) => {
    try {
      await axios.put(`${API_URL}general?type=pagecontrol&id=${id}`, {
        enabled: !currentStatus,
      });
      toast.success(`"${formatPageName(pageName)}" ${currentStatus ? 'disabled' : 'enabled'} successfully`);
      
      // ✅ Update local state instantly
      setPages(prev =>
        prev.map(p =>
          p._id === id ? { ...p, enabled: !currentStatus } : p
        )
      );
    } catch (error) {
      toast.error('Toggle failed');
    }
  };

  const formatPageName = (key) => {
    const mapping = {
      videos: 'Videos',
      pdfs: 'PDFs',
      welcome: 'Welcome Note',
      sitename: 'Site Name',
      'subscription-plans': 'Subscription Plans',
      users: 'Users',
      pagecontrol: 'Page Control',
    };
    return mapping[key] || key;
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2 className="title">Page Control Management</h2>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Page Name</th>
              <th>Status</th>
              <th>Toggle</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(({ _id, page, enabled }) => (
              <tr key={_id}>
                <td>{formatPageName(page)}</td>
                <td style={{ color: enabled ? 'lightgreen' : 'tomato', fontWeight: 'bold' }}>
                  {enabled ? 'Enabled' : 'Disabled'}
                </td>
                <td>
                  {page === 'pagecontrol' ? (
                    <button className="locked" disabled>Locked</button>
                  ) : (
                    <button
                      className={enabled ? 'disable-btn' : 'enable-btn'}
                      onClick={() => togglePageStatus(_id, enabled, page)}
                    >
                      {enabled ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .container {
          padding: 20px;
          background-color: #1e1e1e;
          color: white;
        }

        .title {
          text-align: center;
          margin-bottom: 20px;
          color: #ff9800;
        }

        .table-container {
          overflow-x: auto;
        }

        .styled-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #2c3e50;
        }

        .styled-table th,
        .styled-table td {
          padding: 12px 16px;
          text-align: left;
        }

        .styled-table th {
          background-color: #1e1e1e;
          color: white;
        }

        .styled-table tr:nth-child(even) {
          background-color: #34495e;
        }

        .enable-btn {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        .disable-btn {
          background-color: #ff9800;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        .locked {
          background-color: grey;
          color: white;
          padding: 6px 12px;
          border-radius: 5px;
          border: none;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .styled-table th, .styled-table td {
            padding: 10px;
          }

          .title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
