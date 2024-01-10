/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#12ACF8',
        'secondary': '#F9B44F',
        'black': '#000000',
        'white': '#FFFFFF',
        'cultured': '#F5F5F5',
        'lightWhite': '#FFFFFF80',
        'chocolate': '#450029d1'
      },
    },
  },
  plugins: [],
}
