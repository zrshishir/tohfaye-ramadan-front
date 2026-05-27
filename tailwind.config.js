/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#064e3b', // Deep emerald green
        'secondary': '#d4af37', // Gold accents
        'sand': '#fdfbf7', // Sand background
        'black': '#111827',
        'white': '#FFFFFF',
        'cultured': '#F5F5F5',
        'lightWhite': '#FFFFFF80',
        'gainsboro': '#DDDDDD',
        'darkGreen': '#047857' // Emerald green
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
