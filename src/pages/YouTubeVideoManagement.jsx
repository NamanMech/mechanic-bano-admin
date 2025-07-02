import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function YouTubeVideoManagement() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('free');
  const [loading, setLoading] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

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
      const response = await axios.get(import.meta.env.VITE_API_URL + 'youtube');
      setVideos(response.data);
    } catch (error) {
      alert('Error fetching videos');
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
      alert('Invalid YouTube link');
      setLoading(false);
      return;
    }

    const embedLink = `https://www.youtube.com/embed/${videoId}`;

    try {
      if (editingVideo) {
        // Update video
        await axios.put(import.meta.env.VITE_API_URL + `youtube?id=${editingVideo._id}`, {
          title,
          description,
          embedLink,
          originalLink: link,
          category
        });
        alert('Video updated successfully');
        setEditingVideo(null);
      } else {
        // Add new video
        await axios.post(import.meta.env.VITE_API_URL + 'youtube', {
          title,
          description,
          embedLink,
          originalLink: link,
          category
        });
        alert('Video added successfully');
      }

      // Reset form and refresh list
      setTitle('');
      setDescription('');
      setLink('');
      setCategory('free');
      fetchVideos();
    } catch (error) {
      alert('Error saving video');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this video?');
    if (!confirmDelete) return;

    try {
      await axios.delete(import.meta.env.VITE_API_URL + `youtube?id=${id}`);
      alert('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      alert('Error deleting video');
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
    <div style={{ padding: '20px' }}>
      <h1>YouTube Video Management</h1>

      {/* Add/Update Video Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="YouTube Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editingVideo ? 'Update Video' : 'Save'}
        </button>
        {editingVideo && <button onClick={handleCancelEdit}>Cancel Edit</button>}
      </form>

      {/* List Videos */}
      <h2 style={{ marginTop: '40px' }}>Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {videos.map((video) => (
            <li key={video._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h3>{video.title}</h3>
              <iframe
                width="300"
                height="200"
                src={video.embedLink}
                title={video.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <p>{video.description}</p>
              <p>Category: {video.category}</p>
              <button onClick={() => handleEdit(video)}>Edit</button>
              <button onClick={() => handleDelete(video._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
