module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ['utils'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
  // productionBrowserSourceMaps: true, // turn this on for production debugging
}
