module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ['utils'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/photos/**',
      },
    ],
  }
  // productionBrowserSourceMaps: true, // turn this on for production debugging
}
