import type { Contact, SortField } from '../types/contact';

export function filterContacts(
  contacts: Contact[],
  searchQuery: string,
  typeFilter: string,
  statusFilter: string
): Contact[] {
  const query = searchQuery.trim().toLowerCase();

  return contacts.filter((contact) => {
    // Type filter
    if (typeFilter && typeFilter !== 'all' && contact.type !== typeFilter) {
      return false;
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all' && contact.status !== statusFilter) {
      return false;
    }

    // Search query match (name, company, email)
    if (query) {
      const matchName = contact.name.toLowerCase().includes(query);
      const matchCompany = contact.company ? contact.company.toLowerCase().includes(query) : false;
      const matchEmail = contact.email ? contact.email.toLowerCase().includes(query) : false;

      if (!matchName && !matchCompany && !matchEmail) {
        return false;
      }
    }

    return true;
  });
}

export function sortContacts(contacts: Contact[], sortBy: SortField): Contact[] {
  const sorted = [...contacts];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'value-desc':
      return sorted.sort((a, b) => b.estimated_value - a.estimated_value);
    case 'value-asc':
      return sorted.sort((a, b) => a.estimated_value - b.estimated_value);
    default:
      return sorted;
  }
}

