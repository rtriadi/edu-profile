"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings-context";
import {
  getCurrentDateTime,
  getTimezoneDisplayName,
} from "@/lib/utils";

interface DateTimeDisplayProps {
  showIcon?: boolean;
  showTimezone?: boolean;
  className?: string;
  format?: "full" | "date" | "time";
}

export function DateTimeDisplay({
  showIcon = true,
  showTimezone = true,
  className = "",
  format = "full",
}: DateTimeDisplayProps) {
  const { timezone, language } = useSiteSettings();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updateTime = () => {
      const locale = language === "en" ? "en-US" : "id-ID";
      const now = new Date();
      
      let formattedTime = "";
      
      if (format === "full") {
        formattedTime = now.toLocaleString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: timezone,
        });
      } else if (format === "date") {
        formattedTime = now.toLocaleDateString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: timezone,
        });
      } else if (format === "time") {
        formattedTime = now.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: timezone,
        });
      }
      
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezone, language, format]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {showIcon && <Clock className="h-4 w-4" />}
      <span>{currentTime}</span>
      {showTimezone && (
        <span className="text-muted-foreground">
          ({getTimezoneDisplayName(timezone)})
        </span>
      )}
    </div>
  );
}

// Server component version that accepts settings as props
export function DateTimeDisplayStatic({
  timezone = "Asia/Jakarta",
  language = "id",
  showTimezone = true,
  className = "",
}: {
  timezone?: string;
  language?: string;
  showTimezone?: boolean;
  className?: string;
}) {
  const locale = language === "en" ? "en-US" : "id-ID";
  const now = new Date();
  
  const formattedTime = now.toLocaleString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`} suppressHydrationWarning>
      <Clock className="h-4 w-4" />
      <span>{formattedTime}</span>
      {showTimezone && (
        <span className="text-muted-foreground">
          ({getTimezoneDisplayName(timezone)})
        </span>
      )}
    </div>
  );
}
