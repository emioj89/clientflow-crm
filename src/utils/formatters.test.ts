import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, capitalize } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats numeric values into USD currency representation', () => {
      expect(formatCurrency(1250)).toBe('$1,250');
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(99.5)).toBe('$99.50');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date strings into readable month, day, year format', () => {
      expect(formatDate('2026-03-15T12:00:00Z')).toBe('Mar 15, 2026');
    });

    it('returns fallback dash for invalid or missing dates', () => {
      expect(formatDate('')).toBe('—');
      expect(formatDate('invalid-date')).toBe('—');
    });
  });

  describe('capitalize', () => {
    it('capitalizes the first letter of a string', () => {
      expect(capitalize('lead')).toBe('Lead');
      expect(capitalize('QUALIFIED')).toBe('Qualified');
      expect(capitalize('')).toBe('');
    });
  });
});

