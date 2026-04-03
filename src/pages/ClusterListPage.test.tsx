import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClusterListPage from './ClusterListPage'
import { renderWithProviders } from '../test/helpers'
import client from '../api/client'

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockSchools = [
  { id: 's1', name: 'School A', institutionId: 'i1', institutionName: 'Inst A', clusterId: 'c1', clusterName: 'Cluster 1', licenseName: 'Basic', licenseIssued: 10, licenseInUse: 5 },
  { id: 's2', name: 'School B', institutionId: 'i1', institutionName: 'Inst A', clusterId: 'c2', clusterName: 'Cluster 2', licenseName: 'Pro', licenseIssued: 20, licenseInUse: 15 },
  { id: 's3', name: 'School C', institutionId: 'i2', institutionName: 'Inst B', clusterId: 'c3', clusterName: 'Cluster 3', licenseName: 'Basic', licenseIssued: 5, licenseInUse: 3 },
]

const mockInstitutions = [
  { id: 'i1', name: 'Inst A' },
  { id: 'i2', name: 'Inst B' },
]

const mockClusters = [
  { id: 'c1', name: 'Cluster 1', institutionId: 'i1' },
  { id: 'c2', name: 'Cluster 2', institutionId: 'i1' },
  { id: 'c3', name: 'Cluster 3', institutionId: 'i2' },
]

describe('ClusterListPage', () => {
  beforeEach(() => {
    vi.mocked(client.get).mockImplementation((url: string) => {
      if (url === '/enuma-admin/clusters') return Promise.resolve({ data: mockSchools })
      if (url === '/enuma-admin/institutions') return Promise.resolve({ data: mockInstitutions })
      if (url === '/enuma-admin/clusters-list') return Promise.resolve({ data: mockClusters })
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  it('shows loading initially', () => {
    vi.mocked(client.get).mockReturnValue(new Promise(() => {}))
    renderWithProviders(<ClusterListPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title', async () => {
    renderWithProviders(<ClusterListPage />)
    await waitFor(() => {
      expect(screen.getByText('ENUMA SCHOOL Cluster List')).toBeInTheDocument()
    })
  })

  it('displays all schools in table', async () => {
    renderWithProviders(<ClusterListPage />)
    await waitFor(() => {
      expect(screen.getByText('School A')).toBeInTheDocument()
      expect(screen.getByText('School B')).toBeInTheDocument()
      expect(screen.getByText('School C')).toBeInTheDocument()
    })
  })

  it('renders 3 filter dropdowns', async () => {
    renderWithProviders(<ClusterListPage />)
    await waitFor(() => expect(screen.getByText('School A')).toBeInTheDocument())

    expect(screen.getByText('All Institutions')).toBeInTheDocument()
    expect(screen.getByText('All Clusters')).toBeInTheDocument()
    expect(screen.getByText('All Schools')).toBeInTheDocument()
  })

  it('filters schools by institution', async () => {
    renderWithProviders(<ClusterListPage />)
    await waitFor(() => expect(screen.getByText('School A')).toBeInTheDocument())

    // Click institution dropdown
    await userEvent.click(screen.getByText('All Institutions'))
    // "Inst B" appears in both the dropdown and the table, use getAllByText and click the dropdown one
    const instBOptions = screen.getAllByText('Inst B')
    // The dropdown option is a button element inside the dropdown
    const dropdownOption = instBOptions.find(
      (el) => el.tagName === 'BUTTON' && el.classList.contains('hover:bg-bg'),
    )!
    await userEvent.click(dropdownOption)

    // Only School C should remain (Inst B)
    expect(screen.getByText('School C')).toBeInTheDocument()
    expect(screen.queryByText('School A')).not.toBeInTheDocument()
    expect(screen.queryByText('School B')).not.toBeInTheDocument()
  })

  it('renders column headers', async () => {
    renderWithProviders(<ClusterListPage />)
    await waitFor(() => expect(screen.getByText('School A')).toBeInTheDocument())

    expect(screen.getByText('Institution')).toBeInTheDocument()
    expect(screen.getByText('Cluster Name')).toBeInTheDocument()
    expect(screen.getByText('School Name')).toBeInTheDocument()
    expect(screen.getByText('License Name')).toBeInTheDocument()
    expect(screen.getByText('License Issued')).toBeInTheDocument()
    expect(screen.getByText('License in Use')).toBeInTheDocument()
  })

  it('renders institution and cluster as clickable links', async () => {
    renderWithProviders(<ClusterListPage />)
    await waitFor(() => expect(screen.getByText('School A')).toBeInTheDocument())

    // Institution names should be buttons
    const instLinks = screen.getAllByText('Inst A').filter((el) => el.tagName === 'BUTTON')
    expect(instLinks.length).toBeGreaterThan(0)

    // Cluster names should be buttons
    const clusterLinks = screen.getAllByText('Cluster 1').filter((el) => el.tagName === 'BUTTON')
    expect(clusterLinks.length).toBeGreaterThan(0)
  })
})
