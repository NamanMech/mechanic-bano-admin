import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

export default function PDFManagement() {
  const [pdfs, setPdfs] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('free');
  const [loading, setLoading] = useState(false);
  const [editingPdf, setEditingPdf] = useState(null);
  const fileInputRef = useRef();

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

  const uploadToFirebase = async (file) => {
    const fileRef = ref(storage, `pdfs/${uuidv4()}-${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please choose a PDF file');
      return;
    }

    setLoading(true);
    toast.info(editingPdf ? 'Updating PDF...' : 'Uploading PDF...', { autoClose: 1000 });

    try {
      const fileUrl = await uploadToFirebase(file);

      const payload = {
        title,
        originalLink: fileUrl,
        embedLink: fileUrl, // For now, use same Firebase URL
        category,
      };

      if (editingPdf) {
        await axios.put(`${API_URL}general?type=pdf&id=${editingPdf._id}`, payload);
        toast.success('PDF updated successfully');
      } else {
        await axios.post(`${API_URL}general?type=pdf`, payload);
        toast.success('PDF uploaded successfully');
      }

      // Reset form
      setTitle('');
      setFile(null);
      setCategory('free');
      setEditingPdf(null);
      fileInputRef.current.value = '';
      fetchPdfs();
    } catch (err) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this PDF?')) {
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
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          required={!editingPdf}
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
              <iframe
                src={pdf.originalLink + '#toolbar=0&navpanes=0&scrollbar=0'}
                width="100%"
                height="300"
                frameBorder="0"
                title={pdf.title}
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
