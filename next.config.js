/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLint is run separately (next lint / CI); don't fail the build on it.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Recipe images come from arbitrary external hosts (legacy data + Cloudinary).
    // Keep optimization off for now so any https host works via <AppImage>; once
    // images are normalized to Cloudinary, drop `unoptimized` and add
    // `remotePatterns` to re-enable Next's image optimization.
    unoptimized: true,
  },
};

module.exports = nextConfig;
