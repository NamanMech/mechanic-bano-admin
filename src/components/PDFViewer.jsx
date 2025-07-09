import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set correct worker source URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFViewer({ url }) {
  const canvasRef = useRef();

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error('PDF render error:', err);
      }
    };

    renderPDF();
  }, [url]);

  return <canvas ref={canvasRef} style={{ border: '1px solid #ccc', marginTop: '10px' }} />;
}
