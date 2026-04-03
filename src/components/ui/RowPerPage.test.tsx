import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RowPerPage from './RowPerPage'

describe('RowPerPage', () => {
  it('displays current value', () => {
    render(<RowPerPage value={10} onChange={vi.fn()} />)
    expect(screen.getByText('Row 10')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    render(<RowPerPage value={10} onChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /Row 10/ }))
    expect(screen.getByText('Row 50')).toBeInTheDocument()
    expect(screen.getByText('Row 100')).toBeInTheDocument()
  })

  it('calls onChange with selected value', async () => {
    const onChange = vi.fn()
    render(<RowPerPage value={10} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /Row 10/ }))
    await userEvent.click(screen.getByText('Row 50'))
    expect(onChange).toHaveBeenCalledWith(50)
  })

  it('closes dropdown after selection', async () => {
    render(<RowPerPage value={10} onChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /Row 10/ }))
    await userEvent.click(screen.getByText('Row 50'))
    expect(screen.queryByText('Row 100')).not.toBeInTheDocument()
  })
})
