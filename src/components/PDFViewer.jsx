import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'; // local worker path

const PDFViewer = ({ url, title, category }) => {
  const canvasRef = useRef();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const containerRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const toggleFullScreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement
      ) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ marginTop: '10px', textAlign: 'center' }}>
      <h3 style={{ color: '#000' }}>{title}</h3>
      <p style={{ color: '#000', marginTop: '-5px', fontSize: '14px' }}>
        Category: {category}
      </p>

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
              maxHeight: '90vh',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>

          {/* Page Controls */}
          {totalPages > 1 && (
            <div
              style={{
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                alignItems: 'center',
                color: '#333',
                fontSize: '14px', // made smaller
              }}
            >
              <button onClick={goToPrevPage} disabled={currentPage === 1}>
                ◀ Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                Next ▶
              </button>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <div style={{ marginTop: '8px' }}>
            <button onClick={toggleFullScreen}>
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PDFViewer;
