import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange }) {
  const handlePageSizeChange = (e) => {
    onPageSizeChange(parseInt(e.target.value));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
      <div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-edit"
          style={{ marginRight: '10px' }}
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn-edit"
        >
          Next
        </button>
      </div>

      <div>
        Page {currentPage} of {totalPages}
      </div>

      <div>
        <label htmlFor="pageSize">Page Size: </label>
        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
    </div>
  );
}
