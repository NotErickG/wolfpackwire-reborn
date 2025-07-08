/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'ncstatesports.com',
      'gopack.com',
      'a.espncdn.com',
      'logos.ncstatesports.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'NC State Sports Hub',
    NEXT_PUBLIC_APP_DESCRIPTION: 'The ultimate destination for NC State sports fans',
  },
}