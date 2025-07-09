import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';

// ✅ Use CDN version of the worker to avoid Vite/Netlify build errors
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const renderPDF = async () => {
      try {
        if (!url) return;

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error('Error rendering PDF:', error);
      }
    };

    renderPDF();
  }, [url]);

  return (
    <div style={{ overflowX: 'auto', marginTop: '10px' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid #aaa' }} />
    </div>
  );
};

export default PDFViewer;
