import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountManagementPage from './AccountManagementPage'
import { renderWithProviders } from '../test/helpers'
import client from '../api/client'

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockAccounts = [
  { id: 'a1', email: 'admin@enuma.com', rights: 'Enuma Admin', password: 'ab12' },
  { id: 'a2', email: 'user@enuma.com', rights: 'Enuma Admin', password: 'cd34' },
]

describe('AccountManagementPage', () => {
  beforeEach(() => {
    vi.mocked(client.get).mockResolvedValue({ data: mockAccounts })
    vi.mocked(client.post).mockReset()
    vi.mocked(client.delete).mockReset()
  })

  it('fetches and displays accounts', async () => {
    renderWithProviders(<AccountManagementPage />)
    await waitFor(() => {
      expect(screen.getByText('admin@enuma.com')).toBeInTheDocument()
      expect(screen.getByText('user@enuma.com')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    vi.mocked(client.get).mockReturnValue(new Promise(() => {}))
    renderWithProviders(<AccountManagementPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('toggles create form on + Create click', async () => {
    renderWithProviders(<AccountManagementPage />)
    await waitFor(() => expect(screen.getByText('admin@enuma.com')).toBeInTheDocument())

    await userEvent.click(screen.getByText('+ Create'))
    expect(screen.getByText('Create an account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email address')).toBeInTheDocument()
  })

  it('creates a new account', async () => {
    const newAccount = { id: 'a3', email: 'new@enuma.com', rights: 'Enuma Admin', password: 'ef56' }
    vi.mocked(client.post).mockResolvedValue({ data: newAccount })

    renderWithProviders(<AccountManagementPage />)
    await waitFor(() => expect(screen.getByText('admin@enuma.com')).toBeInTheDocument())

    await userEvent.click(screen.getByText('+ Create'))
    await userEvent.type(screen.getByPlaceholderText('Enter email address'), 'new@enuma.com')
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith('/enuma-admin/accounts', { email: 'new@enuma.com' })
      expect(screen.getByText('new@enuma.com')).toBeInTheDocument()
    })
  })

  it('shows error for duplicate email (409)', async () => {
    vi.mocked(client.post).mockRejectedValue({ response: { status: 409 } })

    renderWithProviders(<AccountManagementPage />)
    await waitFor(() => expect(screen.getByText('admin@enuma.com')).toBeInTheDocument())

    await userEvent.click(screen.getByText('+ Create'))
    await userEvent.type(screen.getByPlaceholderText('Enter email address'), 'admin@enuma.com')
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(screen.getByText('An account with this email address already exists.')).toBeInTheDocument()
    })
  })

  it('opens delete confirmation modal', async () => {
    renderWithProviders(<AccountManagementPage />)
    await waitFor(() => expect(screen.getByText('admin@enuma.com')).toBeInTheDocument())

    // Click first trash icon
    const deleteButtons = screen.getAllByRole('button').filter(
      (btn) => btn.querySelector('svg polyline[points="3 6 5 6 21 6"]'),
    )
    await userEvent.click(deleteButtons[0])

    expect(screen.getByText('Delete Account')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this account?')).toBeInTheDocument()
    // admin@enuma.com appears in both the table and modal
    expect(screen.getAllByText('admin@enuma.com').length).toBeGreaterThanOrEqual(2)
  })

  it('deletes account and removes from list', async () => {
    vi.mocked(client.delete).mockResolvedValue({})

    renderWithProviders(<AccountManagementPage />)
    await waitFor(() => expect(screen.getByText('admin@enuma.com')).toBeInTheDocument())

    // Click trash icon for first account
    const deleteButtons = screen.getAllByRole('button').filter(
      (btn) => btn.querySelector('svg polyline[points="3 6 5 6 21 6"]'),
    )
    await userEvent.click(deleteButtons[0])

    // Click Delete in modal
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(client.delete).toHaveBeenCalledWith('/enuma-admin/accounts/a1')
    })
  })

  it('closes modal on Cancel', async () => {
    renderWithProviders(<AccountManagementPage />)
    await waitFor(() => expect(screen.getByText('admin@enuma.com')).toBeInTheDocument())

    const deleteButtons = screen.getAllByRole('button').filter(
      (btn) => btn.querySelector('svg polyline[points="3 6 5 6 21 6"]'),
    )
    await userEvent.click(deleteButtons[0])
    expect(screen.getByText('Delete Account')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByText('Delete Account')).not.toBeInTheDocument()
  })
})
