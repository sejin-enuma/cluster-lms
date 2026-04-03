import { useState, useCallback } from 'react';
import type { SortState } from '../types';

export function useSort(initialSorts: SortState[] = []) {
  const [sorts, setSorts] = useState<SortState[]>(initialSorts);

  const handleSort = useCallback((key: string) => {
    setSorts((prev) => {
      const existing = prev.find((s) => s.key === key);
      const others = prev.filter((s) => s.key !== key);

      if (!existing || !existing.direction) {
        return [{ key, direction: 'asc' }, ...others];
      }
      if (existing.direction === 'asc') {
        return [{ key, direction: 'desc' }, ...others];
      }
      // desc -> neutral (remove)
      return others;
    });
  }, []);

  const sortData = useCallback(<T,>(data: T[]): T[] => {
    if (sorts.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const sort of sorts) {
        if (!sort.direction) continue;
        const aVal = (a as Record<string, unknown>)[sort.key];
        const bVal = (b as Record<string, unknown>)[sort.key];

        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal ?? '').localeCompare(String(bVal ?? ''));
        }

        if (comparison !== 0) {
          return sort.direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }, [sorts]);

  return { sorts, handleSort, sortData };
}
