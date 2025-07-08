import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PageControlManagement() {
  const [pages, setPages] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [newPage, setNewPage] = useState('');
  const [adding, setAdding] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPages = async () => {
    try {
      const response = await axios.get(`${API_URL}general?type=pagecontrol`);
      setPages(response.data);
    } catch (error) {
      toast.error('Error fetching pages');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const togglePage = async (id, currentStatus) => {
    setLoadingId(id);
    try {
      await axios.put(`${API_URL}general?type=pagecontrol&id=${id}`, {
        enabled: !currentStatus,
      });
      toast.success('Page status updated');
      fetchPages();
    } catch (error) {
      toast.error('Error updating page status');
    } finally {
      setLoadingId(null);
    }
  };

  const handleAddPage = async (e) => {
    e.preventDefault();
    if (!newPage.trim()) {
      toast.warning('Page name is required');
      return;
    }

    setAdding(true);
    try {
      await axios.post(`${API_URL}general?type=pagecontrol`, {
        page: newPage.trim(),
        enabled: true,
      });
      toast.success('Page control added');
      setNewPage('');
      fetchPages();
    } catch (error) {
      toast.error('Error adding page');
    } finally {
      setAdding(false);
    }
  };

  const handleDeletePage = async (id) => {
    if (!confirm('Are you sure you want to delete this page control?')) return;

    setLoadingId(id);
    try {
      await axios.delete(`${API_URL}general?type=pagecontrol&id=${id}`);
      toast.success('Page control deleted');
      fetchPages();
    } catch (error) {
      toast.error('Error deleting page');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Page Control Management</h2>

      <form onSubmit={handleAddPage} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter new page name"
          value={newPage}
          onChange={(e) => setNewPage(e.target.value)}
        />
        <button type="submit" disabled={adding}>
          {adding ? 'Adding...' : 'Add Page'}
        </button>
      </form>

      {pages.length === 0 ? (
        <p>No pages found.</p>
      ) : (
        pages.map((page) => (
          <div
            key={page._id}
            style={{
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#2c2c2c',
              padding: '10px 15px',
              borderRadius: '6px',
            }}
          >
            <span>{page.page}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => togglePage(page._id, page.enabled)}
                disabled={loadingId === page._id}
                className={page.enabled ? 'btn-delete' : 'btn-edit'}
              >
                {loadingId === page._id
                  ? 'Updating...'
                  : page.enabled
                  ? 'Disable'
                  : 'Enable'}
              </button>

              <button
                onClick={() => handleDeletePage(page._id)}
                disabled={loadingId === page._id}
                className="btn-delete"
              >
                {loadingId === page._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
