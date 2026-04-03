import { renderHook, act } from '@testing-library/react'
import { usePagination } from './usePagination'

const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))

describe('usePagination', () => {
  it('defaults to 10 rows per page', () => {
    const { result } = renderHook(() => usePagination(items))
    expect(result.current.rowsPerPage).toBe(10)
    expect(result.current.paginatedData).toHaveLength(10)
  })

  it('calculates totalPages correctly', () => {
    const { result } = renderHook(() => usePagination(items))
    expect(result.current.totalPages).toBe(3) // 25 / 10 = 2.5 → ceil = 3
  })

  it('returns correct slice for page 1', () => {
    const { result } = renderHook(() => usePagination(items))
    expect(result.current.paginatedData[0]).toEqual({ id: 1 })
    expect(result.current.paginatedData[9]).toEqual({ id: 10 })
  })

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination(items))
    act(() => result.current.handlePageChange(2))
    expect(result.current.currentPage).toBe(2)
    expect(result.current.paginatedData[0]).toEqual({ id: 11 })
  })

  it('returns remaining items on last page', () => {
    const { result } = renderHook(() => usePagination(items))
    act(() => result.current.handlePageChange(3))
    expect(result.current.paginatedData).toHaveLength(5)
    expect(result.current.paginatedData[0]).toEqual({ id: 21 })
  })

  it('clamps page to valid range', () => {
    const { result } = renderHook(() => usePagination(items))
    act(() => result.current.handlePageChange(100))
    expect(result.current.currentPage).toBe(3)
    act(() => result.current.handlePageChange(-1))
    expect(result.current.currentPage).toBe(1)
  })

  it('resets to page 1 when rowsPerPage changes', () => {
    const { result } = renderHook(() => usePagination(items))
    act(() => result.current.handlePageChange(2))
    act(() => result.current.handleRowsPerPageChange(50))
    expect(result.current.currentPage).toBe(1)
    expect(result.current.rowsPerPage).toBe(50)
  })

  it('supports custom initial rowsPerPage', () => {
    const { result } = renderHook(() => usePagination(items, 5))
    expect(result.current.rowsPerPage).toBe(5)
    expect(result.current.totalPages).toBe(5)
    expect(result.current.paginatedData).toHaveLength(5)
  })

  it('provides totalCount', () => {
    const { result } = renderHook(() => usePagination(items))
    expect(result.current.totalCount).toBe(25)
  })

  it('resetPage sets to page 1', () => {
    const { result } = renderHook(() => usePagination(items))
    act(() => result.current.handlePageChange(3))
    act(() => result.current.resetPage())
    expect(result.current.currentPage).toBe(1)
  })
})
