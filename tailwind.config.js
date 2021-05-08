module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
        robot: ["Roboto Condensed"]
      },
      colors: {
        thinGray: '#555555',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
