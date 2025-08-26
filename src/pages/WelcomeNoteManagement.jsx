import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { showSuccessToast, showErrorToast } from '../utils/toast';

export default function WelcomeNoteManagement() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchNote = async () => {
    try {
      const response = await axios.get(`${API_URL}welcome`);
      if (response.data?.title && response.data?.message) {
        setTitle(response.data.title);
        setMessage(response.data.message);
      }
    } catch (error) {
      showErrorToast('Error fetching welcome note');
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_URL}welcome`, {
        title: title.trim(),
        message: message.trim(),
      });
      showSuccessToast('Welcome note updated successfully');
    } catch (error) {
      showErrorToast('Error saving welcome note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', minHeight: '100vh' }}>
      <div className="container">
        <h1 className="page-title">Welcome Note Management</h1>
        
        <div className="welcome-card">
          <form onSubmit={handleSubmit} className="form" aria-label="Update Welcome Note Form">
            <div className="input-group">
              <label htmlFor="welcome-title">Welcome Note Title</label>
              <input
                id="welcome-title"
                type="text"
                placeholder="Welcome Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="welcome-message">Welcome Note Message</label>
              <textarea
                id="welcome-message"
                placeholder="Welcome Note Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loading}
                rows={6}
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary save-button"
              disabled={loading}
              style={{ position: 'relative' }}
            >
              {loading ? <Spinner /> : 'Update Welcome Note'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
