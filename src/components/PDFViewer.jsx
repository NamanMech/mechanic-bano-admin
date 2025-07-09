import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '../utils/supabaseClient';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();
  const [error, setError] = useState('');

  useEffect(() => {
    const renderPDF = async () => {
      try {
        if (!url.includes('/storage/v1/object/public/')) {
          throw new Error('Invalid Supabase URL');
        }

        const relativePath = url.split('/storage/v1/object/public/')[1];
        const { data, error: downloadError } = await supabase.storage.from('pdfs').download(relativePath);

        if (downloadError || !data) {
          throw new Error('Supabase download failed');
        }

        const pdfData = new Uint8Array(await data.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('PDF Render Error:', err.message);
        setError('PDF cannot be rendered. Invalid link or format.');
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
