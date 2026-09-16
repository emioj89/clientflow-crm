import React from 'react';
import type { SortField } from '../../types/contact';

interface ContactsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: SortField;
  onSortChange: (value: SortField) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ContactsFilters: React.FC<ContactsFiltersProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="filters-bar">
      <div className="filter-group search-group">
        <label htmlFor="search-input" className="sr-only">
          Search contacts
        </label>
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            id="search-input"
            type="text"
            className="form-control search-input"
            placeholder="Search by name, company, or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="filter-group-row">
        <div className="filter-group">
          <label htmlFor="type-filter" className="filter-label">
            Type
          </label>
          <select
            id="type-filter"
            className="form-select"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="lead">Lead</option>
            <option value="client">Client</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter" className="filter-label">
            Status
          </label>
          <select
            id="status-filter"
            className="form-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by" className="filter-label">
            Sort by
          </label>
          <select
            id="sort-by"
            className="form-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortField)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A-Z</option>
            <option value="value-desc">Value High-Low</option>
            <option value="value-asc">Value Low-High</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn--outline btn--sm reset-filters-btn"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
