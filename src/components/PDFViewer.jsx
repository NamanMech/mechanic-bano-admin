import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();
  const [error, setError] = useState('');

  useEffect(() => {
    const renderPDF = async () => {
      try {
        alert("Start rendering: " + url);

        if (!url.includes('/storage/v1/object/public/')) {
          throw new Error('Invalid Supabase public URL');
        }

        const response = await fetch(url);
        alert("Fetch status: " + response.status);

        if (!response.ok) throw new Error('Failed to fetch PDF from Supabase public URL');

        const buffer = await response.arrayBuffer();
        alert("Buffer length: " + buffer.byteLength);

        const pdfData = new Uint8Array(buffer);
        alert("PDF data created");

        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        alert("PDF loaded");

        const page = await pdf.getPage(1);
        alert("Page 1 loaded");

        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas not found");

        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        alert("Page rendered");
      } catch (err) {
        alert("PDF Error: " + err.message);
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
