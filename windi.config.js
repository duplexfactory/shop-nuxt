import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

export default defineConfig({
  safelist: 'hidden xs:hidden sm:hidden lg:hidden xl:hidden 2xl:hidden xs:flex sm:flex lg:flex xl:flex 2xl:flex',
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
    },
    extend: {
    },
    container: {
      // screens: {
      //     'sm': '540px',
      //     'md': '720px',
      //     'lg': '960px',
      //     'xl': '1140px',
      // }
      padding: {
        DEFAULT: '2rem',
        sm: '4rem',
        lg: '6rem',
        xl: '8rem',
        '2xl': '10rem',
      },
    }
  },
  plugins: [
    require('windicss/plugin/line-clamp'),
  ],
  shortcuts: {
    // 'btn': 'text-white text-md bg-pink-400 px-6 py-2 rounded-md'
  },
})
