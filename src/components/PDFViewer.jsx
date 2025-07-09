import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/build/pdf.worker.entry';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

const PDFViewer = ({ url }) => {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber] = useState(1); // Only show first page for preview

  useEffect(() => {
    const container = canvasRef.current.parentNode;
    const eventBus = new pdfjsViewer.EventBus();
    let pdfViewer = null;

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize PDF viewer
        pdfViewer = new pdfjsViewer.PDFSinglePageViewer({
          container,
          eventBus,
        });

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({
          url,
          withCredentials: false,
        });
        
        const pdfDocument = await loadingTask.promise;
        pdfViewer.setDocument(pdfDocument);
        
        setIsLoading(false);
      } catch (err) {
        console.error('PDF loading error:', err);
        setError('Failed to load PDF preview');
        setIsLoading(false);
      }
    };

    if (url) {
      // Validate URL format
      if (!url.startsWith('https://') || !url.endsWith('.pdf')) {
        setError('Invalid PDF URL');
        return;
      }
      
      loadPDF();
    }

    return () => {
      // Cleanup resources
      if (pdfViewer) {
        pdfViewer.setDocument(null);
      }
    };
  }, [url]);

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '200px',
      border: '1px solid #eee',
      borderRadius: '4px',
      margin: '10px 0'
    }}>
      {isLoading && !error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.8)'
        }}>
          Loading preview...
        </div>
      )}
      
      {error && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#d32f2f',
          backgroundColor: '#ffebee'
        }}>
          {error}
        </div>
      )}
      
      <div ref={canvasRef} className="pdfViewer"></div>
    </div>
  );
};

export default PDFViewer;
