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
  const [filter, setFilter] = useState('all');

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
        return;
      }

      let fileUrl = editingPdf?.originalLink;

      if (file) {
        fileUrl = await uploadToSupabase(file);
      }

      const payload = {
        title,
        originalLink: fileUrl,
        embedLink: '',
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
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, fileUrl) => {
    if (confirm('Are you sure you want to delete this PDF?')) {
      try {
        // ✅ First delete from Supabase
        const fileName = fileUrl.split('/pdfs/')[1];
        const relativePath = `pdfs/${fileName}`;
        const { error: deleteError } = await supabase.storage.from('pdfs').remove([relativePath]);
        if (deleteError) throw new Error('Supabase delete failed');

        // ✅ Then delete from MongoDB
        await axios.delete(`${API_URL}general?type=pdf&id=${id}`);
        toast.success('Deleted from Supabase and database');
        fetchPdfs();
      } catch (err) {
        console.error(err);
        toast.error('Delete failed');
      }
    }
  };

  const handleEdit = (pdf) => {
    setEditingPdf(pdf);
    setTitle(pdf.title);
    setCategory(pdf.category);
  };

  const filteredPdfs = pdfs.filter((pdf) =>
    filter === 'all' ? true : pdf.category === filter
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#fff' }}>PDF Management</h1>

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
          required={!editingPdf}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? (editingPdf ? 'Updating...' : 'Uploading...') : editingPdf ? 'Update PDF' : 'Upload PDF'}
        </button>
      </form>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#fff' }}>Uploaded PDFs</h2>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="filter" style={{ color: '#fff', marginRight: '10px' }}>
            Filter:
          </label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        {filteredPdfs.length === 0 ? (
          <p style={{ color: '#ccc' }}>No PDFs yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredPdfs.map((pdf) => (
              <li
                key={pdf._id}
                style={{
                  marginBottom: '30px',
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#f8f8f8',
                }}
              >
                <h3 style={{ color: '#000' }}>{pdf.title}</h3>
                <p style={{ color: '#000' }}>Category: {pdf.category}</p>

                <div style={{ minHeight: '100px' }}>
                  {pdf.originalLink ? (
                    <PDFViewer url={pdf.originalLink} />
                  ) : (
                    <p style={{ color: 'gray' }}>No preview available</p>
                  )}
                </div>

                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => handleEdit(pdf)} style={{ marginRight: '10px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(pdf._id, pdf.originalLink)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
