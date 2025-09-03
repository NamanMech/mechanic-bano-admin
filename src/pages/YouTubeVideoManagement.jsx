import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/pages/youtube-management.css';

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
    const youtubeRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/;
    const match = url.match(youtubeRegex);
    return match && match[1] ? match[1] : '';
  };

  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/general?type=youtube`);
      if (response.data && response.data.success) {
        setVideos(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        toast.error('Unexpected response format from server');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      toast.error('Error fetching videos');
      console.error('Error details:', error.response?.data || error.message);
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
    const isPremium = category === 'premium';

    try {
      if (editingVideo) {
        await axios.put(`${getBaseUrl()}/general?type=youtube&id=${editingVideo._id}`, {
          title: title.trim(),
          description: description.trim(),
          embedLink: cleanedLink,
          originalLink: link.trim(),
          category,
          isPremium,
        });
        toast.success('Video updated successfully');
        setEditingVideo(null);
      } else {
        await axios.post(`${getBaseUrl()}/general?type=youtube`, {
          title: title.trim(),
          description: description.trim(),
          embedLink: cleanedLink,
          originalLink: link.trim(),
          category,
          isPremium,
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
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await axios.delete(`${getBaseUrl()}/general?type=youtube&id=${id}`);
      toast.success('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      toast.error('Error deleting video');
      console.error('Error details:', error.response?.data || error.message);
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
    <div className="page-container youtube-management">
      <div className="section-card">
        <h1 className="section-title">YouTube Video Management</h1>
        <form
          onSubmit={handleSubmit}
          className="form"
          aria-label={editingVideo ? 'Edit Video Form' : 'Add Video Form'}
        >
          <div className="input-group">
            <label htmlFor="videoTitle">Video Title</label>
            <input
              id="videoTitle"
              type="text"
              placeholder="Video Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="videoDescription">Video Description</label>
            <textarea
              id="videoDescription"
              placeholder="Video Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
              rows={4}
            />
          </div>
          <div className="input-group">
            <label htmlFor="youtubeLink">YouTube Link</label>
            <input
              id="youtubeLink"
              type="url"
              placeholder="YouTube Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="videoCategory">Category</label>
            <select
              id="videoCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="save-button"
              aria-label={editingVideo ? 'Update Video' : 'Save Video'}
            >
              {loading ? 'Saving...' : editingVideo ? 'Update Video' : 'Save'}
            </button>
            {editingVideo && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="cancel-button"
                aria-label="Cancel Edit"
                disabled={loading}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h2>Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p className="no-content-message">No videos uploaded yet.</p>
      ) : (
        <div className="videos-list">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <h3 className="video-title">
                {video.title}{' '}
                {video.isPremium && (
                  <span className="stat-badge premium" title="Premium Video">
                    Premium
                  </span>
                )}
              </h3>
              <p className="video-desc">{video.description}</p>
              <p className="video-category">Category: {video.category}</p>
              <div className="video-preview-container">
                <iframe
                  src={video.embedLink}
                  title={video.title}
                  frameBorder="0"
                  allowFullScreen
                  className="video-preview"
                />
              </div>
              <div className="video-actions">
                <button
                  onClick={() => handleEdit(video)}
                  className="btn-edit"
                  aria-label={`Edit video: ${video.title}`}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="btn-delete"
                  aria-label={`Delete video: ${video.title}`}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
