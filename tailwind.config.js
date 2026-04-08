const premiumMarketplaceColors = {
  primary: '#1E3A8A',
  'primary-pressed': '#172C68',
  'primary-muted': '#DBE7FF',
  secondary: '#2F6B3B',
  accent: '#FBBF24',
  highlight: '#FBBF24',
  background: '#FBFBF7',
  'background-alt': '#F8F6F1',
  surface: '#FFFFFF',
  'surface-alt': '#EEF2F7',
  'surface-raised': '#FFFDFC',
  text: '#18212F',
  'text-secondary': '#5C677D',
  border: '#D7DEE8',
  'border-strong': '#BAC5D3',
  success: '#2F6B3B',
  'success-soft': '#E7F4EA',
  warning: '#FBBF24',
  'warning-soft': '#FFF8DE',
  error: '#DC2626',
  'error-soft': '#FEE2E2',
  ecuadorYellow: '#FBBF24',
  ecuadorBlue: '#1E3A8A',
  ecuadorRed: '#DC2626',
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: premiumMarketplaceColors,
    },
  },
  plugins: [],
}
