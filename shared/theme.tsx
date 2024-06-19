import { Phase } from './types'

export const COLORS = {
  primary: {
    foreground: 'rgb(2, 100, 160)',
    background: 'rgba(2, 100, 160, 0.2)',
  },
  secondary: {
    foreground: 'rgb(100, 157, 200)',
    background: 'rgba(100, 157, 200, 0.2)',
  },
  error: {
    foreground: 'rgb(189, 123, 105)',
    background: 'rgba(189, 123, 105, 0.2)',
  },
  warning: {
    foreground: 'rgb(197, 186, 103)',
    background: 'rgba(197, 186, 103, 0.2)',
  },
  success: {
    foreground: 'rgb(144, 197, 103)',
    background: 'rgba(144, 197, 103, 0.2)',
  },
  light: {
    foreground: 'rgb(215, 216, 214)',
    background: 'rgba(215, 216, 214, 0.2)',
  },
  dark: {
    foreground: 'rgb(34, 39, 45)',
    background: 'rgba(34, 39, 45, 0.2)',
  },
}

export const PHASE_TO_COLOR_NAME = {
  [Phase.Exposing]: COLORS.error,
  [Phase.Exposed]: COLORS.warning,
  [Phase.Developed]: COLORS.success,
  [Phase.Archived]: COLORS.light,
}
