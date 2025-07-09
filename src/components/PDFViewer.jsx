import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Correct worker path for browser
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFViewer({ url }) {
  const canvasRef = useRef();
  const [error, setError] = useState('');

  useEffect(() => {
    const renderPDF = async () => {
      setError('');
      if (!url) return;

      try {
        const loadingTask = pdfjsLib.getDocument({ url, withCredentials: false });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('PDF render error:', err);
        setError('PDF cannot be rendered. Invalid link or format.');
      }
    };

    renderPDF();
  }, [url]);

  return (
    <div className="pdf-viewer" style={{ marginTop: '10px', overflowX: 'auto' }}>
      {error ? (
        <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>
      ) : (
        <canvas ref={canvasRef} style={{ border: '1px solid #ccc', maxWidth: '100%' }} />
      )}
    </div>
  );
}
