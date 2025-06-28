import { useState, useEffect } from 'react';
import axios from 'axios';

const Branding = () => {
  const backendURL = 'https://mechanic-bano-backend.vercel.app';
  const [websiteName, setWebsiteName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/config`);
      setWebsiteName(res.data.websiteName);
      setLoading(false);
    } catch (error) {
      alert('Failed to load configuration');
      setLoading(false);
    }
  };

  const updateSiteName = async () => {
    alert(`Updating site name: ${websiteName}`);
    try {
      await axios.put(`${backendURL}/api/config/update-site-name`, { websiteName });
      alert('Site name updated successfully');
    } catch (error) {
      console.error('Update Error:', error);
      alert('Failed to update site name');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="branding-container">
      <h2>Update Site Name</h2>
      <input
        type="text"
        value={websiteName}
        onChange={(e) => setWebsiteName(e.target.value)}
        placeholder="Enter Site Name"
      />
      <button onClick={updateSiteName}>Update Site Name</button>
    </div>
  );
};

export default Branding;
