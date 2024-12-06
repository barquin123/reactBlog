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
        '100': '100px',
        'carouselHome': '410px',
        'carouselImage': '180px',
      },
      maxWidth: {
        'cardBlog': '640px',
        
      },
      maxHeight: {
        'cardBlog': '427px',
        'smallCard': '180px',
      },
      height: {
        'carouselHome': '380px',
        'carouselImage': '180px',
      },
    },
  },
  plugins: [],
}

