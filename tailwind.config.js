const themeSwapper = require('tailwindcss-theme-swapper')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    themeSwapper({
      themes: [
        // The only required theme is `base`. Every property used in
        // other themes must exist in here.
        {
          name: 'base',
          selectors: [':root'],
          theme: {
            ringWidth: {
              'def': '0px'
            },
            dropShadow: {
              'def': '',
            },
            colors: {
              'base-1': colors.slate[100],
              'base-2': colors.slate[200],
              'base-3': colors.slate[300],

              // backgrounds (eg button)
              'primary-1': colors.blue[300],
              'primary-2': colors.blue[400],
              'primary-3': colors.blue[600],
              'primary-4': colors.blue[800], // border, outline

              // Accents (eg playlist select)
              'accent-1': colors.yellow[600],
              'accent-2': colors.yellow[700],

              // Texts
              'write-1': colors.slate[800],
              'write-2': colors.slate[900],

              'mic-1': colors.pink[200],
              'mic-2': colors.pink[500],

              'player-1': colors.zinc[200],
              'player-2': colors.zinc[500],

              'info-1': colors.blue[200],
              'info-2': colors.blue[500],

              'success-1': colors.green[200],
              'success-2': colors.green[500],

              'warning-1': colors.orange[200],
              'warning-2': colors.orange[500],

              'error-1': colors.red[200],
              'error-2': colors.red[500],
            },
          },
        },
        {
          name: 'dark',
          selectors: ['.dark'],
          // mediaQuery: '@media (prefers-color-scheme: dark)',
          theme: {
            ringWidth: {
              'def': '1px'
            },
            colors: {

              'base-1': colors.stone[900],
              'base-2': colors.stone[800],
              'base-3': colors.stone[700],

              // backgrounds (eg button)
              'primary-1': colors.blue[800],
              'primary-2': colors.blue[700],
              'primary-3': colors.blue[500],
              'primary-4': colors.blue[200], // border, outline

              // Accents (eg playlist select)
              'accent-1': colors.yellow[800],
              'accent-2': colors.yellow[900],

              // Texts
              'write-1': colors.stone[100],
              'write-2': colors.stone[200],

            },
          },
        },
      ],
    }),
  ],
}

