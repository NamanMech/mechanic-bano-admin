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
    <div className="container">
      <h1>PDF Management</h1>
      
      <form onSubmit={handleSubmit} aria-label={editingPdf ? 'Edit PDF form' : 'Upload PDF form'}>
        <label htmlFor="pdfTitle">PDF Title</label>
        <input
          id="pdfTitle"
          type="text"
          placeholder="PDF Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
        
        <label htmlFor="pdfFile">
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
        />
        
        <label htmlFor="pdfCategory">Category</label>
        <select
          id="pdfCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        
        {category === 'premium' && (
          <>
            <label htmlFor="pdfPrice">Price (₹)</label>
            <input
              id="pdfPrice"
              type="number"
              step="0.01"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required={category === 'premium'}
              disabled={loading}
            />
          </>
        )}
        
        <div className="form-buttons">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <span className="button-loading">
                {editingPdf ? 'Updating...' : 'Uploading...'}
              </span>
            ) : editingPdf ? 'Update PDF' : 'Upload PDF'}
          </button>
          
          {editingPdf && (
            <button 
              type="button" 
              onClick={handleCancelEdit} 
              disabled={loading}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <h2>Uploaded PDFs</h2>
      
      {pdfs.length === 0 ? (
        <p className="no-content-message">No PDFs uploaded yet.</p>
      ) : (
        <div className="pdfs-list">
          {pdfs.map((pdf) => (
            <div key={pdf._id} className="pdf-card">
              <h3>{pdf.title}</h3>
              <p>
                Category: {pdf.category}
                {pdf.category === 'premium' && pdf.price ? ` | Price: ₹${pdf.price}` : ''}
              </p>
              
              <div className="pdf-preview">
                {pdf.originalLink ? (
                  <PDFViewer url={pdf.originalLink} />
                ) : (
                  <p className="no-preview">No preview available</p>
                )}
              </div>
              
              <div className="pdf-actions">
                <button 
                  onClick={() => handleEdit(pdf)} 
                  disabled={loading}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(pdf._id)} 
                  disabled={loading}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {loading && <div className="spinner-overlay"><div className="spinner"></div></div>}
    </div>
  );
}
