/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#eaeef4',
          500: '#5a7da3',
          600: '#476388',
          700: '#3a4f6e',
        },
        accent: {
          500: '#bfa094',
          600: '#a18072',
        }
      },
    },
  },
  plugins: [],
}
