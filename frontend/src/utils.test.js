import { describe, it, expect } from 'vitest';
import { getYear, isValidMovieId, isValidSearchQuery, parseGenres } from './utils';

describe('utils', () => {
  it('getYear parses ISO date', () => {
    expect(getYear('1999-10-15')).toBe('1999');
  });

  it('getYear handles missing date', () => {
    expect(getYear(null)).toBe('N/A');
  });

  it('isValidMovieId', () => {
    expect(isValidMovieId('550')).toBe(true);
    expect(isValidMovieId(0)).toBe(false);
    expect(isValidMovieId('')).toBe(false);
  });

  it('isValidSearchQuery', () => {
    expect(isValidSearchQuery('  matrix  ')).toBe(true);
    expect(isValidSearchQuery('')).toBe(false);
  });

  it('parseGenres handles string of ids', () => {
    const g = parseGenres('28,12');
    expect(g.length).toBeGreaterThan(0);
    expect(g[0]).toHaveProperty('name');
  });
});
