import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@sekolah.sch.id" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@sekolah.sch.id",
      password: hashedPassword,
      role: "SUPERADMIN",
      isActive: true,
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create default school profile
  const schoolProfile = await prisma.schoolProfile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Sekolah Contoh",
      tagline: "Mendidik Generasi Unggul dan Berkarakter",
      schoolLevel: "SD",
      email: "info@sekolah.sch.id",
      phone: "(021) 1234567",
      whatsapp: "6281234567890",
      address: "Jl. Pendidikan No. 1, Jakarta",
      vision: "Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, cerdas, dan berwawasan global.",
      mission: "1. Menyelenggarakan pendidikan berkualitas\n2. Mengembangkan karakter siswa\n3. Memfasilitasi pengembangan bakat dan minat\n4. Menjalin kerjasama dengan masyarakat",
      accreditation: "A",
      foundedYear: 2000,
      socialMedia: {
        facebook: "https://facebook.com/sekolahcontoh",
        instagram: "https://instagram.com/sekolahcontoh",
        youtube: "https://youtube.com/@sekolahcontoh",
      },
    },
  });
  console.log("✅ Created school profile:", schoolProfile.name);

  // Create default categories
  const categories = [
    { name: "Berita", slug: "berita", description: "Berita terbaru sekolah", color: "#3B82F6" },
    { name: "Pengumuman", slug: "pengumuman", description: "Pengumuman resmi sekolah", color: "#EF4444" },
    { name: "Kegiatan", slug: "kegiatan", description: "Kegiatan dan acara sekolah", color: "#10B981" },
    { name: "Prestasi", slug: "prestasi", description: "Prestasi siswa dan sekolah", color: "#F59E0B" },
    { name: "Artikel", slug: "artikel", description: "Artikel edukatif", color: "#8B5CF6" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log("✅ Created categories");

  // Create default menus
  const headerMenu = await prisma.menu.upsert({
    where: { location: "header" },
    update: {},
    create: {
      name: "Menu Utama",
      location: "header",
    },
  });

  // Create header menu items
  const menuItems = [
    { label: "Beranda", url: "/", order: 0 },
    { label: "Profil", pageSlug: "profil", order: 1 },
    { label: "Akademik", pageSlug: "akademik", order: 2 },
    { label: "Berita", url: "/berita", order: 3 },
    { label: "Galeri", url: "/galeri", order: 4 },
    { label: "PPDB", url: "/ppdb", order: 5 },
    { label: "Kontak", url: "/kontak", order: 6 },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: {
        ...item,
        menuId: headerMenu.id,
        isVisible: true,
      },
    });
  }
  console.log("✅ Created header menu");

  const footerMenu = await prisma.menu.upsert({
    where: { location: "footer" },
    update: {},
    create: {
      name: "Menu Footer",
      location: "footer",
    },
  });
  console.log("✅ Created footer menu");

  // Create default pages
  const pages = [
    {
      title: "Profil Sekolah",
      slug: "profil",
      excerpt: "Mengenal lebih dekat tentang sekolah kami",
      status: "PUBLISHED" as const,
      template: "profile",
      content: [
        {
          id: "1",
          type: "heading",
          data: { level: 1, text: "Profil Sekolah", align: "center" },
        },
        {
          id: "2",
          type: "paragraph",
          data: { text: "Selamat datang di halaman profil sekolah kami." },
        },
      ],
    },
    {
      title: "Visi dan Misi",
      slug: "visi-misi",
      excerpt: "Visi dan misi sekolah kami",
      status: "PUBLISHED" as const,
      template: "default",
      content: [
        {
          id: "1",
          type: "heading",
          data: { level: 1, text: "Visi dan Misi", align: "center" },
        },
      ],
    },
    {
      title: "Sejarah",
      slug: "sejarah",
      excerpt: "Sejarah berdirinya sekolah kami",
      status: "PUBLISHED" as const,
      template: "default",
      content: [
        {
          id: "1",
          type: "heading",
          data: { level: 1, text: "Sejarah Sekolah", align: "center" },
        },
      ],
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        ...page,
        authorId: admin.id,
        publishedAt: new Date(),
      },
    });
  }
  console.log("✅ Created default pages");

  // Create sample staff
  const staffMembers = [
    {
      name: "Dr. Budi Santoso, M.Pd",
      position: "Kepala Sekolah",
      department: "Pimpinan",
      bio: "Memiliki pengalaman lebih dari 20 tahun di bidang pendidikan.",
      isTeacher: false,
      order: 0,
    },
    {
      name: "Siti Aminah, S.Pd",
      position: "Wakil Kepala Sekolah Bidang Kurikulum",
      department: "Pimpinan",
      isTeacher: true,
      order: 1,
    },
    {
      name: "Ahmad Hidayat, S.Pd",
      position: "Guru Matematika",
      department: "Guru",
      isTeacher: true,
      subjects: ["Matematika"],
      order: 2,
    },
    {
      name: "Dewi Lestari, S.Pd",
      position: "Guru Bahasa Indonesia",
      department: "Guru",
      isTeacher: true,
      subjects: ["Bahasa Indonesia"],
      order: 3,
    },
  ];

  for (const staff of staffMembers) {
    await prisma.staff.create({
      data: {
        ...staff,
        subjects: staff.subjects ? staff.subjects : undefined,
        isActive: true,
      },
    });
  }
  console.log("✅ Created sample staff");

  // Create sample programs
  const programs = [
    {
      name: "Kurikulum Merdeka",
      slug: "kurikulum-merdeka",
      type: "CURRICULUM" as const,
      description: "Implementasi Kurikulum Merdeka dengan pendekatan berpusat pada siswa.",
      isActive: true,
      order: 0,
    },
    {
      name: "Pramuka",
      slug: "pramuka",
      type: "EXTRACURRICULAR" as const,
      description: "Kegiatan kepramukaan untuk membangun karakter dan kepemimpinan.",
      isActive: true,
      order: 0,
    },
    {
      name: "Paduan Suara",
      slug: "paduan-suara",
      type: "EXTRACURRICULAR" as const,
      description: "Mengembangkan bakat seni musik dan vokal siswa.",
      isActive: true,
      order: 1,
    },
    {
      name: "Program Tahfidz",
      slug: "program-tahfidz",
      type: "FEATURED" as const,
      description: "Program unggulan menghafal Al-Quran bagi siswa.",
      isActive: true,
      order: 0,
    },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {},
      create: program,
    });
  }
  console.log("✅ Created sample programs");

  // Create sample facilities
  const facilities = [
    {
      name: "Ruang Kelas Ber-AC",
      slug: "ruang-kelas",
      description: "Ruang kelas nyaman dengan AC dan proyektor interaktif.",
      icon: "School",
      order: 0,
    },
    {
      name: "Perpustakaan",
      slug: "perpustakaan",
      description: "Perpustakaan lengkap dengan koleksi buku yang beragam.",
      icon: "BookOpen",
      order: 1,
    },
    {
      name: "Laboratorium Komputer",
      slug: "lab-komputer",
      description: "Lab komputer modern dengan internet berkecepatan tinggi.",
      icon: "Monitor",
      order: 2,
    },
    {
      name: "Lapangan Olahraga",
      slug: "lapangan-olahraga",
      description: "Lapangan multifungsi untuk berbagai kegiatan olahraga.",
      icon: "Dumbbell",
      order: 3,
    },
    {
      name: "Masjid/Musholla",
      slug: "masjid",
      description: "Tempat ibadah yang nyaman untuk siswa dan guru.",
      icon: "Building",
      order: 4,
    },
  ];

  for (const facility of facilities) {
    await prisma.facility.upsert({
      where: { slug: facility.slug },
      update: {},
      create: {
        ...facility,
        isPublished: true,
      },
    });
  }
  console.log("✅ Created sample facilities");

  // Create sample testimonials
  const testimonials = [
    {
      name: "Ahmad Fauzi",
      role: "Alumni 2023",
      content: "Sekolah ini memberikan pendidikan terbaik dan membentuk karakter saya menjadi lebih baik. Terima kasih kepada semua guru yang telah membimbing.",
      rating: 5,
      order: 0,
    },
    {
      name: "Ibu Sari",
      role: "Orang Tua Siswa",
      content: "Anak saya sangat senang bersekolah di sini. Guru-gurunya ramah dan profesional. Fasilitas juga sangat lengkap.",
      rating: 5,
      order: 1,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: {
        ...testimonial,
        isPublished: true,
      },
    });
  }
  console.log("✅ Created sample testimonials");

  // Create default settings
  const settings = [
    { key: "site_name", value: { value: "Sekolah Contoh" }, group: "general" },
    { key: "site_tagline", value: { value: "Mendidik Generasi Unggul" }, group: "general" },
    { key: "site_language", value: { value: "id" }, group: "general" },
    { key: "meta_title", value: { value: "Sekolah Contoh - Website Resmi" }, group: "seo" },
    { key: "meta_description", value: { value: "Website resmi Sekolah Contoh. Mendidik generasi unggul dan berkarakter." }, group: "seo" },
    { key: "primary_color", value: { value: "#3B82F6" }, group: "theme" },
    { key: "secondary_color", value: { value: "#10B981" }, group: "theme" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅ Created default settings");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Default Admin Credentials:");
  console.log("   Email: admin@sekolah.sch.id");
  console.log("   Password: admin123");
  console.log("\n⚠️  Please change the password after first login!");
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
