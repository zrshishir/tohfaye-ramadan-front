/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#008000',
        'secondary': '#F9B44F',
        'black': '#000000',
        'white': '#FFFFFF',
        'cultured': '#F5F5F5',
        'lightWhite': '#FFFFFF80',
        'gainsboro': '#DDDDDD',
        'darkGreen': '#036F03'
      },
      backgroundImage: {
        'tasbih': "url('../assets/images/tasbih-bg.png')",
        'union': "url('../assets/images/Union.png')",
        'ayat': "url('../assets/images/ayat.png')",
        'ramadan': "url('../assets/images/ramadan-bg.svg')",
      },
      boxShadow: {
        '3xl': '1px 1px 7px 0px rgb(0 0 0 / 0.25)',
      }
    },
  },
  plugins: [],
}
