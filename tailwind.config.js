/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './404.html', './main.js', './projects/**/*.html'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1120',
        gold: {
          DEFAULT: '#d4af37',
          light: '#f4d06f',
        },
      },
    },
  },
  plugins: [],
};
