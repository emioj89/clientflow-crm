import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import { filterContacts, sortContacts } from '../utils/contactFilters';
import type { SortField } from '../types/contact';
import { ContactsFilters } from '../components/contacts/ContactsFilters';
import { ContactsTable } from '../components/contacts/ContactsTable';
import { ContactCard } from '../components/contacts/ContactCard';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

export const ContactsPage: React.FC = () => {
  const { contacts, isLoading, error, refetch } = useContacts();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortField>('newest');

  const filteredContacts = useMemo(() => {
    const filtered = filterContacts(contacts, searchQuery, typeFilter, statusFilter);
    return sortContacts(filtered, sortBy);
  }, [contacts, searchQuery, typeFilter, statusFilter, sortBy]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || typeFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'newest'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
  };

  if (isLoading) {
    return <LoadingState message="Fetching your CRM contacts..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load contacts"
        message={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Contacts Directory</h2>
          <p className="page-subtitle">
            Manage your leads, clients, deal stages, and sales records.
          </p>
        </div>
        <Link to="/contacts/new" className="btn btn--primary">
          ➕ New Contact
        </Link>
      </div>

      <ContactsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {contacts.length === 0 ? (
        <EmptyState
          title="No contacts yet"
          message="Start building your client pipeline by adding your first commercial contact."
          actionLabel="Create Contact"
          onAction={() => window.location.assign('#/contacts/new')}
        />
      ) : filteredContacts.length === 0 ? (
        <EmptyState
          title="No matching contacts"
          message="No contacts matched your search and filter criteria. Try adjusting your filters."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-only">
            <ContactsTable contacts={filteredContacts} />
          </div>

          {/* Mobile Grid Card View */}
          <div className="mobile-only contacts-cards-grid">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

