import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import '../styles/pages/upi-management.css';

export default function UPIManagement() {
  const [upiId, setUpiId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  const fetchUpiData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/general?type=upi`);
      setUpiId(response.data?.data?.upiId || '');
      setQrCode(response.data?.data?.qrCode || '');
    } catch (error) {
      toast.error('Error fetching UPI data');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpiData();
  }, []);

  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'qr_code');

    setUploadingQr(true);
    try {
      const response = await axios.post(`${getBaseUrl()}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setQrCode(response.data.url);
      toast.success('QR code uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading QR code');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setUploadingQr(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${getBaseUrl()}/general?type=upi`, { upiId, qrCode });
      toast.success('UPI data updated successfully!');
    } catch (error) {
      toast.error('Error updating UPI data');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner message="Loading UPI data..." />;

  return (
    <div className="container upi-management">
      <h1>UPI Management</h1>
      <form onSubmit={handleSubmit} className="upi-form" aria-label="Update UPI data form">
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
        
        <div className="form-group">
          <label htmlFor="qrCode">QR Code</label>
          <input
            id="qrCode"
            type="file"
            accept="image/*"
            onChange={handleQrUpload}
            disabled={uploadingQr || saving}
          />
          {uploadingQr && <div className="upload-status">Uploading QR code...</div>}
        </div>
        
        {qrCode && (
          <div className="form-group">
            <label>QR Code Preview</label>
            <img src={qrCode} alt="UPI QR Code" className="qr-preview" />
          </div>
        )}
        
        <button type="submit" disabled={saving || uploadingQr} className="btn-primary">
          {saving ? 'Saving...' : 'Save UPI Data'}
        </button>
      </form>
    </div>
  );
}
