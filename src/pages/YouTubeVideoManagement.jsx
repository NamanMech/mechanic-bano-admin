import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../components/YouTubeVideoManagement.css'; // Make sure path is correct

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
    const isPremium = category === 'premium';
    try {
      if (editingVideo) {
        await axios.put(`${API_URL}general?type=youtube&id=${editingVideo._id}`, {
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
        await axios.post(`${API_URL}general?type=youtube`, {
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
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '14px',
          marginBottom: '40px',
          background: '#fafafa',
          padding: '18px',
          borderRadius: '8px',
        }}
        aria-label={editingVideo ? 'Edit Video Form' : 'Add Video Form'}
      >
        <label htmlFor="videoTitle" style={{ fontWeight: 'bold', color: '#222' }}>
          Video Title
        </label>
        <input
          id="videoTitle"
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          style={{ padding: '8px' }}
        />
        <label htmlFor="videoDescription" style={{ fontWeight: 'bold', color: '#222' }}>
          Video Description
        </label>
        <textarea
          id="videoDescription"
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={loading}
          style={{ padding: '8px', minHeight: '80px' }}
        />
        <label htmlFor="youtubeLink" style={{ fontWeight: 'bold', color: '#222' }}>
          YouTube Link
        </label>
        <input
          id="youtubeLink"
          type="text"
          placeholder="YouTube Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          disabled={loading}
          style={{ padding: '8px' }}
        />
        <label htmlFor="videoCategory" style={{ fontWeight: 'bold', color: '#222' }}>
          Category
        </label>
        <select
          id="videoCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
          style={{ padding: '8px' }}
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            aria-label={editingVideo ? 'Update Video' : 'Save Video'}
          >
            {loading ? 'Saving...' : editingVideo ? 'Update Video' : 'Save'}
          </button>
          {editingVideo && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: '10px 20px',
                background: 'gray',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
              }}
              aria-label="Cancel Edit"
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      <h2 style={{ marginBottom: '20px', color: '#222' }}>Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul className="video-list">
          {videos.map((video) => (
            <li key={video._id} className="video-row">
              <div className="video-row-inner">
                <iframe
                  className="video-preview"
                  src={video.embedLink}
                  title={video.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <div className="video-info">
                  <h3 className="video-title">
                    {video.title}{' '}
                    {video.isPremium && (
                      <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '8px' }}>
                        (Premium)
                      </span>
                    )}
                  </h3>
                  <p className="video-desc">{video.description}</p>
                  <p className="video-category">Category: {video.category}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(video)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ffc107',
                        color: '#222',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                      aria-label={`Edit video: ${video.title}`}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                      aria-label={`Delete video: ${video.title}`}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
