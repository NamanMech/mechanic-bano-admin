import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../utils/supabaseClient';

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

  const uploadToSupabase = async (file) => {
    const fileName = `pdfs/${uuidv4()}-${file.name}`;
    try {
      const { data, error } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf',
        });

      if (error) {
        toast.error('Supabase upload error');
        throw new Error(error.message);
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);

      if (urlError) {
        toast.error('Public URL error');
        throw new Error(urlError.message);
      }

      return urlData.publicUrl;
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!file) {
        toast.error('Please select a PDF file');
        setLoading(false);
        return;
      }

      const fileUrl = await uploadToSupabase(file);

      const payload = {
        title,
        originalLink: fileUrl,
        embedLink: '',
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
      // error already handled in uploadToSupabase
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}general?type=pdf&id=${id}`);
        toast.success('PDF deleted');
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
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? (editingPdf ? 'Updating...' : 'Uploading...') : editingPdf ? 'Update PDF' : 'Upload PDF'}
        </button>
      </form>

      <h2 style={{ marginTop: '40px' }}>Uploaded PDFs</h2>
      {pdfs.length === 0 ? (
        <p>No PDFs yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pdfs.map((pdf) => (
            <li
              key={pdf._id}
              style={{
                marginBottom: '20px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
                background: '#f8f8f8',
              }}
            >
              <h3>{pdf.title}</h3>
              <p>Category: {pdf.category}</p>
              <a href={pdf.originalLink} target="_blank" rel="noreferrer">View PDF</a>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleEdit(pdf)} style={{ marginRight: '10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(pdf._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
