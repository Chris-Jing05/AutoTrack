/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable Turbopack (Next.js 16 default)
  turbopack: {},
  // Add headers for Tesseract.js files
  async headers() {
    return [
      {
        source: '/tesseract/:path*',
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
