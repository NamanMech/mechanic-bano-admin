// src/components/PDFViewer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFViewer({ url }) {
  const canvasRef = useRef();
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pathStart = '/storage/v1/object/public/';
        const relativePath = url.split(pathStart)[1]; // "pdfs/<filename>.pdf"
        if (!relativePath) throw new Error('Invalid public URL');

        const { data, error } = await supabase.storage.from('pdfs').download(relativePath);
        if (error || !data) throw new Error('Failed to download file');

        const pdfBlob = data;
        const pdfData = new Uint8Array(await pdfBlob.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

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

    if (url) loadPdf();
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
}
