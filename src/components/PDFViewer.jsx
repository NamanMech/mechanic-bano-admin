import React, { useEffect, useRef, useState } from 'react';

const PurePDFViewer = ({ url }) => {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  
  // PDF.js library reference
  const pdfjsRef = useRef(null);
  
  // Load PDF.js from CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.js';
    script.async = true;
    script.onload = () => {
      pdfjsRef.current = window.pdfjsLib;
      pdfjsRef.current.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';
    };
    script.onerror = () => setError('Failed to load PDF library');
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  // Render PDF
  useEffect(() => {
    if (!pdfjsRef.current || !url) return;
    
    const renderPage = async (pageNum) => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!pdf) {
          // Load PDF document
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed to fetch PDF');
          const arrayBuffer = await response.arrayBuffer();
          
          const pdfDoc = await pdfjsRef.current.getDocument({ data: arrayBuffer }).promise;
          setPdf(pdfDoc);
          setNumPages(pdfDoc.numPages);
        } else {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale });
          
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({ 
            canvasContext: context, 
            viewport 
          }).promise;
          
          setIsLoading(false);
        }
      } catch (err) {
        console.error('PDF error:', err);
        setError(err.message || 'Failed to load PDF');
        setIsLoading(false);
      }
    };
    
    renderPage(pageNumber);
  }, [pdf, pageNumber, scale, url]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!pdf) return;
      
      if (e.key === 'ArrowRight' && pageNumber < numPages) {
        setPageNumber(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && pageNumber > 1) {
        setPageNumber(prev => prev - 1);
      } else if (e.key === '+' || e.key === '=') {
        setScale(prev => Math.min(prev + 0.1, 3));
      } else if (e.key === '-' || e.key === '_') {
        setScale(prev => Math.max(prev - 0.1, 0.5));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages, pdf]);

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '500px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0'
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
          backgroundColor: 'rgba(255,255,255,0.8)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📄</div>
            Loading PDF...
          </div>
        </div>
      )}
      
      {error ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          maxWidth: '80%'
        }}>
          {error}
        </div>
      ) : (
        <>
          <canvas 
            ref={canvasRef} 
            style={{ 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              backgroundColor: 'white',
              cursor: 'move',
              maxWidth: '100%'
            }} 
          />
          
          {/* Hidden navigation controls */}
          <div style={{ 
            position: 'absolute', 
            bottom: '10px', 
            opacity: 0.1,
            transition: 'opacity 0.3s',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '5px 10px',
            borderRadius: '20px',
            color: 'white',
            fontSize: '14px',
            userSelect: 'none',
            ':hover': {
              opacity: 1
            }
          }}>
            <span>← → to navigate</span>
            <span style={{ margin: '0 10px' }}>|</span>
            <span>+ - to zoom</span>
          </div>
        </>
      )}
    </div>
  );
};

export default PurePDFViewer;
