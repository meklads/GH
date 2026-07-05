/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './**/*.html',
    '!./node_modules/**',
    '!./home-v2-backup.html',
    '!./en-backup.html',
    '!./en-v2.html',
    '!./offer-lite.html',
    '!./gh-admin.html',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
      },
      borderRadius: {
        DEFAULT: '0px',
      },
    },
  },
  plugins: [],
};
