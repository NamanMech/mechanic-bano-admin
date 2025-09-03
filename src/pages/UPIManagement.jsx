import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

export default function UPIManagement() {
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  // Fetch UPI ID from backend
  const fetchUpiId = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/general?type=upi`);
      setUpiId(response.data?.data?.upiId || '');
    } catch (error) {
      toast.error('Error fetching UPI ID');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpiId();
  }, []);

  // Handle form submit for updating UPI ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${getBaseUrl()}/general?type=upi`, { upiId });
      toast.success('UPI ID updated successfully!');
    } catch (error) {
      toast.error('Error updating UPI ID');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner message="Loading UPI ID..." />;

  return (
    <div className="container">
      <h1>UPI ID Management</h1>
      <form onSubmit={handleSubmit} className="form-container" aria-label="Update UPI ID form">
        <div className="form-group">
          <label htmlFor="upiId">UPI ID</label>
          <input
            id="upiId"
            type="text"
            placeholder="Enter UPI ID (e.g., yourname@ybl)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
            disabled={saving}
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save UPI ID'}
        </button>
      </form>
    </div>
  );
}
