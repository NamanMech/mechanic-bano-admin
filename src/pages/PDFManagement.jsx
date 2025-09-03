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
  const [uploadButtonLoading, setUploadButtonLoading] = useState(false);
  const [editingPdf, setEditingPdf] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef();

  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  // Fetch PDFs
  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${getBaseUrl()}/general?type=pdf`);
      if (response.data && response.data.success) {
        setPdfs(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setPdfs(response.data);
      } else {
        toast.error('Unexpected response format from server');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      toast.error('Error fetching PDFs');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  // Upload PDF to Supabase storage
  const uploadToSupabase = async (fileToUpload) => {
    const allowedTypes = ['application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!allowedTypes.includes(fileToUpload.type)) {
      throw new Error('Only PDF files are allowed');
    }
    if (fileToUpload.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }
    const fileName = `${uuidv4()}-${fileToUpload.name}`;
    const filePath = `pdfs/${fileName}`;
    const { error } = await supabase.storage.from('pdfs').upload(filePath, fileToUpload);
    if (error) throw new Error(`Upload failed: ${error.message || error}`);
    const { data } = supabase.storage.from('pdfs').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Handle form submit for add or edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadButtonLoading(true);
    if (!title.trim()) {
      toast.error('Title is required');
      setUploadButtonLoading(false);
      return;
    }
    if (!file && !editingPdf) {
      toast.error('Please select a PDF file');
      setUploadButtonLoading(false);
      return;
    }
    try {
      const fileUrl = file ? await uploadToSupabase(file) : editingPdf.originalLink;
      const payload = {
        title: title.trim(),
        originalLink: fileUrl,
        embedLink: '', // Placeholder
        category,
        price: category === 'premium' ? parseFloat(price || 0) : 0,
      };
      if (editingPdf) {
        await axios.put(`${getBaseUrl()}/general?type=pdf&id=${editingPdf._id}`, payload);
        toast.success('PDF updated successfully');
      } else {
        await axios.post(`${getBaseUrl()}/general?type=pdf`, payload);
        toast.success('PDF uploaded successfully');
      }
      resetForm();
      fetchPdfs();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Upload failed';
      toast.error(errMsg);
      console.error(err);
    } finally {
      setUploadButtonLoading(false);
    }
  };

  // Reset form after submit or cancel
  const resetForm = () => {
    setTitle('');
    setFile(null);
    setCategory('free');
    setPrice('');
    setEditingPdf(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle delete PDF
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PDF?')) return;
    setLoading(true);
    try {
      await axios.delete(`${getBaseUrl()}/general?type=pdf&id=${id}`);
      toast.success('PDF deleted successfully');
      fetchPdfs();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to delete PDF';
      toast.error(errMsg);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a PDF - populate form
  const handleEdit = (pdf) => {
    setEditingPdf(pdf);
    setTitle(pdf.title);
    setCategory(pdf.category);
    setPrice(pdf.price?.toString() || '');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    resetForm();
  };

  // Preview a PDF in viewer
  const handlePreview = (pdfUrl) => {
    setCurrentPdfUrl(pdfUrl);
    setShowViewer(true);
  };

  // Close PDF viewer
  const handleCloseViewer = () => {
    setShowViewer(false);
    setCurrentPdfUrl('');
  };

  return (
    <div className="pdf-management container">
      <form className="pdf-form" onSubmit={handleSubmit}>
        <h2>{editingPdf ? 'Edit PDF' : 'Upload New PDF'}</h2>
        <label htmlFor="pdf-title">Title</label>
        <input
          id="pdf-title"
          type="text"
          placeholder="Enter PDF title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading || uploadButtonLoading}
          required
        />
        <label htmlFor="pdf-category">Category</label>
        <select
          id="pdf-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading || uploadButtonLoading}
          required
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        {category === 'premium' && (
          <>
            <label htmlFor="pdf-price">Price (₹)</label>
            <input
              id="pdf-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading || uploadButtonLoading}
              required
            />
          </>
        )}
        <label htmlFor="pdf-file">{editingPdf ? 'Replace PDF File' : 'Select PDF File'}</label>
        <input
          id="pdf-file"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileInputRef}
          disabled={loading || uploadButtonLoading}
        />
        <div className="button-group">
          <button type="submit" disabled={loading || uploadButtonLoading}>
            {uploadButtonLoading ? 'Saving...' : editingPdf ? 'Update PDF' : 'Upload PDF'}
          </button>
          {editingPdf && (
            <button type="button" className="btn-cancel" onClick={handleCancelEdit} disabled={loading || uploadButtonLoading}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <hr className="section-divider" />
      <section className="pdf-list-section" aria-label="Uploaded PDFs">
        <h2>Uploaded PDFs</h2>
        {loading && !uploadButtonLoading ? (
          <p>Loading...</p>
        ) : pdfs.length === 0 ? (
          <p>No PDFs uploaded yet.</p>
        ) : (
          <ul className="pdf-list">
            {pdfs.map((pdf) => (
              <li key={pdf._id || pdf.id} className="pdf-list-item">
                <div className="pdf-info">
                  <strong>{pdf.title}</strong>
                  <br />
                  Category: {pdf.category}{' '}
                  {pdf.category === 'premium' && pdf.price ? `| Price: ₹${pdf.price.toFixed(2)}` : ''}
                </div>
                <div className="pdf-actions">
                  <button type="button" onClick={() => handlePreview(pdf.originalLink)} disabled={loading || uploadButtonLoading}>
                    Preview
                  </button>
                  <button type="button" onClick={() => handleEdit(pdf)} disabled={loading || uploadButtonLoading}>
                    Edit
                  </button>
                  <button type="button" className="btn-danger" onClick={() => handleDelete(pdf._id)} disabled={loading || uploadButtonLoading}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      {showViewer && currentPdfUrl && (
        <div className="pdf-modal" role="dialog" aria-modal="true" aria-labelledby="pdf-viewer-title">
          <div className="pdf-modal-content">
            <button className="pdf-modal-close" onClick={handleCloseViewer} aria-label="Close PDF viewer">
              ×
            </button>
            <PDFViewer url={currentPdfUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
