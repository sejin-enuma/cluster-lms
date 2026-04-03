import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './LoginPage'
import { renderWithProviders } from '../test/helpers'

// Mock useAuth
const mockLogin = vi.fn()
const mockUseAuth = vi.fn()

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockReset()
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      user: null,
    })
  })

  it('renders login form', () => {
    renderWithProviders(<LoginPage />, { route: '/login' })
    expect(screen.getByAltText('Enuma School')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('calls login with email and password on submit', async () => {
    mockLogin.mockResolvedValue(undefined)
    renderWithProviders(<LoginPage />, { route: '/login' })

    await userEvent.type(screen.getByPlaceholderText('Email'), 'admin@enuma.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'admin123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(mockLogin).toHaveBeenCalledWith('admin@enuma.com', 'admin123')
  })

  it('shows USER_NOT_FOUND error', async () => {
    mockLogin.mockRejectedValue({ response: { data: { error: 'USER_NOT_FOUND' } } })
    renderWithProviders(<LoginPage />, { route: '/login' })

    await userEvent.type(screen.getByPlaceholderText('Email'), 'bad@test.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByText('Account does not exist.')).toBeInTheDocument()
    })
  })

  it('shows WRONG_PASSWORD error', async () => {
    mockLogin.mockRejectedValue({ response: { data: { error: 'WRONG_PASSWORD' } } })
    renderWithProviders(<LoginPage />, { route: '/login' })

    await userEvent.type(screen.getByPlaceholderText('Email'), 'admin@enuma.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByText('Password does not match.')).toBeInTheDocument()
    })
  })

  it('shows general error for unknown failures', async () => {
    mockLogin.mockRejectedValue(new Error('network error'))
    renderWithProviders(<LoginPage />, { route: '/login' })

    await userEvent.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByText('Unable to log in. Please contact the administrator.')).toBeInTheDocument()
    })
  })

  it('shows loading state during login', async () => {
    mockLogin.mockReturnValue(new Promise(() => {}))
    renderWithProviders(<LoginPage />, { route: '/login' })

    await userEvent.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
