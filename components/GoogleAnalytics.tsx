"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getStoredConsent, onConsentChange } from "@/lib/cookie-consent";

const GA_ID = "G-7DDF3Q1R44";

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(getStoredConsent() === "accepted");
    return onConsentChange((status) => setEnabled(status === "accepted"));
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}
