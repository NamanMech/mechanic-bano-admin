import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function WelcomeNoteManagement() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchNote = async () => {
    try {
      const response = await axios.get(`${API_URL}welcome`);
      if (response.data && response.data.title && response.data.message) {
        setTitle(response.data.title);
        setMessage(response.data.message);
      }
    } catch (error) {
      toast.error('Error fetching welcome note');
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_URL}welcome`, { title: title.trim(), message: message.trim() });
      toast.success('Welcome note updated successfully');
    } catch (error) {
      toast.error('Error saving welcome note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '460px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', color: '#2c3e50' }}>Welcome Note Management</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }} aria-label="Update Welcome Note Form">
        <label htmlFor="welcome-title">
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
        <label htmlFor="welcome-message">
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
          style={{ padding: '12px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Saving...' : 'Update Welcome Note'}
        </button>
      </form>
    </div>
  );
}
