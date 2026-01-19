
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Resetting menus to School Standard...");

  // 1. Hapus semua menu yang ada (Cascade akan menghapus items)
  await prisma.menuItem.deleteMany({});
  await prisma.menu.deleteMany({});
  
  console.log("🗑️  Old menus deleted.");

  // 2. Buat Menu Header
  const headerMenu = await prisma.menu.create({
    data: {
      name: "Menu Utama",
      location: "header",
    },
  });

  // --- BERANDA ---
  await prisma.menuItem.create({
    data: {
      menuId: headerMenu.id,
      label: "Beranda",
      url: "/",
      type: "route",
      order: 0,
    },
  });

  // --- PROFIL (Dropdown) ---
  const profilParent = await prisma.menuItem.create({
    data: {
      menuId: headerMenu.id,
      label: "Profil",
      type: "dropdown",
      order: 1,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, parentId: profilParent.id, label: "Tentang Sekolah", url: "/profil", type: "route", order: 0 },
      { menuId: headerMenu.id, parentId: profilParent.id, label: "Visi & Misi", url: "/profil/visi-misi", type: "route", order: 1 },
      { menuId: headerMenu.id, parentId: profilParent.id, label: "Sejarah", url: "/profil/sejarah", type: "route", order: 2 },
      { menuId: headerMenu.id, parentId: profilParent.id, label: "Struktur Organisasi", url: "/profil/struktur", type: "route", order: 3 },
      { menuId: headerMenu.id, parentId: profilParent.id, label: "Guru & Staff", url: "/profil/guru-staff", type: "route", order: 4 },
      { menuId: headerMenu.id, parentId: profilParent.id, label: "Fasilitas", url: "/profil/fasilitas", type: "route", order: 5 },
    ],
  });

  // --- AKADEMIK (Dropdown) ---
  const akademikParent = await prisma.menuItem.create({
    data: {
      menuId: headerMenu.id,
      label: "Akademik",
      type: "dropdown",
      order: 2,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, parentId: akademikParent.id, label: "Kurikulum", url: "/akademik/kurikulum", type: "route", order: 0 },
      { menuId: headerMenu.id, parentId: akademikParent.id, label: "Program Unggulan", url: "/akademik/program-unggulan", type: "route", order: 1 },
      { menuId: headerMenu.id, parentId: akademikParent.id, label: "Ekstrakurikuler", url: "/akademik/ekstrakurikuler", type: "route", order: 2 },
      { menuId: headerMenu.id, parentId: akademikParent.id, label: "Prestasi", url: "/akademik/prestasi", type: "route", order: 3 },
    ],
  });

  // --- INFORMASI (Dropdown) ---
  const infoParent = await prisma.menuItem.create({
    data: {
      menuId: headerMenu.id,
      label: "Informasi",
      type: "dropdown",
      order: 3,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, parentId: infoParent.id, label: "Berita & Artikel", url: "/berita", type: "route", order: 0 },
      { menuId: headerMenu.id, parentId: infoParent.id, label: "Agenda Kegiatan", url: "/agenda", type: "route", order: 1 },
      { menuId: headerMenu.id, parentId: infoParent.id, label: "Galeri Sekolah", url: "/galeri", type: "route", order: 2 },
      { menuId: headerMenu.id, parentId: infoParent.id, label: "Pusat Unduhan", url: "/unduhan", type: "route", order: 3 }, // Asumsi route /unduhan atau /downloads
    ],
  });

  // --- PPDB ---
  await prisma.menuItem.create({
    data: {
      menuId: headerMenu.id,
      label: "PPDB",
      url: "/ppdb",
      type: "route",
      order: 4,
    },
  });

  // --- KONTAK ---
  await prisma.menuItem.create({
    data: {
      menuId: headerMenu.id,
      label: "Kontak",
      url: "/kontak",
      type: "route",
      order: 5,
    },
  });

  console.log("✅ Header menu created.");

  // 3. Buat Menu Footer (Simple)
  const footerMenu = await prisma.menu.create({
    data: {
      name: "Menu Footer",
      location: "footer",
    },
  });

  await prisma.menuItem.createMany({
    data: [
      { menuId: footerMenu.id, label: "Profil", url: "/profil", type: "route", order: 0 },
      { menuId: footerMenu.id, label: "Berita", url: "/berita", type: "route", order: 1 },
      { menuId: footerMenu.id, label: "PPDB", url: "/ppdb", type: "route", order: 2 },
      { menuId: footerMenu.id, label: "Kontak", url: "/kontak", type: "route", order: 3 },
    ],
  });

  console.log("✅ Footer menu created.");
  console.log("🎉 Menu standard sekolah berhasil diterapkan!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
