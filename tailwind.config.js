/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f7f8f9',
        foreground: '#2d333b',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#2d333b',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#2d333b',
        },
        primary: {
          DEFAULT: '#2d333b',
          foreground: '#fcfcfc',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#f5f6f7',
          foreground: '#3d444c',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        muted: {
          DEFAULT: '#f3f4f5',
          foreground: '#767d85',
        },
        accent: {
          DEFAULT: '#e8b84d',
          foreground: '#5c4a1a',
        },
        destructive: {
          DEFAULT: '#c94040',
          foreground: '#fcfcfc',
        },
        border: '#e5e7ea',
        input: '#f5f6f7',
        ring: '#6b7a8a',
        chart: {
          1: '#4a7ec7',
          2: '#5cb85c',
          3: '#9b7cc7',
          4: '#e8b84d',
          5: '#5a9aa0',
        },
        success: '#5cb85c',
        warning: '#e8b84d',
        info: '#4a7ec7',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
