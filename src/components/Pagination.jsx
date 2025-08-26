import React from 'react';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  setCurrentPage, 
  pageSize, 
  setPageSize,
  totalItems 
}) {
  const pageSizes = [5, 10, 20, 50];
  const maxVisiblePages = 5; // Maximum number of page buttons to show

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
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
    return null; // Don't render pagination if not needed
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
      </div>
      
      <div className="pagination" role="navigation" aria-label="Pagination Navigation">
        <button 
          className="pagination-btn pagination-first"
          onClick={handleFirst} 
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          &#171;
        </button>
        
        <button 
          className="pagination-btn pagination-prev"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          &#8249;
        </button>
        
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`pagination-btn pagination-page ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : null}
          >
            {page}
          </button>
        ))}
        
        <button 
          className="pagination-btn pagination-next"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Go to next page"
        >
          &#8250;
        </button>
        
        <button 
          className="pagination-btn pagination-last"
          onClick={handleLast}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Go to last page"
        >
          &#187;
        </button>
      </div>
      
      <div className="page-size-selector">
        <label htmlFor="pageSizeSelect">Items per page:</label>
        <select
          id="pageSizeSelect"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1); // Reset to first page when changing page size
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
