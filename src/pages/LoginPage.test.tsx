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
    expect(screen.getByText('Cluster LMS')).toBeInTheDocument()
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

  it('shows error on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('fail'))
    renderWithProviders(<LoginPage />, { route: '/login' })

    await userEvent.type(screen.getByPlaceholderText('Email'), 'bad@test.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument()
    })
  })

  it('shows loading state during login', async () => {
    // Make login hang
    mockLogin.mockReturnValue(new Promise(() => {}))
    renderWithProviders(<LoginPage />, { route: '/login' })

    await userEvent.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
