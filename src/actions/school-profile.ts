"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";
import { schoolProfileSchema, type SchoolProfileInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getSchoolProfile() {
  const profile = await prisma.schoolProfile.findFirst();
  return profile;
}

export async function updateSchoolProfile(
  data: SchoolProfileInput
): Promise<ApiResponse> {
  const session = await auth();
  if (!session || !canAccess(session.user.role, "ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = schoolProfileSchema.parse(data);

    // Check if profile exists
    const existing = await prisma.schoolProfile.findFirst();

    let profile;
    if (existing) {
      profile = await prisma.schoolProfile.update({
        where: { id: existing.id },
        data: {
          name: validated.name,
          tagline: validated.tagline,
          logo: validated.logo || null,
          favicon: validated.favicon || null,
          email: validated.email || null,
          phone: validated.phone,
          whatsapp: validated.whatsapp,
          address: validated.address,
          latitude: validated.latitude,
          longitude: validated.longitude,
          vision: validated.vision,
          mission: validated.mission,
          history: validated.history,
          accreditation: validated.accreditation,
          npsn: validated.npsn,
          foundedYear: validated.foundedYear,
          schoolLevel: validated.schoolLevel,
          socialMedia: validated.socialMedia,
          operatingHours: validated.operatingHours,
        },
      });
    } else {
      profile = await prisma.schoolProfile.create({
        data: {
          name: validated.name,
          tagline: validated.tagline,
          logo: validated.logo || null,
          favicon: validated.favicon || null,
          email: validated.email || null,
          phone: validated.phone,
          whatsapp: validated.whatsapp,
          address: validated.address,
          latitude: validated.latitude,
          longitude: validated.longitude,
          vision: validated.vision,
          mission: validated.mission,
          history: validated.history,
          accreditation: validated.accreditation,
          npsn: validated.npsn,
          foundedYear: validated.foundedYear,
          schoolLevel: validated.schoolLevel,
          socialMedia: validated.socialMedia,
          operatingHours: validated.operatingHours,
        },
      });
    }

    revalidatePath("/admin/school-profile");
    revalidatePath("/");
    revalidatePath("/profil");
    revalidatePath("/kontak");
    return { success: true, data: profile, message: "Profil sekolah berhasil diperbarui" };
  } catch (error) {
    console.error("Update school profile error:", error);
    return { success: false, error: "Gagal memperbarui profil sekolah" };
  }
}
