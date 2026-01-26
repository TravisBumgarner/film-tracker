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
        <StatusPicker value={RollStatus.IN_CAMERA} onChange={mockOnChange} />
      )

      expect(screen.getByText('In Camera')).toBeTruthy()
      expect(screen.getByText('Status')).toBeTruthy()
    })

    it('renders all five status options when modal is opened', () => {
      render(
        <StatusPicker value={RollStatus.IN_CAMERA} onChange={mockOnChange} />
      )

      // Open the modal by pressing the trigger
      fireEvent.press(screen.getByText('In Camera'))

      expect(screen.getByText('Select Status')).toBeTruthy()
      // All statuses should be visible in the modal
      expect(screen.getAllByText('In Camera').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Exposing')).toBeTruthy()
      expect(screen.getByText('Exposed')).toBeTruthy()
      expect(screen.getByText('Developed')).toBeTruthy()
      expect(screen.getByText('Archived')).toBeTruthy()
    })
  })

  describe('selection', () => {
    it('calls onChange with the selected status when a status is pressed', () => {
      render(
        <StatusPicker value={RollStatus.IN_CAMERA} onChange={mockOnChange} />
      )

      // Open the modal
      fireEvent.press(screen.getByText('In Camera'))
      // Select a different status
      fireEvent.press(screen.getByText('Exposing'))

      expect(mockOnChange).toHaveBeenCalledWith(RollStatus.EXPOSING)
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
