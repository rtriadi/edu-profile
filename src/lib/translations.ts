// Translation strings for the application
// Supports Indonesian (id) and English (en)

export type Language = "id" | "en";

export interface Translations {
  // Common
  common: {
    home: string;
    about: string;
    contact: string;
    news: string;
    gallery: string;
    download: string;
    search: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    close: string;
    readMore: string;
    seeAll: string;
    noData: string;
  };
  // Navigation
  nav: {
    home: string;
    profile: string;
    aboutUs: string;
    visionMission: string;
    history: string;
    structure: string;
    teachersStaff: string;
    facilities: string;
    academic: string;
    curriculum: string;
    extracurricular: string;
    featuredPrograms: string;
    achievements: string;
    news: string;
    gallery: string;
    ppdb: string;
    contact: string;
    register: string;
  };
  // Homepage
  home: {
    welcome: string;
    heroTitle: string;
    heroSubtitle: string;
    registerNow: string;
    aboutUs: string;
    ourPrograms: string;
    featuredPrograms: string;
    latestNews: string;
    newsInfo: string;
    testimonials: string;
    whatTheySay: string;
    joinUs: string;
    joinUsDesc: string;
    registerPpdb: string;
    contactUs: string;
  };
  // Stats
  stats: {
    teachers: string;
    alumni: string;
    achievements: string;
    extracurricular: string;
  };
  // Footer
  footer: {
    quickLinks: string;
    contact: string;
    information: string;
    address: string;
    phone: string;
    email: string;
    foundedSince: string;
    allRightsReserved: string;
    poweredBy: string;
  };
  // Forms
  forms: {
    name: string;
    email: string;
    phone: string;
    message: string;
    subject: string;
    send: string;
    sending: string;
    sent: string;
    required: string;
    invalid: string;
  };
  // Date/Time
  datetime: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    weeksAgo: string;
  };
  // Maintenance
  maintenance: {
    title: string;
    description: string;
    workInProgress: string;
    needHelp: string;
  };
  // Pages
  pages: {
    news: {
      title: string;
      description: string;
      allCategories: string;
      noNews: string;
      readMore: string;
      views: string;
    };
    gallery: {
      title: string;
      description: string;
      allTypes: string;
      photo: string;
      video: string;
      noGallery: string;
      items: string;
    };
    contact: {
      title: string;
      description: string;
      getInTouch: string;
      sendMessage: string;
      address: string;
      phone: string;
      email: string;
      operatingHours: string;
      findUs: string;
    };
    profile: {
      title: string;
      description: string;
      visionMission: string;
      vision: string;
      mission: string;
      history: string;
      structure: string;
      teachersStaff: string;
      facilities: string;
      alumni: string;
    };
    academic: {
      title: string;
      description: string;
      curriculum: string;
      extracurricular: string;
      featuredPrograms: string;
      achievements: string;
    };
    ppdb: {
      title: string;
      description: string;
      registerNow: string;
      requirements: string;
      timeline: string;
      registrationClosed: string;
      registrationOpen: string;
    };
    agenda: {
      title: string;
      description: string;
      upcomingEvents: string;
      pastEvents: string;
      noEvents: string;
    };
    downloads: {
      title: string;
      description: string;
      noFiles: string;
      download: string;
      fileSize: string;
    };
  };
}

