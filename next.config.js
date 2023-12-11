/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cookies: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  }
}

module.exports = nextConfig
