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
  setFilterEndDate,
  clearFilters
}) {
  return (
    <div className="search-bar" role="search" aria-label="User search and filter">
      <label htmlFor="searchInput" style={{ marginRight: '8px' }}>Search:</label>
      <input
        id="searchInput"
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search users by name or email"
        style={{ marginRight: '12px' }}
      />

      <label htmlFor="statusFilter" style={{ marginRight: '8px' }}>Status:</label>
      <select
        id="statusFilter"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        aria-label="Filter users by subscription status"
        style={{ marginRight: '12px' }}
      >
        <option value="all">All</option>
        <option value="subscribed">Subscribed</option>
        <option value="expired">Expired</option>
      </select>

      <label htmlFor="startDate" style={{ marginRight: '8px' }}>Start Date:</label>
      <input
        id="startDate"
        type="date"
        value={filterStartDate}
        onChange={(e) => setFilterStartDate(e.target.value)}
        aria-label="Filter users with subscription start date after"
        style={{ marginRight: '12px' }}
      />

      <label htmlFor="endDate" style={{ marginRight: '8px' }}>End Date:</label>
      <input
        id="endDate"
        type="date"
        value={filterEndDate}
        onChange={(e) => setFilterEndDate(e.target.value)}
        aria-label="Filter users with subscription end date before"
        style={{ marginRight: '12px' }}
      />

      <button onClick={handleSortToggle} className="btn-edit" aria-label="Toggle sort order" style={{ marginRight: '12px' }}>
        Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
      </button>

      {clearFilters && (
        <button onClick={clearFilters} className="btn-clear" aria-label="Clear all filters">
          Clear Filters
        </button>
      )}
    </div>
  );
}
