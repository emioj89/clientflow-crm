import { describe, it, expect } from 'vitest';
import { filterContacts, sortContacts } from './contactFilters';
import type { Contact } from '../types/contact';

const mockContacts: Contact[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Alice Johnson',
    company: 'Acme Corp',
    email: 'alice@acme.com',
    phone: '123-456',
    type: 'lead',
    status: 'new',
    estimated_value: 5000,
    notes: 'Initial contact',
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Bob Smith',
    company: 'Beta Industries',
    email: 'bob@beta.io',
    phone: '987-654',
    type: 'client',
    status: 'won',
    estimated_value: 12000,
    notes: 'Signed contract',
    created_at: '2026-02-15T14:30:00Z',
    updated_at: '2026-02-15T14:30:00Z',
  },
  {
    id: '3',
    user_id: 'user-1',
    name: 'Charlie Brown',
    company: 'Gamma Logistics',
    email: 'charlie@gamma.com',
    phone: null,
    type: 'lead',
    status: 'qualified',
    estimated_value: 7500,
    notes: null,
    created_at: '2026-03-01T09:15:00Z',
    updated_at: '2026-03-01T09:15:00Z',
  },
  {
    id: '4',
    user_id: 'user-1',
    name: 'David Miller',
    company: null,
    email: 'david@freelance.org',
    phone: null,
    type: 'lead',
    status: 'lost',
    estimated_value: 2000,
    notes: 'Budget cancelled',
    created_at: '2025-12-01T11:00:00Z',
    updated_at: '2025-12-01T11:00:00Z',
  },
];

describe('contactFilters', () => {
  describe('filterContacts', () => {
    it('filters by name query (case-insensitive)', () => {
      const result = filterContacts(mockContacts, 'alice', 'all', 'all');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice Johnson');
    });

    it('filters by company query (case-insensitive)', () => {
      const result = filterContacts(mockContacts, 'gamma', 'all', 'all');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Charlie Brown');
    });

    it('filters by email query (case-insensitive)', () => {
      const result = filterContacts(mockContacts, 'beta.io', 'all', 'all');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Bob Smith');
    });

    it('filters by contact type dropdown selection', () => {
      const result = filterContacts(mockContacts, '', 'client', 'all');
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('client');
    });

    it('filters by status dropdown selection', () => {
      const result = filterContacts(mockContacts, '', 'all', 'qualified');
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('qualified');
    });

    it('combines search query, type filter, and status filter', () => {
      const result = filterContacts(mockContacts, 'Acme', 'lead', 'new');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');

      const noMatch = filterContacts(mockContacts, 'Acme', 'client', 'new');
      expect(noMatch).toHaveLength(0);
    });

    it('returns empty array when query matches nothing', () => {
      const result = filterContacts(mockContacts, 'nonexistent entity', 'all', 'all');
      expect(result).toHaveLength(0);
    });
  });

  describe('sortContacts', () => {
    it('sorts by newest created_at date', () => {
      const result = sortContacts(mockContacts, 'newest');
      expect(result.map((c) => c.id)).toEqual(['3', '2', '1', '4']);
    });

    it('sorts by oldest created_at date', () => {
      const result = sortContacts(mockContacts, 'oldest');
      expect(result.map((c) => c.id)).toEqual(['4', '1', '2', '3']);
    });

    it('sorts by name A-Z', () => {
      const result = sortContacts(mockContacts, 'name-asc');
      expect(result.map((c) => c.name)).toEqual([
        'Alice Johnson',
        'Bob Smith',
        'Charlie Brown',
        'David Miller',
      ]);
    });

    it('sorts by estimated_value high to low', () => {
      const result = sortContacts(mockContacts, 'value-desc');
      expect(result.map((c) => c.estimated_value)).toEqual([12000, 7500, 5000, 2000]);
    });

    it('sorts by estimated_value low to high', () => {
      const result = sortContacts(mockContacts, 'value-asc');
      expect(result.map((c) => c.estimated_value)).toEqual([2000, 5000, 7500, 12000]);
    });
  });
});

