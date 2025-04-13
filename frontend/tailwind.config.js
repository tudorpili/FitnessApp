/** @type {import('tailwindcss').Config} */
// Use ES Module import instead of require
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Set 'Inter' as the default sans-serif font
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // Add custom animation for fade-in if desired
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' }, // Start slightly lower
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        // Updated animation for smoother effect
        fadeIn: 'fadeIn 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}
