/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minHeight: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '100': '100px'
      },
    },
  },
  plugins: [],
}

