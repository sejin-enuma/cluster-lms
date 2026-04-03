import { useState, useMemo, useCallback } from 'react';

export function usePagination<T>(data: T[], initialRowsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, Math.ceil(data.length / rowsPerPage))));
  }, [data.length, rowsPerPage]);

  const handleRowsPerPageChange = useCallback((rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  }, []);

  // Reset to page 1 when data changes
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    rowsPerPage,
    totalPages,
    paginatedData,
    totalCount: data.length,
    handlePageChange,
    handleRowsPerPageChange,
    resetPage,
  };
}
