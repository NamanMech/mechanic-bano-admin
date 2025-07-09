import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';

// ✅ Use CDN worker to avoid build issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const renderPDF = async () => {
      try {
        // ✅ Fetch PDF from Supabase URL
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // ✅ Load PDF
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        // ✅ Render to canvas
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('PDF render error:', err);
        alert('PDF cannot be rendered. Check URL or file type.');
      }
    };

    if (url) renderPDF();
  }, [url]);

  return (
    <div style={{ overflowX: 'auto', marginTop: '10px' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid #aaa', maxWidth: '100%' }} />
    </div>
  );
};

export default PDFViewer;
