import { renderHook, act } from '@testing-library/react'
import { useSort } from './useSort'

describe('useSort', () => {
  it('starts with no sorts by default', () => {
    const { result } = renderHook(() => useSort())
    expect(result.current.sorts).toEqual([])
  })

  it('starts with provided initial sorts', () => {
    const { result } = renderHook(() => useSort([{ key: 'name', direction: 'asc' }]))
    expect(result.current.sorts).toEqual([{ key: 'name', direction: 'asc' }])
  })

  describe('handleSort cycling: neutral -> asc -> desc -> neutral', () => {
    it('sets asc on first click', () => {
      const { result } = renderHook(() => useSort())
      act(() => result.current.handleSort('name'))
      expect(result.current.sorts).toEqual([{ key: 'name', direction: 'asc' }])
    })

    it('sets desc on second click', () => {
      const { result } = renderHook(() => useSort())
      act(() => result.current.handleSort('name'))
      act(() => result.current.handleSort('name'))
      expect(result.current.sorts).toEqual([{ key: 'name', direction: 'desc' }])
    })

    it('removes sort (neutral) on third click', () => {
      const { result } = renderHook(() => useSort())
      act(() => result.current.handleSort('name'))
      act(() => result.current.handleSort('name'))
      act(() => result.current.handleSort('name'))
      expect(result.current.sorts).toEqual([])
    })
  })

  describe('multi-column sort', () => {
    it('puts most recently clicked column first', () => {
      const { result } = renderHook(() => useSort())
      act(() => result.current.handleSort('name'))
      act(() => result.current.handleSort('age'))
      expect(result.current.sorts[0].key).toBe('age')
      expect(result.current.sorts[1].key).toBe('name')
    })
  })

  describe('sortData', () => {
    const data = [
      { name: 'Charlie', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 },
    ]

    it('returns data unchanged when no sorts', () => {
      const { result } = renderHook(() => useSort())
      expect(result.current.sortData(data)).toEqual(data)
    })

    it('sorts strings ascending', () => {
      const { result } = renderHook(() => useSort())
      act(() => result.current.handleSort('name'))
      const sorted = result.current.sortData(data)
      expect(sorted.map((d) => d.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('sorts strings descending', () => {
      const { result } = renderHook(() => useSort())
      act(() => result.current.handleSort('name'))
      act(() => result.current.handleSort('name'))
      const sorted = result.current.sortData(data)
      expect(sorted.map((d) => d.name)).toEqual(['Charlie', 'Bob', 'Alice'])
    })

    it('sorts numbers ascending', () => {
      const { result } = renderHook(() => useSort())
      act(() => result.current.handleSort('age'))
      const sorted = result.current.sortData(data)
      expect(sorted.map((d) => d.age)).toEqual([25, 30, 35])
    })

    it('sorts numbers descending', () => {
      const { result } = renderHook(() => useSort())
      act(() => result.current.handleSort('age'))
      act(() => result.current.handleSort('age'))
      const sorted = result.current.sortData(data)
      expect(sorted.map((d) => d.age)).toEqual([35, 30, 25])
    })

    it('does not mutate original array', () => {
      const { result } = renderHook(() => useSort())
      act(() => result.current.handleSort('name'))
      const original = [...data]
      result.current.sortData(data)
      expect(data).toEqual(original)
    })
  })
})
