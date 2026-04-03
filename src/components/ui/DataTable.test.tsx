import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from './DataTable'
import type { Column } from '../../types'
import { renderWithProviders } from '../../test/helpers'

interface TestItem {
  id: string
  name: string
  age: number
}

const columns: Column<TestItem>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: false },
]

const data: TestItem[] = [
  { id: '1', name: 'Alice', age: 25 },
  { id: '2', name: 'Bob', age: 30 },
]

describe('DataTable', () => {
  it('shows "No data to display" when data is empty', () => {
    renderWithProviders(
      <DataTable
        columns={columns}
        data={[]}
        sorts={[]}
        onSort={vi.fn()}
        keyExtractor={(r) => r.id}
      />,
    )
    expect(screen.getByText('No data to display')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    renderWithProviders(
      <DataTable
        columns={columns}
        data={data}
        sorts={[]}
        onSort={vi.fn()}
        keyExtractor={(r) => r.id}
      />,
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    renderWithProviders(
      <DataTable
        columns={columns}
        data={data}
        sorts={[]}
        onSort={vi.fn()}
        keyExtractor={(r) => r.id}
      />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('calls onSort when sortable header is clicked', async () => {
    const onSort = vi.fn()
    renderWithProviders(
      <DataTable
        columns={columns}
        data={data}
        sorts={[]}
        onSort={onSort}
        keyExtractor={(r) => r.id}
      />,
    )
    await userEvent.click(screen.getByText('Name'))
    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('does not call onSort when non-sortable header is clicked', async () => {
    const onSort = vi.fn()
    renderWithProviders(
      <DataTable
        columns={columns}
        data={data}
        sorts={[]}
        onSort={onSort}
        keyExtractor={(r) => r.id}
      />,
    )
    await userEvent.click(screen.getByText('Age'))
    expect(onSort).not.toHaveBeenCalled()
  })

  it('supports custom render functions', () => {
    const customColumns: Column<TestItem>[] = [
      {
        key: 'name',
        header: 'Name',
        sortable: false,
        render: (row) => <strong data-testid="custom">{row.name.toUpperCase()}</strong>,
      },
    ]
    renderWithProviders(
      <DataTable
        columns={customColumns}
        data={data}
        sorts={[]}
        onSort={vi.fn()}
        keyExtractor={(r) => r.id}
      />,
    )
    expect(screen.getByText('ALICE')).toBeInTheDocument()
  })
})
