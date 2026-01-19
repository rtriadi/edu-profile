"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setLocale(locale: "id" | "en") {
  const cookieStore = await cookies();
  
  // Set cookie for 1 year
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "strict",
  });

  revalidatePath("/");
}

export async function getLocale(): Promise<"id" | "en"> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value;
  
  if (locale === "en") return "en";
  return "id";
}
