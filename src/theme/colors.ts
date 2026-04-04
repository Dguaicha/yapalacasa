import { brandSplashBackground } from './brandAssets'

export const colors = {
  // Primary UI: deep Ecuador blue (professional, not childish)
  primary: '#1A3A5C',
  primaryMuted: '#2E5077',

  // Flag-inspired accents (muted / print-safe)
  ecuadorYellow: '#C9A227',
  ecuadorBlue: '#1A3A5C',
  ecuadorRed: '#B71C1C',

  // Logo / brand glyph on splash and marks
  brandMark: '#B71C1C',

  // Supporting
  secondary: '#1B5E20',
  accent: '#C9A227',

  /** Matches native splash / logo mat (see brandAssets + scripts/generate-brand-assets.mjs) */
  background: brandSplashBackground,
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F5',
  text: '#1A1D21',
  textSecondary: '#5C6370',
  border: '#E2E6EB',

  success: '#2E7D32',
  error: '#C62828',
  warning: '#B8860B',
  muted: '#EDEFF2',

  // Legacy regional keys (kept for types / copy)
  sierra: '#1B5E20',
  costa: '#1A3A5C',
  oriente: '#1B5E20',
  galapagos: '#C9A227',
  amazon: '#1B5E20',

  overlay: 'rgba(26, 29, 33, 0.45)'
} as const

export type AppColors = typeof colors