const translations: Record<Language, Translations> = {
  id: {
    common: {
      home: "Beranda",
      about: "Tentang",
      contact: "Kontak",
      news: "Berita",
      gallery: "Galeri",
      download: "Unduhan",
      search: "Cari",
      loading: "Memuat...",
      error: "Terjadi kesalahan",
      success: "Berhasil",
      cancel: "Batal",
      save: "Simpan",
      delete: "Hapus",
      edit: "Edit",
      view: "Lihat",
      back: "Kembali",
      next: "Selanjutnya",
      previous: "Sebelumnya",
      submit: "Kirim",
      close: "Tutup",
      readMore: "Baca Selengkapnya",
      seeAll: "Lihat Semua",
      noData: "Tidak ada data",
    },
    nav: {
      home: "Beranda",
      profile: "Profil",
      aboutUs: "Tentang Kami",
      visionMission: "Visi & Misi",
      history: "Sejarah",
      structure: "Struktur Organisasi",
      teachersStaff: "Guru & Staff",
      facilities: "Fasilitas",
      academic: "Akademik",
      curriculum: "Kurikulum",
      extracurricular: "Ekstrakurikuler",
      featuredPrograms: "Program Unggulan",
      achievements: "Prestasi",
      news: "Berita",
      gallery: "Galeri",
      ppdb: "PPDB",
      contact: "Kontak",
      register: "Daftar PPDB",
    },
    home: {
      welcome: "Selamat Datang di",
      heroTitle: "Sekolah Unggulan",
      heroSubtitle: "Mendidik Generasi Unggul dan Berkarakter untuk Masa Depan yang Gemilang",
      registerNow: "Daftar Sekarang",
      aboutUs: "Tentang Kami",
      ourPrograms: "Program Kami",
      featuredPrograms: "Program Unggulan",
      latestNews: "Berita Terbaru",
      newsInfo: "Kabar & Informasi",
      testimonials: "Testimoni",
      whatTheySay: "Apa Kata Mereka",
      joinUs: "Bergabung Bersama Kami",
      joinUsDesc: "Daftarkan putra-putri Anda untuk menjadi bagian dari keluarga besar",
      registerPpdb: "Daftar PPDB Online",
      contactUs: "Hubungi Kami",
    },
    stats: {
      teachers: "Guru & Staff",
      alumni: "Alumni",
      achievements: "Prestasi",
      extracurricular: "Ekstrakurikuler",
    },
    footer: {
      quickLinks: "Menu Cepat",
      contact: "Kontak",
      information: "Informasi",
      address: "Alamat",
      phone: "Telepon",
      email: "Email",
      foundedSince: "Berdiri Sejak",
      allRightsReserved: "Hak Cipta Dilindungi",
      poweredBy: "Didukung oleh",
    },
    forms: {
      name: "Nama",
      email: "Email",
      phone: "Telepon",
      message: "Pesan",
      subject: "Subjek",
      send: "Kirim",
      sending: "Mengirim...",
      sent: "Terkirim",
      required: "Wajib diisi",
      invalid: "Format tidak valid",
    },
    datetime: {
      justNow: "Baru saja",
      minutesAgo: "menit lalu",
      hoursAgo: "jam lalu",
      daysAgo: "hari lalu",
      weeksAgo: "minggu lalu",
    },
    maintenance: {
      title: "Sedang Dalam Perbaikan",
      description: "Kami sedang melakukan pemeliharaan terjadwal. Kami akan segera kembali. Terima kasih atas kesabaran Anda.",
      workInProgress: "Pekerjaan sedang berlangsung",
      needHelp: "Butuh bantuan segera? Hubungi kami:",
    },
    pages: {
      news: {
        title: "Berita & Artikel",
        description: "Berita dan artikel terbaru dari sekolah",
        allCategories: "Semua Kategori",
        noNews: "Belum ada berita",
        readMore: "Baca Selengkapnya",
        views: "dilihat",
      },
      gallery: {
        title: "Galeri",
        description: "Galeri foto dan video kegiatan sekolah",
        allTypes: "Semua",
        photo: "Foto",
        video: "Video",
        noGallery: "Belum ada galeri",
        items: "item",
      },
      contact: {
        title: "Hubungi Kami",
        description: "Hubungi kami untuk informasi lebih lanjut",
        getInTouch: "Hubungi Kami",
        sendMessage: "Kirim Pesan",
        address: "Alamat",
        phone: "Telepon",
        email: "Email",
        operatingHours: "Jam Operasional",
        findUs: "Temukan Kami",
      },
      profile: {
        title: "Profil Sekolah",
        description: "Informasi tentang sekolah kami",
        visionMission: "Visi & Misi",
        vision: "Visi",
        mission: "Misi",
        history: "Sejarah",
        structure: "Struktur Organisasi",
        teachersStaff: "Guru & Staff",
        facilities: "Fasilitas",
        alumni: "Alumni",
      },
      academic: {
        title: "Program Akademik",
        description: "Program kurikulum, ekstrakurikuler, dan program unggulan sekolah",
        curriculum: "Kurikulum",
        extracurricular: "Ekstrakurikuler",
        featuredPrograms: "Program Unggulan",
        achievements: "Prestasi",
      },
      ppdb: {
        title: "Penerimaan Peserta Didik Baru",
        description: "Informasi pendaftaran siswa baru",
        registerNow: "Daftar Sekarang",
        requirements: "Persyaratan",
        timeline: "Jadwal Pendaftaran",
        registrationClosed: "Pendaftaran Ditutup",
        registrationOpen: "Pendaftaran Dibuka",
      },
      agenda: {
        title: "Agenda & Kegiatan",
        description: "Kalender kegiatan dan acara sekolah",
        upcomingEvents: "Agenda Mendatang",
        pastEvents: "Agenda Sebelumnya",
        noEvents: "Belum ada agenda",
      },
      downloads: {
        title: "Unduhan",
        description: "File dan dokumen yang dapat diunduh",
        noFiles: "Belum ada file",
        download: "Unduh",
        fileSize: "Ukuran file",
      },
    },
  },
  en: {
    common: {
      home: "Home",
      about: "About",
      contact: "Contact",
      news: "News",
      gallery: "Gallery",
      download: "Downloads",
      search: "Search",
      loading: "Loading...",
      error: "An error occurred",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      back: "Back",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      close: "Close",
      readMore: "Read More",
      seeAll: "See All",
      noData: "No data available",
    },
    nav: {
      home: "Home",
      profile: "Profile",
      aboutUs: "About Us",
      visionMission: "Vision & Mission",
      history: "History",
      structure: "Organization Structure",
      teachersStaff: "Teachers & Staff",
      facilities: "Facilities",
      academic: "Academic",
      curriculum: "Curriculum",
      extracurricular: "Extracurricular",
      featuredPrograms: "Featured Programs",
      achievements: "Achievements",
      news: "News",
      gallery: "Gallery",
      ppdb: "Admission",
      contact: "Contact",
      register: "Register Now",
    },
    home: {
      welcome: "Welcome to",
      heroTitle: "Excellent School",
      heroSubtitle: "Educating Excellent and Character Generation for a Bright Future",
      registerNow: "Register Now",
      aboutUs: "About Us",
      ourPrograms: "Our Programs",
      featuredPrograms: "Featured Programs",
      latestNews: "Latest News",
      newsInfo: "News & Information",
      testimonials: "Testimonials",
      whatTheySay: "What They Say",
      joinUs: "Join Us",
      joinUsDesc: "Register your children to be part of our big family",
      registerPpdb: "Online Registration",
      contactUs: "Contact Us",
    },
    stats: {
      teachers: "Teachers & Staff",
      alumni: "Alumni",
      achievements: "Achievements",
      extracurricular: "Extracurricular",
    },
    footer: {
      quickLinks: "Quick Links",
      contact: "Contact",
      information: "Information",
      address: "Address",
      phone: "Phone",
      email: "Email",
      foundedSince: "Founded Since",
      allRightsReserved: "All Rights Reserved",
      poweredBy: "Powered by",
    },
    forms: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      subject: "Subject",
      send: "Send",
      sending: "Sending...",
      sent: "Sent",
      required: "Required",
      invalid: "Invalid format",
    },
    datetime: {
      justNow: "Just now",
      minutesAgo: "minutes ago",
      hoursAgo: "hours ago",
      daysAgo: "days ago",
      weeksAgo: "weeks ago",
    },
    maintenance: {
      title: "Under Maintenance",
      description: "We're currently performing scheduled maintenance. We'll be back shortly. Thank you for your patience.",
      workInProgress: "Work in progress",
      needHelp: "Need immediate assistance? Contact us:",
    },
    pages: {
      news: {
        title: "News & Articles",
        description: "Latest news and articles from school",
        allCategories: "All Categories",
        noNews: "No news yet",
        readMore: "Read More",
        views: "views",
      },
      gallery: {
        title: "Gallery",
        description: "Photo and video gallery of school activities",
        allTypes: "All",
        photo: "Photo",
        video: "Video",
        noGallery: "No gallery yet",
        items: "items",
      },
      contact: {
        title: "Contact Us",
        description: "Contact us for more information",
        getInTouch: "Get In Touch",
        sendMessage: "Send Message",
        address: "Address",
        phone: "Phone",
        email: "Email",
        operatingHours: "Operating Hours",
        findUs: "Find Us",
      },
      profile: {
        title: "School Profile",
        description: "Information about our school",
        visionMission: "Vision & Mission",
        vision: "Vision",
        mission: "Mission",
        history: "History",
        structure: "Organization Structure",
        teachersStaff: "Teachers & Staff",
        facilities: "Facilities",
        alumni: "Alumni",
      },
      academic: {
        title: "Academic Programs",
        description: "Curriculum, extracurricular, and featured programs",
        curriculum: "Curriculum",
        extracurricular: "Extracurricular",
        featuredPrograms: "Featured Programs",
        achievements: "Achievements",
      },
      ppdb: {
        title: "Student Admission",
        description: "New student registration information",
        registerNow: "Register Now",
        requirements: "Requirements",
        timeline: "Registration Timeline",
        registrationClosed: "Registration Closed",
        registrationOpen: "Registration Open",
      },
      agenda: {
        title: "Events & Activities",
        description: "School events and activities calendar",
        upcomingEvents: "Upcoming Events",
        pastEvents: "Past Events",
        noEvents: "No events yet",
      },
      downloads: {
        title: "Downloads",
        description: "Downloadable files and documents",
        noFiles: "No files yet",
        download: "Download",
        fileSize: "File size",
      },
    },
  },
};

export function getTranslations(language: Language = "id"): Translations {
  return translations[language] || translations.id;
}

export function t(key: string, language: Language = "id"): string {
  const keys = key.split(".");
  let value: unknown = translations[language] || translations.id;
  
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === "string" ? value : key;
}
