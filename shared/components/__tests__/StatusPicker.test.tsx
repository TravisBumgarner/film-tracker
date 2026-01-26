import { fireEvent, render, screen } from '@testing-library/react-native'
import { RollStatus } from '../../types'
import StatusPicker from '../StatusPicker'

describe('StatusPicker', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  describe('rendering', () => {
    it('renders the current status value', () => {
      render(
        <StatusPicker value={RollStatus.EXPOSING} onChange={mockOnChange} />
      )

      expect(screen.getByText('Exposing')).toBeTruthy()
      expect(screen.getByText('Status')).toBeTruthy()
    })

    it('renders all four status options when modal is opened', () => {
      render(
        <StatusPicker value={RollStatus.EXPOSING} onChange={mockOnChange} />
      )

      // Open the modal by pressing the trigger
      fireEvent.press(screen.getByText('Exposing'))

      expect(screen.getByText('Select Status')).toBeTruthy()
      // All statuses should be visible in the modal
      expect(screen.getAllByText('Exposing').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Exposed')).toBeTruthy()
      expect(screen.getByText('Developed')).toBeTruthy()
      expect(screen.getByText('Archived')).toBeTruthy()
    })
  })

  describe('selection', () => {
    it('calls onChange with the selected status when a status is pressed', () => {
      render(
        <StatusPicker value={RollStatus.EXPOSING} onChange={mockOnChange} />
      )

      // Open the modal
      fireEvent.press(screen.getByText('Exposing'))
      // Select a different status
      fireEvent.press(screen.getByText('Exposed'))

      expect(mockOnChange).toHaveBeenCalledWith(RollStatus.EXPOSED)
    })

    it('calls onChange when pressing a different status', () => {
      render(
        <StatusPicker value={RollStatus.EXPOSING} onChange={mockOnChange} />
      )

      // Open the modal
      fireEvent.press(screen.getByText('Exposing'))
      // Select a different status
      fireEvent.press(screen.getByText('Developed'))

      expect(mockOnChange).toHaveBeenCalledWith(RollStatus.DEVELOPED)
    })
  })
})
