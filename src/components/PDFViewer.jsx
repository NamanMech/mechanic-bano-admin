import React, { useEffect, useRef, useState } from 'react';

const PDFViewer = ({ url }) => {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Dynamically import PDF.js to avoid build issues
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

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
      
      <canvas ref={canvasRef} style={{ 
        display: error ? 'none' : 'block',
        border: '1px solid #eee',
        borderRadius: '4px'
      }} />
    </div>
  );
};

export default PDFViewer;
