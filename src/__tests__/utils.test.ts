import { describe, it, expect } from 'vitest';
import { generateSlug, formatDate, cn } from '@/lib/utils';

describe('Utils', () => {
  describe('generateSlug', () => {
    it('should convert text to lowercase slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(generateSlug('Hello & World!')).toBe('hello-and-world');
    });

    it('should handle Indonesian characters', () => {
      expect(generateSlug('Berita Terbaru 2024')).toBe('berita-terbaru-2024');
    });

    it('should remove multiple dashes', () => {
      expect(generateSlug('Hello   World')).toBe('hello-world');
    });

    it('should trim dashes from start and end', () => {
      expect(generateSlug('  Hello World  ')).toBe('hello-world');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should handle string date input', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toBeTruthy();
    });
  });

  describe('cn (classnames utility)', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
    });

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });

    it('should merge tailwind classes correctly', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });
  });
});
