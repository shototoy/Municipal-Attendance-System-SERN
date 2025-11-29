/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-primary', 'bg-secondary', 'bg-background', 'bg-text', 'bg-accent1', 'bg-accent2',
    'text-primary', 'text-secondary', 'text-background', 'text-text', 'text-accent1', 'text-accent2',
    'border-primary', 'border-secondary', 'border-background', 'border-text', 'border-accent1', 'border-accent2',
    'hover:bg-primary', 'hover:bg-secondary', 'hover:bg-background', 'hover:bg-text', 'hover:bg-accent1', 'hover:bg-accent2',
    'hover:text-primary', 'hover:text-secondary', 'hover:text-background', 'hover:text-text', 'hover:text-accent1', 'hover:text-accent2',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        text: 'var(--text)',
        accent1: 'var(--accent1)',
        accent2: 'var(--accent2)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}