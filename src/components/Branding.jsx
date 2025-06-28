import { useEffect, useState } from 'react';
import axios from 'axios';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

function Branding() {
  const [websiteName, setWebsiteName] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/config`);
      setWebsiteName(res.data.websiteName);
    } catch (error) {
      alert('Failed to load configuration');
      console.error('Fetch Config Error:', error);
    }
  };

  // Site Name Update - Using Axios with CORS
const handleUpdateSiteName = async () => {
  alert(`Updating site name: ${websiteName}`);

  try {
    await axios.put(`${backendURL}/api/config`, { websiteName }, {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors' // Added CORS mode
    });

    alert('Site name updated successfully');
    fetchConfig();
  } catch (error) {
    alert('Failed to update site name');
    console.error('Error:', error);
  }
};

  return (
    <div>
      <h2>Site Branding</h2>

      <div>
        <label>Site Name:</label>
        <input type="text" value={websiteName} onChange={(e) => setWebsiteName(e.target.value)} />
        <button onClick={handleUpdateSiteName}>Update Site Name</button>
      </div>
    </div>
  );
}

export default Branding;
