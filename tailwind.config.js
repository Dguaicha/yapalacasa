/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1A3A5C',
        'primary-muted': '#2E5077',
        secondary: '#1B5E20',
        accent: '#C9A227',
        ecuadorYellow: '#C9A227',
        ecuadorBlue: '#1A3A5C',
        ecuadorRed: '#B71C1C',
        brandMark: '#B71C1C',
        background: '#FBFBF7',
        surface: '#FFFFFF',
        'surface-alt': '#EEF1F5',
        text: '#1A1D21',
        'text-secondary': '#5C6370',
        border: '#E2E6EB',
        sierra: '#1B5E20',
        costa: '#1A3A5C',
        oriente: '#1B5E20',
        galapagos: '#C9A227',
        success: '#2E7D32',
        error: '#C62828',
        muted: '#EDEFF2',
      },
    },
  },
  plugins: [],
}
