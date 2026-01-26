import { fireEvent, render, screen } from '@testing-library/react-native'
import { RollStatus, type RollStatusType } from '../../types'
import StatusPicker from '../StatusPicker'

describe('StatusPicker', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  describe('rendering', () => {
    it('renders all five status options', () => {
      render(
        <StatusPicker value={RollStatus.IN_CAMERA} onChange={mockOnChange} />
      )

      expect(screen.getByText('In Camera')).toBeTruthy()
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

      fireEvent.press(screen.getByText('Exposing'))

      expect(mockOnChange).toHaveBeenCalledWith(RollStatus.EXPOSING)
    })

    it('calls onChange when pressing a different status', () => {
      render(
        <StatusPicker value={RollStatus.EXPOSING} onChange={mockOnChange} />
      )

      fireEvent.press(screen.getByText('Developed'))

      expect(mockOnChange).toHaveBeenCalledWith(RollStatus.DEVELOPED)
    })
  })
})
