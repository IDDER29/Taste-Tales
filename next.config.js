/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLint is run separately (next lint / CI); don't fail the build on it.
  eslint: { ignoreDuringBuilds: true },
  // Enable the instrumentation.ts hook (Sentry init) on Next 14.
  experimental: {
    instrumentationHook: true,
  },
  images: {
    // Recipe images come from arbitrary external hosts (legacy data + Cloudinary).
    // Keep optimization off for now so any https host works via <AppImage>; once
    // images are normalized to Cloudinary, drop `unoptimized` and add
    // `remotePatterns` to re-enable Next's image optimization.
    unoptimized: true,
  },
  // Baseline security headers (safe defaults). A strict CSP is a follow-up — it
  // needs nonces for Next's inline scripts and browser testing.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

// Only wrap with the Sentry build plugin when Sentry is actually configured, so
// the default (keyless) build is unchanged. With a DSN/auth token set, this adds
// client init injection + source-map upload.
let config = nextConfig;
if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_AUTH_TOKEN) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { withSentryConfig } = require("@sentry/nextjs");
  config = withSentryConfig(config, {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    // Source maps upload only when SENTRY_AUTH_TOKEN is present.
  });
}

module.exports = config;
