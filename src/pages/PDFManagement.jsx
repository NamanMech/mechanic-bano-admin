import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PDFManagement() {
  const [pdfs, setPdfs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfLink, setPdfLink] = useState('');
  const [category, setCategory] = useState('free');
  const [loading, setLoading] = useState(false);
  const [editingPDF, setEditingPDF] = useState(null);

  const fetchPDFs = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + 'pdf');
      setPdfs(response.data);
    } catch (error) {
      alert('Error fetching PDFs');
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!pdfLink.endsWith('.pdf')) {
      alert('Please enter a valid PDF link ending with .pdf');
      setLoading(false);
      return;
    }

    try {
      if (editingPDF) {
        await axios.put(import.meta.env.VITE_API_URL + `pdf?id=${editingPDF._id}`, {
          title,
          description,
          pdfLink,
          category
        });
        alert('PDF updated successfully');
        setEditingPDF(null);
      } else {
        await axios.post(import.meta.env.VITE_API_URL + 'pdf', {
          title,
          description,
          pdfLink,
          category
        });
        alert('PDF added successfully');
      }

      setTitle('');
      setDescription('');
      setPdfLink('');
      setCategory('free');
      fetchPDFs();
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
      fetchPDFs();
    } catch (error) {
      alert('Error deleting PDF');
    }
  };

  const handleEdit = (pdf) => {
    setEditingPDF(pdf);
    setTitle(pdf.title);
    setDescription(pdf.description);
    setPdfLink(pdf.pdfLink);
    setCategory(pdf.category);
  };

  const handleCancelEdit = () => {
    setEditingPDF(null);
    setTitle('');
    setDescription('');
    setPdfLink('');
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
        <textarea
          placeholder="PDF Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="PDF Link (must end with .pdf)"
          value={pdfLink}
          onChange={(e) => setPdfLink(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editingPDF ? 'Update PDF' : 'Save'}
        </button>
        {editingPDF && <button onClick={handleCancelEdit}>Cancel Edit</button>}
      </form>

      <h2 style={{ marginTop: '40px' }}>Uploaded PDFs</h2>
      {pdfs.length === 0 ? (
        <p>No PDFs uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pdfs.map((pdf) => (
            <li key={pdf._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h3>{pdf.title}</h3>
              <p>{pdf.description}</p>
              <a href={pdf.pdfLink} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                View PDF
              </a>
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
