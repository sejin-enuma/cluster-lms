import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test">
        Body
      </Modal>,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders title and children when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Delete Item">
        Are you sure?
      </Modal>,
    )
    expect(screen.getByText('Delete Item')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('renders actions slot', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Confirm"
        actions={<button>OK</button>}
      >
        Content
      </Modal>,
    )
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        Body
      </Modal>,
    )
    // Close button is the X button in the header
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        Body
      </Modal>,
    )
    // The overlay is the first child div with bg-black/40
    const overlay = container.querySelector('.absolute.inset-0')!
    await userEvent.click(overlay)
    expect(onClose).toHaveBeenCalledOnce()
  })
})
