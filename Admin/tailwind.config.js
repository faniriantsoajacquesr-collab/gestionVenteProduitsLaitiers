/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#36628f',
        'primary-dim': '#285583',
        'primary-container': '#9dc7fb',
        background: '#f8fafa',
        surface: '#f8fafa',
        'surface-container': '#eaefef',
        'surface-container-low': '#f0f4f4',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e3e9ea',
        'on-surface': '#2c3435',
        'on-surface-variant': '#596061',
        'on-primary': '#f7f9ff',
        outline: '#757c7d',
        'outline-variant': '#acb3b4',
        secondary: '#50616c',
        error: '#a83836',
        tertiary: '#5b5b85',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
}
