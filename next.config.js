/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The app uses plain <img> tags with remote URLs; allow them without next/image.
  // ESLint is run separately (next lint / CI); don't fail the build on it.
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
