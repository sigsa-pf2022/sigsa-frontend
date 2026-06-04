/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        sigsa: {
          50:  '#faf5fe',
          100: '#f3e7fc',
          200: '#e9d2fa',
          300: '#d4b0f5',
          400: '#bb83ee',
          500: '#9c59e8',
          600: '#894ecc',
          700: '#7338ad',
          800: '#5f2d8d',
          900: '#4d2572',
          950: '#2f124b',
        },
        ink: {
          DEFAULT: '#18181B',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          app: '#FAFAFB',
          subtle: '#F4F4F6',
        },
        hairline: '#F0F0F3',
      },
      fontFamily: {
        sans: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        display: ['"Inter"', '"Alatsi"', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
        button: '16px',
        input: '16px',
        chip: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        elevated: '0 4px 16px rgba(0, 0, 0, 0.08)',
        floating: '0 8px 24px rgba(156, 89, 232, 0.25)',
        'floating-soft': '0 6px 18px rgba(156, 89, 232, 0.18)',
        'top-bar': '0 -4px 16px rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'sigsa-gradient': 'linear-gradient(135deg, #9c59e8 0%, #7338ad 100%)',
        'sigsa-gradient-soft': 'linear-gradient(135deg, #bb83ee 0%, #9c59e8 100%)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '250': '250ms',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 320ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulse-soft 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
