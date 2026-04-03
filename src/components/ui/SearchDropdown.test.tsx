import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchDropdown from './SearchDropdown'

const options = [
  { value: '1', label: 'Alpha' },
  { value: '2', label: 'Beta' },
  { value: '3', label: 'Gamma' },
]

describe('SearchDropdown', () => {
  it('shows placeholder when no value selected', () => {
    render(
      <SearchDropdown options={options} value="" onChange={vi.fn()} placeholder="All Items" />,
    )
    expect(screen.getByText('All Items')).toBeInTheDocument()
  })

  it('shows selected option label', () => {
    render(
      <SearchDropdown options={options} value="2" onChange={vi.fn()} placeholder="All Items" />,
    )
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    render(
      <SearchDropdown options={options} value="" onChange={vi.fn()} placeholder="All Items" />,
    )
    await userEvent.click(screen.getByRole('button', { name: /All Items/ }))
    // All options should be visible
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('filters options by search text', async () => {
    render(
      <SearchDropdown options={options} value="" onChange={vi.fn()} placeholder="All Items" />,
    )
    await userEvent.click(screen.getByRole('button', { name: /All Items/ }))
    await userEvent.type(screen.getByPlaceholderText('All Items'), 'alp')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
  })

  it('calls onChange when an option is selected', async () => {
    const onChange = vi.fn()
    render(
      <SearchDropdown options={options} value="" onChange={onChange} placeholder="All Items" />,
    )
    await userEvent.click(screen.getByRole('button', { name: /All Items/ }))
    await userEvent.click(screen.getByText('Beta'))
    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('calls onChange with empty string for "All" option', async () => {
    const onChange = vi.fn()
    render(
      <SearchDropdown options={options} value="1" onChange={onChange} placeholder="All Items" />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Alpha/ }))
    // The "All Items" button in dropdown
    const allButton = screen.getAllByText('All Items')[0]
    await userEvent.click(allButton)
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('shows "No results" when nothing matches search', async () => {
    render(
      <SearchDropdown options={options} value="" onChange={vi.fn()} placeholder="All Items" />,
    )
    await userEvent.click(screen.getByRole('button', { name: /All Items/ }))
    await userEvent.type(screen.getByPlaceholderText('All Items'), 'zzz')
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', async () => {
    const onChange = vi.fn()
    render(
      <SearchDropdown
        options={options}
        value=""
        onChange={onChange}
        placeholder="All Items"
        disabled
      />,
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
