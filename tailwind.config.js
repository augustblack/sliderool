const themeSwapper = require('tailwindcss-theme-swapper')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './shared/**/*.{js,ts,jsx,tsx}'
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
              def: '1px'
            },
            colors: {
              'base-1': colors.slate[200],
              'base-2': colors.slate[300],
              'base-3': colors.slate[400],
              'base-4': colors.slate[500],
              // Texts, borders
              'base-con': colors.slate[950],

              // backgrounds (eg button)
              'primary-1': colors.blue[300],
              'primary-2': colors.blue[400],
              'primary-3': colors.blue[600],
              'primary-con': colors.blue[900], // border, outline

              // Accents (eg playlist select)
              'accent-1': colors.yellow[600],
              'accent-2': colors.yellow[700],

              'mic-1': colors.red[200],
              'mic-2': colors.red[300],
              'mic-3': colors.red[400],
              'mic-con': colors.red[950],

              'player-1': colors.slate[200],
              'player-2': colors.slate[400],
              'player-3': colors.slate[500],
              'player-con': colors.slate[800],

              'info-1': colors.blue[200],
              'info-2': colors.blue[500],
              'info-con': colors.blue[800],

              'success-1': colors.green[200],
              'success-2': colors.green[500],
              'success-con': colors.green[800],

              'warning-1': colors.orange[200],
              'warning-2': colors.orange[500],
              'warning-con': colors.orange[800],

              'error-1': colors.red[200],
              'error-2': colors.red[500],
              'error-con': colors.red[800]
            }
          }
        },
        {
          name: 'dark',
          selectors: ['.dark'],
          // mediaQuery: '@media (prefers-color-scheme: dark)',
          theme: {
            ringWidth: {
              def: '1px'
            },
            colors: {
              'base-1': colors.slate[500],
              'base-2': colors.slate[700],
              'base-3': colors.slate[800],
              'base-4': colors.slate[900],
              // Texts, borders
              'base-con': colors.slate[100],


              // backgrounds (eg button)
              'primary-1': colors.blue[800],
              'primary-2': colors.blue[700],
              'primary-3': colors.blue[500],
              'primary-con': colors.blue[200], // border, outline

              // Accents (eg playlist select)
              'accent-1': colors.yellow[800],
              'accent-2': colors.yellow[900],

              'mic-1': colors.rose[700],
              'mic-2': colors.rose[600],
              'mic-3': colors.rose[500],
              'mic-con': colors.rose[100],

              'player-1': colors.gray[700],
              'player-2': colors.gray[500],
              'player-3': colors.gray[400],
              'player-con': colors.gray[100],

              'info-1': colors.blue[950],
              'info-2': colors.blue[700],
              'info-con': colors.blue[300],

              'success-1': colors.green[950],
              'success-2': colors.green[700],
              'success-con': colors.green[300],

              'warning-1': colors.orange[950],
              'warning-2': colors.orange[700],
              'warning-con': colors.orange[300],

              'error-1': colors.red[950],
              'error-2': colors.red[700],
              'error-con': colors.red[300]

            }
          }
        }
      ]
    })
  ]
}
