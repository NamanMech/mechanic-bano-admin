import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from '../utils/cloudinaryConfig';

export default function PDFManagement() {
  const [pdfs, setPdfs] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('free');
  const [loading, setLoading] = useState(false);
  const [editingPdf, setEditingPdf] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPdfs = async () => {
    try {
      const response = await axios.get(`${API_URL}general?type=pdf`);
      setPdfs(response.data);
    } catch {
      toast.error('Error fetching PDFs');
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
    return response.data.secure_url;
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

      let fileUrl = editingPdf?.originalLink;

      if (file) {
        fileUrl = await uploadToCloudinary(file);
      }

      const payload = {
        title,
        originalLink: fileUrl,
        embedLink: '', // optional, not used
        category,
      };

      if (editingPdf) {
        await axios.put(`${API_URL}general?type=pdf&id=${editingPdf._id}`, payload);
        toast.success('PDF updated successfully');
      } else {
        await axios.post(`${API_URL}general?type=pdf`, payload);
        toast.success('PDF uploaded successfully');
      }

      setTitle('');
      setFile(null);
      setCategory('free');
      setEditingPdf(null);
      fetchPdfs();
    } catch {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}general?type=pdf&id=${id}`);
        toast.success('Deleted');
        fetchPdfs();
      } catch {
        toast.error('Delete failed');
      }
    }
  };

  const handleEdit = (pdf) => {
    setEditingPdf(pdf);
    setTitle(pdf.title);
    setCategory(pdf.category);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>PDF Management</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="PDF Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : editingPdf ? 'Update PDF' : 'Upload PDF'}
        </button>
      </form>

      <h2 style={{ marginTop: '40px' }}>Uploaded PDFs</h2>
      {pdfs.length === 0 ? (
        <p>No PDFs yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pdfs.map((pdf) => (
            <li key={pdf._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h3>{pdf.title}</h3>
              <p>Category: {pdf.category}</p>
              <button onClick={() => handleEdit(pdf)}>Edit</button>
              <button onClick={() => handleDelete(pdf._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
