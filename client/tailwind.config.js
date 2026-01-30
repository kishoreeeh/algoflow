/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#60A5FA',
        },
        // Semantic Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#8B5CF6',
        // Visualization Colors
        array: {
          default: '#E5E7EB',
          comparing: '#FCD34D',
          swapping: '#F87171',
          sorted: '#34D399',
        },
        pointer: '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
    },
  },
  plugins: [],
}
