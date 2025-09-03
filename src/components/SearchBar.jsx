import React from 'react';
import '../styles/components/search-bar.css';


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
    <section className="search-bar" role="search" aria-label="User search and filter">
      <div className="form-group">
        <label htmlFor="searchInput">Search:</label>
        <input
          id="searchInput"
          type="search"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search users by name or email"
          autoComplete="off"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="statusFilter">Status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter users by subscription status"
        >
          <option value="all">All</option>
          <option value="subscribed">Subscribed</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="startDate">Start Date:</label>
        <input
          id="startDate"
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          aria-label="Filter users with subscription start date after"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="endDate">End Date:</label>
        <input
          id="endDate"
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          aria-label="Filter users with subscription end date before"
        />
      </div>
      
      <div className="form-group">
        <button onClick={handleSortToggle} type="button" className="btn-edit" aria-label="Toggle sort order">
          Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </button>
      </div>
      
      {clearFilters && (
        <div className="form-group">
          <button onClick={clearFilters} type="button" className="cancel-button" aria-label="Clear all filters">
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
