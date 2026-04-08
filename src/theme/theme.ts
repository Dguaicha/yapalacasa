import { brandSplashBackground } from './brandAssets'

const palette = {
  andeanBlue: '#1E3A8A',
  andeanBlueDeep: '#172C68',
  andeanBlueSoft: '#DBE7FF',
  sunshineYellow: '#FBBF24',
  sunshineYellowSoft: '#FFF3C4',
  crimson: '#DC2626',
  crimsonSoft: '#FEE2E2',
  cloud: '#F8F6F1',
  mist: '#EEF2F7',
  stone: '#D7DEE8',
  ink: '#18212F',
  slate: '#5C677D',
  forest: '#2F6B3B',
  forestSoft: '#E7F4EA',
  white: '#FFFFFF',
  night: '#0F172A'
} as const

export const theme = {
  name: 'salvar-premium-marketplace',
  palette,
  colors: {
    primary: palette.andeanBlue,
    primaryPressed: palette.andeanBlueDeep,
    primaryMuted: palette.andeanBlueSoft,
    secondary: palette.forest,
    accent: palette.sunshineYellow,
    accentSoft: palette.sunshineYellowSoft,
    highlight: palette.sunshineYellow,
    success: palette.forest,
    successSoft: palette.forestSoft,
    warning: palette.sunshineYellow,
    warningSoft: '#FFF8DE',
    error: palette.crimson,
    errorSoft: palette.crimsonSoft,
    info: palette.andeanBlue,
    infoSoft: palette.andeanBlueSoft,
    background: brandSplashBackground,
    backgroundAlt: palette.cloud,
    surface: palette.white,
    surfaceAlt: palette.mist,
    surfaceRaised: '#FFFDFC',
    text: palette.ink,
    textSecondary: palette.slate,
    textInverse: palette.white,
    border: palette.stone,
    borderStrong: '#BAC5D3',
    overlay: 'rgba(15, 23, 42, 0.48)',
    brandMark: palette.crimson,
    ecuadorYellow: palette.sunshineYellow,
    ecuadorBlue: palette.andeanBlue,
    ecuadorRed: palette.crimson,
    sierra: palette.andeanBlue,
    costa: '#0F766E',
    oriente: palette.forest,
    galapagos: palette.sunshineYellow
  },
  gradients: {
    hero: ['#F8F6F1', '#EEF4FF', '#FFF7E1'],
    premiumCard: ['#FFFFFF', '#F8FAFC'],
    sunriseAccent: ['#FBBF24', '#F59E0B']
  },
  shadows: {
    card: {
      shadowColor: '#0F172A',
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4
    },
    floating: {
      shadowColor: '#0F172A',
      shadowOpacity: 0.14,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 8
    }
  },
  radii: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    pill: 999
  },
  semantics: {
    cta: palette.andeanBlue,
    ctaText: palette.white,
    dealBadge: palette.sunshineYellow,
    dealBadgeText: palette.andeanBlueDeep,
    alert: palette.crimson,
    alertText: palette.white
  },
  cssVars: {
    '--color-primary': palette.andeanBlue,
    '--color-primary-pressed': palette.andeanBlueDeep,
    '--color-highlight': palette.sunshineYellow,
    '--color-alert': palette.crimson,
    '--color-background': brandSplashBackground,
    '--color-surface': palette.white,
    '--color-surface-alt': palette.mist,
    '--color-text': palette.ink,
    '--color-text-secondary': palette.slate,
    '--color-border': palette.stone
  }
} as const

export const tailwindThemeColors = {
  primary: theme.colors.primary,
  'primary-pressed': theme.colors.primaryPressed,
  'primary-muted': theme.colors.primaryMuted,
  secondary: theme.colors.secondary,
  accent: theme.colors.accent,
  highlight: theme.colors.highlight,
  background: theme.colors.background,
  'background-alt': theme.colors.backgroundAlt,
  surface: theme.colors.surface,
  'surface-alt': theme.colors.surfaceAlt,
  'surface-raised': theme.colors.surfaceRaised,
  text: theme.colors.text,
  'text-secondary': theme.colors.textSecondary,
  border: theme.colors.border,
  'border-strong': theme.colors.borderStrong,
  success: theme.colors.success,
  'success-soft': theme.colors.successSoft,
  warning: theme.colors.warning,
  'warning-soft': theme.colors.warningSoft,
  error: theme.colors.error,
  'error-soft': theme.colors.errorSoft,
  ecuadorYellow: theme.colors.ecuadorYellow,
  ecuadorBlue: theme.colors.ecuadorBlue,
  ecuadorRed: theme.colors.ecuadorRed
} as const

export type AppTheme = typeof theme
