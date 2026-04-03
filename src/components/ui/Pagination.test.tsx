import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('renders nothing when totalPages <= 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders page buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument()
    }
  })

  it('calls onPageChange when a page button is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('disables first/prev buttons on page 1', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    // First two navigation buttons (First, Prev) should be disabled
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })

  it('disables next/last buttons on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    const lastIdx = buttons.length - 1
    expect(buttons[lastIdx]).toBeDisabled()
    expect(buttons[lastIdx - 1]).toBeDisabled()
  })

  it('limits visible pages to max 10', () => {
    render(<Pagination currentPage={10} totalPages={20} onPageChange={vi.fn()} />)
    // All buttons include 4 nav buttons + page number buttons
    const allButtons = screen.getAllByRole('button')
    // 4 nav buttons (first, prev, next, last), rest are page numbers
    const pageButtons = allButtons.length - 4
    expect(pageButtons).toBeLessThanOrEqual(10)
  })
})
