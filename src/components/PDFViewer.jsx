import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'; // Local worker from public folder

const PDFViewer = ({ url, title, category }) => {
  const canvasRef = useRef();
  const [error, setError] = useState('');
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const scale = 1.2;

  const renderPage = async (num) => {
    try {
      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
    } catch (err) {
      setError('Failed to render page.');
      console.error('Page render error:', err.message);
    }
  };

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch PDF');

        const buffer = await response.arrayBuffer();
        const pdfData = new Uint8Array(buffer);

        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setPageNum(1);
      } catch (err) {
        alert('PDF Error: ' + err.message);
        setError('PDF cannot be rendered. Please check the link or file format.');
      }
    };

    renderPDF();
  }, [url]);

  useEffect(() => {
    if (pdfDoc) renderPage(pageNum);
  }, [pdfDoc, pageNum]);

  const nextPage = () => {
    if (pageNum < totalPages) setPageNum(pageNum + 1);
  };

  const prevPage = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  return (
    <div style={{ marginTop: '10px', padding: '10px' }}>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          {/* Title and Category */}
          <div style={{ marginBottom: '10px', color: '#222', fontWeight: '600' }}>
            <div>Title: <span style={{ fontWeight: 'normal' }}>{title || 'N/A'}</span></div>
            <div>Category: <span style={{ fontWeight: 'normal' }}>{category || 'N/A'}</span></div>
          </div>

          {/* PDF Canvas */}
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 0 8px rgba(0,0,0,0.1)',
              padding: '10px',
              textAlign: 'center',
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            <canvas ref={canvasRef} style={{ width: '100%', maxHeight: '80vh' }} />
          </div>

          {/* Navigation */}
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#222' }}>
            <button
              onClick={prevPage}
              disabled={pageNum === 1}
              style={{
                padding: '8px 12px',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              ◀ Prev
            </button>

            <span style={{ fontWeight: 'bold' }}>
              Page {pageNum} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={pageNum === totalPages}
              style={{
                padding: '8px 12px',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PDFViewer;
