import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WelcomeNoteManagement() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNote = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + 'welcome');
      if (response.data) {
        setTitle(response.data.title);
        setMessage(response.data.message);
      }
    } catch (error) {
      alert('Error fetching welcome note');
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(import.meta.env.VITE_API_URL + 'welcome', { title, message });
      alert('Welcome note updated successfully');
    } catch (error) {
      alert('Error saving welcome note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome Note Management</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Welcome Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Welcome Note Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Update Welcome Note'}
        </button>
      </form>
    </div>
  );
}
