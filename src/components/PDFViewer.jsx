import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();
  const [error, setError] = useState('');

  useEffect(() => {
    const renderPDF = async () => {
      if (!url) return;

      try {
        const encodedUrl = encodeURI(url);

        const loadingTask = pdfjsLib.getDocument({
          url: encodedUrl,
          withCredentials: false,
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

      } catch (err) {
        console.error('PDF Render Error:', err);
        setError('PDF cannot be rendered. Invalid link or format.');
      }
    };

    renderPDF();
  }, [url]);

  return (
    <div className="pdf-viewer">
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <canvas ref={canvasRef} style={{ border: '1px solid #ccc', maxWidth: '100%' }} />
      )}
    </div>
  );
};

export default PDFViewer;
