import React from 'react';

export default function Pagination({ currentPage, totalPages, setCurrentPage, pageSize, setPageSize }) {
  const pageSizes = [5, 10, 20];

  return (
    <div className="pagination">
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
        Prev
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
        Next
      </button>

      <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
        {pageSizes.map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
    </div>
  );
}
