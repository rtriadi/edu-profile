"use client";

import { useEffect, useState } from "react";

interface GoogleAnalyticsProps {
  gaId: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    
    if (prefersReducedMotion) {
      setShouldLoad(false);
      return;
    }

    const loadGA = () => {
      if (!gaId) return;

      const existingScript = document.querySelector(
        'script[src*="googletagmanager.com/gtag/js"]'
      );
      if (existingScript) return;

      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script.async = true;
      script.defer = true;
      script.setAttribute("data-cookieconsent", "analytics");
      document.head.appendChild(script);

      const win = window as typeof window & { dataLayer?: unknown[] };
      win.dataLayer = win.dataLayer || [];
      function gtag(...args: unknown[]) {
        win.dataLayer?.push(args);
      }
      gtag("js", new Date());
      gtag("config", gaId);
    };

    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(loadGA, { timeout: 4000 });
      } else {
        setTimeout(loadGA, 3000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [gaId]);

  return null;
}
