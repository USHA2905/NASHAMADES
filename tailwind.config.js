/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7f9',
          100: '#ffeef2',
          200: '#ffd6e0',
          300: '#ffb3c6',
          400: '#ff85a3',
          500: '#fb5f86',
          600: '#e8436b',
          700: '#c22f56',
          800: '#9c2647',
          900: '#7d1f3b',
        },
        cream: '#fffaf5',
        ink: '#2b2530',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(43,37,48,0.08)',
        card: '0 4px 20px rgba(43,37,48,0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pop: { '0%': { transform: 'scale(0.8)' }, '60%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        slideUp: 'slideUp 0.4s ease-out',
        pop: 'pop 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
