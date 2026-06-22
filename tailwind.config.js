/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e5fd',
          300: '#7cd0fc',
          400: '#36b8f8',
          500: '#0c9de9',
          600: '#007bc7',
          700: '#0162a2',
          800: '#065385',
          900: '#0a456e',
          950: '#072c48',
        },
        accent: {
          DEFAULT: '#f97316',
          light: '#fed7aa',
          dark: '#c2410c',
        },
        surface: {
          DEFAULT: '#f8fafc',
          card: '#ffffff',
          dark: '#0f172a',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(0,0,0,0.07)',
        hover: '0 8px 32px 0 rgba(0,0,0,0.13)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
