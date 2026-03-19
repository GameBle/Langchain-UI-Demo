/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#fafafa',
          dark: '#0f0f0f',
        },
        sidebar: {
          DEFAULT: '#f5f5f5',
          dark: '#171717',
        },
        border: {
          DEFAULT: '#e5e5e5',
          dark: '#262626',
        },
        bubble: {
          user: '#2d2d2d',
          userDark: '#2d2d2d',
          ai: '#f5f5f5',
          aiDark: '#262626',
        },
      },
    },
  },
  plugins: [],
};
