import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PDFManagement() {
  const [pdfs, setPdfs] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingPDF, setEditingPDF] = useState(null); // Edit Mode

  const fetchPdfs = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + 'pdf');
      setPdfs(response.data);
    } catch (error) {
      alert('Error fetching PDFs');
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const convertGoogleDriveLink = (url) => {
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanedLink = convertGoogleDriveLink(link);

    try {
      if (editingPDF) {
        // Update PDF
        await axios.put(import.meta.env.VITE_API_URL + `pdf?id=${editingPDF._id}`, {
          title,
          link: cleanedLink
        });
        alert('PDF updated successfully');
        setEditingPDF(null);
      } else {
        // Add New PDF
        await axios.post(import.meta.env.VITE_API_URL + 'pdf', {
          title,
          link: cleanedLink
        });
        alert('PDF added successfully');
      }

      setTitle('');
      setLink('');
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
      await axios.delete(import.meta.env.VITE_API_URL + `pdf?id=${id}`);
      alert('PDF deleted successfully');
      fetchPdfs();
    } catch (error) {
      alert('Error deleting PDF');
    }
  };

  const handleEdit = (pdf) => {
    setEditingPDF(pdf);
    setTitle(pdf.title);
    setLink(pdf.link);
  };

  const handleCancelEdit = () => {
    setEditingPDF(null);
    setTitle('');
    setLink('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>PDF Management</h1>

      {/* Add/Update PDF Form */}
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
          placeholder="Google Drive Share Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editingPDF ? 'Update PDF' : 'Save'}
        </button>
        {editingPDF && <button onClick={handleCancelEdit}>Cancel Edit</button>}
      </form>

      {/* List PDFs */}
      <h2 style={{ marginTop: '40px' }}>Uploaded PDFs</h2>
      {pdfs.length === 0 ? (
        <p>No PDFs uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pdfs.map((pdf) => (
            <li key={pdf._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h3>{pdf.title}</h3>
              <iframe
                src={pdf.link}
                width="100%"
                height="400px"
                frameBorder="0"
              ></iframe>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleEdit(pdf)} style={{ marginRight: '10px' }}>Edit</button>
                <button onClick={() => handleDelete(pdf._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
