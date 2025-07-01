import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function YouTubeVideoManagement() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}youtube`);
      setVideos(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('Error fetching videos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Button clicked');
    alert('Sending request');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}youtube`, { title, description, link });
      alert('Video added successfully');
      setTitle('');
      setDescription('');
      setLink('');
      fetchVideos();
    } catch (error) {
      alert('Error adding video');
    } finally {
      alert('Request finished');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}youtube`, { params: { id } });
      fetchVideos();
    } catch (error) {
      alert('Error deleting video');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">YouTube Video Management</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="YouTube Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>

      {loading ? (
        <p>Loading videos...</p>
      ) : (
        <ul className="space-y-2">
          {videos.map((video) => (
            <li key={video._id} className="border p-2 flex justify-between items-center">
              <span>{video.title}</span>
              <button
                onClick={() => handleDelete(video._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
