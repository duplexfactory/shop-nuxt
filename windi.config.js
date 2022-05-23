import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

const windiBreakpoints = ['', 'xs:', 'sm:', 'lg:', 'xl:', '2xl:'];

export default defineConfig({
  safelist: [
    windiBreakpoints.map((s) => `${s}hidden`),
    windiBreakpoints.map((s) => `${s}flex`),
    ['none', ...Array(7).fill(0).map((_, i) => `${i + 1}`)].map((s) => `line-clamp-${s}`),
  ],
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
    require('windicss/plugin/aspect-ratio'),
    require('windicss/plugin/line-clamp'),
  ],
  shortcuts: {
    // 'btn': 'text-white text-md bg-pink-400 px-6 py-2 rounded-md'
  },
})
