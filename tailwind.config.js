/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite', // 3s is slower than the default 1s
      },
    },
  },
  variants: {},
  plugins: [],
};

