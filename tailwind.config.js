/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0a0908',
        },
        secondary: {
          50: '#f6f5f4',
          100: '#e8e6e1',
          200: '#d3cec4',
          300: '#b8b2a7',
          400: '#a39e93',
          500: '#857f72',
          600: '#625d52',
          700: '#504a40',
          800: '#403d33',
          900: '#27241d',
        },
        accent: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#d6ccc2',
          400: '#b6a397',
          500: '#a18072',
          600: '#886553',
          700: '#704f37',
          800: '#5a3e2b',
          900: '#432d1a',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to right bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4))',
        'luxury-gradient': 'linear-gradient(to right, rgba(27, 24, 20, 0.8), rgba(10, 9, 8, 0.6))',
        'subtle-gradient': 'linear-gradient(to right, rgba(234, 221, 215, 0.15), rgba(214, 204, 194, 0.1))',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'luxury': '0 8px 30px rgba(0, 0, 0, 0.1)',
        'elegant': '0 20px 40px rgba(10, 9, 8, 0.15)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease-in-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
