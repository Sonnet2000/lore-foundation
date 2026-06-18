/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Stop MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict powerful browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS for 1 year (prod only — dev doesn't run HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Content Security Policy
  // Inline styles/scripts needed for Next.js hydration → use nonce in a future step,
  // for now 'unsafe-inline' is scoped tightly per directive.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs inline scripts + eval for dev; in prod only inline scripts
      "script-src 'self' 'unsafe-inline'",
      // Tailwind + Framer Motion inject inline styles
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + Supabase Storage
      "img-src 'self' data: blob: https://*.supabase.co",
      // Videos: self + Supabase Storage
      "media-src 'self' blob: https://*.supabase.co",
      // API calls: self + Supabase + Resend
      "connect-src 'self' https://*.supabase.co https://api.resend.com",
      // No <object>, <embed>, or <applet>
      "object-src 'none'",
      // No iframes from other origins
      "frame-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,

  // Harden HTTP headers on every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      // HARDENED: was `hostname: "**"` (any origin) — now scoped to Supabase only.
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
