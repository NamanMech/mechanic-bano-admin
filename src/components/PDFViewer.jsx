import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFViewer = ({ url }) => {
  const canvasRef = useRef();
  const [error, setError] = useState('');
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch PDF');

        const buffer = await response.arrayBuffer();
        const pdfData = new Uint8Array(buffer);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setPageNum(1); // Start from page 1
      } catch (err) {
        console.error('PDF Load Error:', err.message);
        setError('PDF cannot be rendered. Please check the link or file format.');
      }
    };

    loadPDF();
  }, [url]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas not found");
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('PDF Page Render Error:', err.message);
        setError('Failed to render page.');
      }
    };

    renderPage();
  }, [pdfDoc, pageNum]);

  const nextPage = () => {
    if (pageNum < totalPages) setPageNum(pageNum + 1);
  };

  const prevPage = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  return (
    <div style={{ marginTop: '10px', padding: '10px' }}>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: '#fff',
              maxWidth: '100%',
              overflowX: 'auto',
              textAlign: 'center',
            }}
          >
            <canvas ref={canvasRef} style={{ width: '100%', maxHeight: '80vh' }} />
          </div>

          {/* Pagination Controls */}
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={prevPage}
              disabled={pageNum === 1}
              style={{
                padding: '8px 12px',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              ◀ Prev
            </button>

            <span style={{ alignSelf: 'center' }}>
              Page {pageNum} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={pageNum === totalPages}
              style={{
                padding: '8px 12px',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PDFViewer;
