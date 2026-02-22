"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import {
  SiteSettingsProvider,
  type SiteSettings,
} from "@/contexts/site-settings-context";

interface ProvidersProps {
  children: React.ReactNode;
  siteSettings?: Partial<SiteSettings>;
  session?: Session | null;
}

export function Providers({ children, siteSettings = {}, session }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider
      session={session || null}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SiteSettingsProvider settings={siteSettings}>
            {children}
            <Toaster richColors position="top-right" />
          </SiteSettingsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
