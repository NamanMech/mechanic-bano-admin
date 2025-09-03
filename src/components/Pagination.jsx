import React from 'react';
import '../styles/components/pagination.css';


export default function Pagination({ 
  currentPage, 
  totalPages, 
  setCurrentPage, 
  pageSize, 
  setPageSize,
  totalItems 
}) {
  const pageSizes = [5, 10, 20, 50];
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleFirst = () => setCurrentPage(1);
  const handleLast = () => setCurrentPage(totalPages);
  const handlePageChange = (page) => setCurrentPage(page);

  if (totalPages <= 1 && totalItems <= pageSizes[0]) {
    return null; 
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info" aria-live="polite" aria-atomic="true">
        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
      </div>
      
      <nav className="pagination" aria-label="Pagination Navigation">
        <button 
          className="pagination-btn pagination-first"
          onClick={handleFirst} 
          disabled={currentPage === 1}
          aria-label="Go to first page"
          type="button"
        >
          «
        </button>
        
        <button 
          className="pagination-btn pagination-prev"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          type="button"
        >
          ‹
        </button>
        
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`pagination-btn pagination-page ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            type="button"
          >
            {page}
          </button>
        ))}
        
        <button 
          className="pagination-btn pagination-next"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Go to next page"
          type="button"
        >
          ›
        </button>
        
        <button 
          className="pagination-btn pagination-last"
          onClick={handleLast}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Go to last page"
          type="button"
        >
          »
        </button>
      </nav>
      
      <div className="page-size-selector">
        <label htmlFor="pageSizeSelect">Items per page:</label>
        <select
          id="pageSizeSelect"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          aria-label="Select items per page"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
