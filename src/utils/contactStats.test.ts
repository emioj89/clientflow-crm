import { describe, it, expect } from 'vitest';
import { calculateContactStats } from './contactStats';
import type { Contact } from '../types/contact';

const mockContacts: Contact[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Lead 1',
    company: 'Co 1',
    email: 'l1@co.com',
    phone: null,
    type: 'lead',
    status: 'new',
    estimated_value: 1000,
    notes: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Lead 2 (Qualified)',
    company: 'Co 2',
    email: 'l2@co.com',
    phone: null,
    type: 'lead',
    status: 'qualified',
    estimated_value: 3000,
    notes: null,
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'user-1',
    name: 'Client 1 (Won)',
    company: 'Co 3',
    email: 'c1@co.com',
    phone: null,
    type: 'client',
    status: 'won',
    estimated_value: 5000,
    notes: null,
    created_at: '2026-01-03T00:00:00Z',
    updated_at: '2026-01-03T00:00:00Z',
  },
  {
    id: '4',
    user_id: 'user-1',
    name: 'Lost Lead',
    company: 'Co 4',
    email: 'lost@co.com',
    phone: null,
    type: 'lead',
    status: 'lost',
    estimated_value: 4000, // Excluded from pipeline value (status === 'lost')
    notes: null,
    created_at: '2026-01-04T00:00:00Z',
    updated_at: '2026-01-04T00:00:00Z',
  },
  {
    id: '5',
    user_id: 'user-1',
    name: 'Client Qualified (Not a lead)',
    company: 'Co 5',
    email: 'c2@co.com',
    phone: null,
    type: 'client',
    status: 'qualified',
    estimated_value: 2000,
    notes: null,
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-01-05T00:00:00Z',
  },
];

describe('contactStats', () => {
  describe('calculateContactStats', () => {
    it('calculates metrics correctly for a full contact dataset', () => {
      const stats = calculateContactStats(mockContacts);

      expect(stats.totalContacts).toBe(5);
      expect(stats.leadsCount).toBe(3);
      expect(stats.clientsCount).toBe(2);
      expect(stats.qualifiedCount).toBe(1); // Only Lead 2 counts (type === 'lead' AND status === 'qualified')
      expect(stats.wonCount).toBe(1);
      // Pipeline value sums status !== 'lost': 1000 + 3000 + 5000 + 2000 = 11000
      expect(stats.pipelineValue).toBe(11000);
    });

    it('verifies that a lead with status qualified INCREMENTS qualifiedCount', () => {
      const leadQualified: Contact[] = [
        {
          id: 'q1',
          user_id: 'u1',
          name: 'Qualified Lead',
          company: 'A',
          email: null,
          phone: null,
          type: 'lead',
          status: 'qualified',
          estimated_value: 100,
          notes: null,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ];
      const stats = calculateContactStats(leadQualified);
      expect(stats.qualifiedCount).toBe(1);
    });

    it('verifies that a client with status qualified DOES NOT INCREMENT qualifiedCount', () => {
      const clientQualified: Contact[] = [
        {
          id: 'q2',
          user_id: 'u1',
          name: 'Qualified Client',
          company: 'B',
          email: null,
          phone: null,
          type: 'client',
          status: 'qualified',
          estimated_value: 100,
          notes: null,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ];
      const stats = calculateContactStats(clientQualified);
      expect(stats.qualifiedCount).toBe(0);
    });

    it('verifies that pipeline value excludes lost opportunities and keeps non-lost rule', () => {
      const lostOnly: Contact[] = [
        {
          id: 'l1',
          user_id: 'u1',
          name: 'Lost Deal',
          company: 'C',
          email: null,
          phone: null,
          type: 'lead',
          status: 'lost',
          estimated_value: 50000,
          notes: null,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ];
      const stats = calculateContactStats(lostOnly);
      expect(stats.pipelineValue).toBe(0);
    });

    it('returns zero metrics for empty contact list or undefined', () => {
      const emptyStats = calculateContactStats([]);
      expect(emptyStats).toEqual({
        totalContacts: 0,
        leadsCount: 0,
        clientsCount: 0,
        qualifiedCount: 0,
        wonCount: 0,
        pipelineValue: 0,
      });

      // @ts-expect-error testing null input handling
      const nullStats = calculateContactStats(null);
      expect(nullStats).toEqual({
        totalContacts: 0,
        leadsCount: 0,
        clientsCount: 0,
        qualifiedCount: 0,
        wonCount: 0,
        pipelineValue: 0,
      });
    });
  });
});
