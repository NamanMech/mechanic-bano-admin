// src/components/PDFViewer.jsx

import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Worker source: public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();
  const [error, setError] = useState('');

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch PDF');

        const buffer = await response.arrayBuffer();
        const pdfData = new Uint8Array(buffer);

        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas not found");

        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('PDF Render Error:', err.message);
        setError('PDF cannot be rendered. Please check the link or file format.');
      }
    };

    renderPDF();
  }, [url]);

  return (
    <div style={{ marginTop: '10px', overflowX: 'auto' }}>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <canvas ref={canvasRef} style={{ border: '1px solid #999' }} />
      )}
    </div>
  );
};

export default PDFViewer;
