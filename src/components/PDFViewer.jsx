import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Use CDN worker for better compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.worker.min.js';

const PDFViewer = ({ url }) => {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfVersion, setPdfVersion] = useState(null);

  useEffect(() => {
    if (!url) return;

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Validate URL
        if (!url.startsWith('https://') || !url.endsWith('.pdf')) {
          throw new Error('Invalid PDF URL format');
        }

        // Fetch PDF
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const arrayBuffer = await response.arrayBuffer();

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPdfVersion(pdf.pdfInfo.pdfVersion);
        
        // Render first page
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ 
          canvasContext: context, 
          viewport 
        }).promise;
        
        setIsLoading(false);
      } catch (err) {
        console.error('PDF error:', err);
        setError(err.message || 'Failed to load PDF');
        setIsLoading(false);
      }
    };

    loadPDF();
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
          Loading PDF preview...
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
      
      {pdfVersion && (
        <div style={{ 
          position: 'absolute', 
          top: 5, 
          right: 5, 
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '2px 5px',
          fontSize: '0.8rem'
        }}>
          PDF v{pdfVersion}
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: error ? 'none' : 'block' }} />
    </div>
  );
};

export default PDFViewer;
