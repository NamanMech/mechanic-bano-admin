import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { supabase } from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import PDFViewer from '../components/PDFViewer';

export default function PDFManagement() {
  const [pdfs, setPdfs] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('free');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingPdf, setEditingPdf] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef();

  const fetchPdfs = async () => {
    try {
      // Remove any trailing slash from API_URL to avoid double slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      const response = await axios.get(`${baseUrl}/general?type=pdf`);
      
      // Check if response structure matches expected format
      if (response.data && response.data.success) {
        setPdfs(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        // Handle case where API returns array directly
        setPdfs(response.data);
      } else {
        toast.error('Unexpected response format from server');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      toast.error('Error fetching PDFs');
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const uploadToSupabase = async (file) => {
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `pdfs/${fileName}`;
    const { error } = await supabase.storage.from('pdfs').upload(filePath, file);
    if (error) throw new Error('Upload failed');
    const { data } = supabase.storage.from('pdfs').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!file && !editingPdf) {
        toast.error('Please select a PDF file');
        setLoading(false);
        return;
      }
      
      // Remove any trailing slash from API_URL to avoid double slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      
      const fileUrl = file ? await uploadToSupabase(file) : editingPdf.originalLink;
      const payload = {
        title: title.trim(),
        originalLink: fileUrl,
        embedLink: '',
        category,
        price: category === 'premium' ? parseFloat(price || 0) : 0,
      };
      
      if (editingPdf) {
        await axios.put(`${baseUrl}/general?type=pdf&id=${editingPdf._id}`, payload);
        toast.success('PDF updated');
      } else {
        await axios.post(`${baseUrl}/general?type=pdf`, payload);
        toast.success('PDF uploaded');
      }
      
      setTitle('');
      setFile(null);
      setCategory('free');
      setPrice('');
      setEditingPdf(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchPdfs();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this PDF?')) {
      try {
        // Remove any trailing slash from API_URL to avoid double slashes
        const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        await axios.delete(`${baseUrl}/general?type=pdf&id=${id}`);
        toast.success('PDF deleted');
        fetchPdfs();
      } catch (err) {
        toast.error('Failed to delete PDF');
        console.error('Error details:', err.response?.data || err.message);
      }
    }
  };

  const handleEdit = (pdf) => {
    setEditingPdf(pdf);
    setTitle(pdf.title);
    setCategory(pdf.category);
    setPrice(pdf.price?.toString() || '');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancelEdit = () => {
    setEditingPdf(null);
    setTitle('');
    setCategory('free');
    setPrice('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ padding: '20px', maxWidth: 950, margin: '0 auto' }}>
      <h1 style={{ color: '#34495e', marginBottom: 25 }}>PDF Management</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '14px',
          maxWidth: '400px',
          background: '#f9f9f9',
          padding: '16px 22px',
          borderRadius: '8px',
          marginBottom: '18px',
        }}
        aria-label={editingPdf ? 'Edit PDF form' : 'Upload PDF form'}
      >
        <label htmlFor="pdfTitle" style={{ fontWeight: 'bold' }}>PDF Title</label>
        <input
          id="pdfTitle"
          type="text"
          placeholder="PDF Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <label htmlFor="pdfFile" style={{ fontWeight: 'bold' }}>
          {editingPdf ? 'Replace PDF file (optional)' : 'PDF File'}
        </label>
        <input
          id="pdfFile"
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required={!editingPdf}
          disabled={loading}
          style={{ padding: '8px 0' }}
        />
        <label htmlFor="pdfCategory" style={{ fontWeight: 'bold' }}>Category</label>
        <select
          id="pdfCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        {category === 'premium' && (
          <>
            <label htmlFor="pdfPrice" style={{ fontWeight: 'bold' }}>Price (₹)</label>
            <input
              id="pdfPrice"
              type="number"
              step="0.01"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required={category === 'premium'}
              disabled={loading}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </>
        )}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (editingPdf ? 'Updating...' : 'Uploading...') : editingPdf ? 'Update PDF' : 'Upload PDF'}
          </button>
          {editingPdf && (
            <button 
              type="button" 
              onClick={handleCancelEdit} 
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e0e0e0',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <h2 style={{ marginTop: '40px', color: '#34495e' }}>Uploaded PDFs</h2>
      {pdfs.length === 0 ? (
        <p>No PDFs yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pdfs.map((pdf) => (
            <li
              key={pdf._id}
              style={{
                marginBottom: '30px',
                border: '1px solid #ccd',
                padding: '14px',
                borderRadius: '8px',
                background: '#f8f8f8',
                boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
              }}
            >
              <h3 style={{ color: '#222', margin: '0 0 10px 0' }}>{pdf.title}</h3>
              <p style={{ color: '#555', margin: '0 0 10px 0' }}>
                Category: {pdf.category}
                {pdf.category === 'premium' && pdf.price ? ` | Price: ₹${pdf.price}` : ''}
              </p>
              <div style={{ minHeight: '120px', margin: '12px 0' }}>
                {pdf.originalLink ? (
                  <PDFViewer url={pdf.originalLink} />
                ) : (
                  <p style={{ color: 'gray' }}>No preview available</p>
                )}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleEdit(pdf)} 
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffc107',
                    color: '#222',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(pdf._id)} 
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
