/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent clickjacking — NOTE: must allow Google AdSense frames
  // X-Frame-Options DENY is replaced by frame-ancestors in CSP below
  // { key: "X-Frame-Options", value: "DENY" },  ← removed: conflicts with AdSense iframes

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
  // Content Security Policy — updated for Google AdSense compatibility
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",

      // Scripts: Next.js inline + Google AdSense + Google APIs
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagservices.com https://adservice.google.com https://www.google.com https://www.gstatic.com",

      // Styles: Tailwind + Framer Motion + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

      // Fonts: Google Fonts
      "font-src 'self' https://fonts.gstatic.com",

      // Images: self + Supabase + Google AdSense image CDN
      "img-src 'self' data: blob: https://*.supabase.co https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.google.com https://*.gstatic.com",

      // Videos: self + Supabase Storage
      "media-src 'self' blob: https://*.supabase.co",

      // API calls: self + Supabase + Resend + AdSense endpoints
      "connect-src 'self' https://*.supabase.co https://api.resend.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://*.googlesyndication.com",

      // Frames: Google AdSense iframes (required for ad rendering)
      "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com https://www.google.com",

      // frame-ancestors: restricts who can embed THIS site in an iframe
      "frame-ancestors 'self'",

      // No <object>, <embed>, or <applet>
      "object-src 'none'",

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
      // HARDENED: scoped to Supabase only.
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // Photos de profil Google (connexion "Continuer avec Google").
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
