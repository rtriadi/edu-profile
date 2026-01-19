"use client";

import { useEffect } from "react";

interface GoogleAnalyticsProps {
  gaId: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Defer GA loading until after hydration for better performance
    if (!gaId) return;

    const loadGA = () => {
      // Load gtag.js
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize dataLayer using a type-safe approach
      const win = window as typeof window & { dataLayer?: unknown[] };
      win.dataLayer = win.dataLayer || [];
      function gtag(...args: unknown[]) {
        win.dataLayer?.push(args);
      }
      gtag("js", new Date());
      gtag("config", gaId);
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadGA);
    } else {
      setTimeout(loadGA, 1);
    }
  }, [gaId]);

  return null;
}
