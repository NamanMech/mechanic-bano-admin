import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
      toast.error('Error fetching videos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}youtube`, { title, description, link });
      toast.success('Video added successfully');
      setTitle('');
      setDescription('');
      setLink('');
      fetchVideos();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error adding video');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}youtube`, { params: { id } });
      toast.success('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      toast.error('Error deleting video');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">YouTube Video Management</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="YouTube Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-500">Loading videos...</p>
      ) : (
        <ul className="space-y-3">
          {videos.map((video) => (
            <li
              key={video._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{video.title}</h2>
                <p className="text-gray-600">{video.description}</p>
                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Watch Video
                </a>
              </div>
              <button
                onClick={() => handleDelete(video._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
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
