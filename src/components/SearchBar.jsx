import React from 'react';

export default function SearchBar({ searchQuery, setSearchQuery, handleSortToggle, sortOrder }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSortToggle} className="btn-edit">
        Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
      </button>
    </div>
  );
}
