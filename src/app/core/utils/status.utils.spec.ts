import { describe, it, expect } from 'vitest';
import { getStatusName } from './status.utils';

describe('Status Utils', () => {
  it('should return "Confirmed" for status 2', () => {
    expect(getStatusName(2)).toBe('Confirmed');
  });

  it('should return "Initiated" for status 0', () => {
    expect(getStatusName(0)).toBe('Initiated');
  });

  it('should return "Unknown" for negative status', () => {
    expect(getStatusName(-1)).toBe('Unknown');
  });

  it('should return "Unknown" for out of bounds status', () => {
    expect(getStatusName(99)).toBe('Unknown');
  });
});
