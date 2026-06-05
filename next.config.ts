import type { NextConfig } from "next";

const isStaticExport = process.env.BUILD_MODE === 'static';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' } : {}),
  turbopack: {
    root: process.cwd(),
  },
  ...(!isStaticExport
    ? {
        async headers() {
          return [{ source: '/(.*)', headers: securityHeaders }];
        },
      }
    : {}),
};

export default nextConfig;
