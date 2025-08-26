import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'; // local worker path

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPDF = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const buffer = await response.arrayBuffer();
        const pdfData = new Uint8Array(buffer);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        setError('');
      } catch (err) {
        console.error('PDF Error:', err.message);
        setError('PDF cannot be rendered. Please check the link or file format.');
      } finally {
        setLoading(false);
      }
    };
    
    if (url) {
      loadPDF();
    }
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
        setError('Failed to render page.');
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
    <div
      ref={containerRef}
      className={`pdf-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}
      aria-live="polite"
      aria-label="PDF Viewer"
      role="region"
    >
      {loading ? (
        <div className="pdf-loading">
          <div className="spinner"></div>
          <p>Loading PDF...</p>
        </div>
      ) : error ? (
        <p className="pdf-error">{error}</p>
      ) : (
        <>
          <div className="pdf-canvas-container">
            <canvas
              ref={canvasRef}
              className="pdf-canvas"
              aria-label={`PDF page ${currentPage}`}
            />
          </div>
          
          {totalPages > 1 && (
            <div className="pdf-navigation">
              <button 
                onClick={goToPrevPage} 
                disabled={currentPage === 1}
                className="btn-primary"
                aria-label="Previous page"
              >
                ◀ Prev
              </button>
              
              <span className="page-counter">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                className="btn-primary"
                aria-label="Next page"
              >
                Next ▶
              </button>
            </div>
          )}
          
          <div className="fullscreen-toggle">
            <button 
              onClick={toggleFullScreen} 
              className="btn-primary"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PDFViewer;
