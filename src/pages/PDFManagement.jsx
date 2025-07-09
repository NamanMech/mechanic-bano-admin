import React, { useEffect, useState } from 'react';
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
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `${fileName}`; // ✅ no folder

    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('Upload failed');
    }

    const { data, error: signedUrlError } = await supabase.storage
      .from('pdfs')
      .createSignedUrl(filePath, 60 * 60); // 1 hour signed link

    if (signedUrlError || !data?.signedUrl) {
      throw new Error('Failed to generate signed URL');
    }

    return data.signedUrl;
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
        embedLink: '', // not used
        category,
      };

      if (editingPdf) {
        await axios.put(`${API_URL}general?type=pdf&id=${editingPdf._id}`, payload);
        toast.success('PDF updated');
      } else {
        await axios.post(`${API_URL}general?type=pdf`, payload);
        toast.success('PDF uploaded');
      }

      setTitle('');
      setFile(null);
      setCategory('free');
      setEditingPdf(null);
      fetchPdfs();
    } catch (err) {
      toast.error('Upload failed');
      console.error(err);
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
              <PDFViewer url={pdf.originalLink} />

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
