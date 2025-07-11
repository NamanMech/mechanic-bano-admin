import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFViewer = ({ url, title = 'Untitled', category = 'N/A' }) => {
  const canvasRef = useRef();
  const [error, setError] = useState('');
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const buffer = await response.arrayBuffer();
        const pdfData = new Uint8Array(buffer);

        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('PDF Error:', err.message);
        setError('PDF cannot be rendered. Please check the link or file format.');
      }
    };

    loadPDF();
  }, [url]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.1 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('Render page error:', err.message);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage]);

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Title + Category */}
      <div style={{ color: '#333', marginBottom: '10px', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 5px' }}>📄 {title}</h3>
        <p style={{ margin: 0 }}>📁 Category: {category}</p>
      </div>

      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          {/* PDF Box */}
          <div
            style={{
              overflowX: 'auto',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              background: '#f9f9f9',
              maxWidth: '100%',
              maxHeight: '90vh',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </div>

          {/* Page Controls */}
          {totalPages > 1 && (
            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                alignItems: 'center',
                color: '#333',
              }}
            >
              <button onClick={goToPrevPage} disabled={currentPage === 1}>
                ◀ Prev
              </button>
              <span style={{ fontWeight: 'bold' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PDFViewer;
