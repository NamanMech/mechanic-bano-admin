import React from 'react';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSortToggle,
  sortOrder,
  filterStatus,
  setFilterStatus,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate
}) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="all">All</option>
        <option value="subscribed">Subscribed</option>
        <option value="expired">Expired</option>
      </select>

      <input
        type="date"
        value={filterStartDate}
        onChange={(e) => setFilterStartDate(e.target.value)}
      />

      <input
        type="date"
        value={filterEndDate}
        onChange={(e) => setFilterEndDate(e.target.value)}
      />

      <button onClick={handleSortToggle} className="btn-edit">
        Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
      </button>
    </div>
  );
}
