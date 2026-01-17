"use server";

import { cookies } from "next/headers";

/**
 * Set maintenance mode cookie based on site config
 * This cookie is read by middleware to redirect users to maintenance page
 */
export async function setMaintenanceCookie(isMaintenanceMode: boolean) {
  const cookieStore = await cookies();
  
  if (isMaintenanceMode) {
    cookieStore.set("maintenance_mode", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Cookie expires in 1 hour - will be refreshed on each page load
      maxAge: 60 * 60,
    });
  } else {
    // Delete the cookie if maintenance mode is off
    cookieStore.delete("maintenance_mode");
  }
}

/**
 * Check if maintenance mode is enabled from cookie
 */
export async function isMaintenanceMode(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("maintenance_mode")?.value === "true";
}
