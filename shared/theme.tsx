export const COLORS = {
  NEUTRAL: {
    '100': '#E3E7E8',
    '200': '#C7CFD1',
    '300': '#ABB7BA',
    '400': '#8F9EA3',
    '500': '#73868C',
    '600': '#5C6B70',
    '700': '#475E66',
    '800': '#3A4D53',
    '900': '#2C3B40',
    '1000': '#1F2A2D',
  },
  PRIMARY: {
    '100': '#CCF3FF',
    '200': '#66DAFF',
    '300': '#00C1FF',
    '400': '#007499',
    '500': '#002733',
  },
  SECONDARY: {
    '100': '#E9CFFC',
    '200': '#BC6EF7',
    '300': '#8F0DF2',
    '400': '#720AC2',
    '500': '#560891',
  },
  SUCCESS: {
    '100': '#CCFFDD',
    '200': '#66FF99',
    '300': '#00FF55',
    '400': '#00CC44',
    '500': '#009933',
  },
  WARNING: {
    '100': '#FFF1CC',
    '200': '#FFD466',
    '300': '#FFB800',
    '400': '#996E00',
    '500': '#332500',
  },
  ERROR: {
    '100': '#FFCCEB',
    '200': '#FF66C2',
    '300': '#FF0099',
    '400': '#CC007A',
    '500': '#99005C',
  },
  MISC: {
    TRANSPARENT: 'transparent',
    BLACK: '#000',
    WHITE: '#FFF',
  },
} as const

export const BORDER_RADIUS = {
  NONE: 0,
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
} as const

export const SPACING = {
  XXSMALL: 4,
  XSMALL: 8,
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 48,
} as const

export const BORDER_WIDTH = {
  NONE: 0,
  XSMALL: 1,
  SMALL: 2,
  MEDIUM: 4,
  LARGE: 8,
} as const

export const ROLL_STATUS_COLORS = {
  EXPOSING: COLORS.PRIMARY[300],
  EXPOSED: COLORS.WARNING[300],
  DEVELOPED: COLORS.SUCCESS[300],
  ARCHIVED: COLORS.SECONDARY[300],
  ABANDONED: COLORS.ERROR[300],
} as const
