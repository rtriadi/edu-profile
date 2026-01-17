import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner, PageLoading, Skeleton, SkeletonCard } from '@/components/ui/loading';
import { EmptyState, NoDataEmpty, NoSearchResults } from '@/components/ui/empty-state';

describe('Loading Components', () => {
  describe('Spinner', () => {
    it('should render spinner with default size', () => {
      render(<Spinner />);
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
    });

    it('should render spinner with custom size', () => {
      render(<Spinner size="lg" />);
      const spinner = document.querySelector('.h-8.w-8');
      expect(spinner).toBeTruthy();
    });
  });

  describe('PageLoading', () => {
    it('should render with default message', () => {
      render(<PageLoading />);
      expect(screen.getByText('Memuat...')).toBeTruthy();
    });

    it('should render with custom message', () => {
      render(<PageLoading message="Loading data..." />);
      expect(screen.getByText('Loading data...')).toBeTruthy();
    });
  });

  describe('Skeleton', () => {
    it('should render skeleton with animation', () => {
      render(<Skeleton className="h-4 w-full" />);
      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeTruthy();
    });
  });

  describe('SkeletonCard', () => {
    it('should render skeleton card structure', () => {
      render(<SkeletonCard />);
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});

describe('Empty State Components', () => {
  describe('EmptyState', () => {
    it('should render title', () => {
      render(<EmptyState title="No items found" />);
      expect(screen.getByText('No items found')).toBeTruthy();
    });

    it('should render description when provided', () => {
      render(
        <EmptyState 
          title="No items" 
          description="Add some items to get started" 
        />
      );
      expect(screen.getByText('Add some items to get started')).toBeTruthy();
    });

    it('should render action button when provided', () => {
      const mockAction = { label: 'Add Item', onClick: () => {} };
      render(
        <EmptyState 
          title="No items" 
          action={mockAction} 
        />
      );
      expect(screen.getByText('Add Item')).toBeTruthy();
    });
  });

  describe('NoDataEmpty', () => {
    it('should render with default message', () => {
      render(<NoDataEmpty />);
      expect(screen.getByText('Belum ada data')).toBeTruthy();
    });
  });

  describe('NoSearchResults', () => {
    it('should render with query', () => {
      render(<NoSearchResults query="test" />);
      expect(screen.getByText(/tidak ditemukan hasil untuk "test"/i)).toBeTruthy();
    });
  });
});
