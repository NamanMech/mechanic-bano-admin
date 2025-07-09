// src/components/PDFViewer.jsx
import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// ✅ Configure worker from CDN (important for Vite)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const renderPDF = async () => {
      try {
        // ✅ Step 1: Fetch PDF manually as arrayBuffer
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        // ✅ Step 2: Pass arrayBuffer to PDF.js
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (error) {
        console.error('PDF render error:', error);
      }
    };

    if (url) renderPDF();
  }, [url]);

  return (
    <div style={{ overflowX: 'auto', marginTop: '10px' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid #aaa', width: '100%' }} />
    </div>
  );
};

export default PDFViewer;
