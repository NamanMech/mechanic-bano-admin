import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SiteNameManagement() {
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchSiteName = async () => {
    try {
      // Remove any trailing slash from API_URL to avoid double slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      const response = await axios.get(`${baseUrl}/general?type=sitename`);
      
      // Check if response structure matches expected format
      if (response.data && response.data.success && response.data.data && response.data.data.name) {
        setSiteName(response.data.data.name);
      } else if (response.data && response.data.name) {
        // Handle case where API returns data directly
        setSiteName(response.data.name);
      } else {
        console.error('Unexpected response structure:', response);
        setSiteName('Mechanic Bano'); // Default fallback
      }
    } catch (error) {
      toast.error('Error fetching site name');
      console.error('Error details:', error.response?.data || error.message);
      setSiteName('Mechanic Bano'); // Default fallback on error
    }
  };

  useEffect(() => {
    fetchSiteName();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!siteName.trim()) {
      toast.error('Site name cannot be empty');
      return;
    }
    
    setLoading(true);
    try {
      // Remove any trailing slash from API_URL to avoid double slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      await axios.put(`${baseUrl}/general?type=sitename`, { name: siteName.trim() });
      toast.success('Site name updated successfully');
    } catch (error) {
      toast.error('Error updating site name');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '450px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        color: '#2c3e50', 
        marginBottom: '12px',
        textAlign: 'center'
      }}>
        Site Name Management
      </h1>
      <p style={{ 
        fontWeight: 'bold', 
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        Current Site Name: <span style={{ color: '#34495e' }}>{siteName || '-'}</span>
      </p>
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          display: 'grid', 
          gap: '12px',
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }} 
        aria-label="Update Site Name form"
      >
        <label htmlFor="siteNameInput" style={{ fontWeight: '600' }}>
          Enter New Site Name
        </label>
        <input
          id="siteNameInput"
          type="text"
          placeholder="Enter New Site Name"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          required
          disabled={loading}
          style={{ 
            padding: '10px 12px', 
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            padding: '12px', 
            fontWeight: 'bold',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Saving...' : 'Update Site Name'}
        </button>
      </form>
    </div>
  );
}
