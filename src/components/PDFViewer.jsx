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
      if (!url) return;

      try {
        // ✅ Extract the storage path from public URL
        const urlParts = url.split('/object/public/pdfs/');
        if (urlParts.length !== 2) throw new Error('Invalid Supabase URL');

        const path = `pdfs/${urlParts[1]}`; // actual object path

        // ✅ Download PDF blob using Supabase client
        const { data, error: downloadError } = await supabase.storage.from('pdfs').download(path);
        if (downloadError) throw downloadError;

        const arrayBuffer = await data.arrayBuffer();

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('PDF Render Error:', err);
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
