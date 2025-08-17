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
    if (match && match[1]) videoId = match;
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

  // Responsive style
  const videoRowStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'stretch',
  };
  const videoRowDesktop = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '22px',
  };
  const videoPreviewMobile = {
    width: '100%',
    height: '180px',
    borderRadius: '6px',
    background: '#111',
  };
  const videoPreviewDesktop = {
    width: '200px',
    height: '120px',
    minWidth: '200px',
    borderRadius: '6px',
    background: '#111',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        YouTube Video Management
      </h1>
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
        aria-label={editingVideo ? "Edit Video Form" : "Add Video Form"}
      >
        <label htmlFor="videoTitle" style={{ fontWeight: 'bold' }}>Video Title</label>
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
        <label htmlFor="videoDescription" style={{ fontWeight: 'bold' }}>Video Description</label>
        <textarea
          id="videoDescription"
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={loading}
          style={{ padding: '8px', minHeight: '80px' }}
        />
        <label htmlFor="youtubeLink" style={{ fontWeight: 'bold' }}>YouTube Link</label>
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
        <label htmlFor="videoCategory" style={{ fontWeight: 'bold' }}>Category</label>
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
            style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
            aria-label={editingVideo ? 'Update Video' : 'Save Video'}
          >
            {loading ? 'Saving...' : editingVideo ? 'Update Video' : 'Save'}
          </button>
          {editingVideo && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{ padding: '10px 20px', background: 'gray', color: 'white', border: 'none', fontWeight: 'bold' }}
              aria-label="Cancel Edit"
              disabled={loading}
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
            <li
              key={video._id}
              className="video-row"
              style={{
                marginBottom: '20px',
                border: '1px solid #ccc',
                padding: '14px',
                borderRadius: '8px',
                background: '#f6f7fa',
              }}
            >
              <div
                className="video-row-inner"
                style={window.innerWidth > 768 ? videoRowDesktop : videoRowStyle}
              >
                <iframe
                  width={window.innerWidth > 768 ? 200 : '100%'}
                  height={window.innerWidth > 768 ? 120 : 180}
                  src={video.embedLink}
                  title={video.title}
                  frameBorder="0"
                  allowFullScreen
                  style={window.innerWidth > 768 ? videoPreviewDesktop : videoPreviewMobile}
                ></iframe>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '8px' }}>
                    {video.title}{' '}
                    {video.isPremium && (
                      <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '8px' }}>
                        (Premium)
                      </span>
                    )}
                  </h3>
                  <p style={{ margin: '10px 0' }}>{video.description}</p>
                  <p>Category: {video.category}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(video)}
                      style={{
                        padding: '6px 12px',
                        background: '#ffc107',
                        color: 'white',
                        border: 'none',
                        fontWeight: 'bold',
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
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        fontWeight: 'bold',
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
