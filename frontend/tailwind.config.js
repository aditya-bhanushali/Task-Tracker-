/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Core slate workspace palette
        canvas: {
          DEFAULT: '#0b0e14', // page background
          raised: '#11151d', // sidebar / header
        },
        surface: {
          DEFAULT: '#161b26', // cards
          hover: '#1c2230',
          border: '#262d3d',
          borderLight: '#2f3850',
        },
        ink: {
          primary: '#e8eaf0',
          secondary: '#9aa3b8',
          muted: '#646e85',
        },
        accent: {
          DEFAULT: '#6366f1', // indigo — primary actions only
          hover: '#5457e0',
          soft: '#1e1f3d',
        },
        priority: {
          high: '#ef4444',
          highSoft: '#2a1418',
          medium: '#f59e0b',
          mediumSoft: '#2a2012',
          low: '#22c55e',
          lowSoft: '#10261a',
        },
        status: {
          todo: '#646e85',
          progress: '#3b82f6',
          done: '#22c55e',
        },
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        collapseOut: {
          '0%': { opacity: '1', transform: 'scale(1)', maxHeight: '400px' },
          '100%': { opacity: '0', transform: 'scale(0.9)', maxHeight: '0px' },
        },
        panelIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        toastIn: 'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        collapseOut: 'collapseOut 0.22s ease-in forwards',
        panelIn: 'panelIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        shake: 'shake 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
