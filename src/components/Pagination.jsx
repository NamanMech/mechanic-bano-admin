import React from 'react';

export default function Pagination({ currentPage, totalPages, setCurrentPage, pageSize, setPageSize }) {
  const pageSizes = [5, 10, 20];

  const handleFirst = () => setCurrentPage(1);
  const handleLast = () => setCurrentPage(totalPages);

  return (
    <div className="pagination" role="navigation" aria-label="Pagination Navigation" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button onClick={handleFirst} disabled={currentPage === 1} aria-label="Go to first page">
        {'<<'}
      </button>
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1} aria-label="Go to previous page"
      >
        Prev
      </button>
      <span aria-live="polite" aria-atomic="true">
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0} aria-label="Go to next page"
      >
        Next
      </button>
      <button onClick={handleLast}
        disabled={currentPage === totalPages || totalPages === 0} aria-label="Go to last page"
      >
        {'>>'}
      </button>
      <label htmlFor="pageSizeSelect" style={{ marginLeft: '10px' }}>Items per page:</label>
      <select
        id="pageSizeSelect"
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        aria-label="Select items per page"
      >
        {pageSizes.map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
    </div>
  );
}
