// src/components/PDFViewer.jsx
import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Use CDN worker (compatible with Vite + Netlify)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const renderPDF = async () => {
      try {
        // 👇 Fetch the file as blob first
        const response = await fetch(url);
        const blob = await response.blob();

        // 👇 Create a blob URL so pdf.js can read it
        const objectUrl = URL.createObjectURL(blob);

        const loadingTask = pdfjsLib.getDocument(objectUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.3 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        URL.revokeObjectURL(objectUrl); // 👈 Cleanup blob URL
      } catch (err) {
        console.error('❌ PDF rendering failed:', err);
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
