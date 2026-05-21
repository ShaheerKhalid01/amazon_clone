/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#FF9900',
          'orange-dark': '#E88B00',
          'orange-light': '#FFB84D',
          blue: '#146EB4',
          'blue-dark': '#0D4F82',
          navy: '#131A22',
          'dark-gray': '#232F3E',
          gray: '#37475A',
          'light-gray': '#EAEDED',
          yellow: '#FFD814',
          'yellow-dark': '#F7CA00',
          red: '#B12704',
          green: '#007600',
          white: '#FFFFFF',
          black: '#000000',
        },
      },
      fontFamily: {
        amazon: ['Amazon Ember', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        'amazon': '1500px',
      },
      spacing: {
        'amazon': '1500px',
      },
      boxShadow: {
        'amazon': '0 2px 5px rgba(0,0,0,0.1)',
        'amazon-hover': '0 5px 15px rgba(0,0,0,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};