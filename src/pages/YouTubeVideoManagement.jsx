import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function YouTubeVideoManagement() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('free');
  const [loading, setLoading] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const extractVideoId = (url) => {
    let videoId = '';
    const youtubeRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      videoId = match[1];
    }
    return videoId;
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_URL}general?type=youtube`);
      setVideos(response.data);
    } catch (error) {
      toast.error('Error fetching videos');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const videoId = extractVideoId(link);
    if (!videoId) {
      toast.error('Invalid YouTube link');
      setLoading(false);
      return;
    }

    const cleanedLink = `https://www.youtube.com/embed/${videoId}`;

    try {
      if (editingVideo) {
        await axios.put(`${API_URL}general?type=youtube&id=${editingVideo._id}`, {
          title,
          description,
          embedLink: cleanedLink,
          originalLink: link,
          category
        });
        toast.success('Video updated successfully');
        setEditingVideo(null);
      } else {
        await axios.post(`${API_URL}general?type=youtube`, {
          title,
          description,
          embedLink: cleanedLink,
          originalLink: link,
          category
        });
        toast.success('Video added successfully');
      }

      setTitle('');
      setDescription('');
      setLink('');
      setCategory('free');
      fetchVideos();
    } catch (error) {
      toast.error('Error saving video');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`${API_URL}general?type=youtube&id=${id}`);
        toast.success('Video deleted successfully');
        fetchVideos();
      } catch (error) {
        toast.error('Error deleting video');
      }
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setLink(video.originalLink);
    setCategory(video.category);
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
    setTitle('');
    setDescription('');
    setLink('');
    setCategory('free');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>YouTube Video Management</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginBottom: '40px' }}>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ padding: '8px', minHeight: '80px' }}
        />
        <input
          type="text"
          placeholder="YouTube Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none' }}
          >
            {loading ? 'Saving...' : editingVideo ? 'Update Video' : 'Save'}
          </button>
          {editingVideo && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{ padding: '10px 20px', background: 'gray', color: 'white', border: 'none' }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h2 style={{ marginBottom: '20px' }}>Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {videos.map((video) => (
            <li key={video._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
              <h3>{video.title}</h3>
              <iframe
                width="100%"
                height="315"
                src={video.embedLink}
                title={video.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <p>{video.description}</p>
              <p>Category: {video.category}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(video)}
                  style={{ padding: '6px 12px', background: '#ffc107', color: 'white', border: 'none' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
                  style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none' }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
