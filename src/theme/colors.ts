import { theme } from './theme'

export const colors = {
  ...theme.colors,
  muted: theme.colors.surfaceAlt,
  amazon: theme.colors.oriente
} as const

export type AppColors = typeof colors
