// src/pages/PDFManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PDFManagement() {
  const [pdfs, setPdfs] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('free');
  const [loading, setLoading] = useState(false);
  const [editingPdf, setEditingPdf] = useState(null);

  const extractGoogleDriveId = (url) => {
    const regex = /\/d\/([a-zA-Z0-9_-]{33,})/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return '';
  };

  const fetchPdfs = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + 'general?type=pdf');
      setPdfs(response.data);
    } catch (error) {
      alert('Error fetching PDFs');
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const driveId = extractGoogleDriveId(link);
    if (!driveId) {
      alert('Invalid Google Drive link');
      setLoading(false);
      return;
    }

    const embedLink = `https://drive.google.com/file/d/${driveId}/preview`;
    const originalLink = link;

    try {
      if (editingPdf) {
        await axios.put(import.meta.env.VITE_API_URL + `general?type=pdf&id=${editingPdf._id}`, {
          title,
          embedLink,
          originalLink,
          category
        });
        alert('PDF updated successfully');
        setEditingPdf(null);
      } else {
        await axios.post(import.meta.env.VITE_API_URL + 'general?type=pdf', {
          title,
          embedLink,
          originalLink,
          category
        });
        alert('PDF added successfully');
      }

      setTitle('');
      setLink('');
      setCategory('free');
      fetchPdfs();
    } catch (error) {
      alert('Error saving PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this PDF?');
    if (!confirmDelete) return;

    try {
      await axios.delete(import.meta.env.VITE_API_URL + `general?type=pdf&id=${id}`);
      alert('PDF deleted successfully');
      fetchPdfs();
    } catch (error) {
      alert('Error deleting PDF');
    }
  };

  const handleEdit = (pdf) => {
    setEditingPdf(pdf);
    setTitle(pdf.title);
    setLink(pdf.originalLink);
    setCategory(pdf.category);
  };

  const handleCancelEdit = () => {
    setEditingPdf(null);
    setTitle('');
    setLink('');
    setCategory('free');
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
          type="text"
          placeholder="Google Drive Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editingPdf ? 'Update PDF' : 'Save'}
        </button>
        {editingPdf && <button type="button" onClick={handleCancelEdit}>Cancel Edit</button>}
      </form>

      <h2 style={{ marginTop: '40px' }}>Uploaded PDFs</h2>
      {pdfs.length === 0 ? (
        <p>No PDFs uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pdfs.map((pdf) => (
            <li key={pdf._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h3>{pdf.title}</h3>
              <iframe
                src={pdf.embedLink}
                width="300"
                height="200"
                title={pdf.title}
                frameBorder="0"
                allow="autoplay"
              ></iframe>
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
