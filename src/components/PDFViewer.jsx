import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'; // Make sure this is in public/

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();
  const [error, setError] = useState('');
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.1); // Slightly smaller for mobile

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
        alert('PDF Error: ' + err.message);
        console.error('PDF Render Error:', err.message);
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
        const viewport = page.getViewport({ scale });
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
  }, [pdfDoc, currentPage, scale]);

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div style={{ marginTop: '10px', textAlign: 'center' }}>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <div
            style={{
              overflowX: 'auto',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              background: '#fff',
              maxWidth: '100%',
              margin: '0 auto',
            }}
          >
            <canvas ref={canvasRef} />
          </div>

          {/* Page Controls */}
          {totalPages > 1 && (
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
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
