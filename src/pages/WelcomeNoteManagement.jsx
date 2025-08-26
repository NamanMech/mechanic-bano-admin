import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { showSuccessToast, showErrorToast } from '../utils/toast'; // Import from your centralized toast utilities

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
      showErrorToast('Error fetching welcome note'); // Use centralized function
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
      showSuccessToast('Welcome note updated successfully'); // Use centralized function
    } catch (error) {
      showErrorToast('Error saving welcome note'); // Use centralized function
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '460px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea, #764ba2)'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#fff', textAlign: 'center' }}>Welcome Note Management</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }} aria-label="Update Welcome Note Form">
        <label htmlFor="welcome-title" style={{ color: '#fff' }}>
          Welcome Note Title
        </label>
        <input
          id="welcome-title"
          type="text"
          placeholder="Welcome Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <label htmlFor="welcome-message" style={{ color: '#fff' }}>
          Welcome Note Message
        </label>
        <textarea
          id="welcome-message"
          placeholder="Welcome Note Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={loading}
          rows={6}
          style={{ padding: '8px', fontSize: '16px', resize: 'vertical' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            position: 'relative'
          }}
        >
          {loading ? <Spinner /> : 'Update Welcome Note'}
        </button>
      </form>
    </div>
  );
}
