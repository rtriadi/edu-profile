"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function clearSystemCache(): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Revalidate everything
    revalidatePath("/", "layout");
    
    return { 
      success: true, 
      message: "Cache sistem berhasil dibersihkan" 
    };
  } catch (error) {
    console.error("Clear cache error:", error);
    return { success: false, error: "Gagal membersihkan cache" };
  }
}
