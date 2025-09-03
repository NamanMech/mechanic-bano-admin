import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFViewer = ({ url, onClose }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(1.5);
  const renderTaskRef = useRef(null);

  // Cancel ongoing PDF render task
  const cancelRenderTask = useCallback(() => {
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }
  }, []);

  // Load PDF document when URL changes
  useEffect(() => {
    const loadPDF = async () => {
      setLoading(true);
      cancelRenderTask();

      try {
        if (!url) {
          throw new Error('No PDF URL provided');
        }

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
        setError('Failed to load PDF. Please check the file URL.');
      } finally {
        setLoading(false);
      }
    };

    loadPDF();

    return () => {
      cancelRenderTask();
    };
  }, [url, cancelRenderTask]);

  // Render the current page on the canvas
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      cancelRenderTask();

      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas size to match PDF page size
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Start rendering the page
        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport,
        });

        await renderTaskRef.current.promise;
        renderTaskRef.current = null;
      } catch (err) {
        if (err.name === 'RenderingCancelledException') {
          console.log('Rendering cancelled');
        } else {
          console.error('Render page error:', err.message);
          setError('Failed to render page.');
        }
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale, cancelRenderTask]);

  // Navigation controls
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Handle manual page input
  const handlePageInput = (e) => {
    const pageNum = parseInt(e.target.value, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Zoom controls with limits
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  // Fullscreen toggle logic
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
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
  }, []);

  // Listen to fullscreen change events to sync state
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Keyboard shortcuts: left/right for page navigation, Esc to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'Escape' && isFullscreen) {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggleFullScreen]);

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
        <div className="pdf-error-container">
          <p className="pdf-error">{error}</p>
          {onClose && (
            <button className="btn-primary" onClick={onClose}>
              Close Viewer
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="pdf-controls">
            {onClose && (
              <button 
                className="btn-primary pdf-close-btn"
                onClick={onClose}
                aria-label="Close PDF viewer"
              >
                &times;
              </button>
            )}
            
            <div className="pdf-zoom-controls">
              <button 
                onClick={zoomOut}
                className="btn-primary"
                aria-label="Zoom out"
                disabled={scale <= 0.5}
              >
                -
              </button>
              <span className="zoom-level">{Math.round(scale * 100)}%</span>
              <button 
                onClick={zoomIn}
                className="btn-primary"
                aria-label="Zoom in"
                disabled={scale >= 3}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="pdf-canvas-container">
            <canvas
              ref={canvasRef}
              className="pdf-canvas"
              aria-label={`PDF page ${currentPage} of ${totalPages}`}
            />
          </div>
          
          {totalPages > 0 && (
            <div className="pdf-navigation">
              <button 
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="btn-primary"
                aria-label="First page"
              >
                ◀◀
              </button>
              
              <button 
                onClick={goToPrevPage} 
                disabled={currentPage === 1}
                className="btn-primary"
                aria-label="Previous page"
              >
                ◀ Prev
              </button>
              
              <div className="page-control">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={handlePageInput}
                  className="page-input"
                  aria-label="Current page number"
                />
                <span className="page-count">/ {totalPages}</span>
              </div>
              
              <button 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                className="btn-primary"
                aria-label="Next page"
              >
                Next ▶
              </button>
              
              <button 
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="btn-primary"
                aria-label="Last page"
              >
                ▶▶
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
