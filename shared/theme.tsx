import { Phase } from './types'

export const COLORS = {
  primary: {
    opaque: 'rgb(2, 100, 160)',
    transparent: 'rgba(2, 100, 160, 0.2)',
  },
  secondary: {
    opaque: 'rgb(100, 157, 200)',
    transparent: 'rgba(100, 157, 200, 0.2)',
  },
  error: {
    opaque: 'rgb(189, 123, 105)',
    transparent: 'rgba(189, 123, 105, 0.2)',
  },
  warning: {
    opaque: 'rgb(197, 186, 103)',
    transparent: 'rgba(197, 186, 103, 0.2)',
  },
  success: {
    opaque: 'rgb(144, 197, 103)',
    transparent: 'rgba(144, 197, 103, 0.2)',
  },
  light: {
    opaque: 'rgb(215, 216, 214)',
    transparent: 'rgba(215, 216, 214, 0.2)',
  },
  dark: {
    opaque: 'rgb(34, 39, 45)',
    transparent: 'rgba(34, 39, 45, 0.2)',
  },
}

export const PHASE_TO_COLOR_NAME = {
  [Phase.Exposing]: COLORS.error,
  [Phase.Exposed]: COLORS.warning,
  [Phase.Developed]: COLORS.success,
  [Phase.Archived]: COLORS.light,
}

export const SPACING = {
  sm: 8,
  md: 16,
}

export const BORDER_RADIUS = {
  md: 8,
}
