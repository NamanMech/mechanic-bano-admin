import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [videos, setVideos] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_URL}youtube`);
      setVideos(res.data);
    } catch (error) {
      alert('Error fetching videos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Button Clicked');

    try {
      alert('Sending request...');
      await axios.post(`${API_URL}youtube`, { title, description, link });
      alert('Video Added Successfully');
      setTitle('');
      setDescription('');
      setLink('');
      fetchVideos();
    } catch (error) {
      alert('Error Adding Video');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete?')) return;

    try {
      await axios.delete(`${API_URL}youtube?id=${id}`);
      alert('Video Deleted Successfully');
      fetchVideos();
    } catch (error) {
      alert('Error Deleting Video');
    }
  };

  return (
    <div>
      <header>Mechanic Bano Admin Panel</header>

      <div className="container">
        <h2>Add New YouTube Video</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="text"
            placeholder="YouTube Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>

        <h2>Saved Videos</h2>
        <ul>
          {videos.map((video) => (
            <li key={video._id}>
              <div>
                <strong>{video.title}</strong> - {video.description}
              </div>
              <button onClick={() => handleDelete(video._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
