import { Platform, TextStyle } from 'react-native'

import { colors } from './colors'

// Delivery-app style hierarchy: system UI fonts, comfortable reading size, clear weights.
const fontFamily = Platform.select<TextStyle['fontFamily']>({
  ios: undefined,
  android: 'sans-serif',
  default: undefined
})

const base: TextStyle = {
  fontFamily,
  color: colors.text,
  includeFontPadding: false
}

export const typography = {
  heading1: {
    ...base,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.45,
    color: colors.text
  } satisfies TextStyle,
  heading2: {
    ...base,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.text
  } satisfies TextStyle,
  /** Section titles, list headers */
  title: {
    ...base,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.text
  } satisfies TextStyle,
  /** Primary reading */
  body: {
    ...base,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.textSecondary
  } satisfies TextStyle,
  /** Secondary lines, meta */
  caption: {
    ...base,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0,
    color: colors.textSecondary
  } satisfies TextStyle,
  /** Overlines, chips */
  overline: {
    ...base,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.textSecondary
  } satisfies TextStyle,
  /** Badges, map pins, dense meta */
  micro: {
    ...base,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: colors.textSecondary
  } satisfies TextStyle,
  /** Stack / modal titles */
  navTitle: {
    ...base,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.28,
    color: colors.text
  } satisfies TextStyle,
  button: {
    ...base,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
    textTransform: 'none',
    color: colors.text
  } satisfies TextStyle
}
