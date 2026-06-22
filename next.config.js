/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The app uses plain <img> tags with remote URLs; allow them without next/image.
  // ESLint is run separately (next lint / CI); don't fail the build on it.
  eslint: { ignoreDuringBuilds: true },
  // isomorphic-dompurify depends on jsdom, which must not be webpack-bundled on
  // the server (jsdom reads asset files at runtime). Load it as an external.
  experimental: {
    serverComponentsExternalPackages: ["isomorphic-dompurify"],
  },
};

module.exports = nextConfig;
