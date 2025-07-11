// src/components/PDFViewer.jsx

import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFViewer = ({ url }) => {
  const containerRef = useRef();
  const [pdf, setPdf] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch PDF');

        const buffer = await response.arrayBuffer();
        const pdfData = new Uint8Array(buffer);
        const loadedPdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
      } catch (err) {
        console.error('PDF Load Error:', err.message);
        setError('PDF cannot be rendered. Please check the link or file format.');
      }
    };

    loadPDF();
  }, [url]);

  useEffect(() => {
    const renderPages = async () => {
      if (!pdf || !containerRef.current) return;

      const container = containerRef.current;
      container.innerHTML = ''; // Clear previous renders

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.style.marginBottom = '15px';
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        container.appendChild(canvas);
      }
    };

    renderPages();
  }, [pdf, scale, numPages]);

  const handleZoomIn = () => setScale((prev) => prev + 0.2);
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));
  const handleFullScreen = () => {
    const elem = containerRef.current;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={handleZoomIn}>➕ Zoom In</button>
        <button onClick={handleZoomOut}>➖ Zoom Out</button>
        <button onClick={handleFullScreen}>⛶ Full Screen</button>
      </div>

      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div
          ref={containerRef}
          style={{
            overflowX: 'auto',
            maxWidth: '100%',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
            background: '#f9f9f9'
          }}
        />
      )}
    </div>
  );
};

export default PDFViewer;
