const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        lexend: ['"Lexend"', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
