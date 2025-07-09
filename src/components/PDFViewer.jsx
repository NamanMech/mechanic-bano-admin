// src/components/PDFViewer.jsx
import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// ✅ Set global worker from CDN (for compatibility with Vite & Netlify)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // render only first page
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (error) {
        console.error('Error rendering PDF:', error);
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
