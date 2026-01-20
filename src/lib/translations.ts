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
    testimonialsDesc: string;
    joinUs: string;
    joinUsDesc: string;
    registerPpdb: string;
    contactUs: string;
    allNews: string;
    buildingGeneration: string;
    excellentAndCharacter: string;
    ourMission: string;
    foundedSince: string;
    totalTeachers: string;
    instructors: string;
    accreditation: string;
    age: string;
    quota: string;
    students: string;
    ourClasses: string;
    educationLevels: string;
    educationLevelsDesc: string;
    learnMore: string;
  };
  // Stats
  stats: {
    teachers: string;
    alumni: string;
    achievements: string;
    extracurricular: string;
    gradeLevels: string;
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
    fullName: string;
    phoneNumber: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    namePlaceholder: string;
    thankYou: string;
    messageReceived: string;
    messageSent: string;
    messageFailed: string;
    sendMessage: string;
    // PPDB Form
    registrationSuccess: string;
    registrationSuccessDesc: string;
    saveRegistrationNo: string;
    contactSchool: string;
    backToPpdb: string;
    draftRestored: string;
    deleteDraft: string;
    draftDeleted: string;
    studentData: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    birthPlace: string;
    birthPlacePlaceholder: string;
    birthDate: string;
    gender: string;
    selectGender: string;
    male: string;
    female: string;
    religion: string;
    selectReligion: string;
    previousSchool: string;
    previousSchoolPlaceholder: string;
    address: string;
    fullAddress: string;
    fullAddressPlaceholder: string;
    parentData: string;
    fatherData: string;
    fatherName: string;
    fatherNamePlaceholder: string;
    occupation: string;
    occupationPlaceholder: string;
    motherData: string;
    motherName: string;
    motherNamePlaceholder: string;
    guardianData: string;
    guardianName: string;
    guardianNamePlaceholder: string;
    submitRegistration: string;
    submitting: string;
    registrationFailed: string;
    errorOccurred: string;
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
      sendMessageDesc: string;
      address: string;
      phone: string;
      email: string;
      operatingHours: string;
      findUs: string;
      viewLargerMap: string;
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
      heroSubtitle: string;
      curriculumDesc: string;
      extracurricularDesc: string;
      featuredProgramsDesc: string;
      noPrograms: string;
    };
    ppdb: {
      title: string;
      description: string;
      registerNow: string;
      requirements: string;
      timeline: string;
      registrationClosed: string;
      registrationOpen: string;
      comingSoon: string;
      noActivePeriod: string;
      noActivePeriodDesc: string;
      contactUs: string;
      registrationInfo: string;
      registrationPeriod: string;
      quota: string;
      students: string;
      registrationRequirements: string;
      registrationStages: string;
      startRegistration: string;
      registrationNotOpen: string;
      needHelp: string;
      needHelpDesc: string;
      downloads: string;
      viewAllDownloads: string;
      academicYear: string;
      joinUs: string;
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
      heroSubtitle:
        "Mendidik Generasi Unggul dan Berkarakter untuk Masa Depan yang Gemilang",
      registerNow: "Daftar Sekarang",
      aboutUs: "Tentang Kami",
      ourPrograms: "Program Kami",
      featuredPrograms: "Program Unggulan",
      latestNews: "Berita Terbaru",
      newsInfo: "Kabar & Informasi",
      testimonials: "Testimoni",
      whatTheySay: "Apa Kata Mereka",
      testimonialsDesc: "Cerita dan pengalaman dari orang tua dan siswa kami",
      joinUs: "Bergabung Bersama Kami",
      joinUsDesc:
        "Daftarkan putra-putri Anda untuk menjadi bagian dari keluarga besar",
      registerPpdb: "Daftar PPDB Online",
      contactUs: "Hubungi Kami",
      allNews: "Semua Berita",
      buildingGeneration: "Membangun Generasi",
      excellentAndCharacter: "Unggul dan Berkarakter",
      ourMission: "Misi Kami",
      foundedSince: "Berdiri Sejak",
      totalTeachers: "Total Pengajar",
      instructors: "Pengajar",
      accreditation: "Akreditasi",
      age: "Usia",
      quota: "Kuota",
      students: "Siswa",
      ourClasses: "Kelas Kami",
      educationLevels: "Jenjang Pendidikan",
      educationLevelsDesc: "Pilihan kelas yang tersedia untuk putra-putri Anda",
      learnMore: "Selengkapnya",
    },
    stats: {
      teachers: "Guru & Staff",
      alumni: "Alumni",
      achievements: "Prestasi",
      extracurricular: "Ekstrakurikuler",
      gradeLevels: "Kelas Dibuka",
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
      fullName: "Nama Lengkap",
      phoneNumber: "No. Telepon",
      subjectPlaceholder: "Perihal pesan",
      messagePlaceholder: "Tulis pesan Anda di sini...",
      namePlaceholder: "Masukkan nama lengkap",
      thankYou: "Terima Kasih!",
      messageReceived: "Pesan Anda telah kami terima. Kami akan segera menghubungi Anda.",
      messageSent: "Pesan berhasil dikirim!",
      messageFailed: "Gagal mengirim pesan",
      sendMessage: "Kirim Pesan",
      // PPDB Form
      registrationSuccess: "Pendaftaran Berhasil!",
      registrationSuccessDesc: "Terima kasih telah mendaftar. Simpan nomor registrasi Anda:",
      saveRegistrationNo: "Simpan nomor registrasi Anda",
      contactSchool: "Silakan hubungi sekolah untuk informasi lebih lanjut tentang proses seleksi.",
      backToPpdb: "Kembali ke Halaman PPDB",
      draftRestored: "Data formulir sebelumnya telah dipulihkan.",
      deleteDraft: "Hapus Draft",
      draftDeleted: "Draft berhasil dihapus",
      studentData: "Data Calon Siswa",
      fullNameLabel: "Nama Lengkap *",
      fullNamePlaceholder: "Nama lengkap sesuai akta",
      birthPlace: "Tempat Lahir *",
      birthPlacePlaceholder: "Kota kelahiran",
      birthDate: "Tanggal Lahir *",
      gender: "Jenis Kelamin *",
      selectGender: "Pilih jenis kelamin",
      male: "Laki-laki",
      female: "Perempuan",
      religion: "Agama",
      selectReligion: "Pilih agama",
      previousSchool: "Asal Sekolah",
      previousSchoolPlaceholder: "Nama sekolah sebelumnya",
      address: "Alamat",
      fullAddress: "Alamat Lengkap *",
      fullAddressPlaceholder: "Alamat lengkap tempat tinggal",
      parentData: "Data Orang Tua / Wali",
      fatherData: "Data Ayah",
      fatherName: "Nama Ayah",
      fatherNamePlaceholder: "Nama lengkap ayah",
      occupation: "Pekerjaan",
      occupationPlaceholder: "Pekerjaan",
      motherData: "Data Ibu",
      motherName: "Nama Ibu",
      motherNamePlaceholder: "Nama lengkap ibu",
      guardianData: "Data Wali (Opsional)",
      guardianName: "Nama Wali",
      guardianNamePlaceholder: "Nama lengkap wali",
      submitRegistration: "Kirim Pendaftaran",
      submitting: "Mengirim...",
      registrationFailed: "Gagal melakukan pendaftaran",
      errorOccurred: "Terjadi kesalahan. Silakan coba lagi.",
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
      description:
        "Kami sedang melakukan pemeliharaan terjadwal. Kami akan segera kembali. Terima kasih atas kesabaran Anda.",
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
        sendMessageDesc: "Silakan kirim pesan kepada kami jika ada pertanyaan atau masukan",
        address: "Alamat",
        phone: "Telepon",
        email: "Email",
        operatingHours: "Jam Operasional",
        findUs: "Temukan Kami",
        viewLargerMap: "Lihat peta lebih besar",
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
        description:
          "Program kurikulum, ekstrakurikuler, dan program unggulan sekolah",
        curriculum: "Kurikulum",
        extracurricular: "Ekstrakurikuler",
        featuredPrograms: "Program Unggulan",
        achievements: "Prestasi",
        heroSubtitle:
          "Jelajahi program pendidikan dan kegiatan yang kami tawarkan",
        curriculumDesc: "Program pembelajaran sesuai kurikulum nasional",
        extracurricularDesc: "Kegiatan pengembangan bakat dan minat siswa",
        featuredProgramsDesc:
          "Program unggulan yang menjadi kebanggaan sekolah",
        noPrograms: "Belum ada program dalam kategori ini",
      },
      ppdb: {
        title: "Penerimaan Peserta Didik Baru",
        description: "Informasi pendaftaran siswa baru",
        registerNow: "Daftar Sekarang",
        requirements: "Persyaratan",
        timeline: "Jadwal Pendaftaran",
        registrationClosed: "Pendaftaran Ditutup",
        registrationOpen: "Pendaftaran Dibuka",
        comingSoon: "Segera Dibuka",
        noActivePeriod: "Belum Ada Periode Aktif",
        noActivePeriodDesc: "Saat ini belum ada periode pendaftaran yang aktif. Silakan hubungi kami untuk informasi lebih lanjut.",
        contactUs: "Hubungi Kami",
        registrationInfo: "Informasi Pendaftaran",
        registrationPeriod: "Periode Pendaftaran",
        quota: "Kuota Penerimaan",
        students: "Siswa",
        registrationRequirements: "Persyaratan Pendaftaran",
        registrationStages: "Tahapan Pendaftaran",
        startRegistration: "Mulai Pendaftaran",
        registrationNotOpen: "Pendaftaran Belum Dibuka",
        needHelp: "Butuh Bantuan?",
        needHelpDesc: "Jika Anda memiliki pertanyaan tentang proses pendaftaran, silakan hubungi kami.",
        downloads: "Unduhan",
        viewAllDownloads: "Lihat Semua Unduhan",
        academicYear: "Tahun Ajaran",
        joinUs: "Bergabunglah bersama {schoolName} untuk masa depan yang lebih cerah",
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
      heroSubtitle:
        "Educating Excellent and Character Generation for a Bright Future",
      registerNow: "Register Now",
      aboutUs: "About Us",
      ourPrograms: "Our Programs",
      featuredPrograms: "Featured Programs",
      latestNews: "Latest News",
      newsInfo: "News & Information",
      testimonials: "Testimonials",
      whatTheySay: "What They Say",
      testimonialsDesc: "Stories and experiences from our parents and students",
      joinUs: "Join Us",
      joinUsDesc: "Register your children to be part of our big family",
      registerPpdb: "Online Registration",
      contactUs: "Contact Us",
      allNews: "All News",
      buildingGeneration: "Building a Generation of",
      excellentAndCharacter: "Excellence and Character",
      ourMission: "Our Mission",
      foundedSince: "Founded Since",
      totalTeachers: "Total Teachers",
      instructors: "Instructors",
      accreditation: "Accreditation",
      age: "Age",
      quota: "Quota",
      students: "Students",
      ourClasses: "Our Classes",
      educationLevels: "Education Levels",
      educationLevelsDesc: "Available classes for your children",
      learnMore: "Learn More",
    },
    stats: {
      teachers: "Teachers & Staff",
      alumni: "Alumni",
      achievements: "Achievements",
      extracurricular: "Extracurricular",
      gradeLevels: "Classes Opened",
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
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      subjectPlaceholder: "Message subject",
      messagePlaceholder: "Write your message here...",
      namePlaceholder: "Enter your full name",
      thankYou: "Thank You!",
      messageReceived: "Your message has been received. We will contact you soon.",
      messageSent: "Message sent successfully!",
      messageFailed: "Failed to send message",
      sendMessage: "Send Message",
      // PPDB Form
      registrationSuccess: "Registration Successful!",
      registrationSuccessDesc: "Thank you for registering. Save your registration number:",
      saveRegistrationNo: "Save your registration number",
      contactSchool: "Please contact the school for more information about the selection process.",
      backToPpdb: "Back to Admission Page",
      draftRestored: "Previous form data has been restored.",
      deleteDraft: "Delete Draft",
      draftDeleted: "Draft deleted successfully",
      studentData: "Student Data",
      fullNameLabel: "Full Name *",
      fullNamePlaceholder: "Full name as per birth certificate",
      birthPlace: "Place of Birth *",
      birthPlacePlaceholder: "City of birth",
      birthDate: "Date of Birth *",
      gender: "Gender *",
      selectGender: "Select gender",
      male: "Male",
      female: "Female",
      religion: "Religion",
      selectReligion: "Select religion",
      previousSchool: "Previous School",
      previousSchoolPlaceholder: "Name of previous school",
      address: "Address",
      fullAddress: "Full Address *",
      fullAddressPlaceholder: "Complete residential address",
      parentData: "Parent / Guardian Data",
      fatherData: "Father's Data",
      fatherName: "Father's Name",
      fatherNamePlaceholder: "Father's full name",
      occupation: "Occupation",
      occupationPlaceholder: "Occupation",
      motherData: "Mother's Data",
      motherName: "Mother's Name",
      motherNamePlaceholder: "Mother's full name",
      guardianData: "Guardian's Data (Optional)",
      guardianName: "Guardian's Name",
      guardianNamePlaceholder: "Guardian's full name",
      submitRegistration: "Submit Registration",
      submitting: "Submitting...",
      registrationFailed: "Registration failed",
      errorOccurred: "An error occurred. Please try again.",
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
      description:
        "We're currently performing scheduled maintenance. We'll be back shortly. Thank you for your patience.",
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
        sendMessageDesc: "Please send us a message if you have any questions or feedback",
        address: "Address",
        phone: "Phone",
        email: "Email",
        operatingHours: "Operating Hours",
        findUs: "Find Us",
        viewLargerMap: "View larger map",
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
        heroSubtitle: "Explore our educational programs and activities",
        curriculumDesc: "Learning programs according to national curriculum",
        extracurricularDesc:
          "Activities for developing student talents and interests",
        featuredProgramsDesc:
          "Featured programs that are the pride of the school",
        noPrograms: "No programs in this category yet",
      },
      ppdb: {
        title: "Student Admission",
        description: "New student registration information",
        registerNow: "Register Now",
        requirements: "Requirements",
        timeline: "Registration Timeline",
        registrationClosed: "Registration Closed",
        registrationOpen: "Registration Open",
        comingSoon: "Coming Soon",
        noActivePeriod: "No Active Period",
        noActivePeriodDesc: "There is currently no active registration period. Please contact us for more information.",
        contactUs: "Contact Us",
        registrationInfo: "Registration Information",
        registrationPeriod: "Registration Period",
        quota: "Admission Quota",
        students: "Students",
        registrationRequirements: "Registration Requirements",
        registrationStages: "Registration Stages",
        startRegistration: "Start Registration",
        registrationNotOpen: "Registration Not Open",
        needHelp: "Need Help?",
        needHelpDesc: "If you have questions about the registration process, please contact us.",
        downloads: "Downloads",
        viewAllDownloads: "View All Downloads",
        academicYear: "Academic Year",
        joinUs: "Join {schoolName} for a brighter future",
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
