/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#E50914',
          600: '#B8070F',
          700: '#8B0000'
        },
        dark: {
          800: '#1a1a1a',
          850: '#1f1f1f',
          900: '#0d0d0d'
        },
        gray: {
          750: '#3f3f3f',
          850: '#262626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}