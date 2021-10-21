module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'kanit': ['Kanit', 'sans']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
