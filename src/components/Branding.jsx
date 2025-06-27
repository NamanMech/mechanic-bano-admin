import { useEffect, useState } from 'react';
import axios from 'axios';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

export default function Branding() {
  const [websiteName, setWebsiteName] = useState('');
  const [logoURL, setLogoURL] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/config`);
        setWebsiteName(res.data.websiteName);
        setLogoURL(res.data.logoURL);
      } catch (error) {
        console.error('Fetch Config Error:', error);
        alert('Failed to load configuration');
      } finally {
        setLoading(false); // ✅ Loading state hata do chahe success ya fail ho
      }
    };

    fetchConfig();
  }, []);

  const updateSiteName = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, { websiteName, logoURL });
      alert('Site name updated successfully');
    } catch (error) {
      console.error('Update Site Name Error:', error);
      alert('Failed to update site name');
    }
  };

  const updateLogo = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, { websiteName, logoURL });
      alert('Logo updated successfully');
    } catch (error) {
      console.error('Update Logo Error:', error);
      alert('Failed to update logo');
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Site Branding</h1>

      <div className="mb-4">
        <label className="block mb-1">Website Name:</label>
        <input
          type="text"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          className="border p-2 w-full"
        />
        <button onClick={updateSiteName} className="mt-2 p-2 bg-blue-500 text-white rounded">
          Update Site Name
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Logo URL:</label>
        <input
          type="text"
          value={logoURL}
          onChange={(e) => setLogoURL(e.target.value)}
          className="border p-2 w-full"
        />
        <button onClick={updateLogo} className="mt-2 p-2 bg-green-500 text-white rounded">
          Update Logo
        </button>
      </div>

      <div className="mt-4">
        <h2>Current Logo:</h2>
        {logoURL ? (
          <img src={logoURL} alt="Logo" className="mt-2" style={{ maxWidth: '200px' }} />
        ) : (
          <p>No logo available</p>
        )}
      </div>
    </div>
  );
}
