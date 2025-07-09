// src/components/PDFViewer.jsx
import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// ✅ Use CDN to avoid worker issues with Vite/Netlify
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const renderPDF = async () => {
      if (!url || !canvasRef.current) return;

      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          withCredentials: false, // important for public access
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (error) {
        console.error('❌ Failed to render PDF:', error.message);
      }
    };

    renderPDF();
  }, [url]);

  return (
    <div style={{ overflowX: 'auto', marginTop: '10px', textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #ccc',
          maxWidth: '100%',
          background: '#fff',
        }}
      />
    </div>
  );
};

export default PDFViewer;
