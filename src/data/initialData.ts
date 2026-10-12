import { Course, StudentSubmission, ActivityEvent, CrossClassAttendance, ClassOfficer } from '../types';

export const CLASS_OFFICERS: ClassOfficer[] = [
  {
    role: 'Ketua Mahasiswa (KM)',
    name: 'Nadya Anggi Kusuma',
    phone: '085772921368',
    whatsappUrl: 'https://wa.me/6285772921368',
    notes: 'Penanggung jawab utama kelas IF26E & pengesah koordinasi mahasiswa lintas kelas'
  },
  {
    role: 'Wakil KM',
    name: 'Yuda',
    phone: '081262582492',
    whatsappUrl: 'https://wa.me/6281262582492',
    notes: 'Wakil koordinator kelas IF26E & konfirmasi perizinan lintas kelas'
  }
];

export const COORDINATION_RULES: string[] = [
  'Wajib konfirmasi terlebih dahulu kepada KM/Wakil KM sebelum menghubungi pihak luar kelas atau melakukan lintas kelas.',
  'Sampaikan tujuan dan keperluan dengan jelas saat melakukan konfirmasi.',
  'Untuk urusan mata kuliah, utamakan menghubungi koordinator mata kuliah yang bersangkutan.',
  'Jangan mengatasnamakan kelas atau KM tanpa adanya konfirmasi dan persetujuan.',
  'Jika sudah mendapat izin, lakukan komunikasi dengan sopan dan profesional.',
  'Hindari memberikan informasi kelas kepada pihak lain tanpa koordinasi terlebih dahulu.',
  'Jika terdapat perubahan informasi atau hasil komunikasi, laporkan kembali kepada KM/Wakil KM agar dapat diteruskan kepada teman-teman.'
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-pti',
    code: 'IF-PTI',
    name: 'PTI (Pengantar Teknologi Informasi)',
    semester: 1,
    classSection: 'IF26E',
    department: 'Teknik Informatika',
    lecturer: {
      name: 'Dosen Pengampu PTI',
      nip: '198904122015041002',
      email: 'pti.if26e@univ.ac.id',
      phone: '0812-9900-1122'
    },
    schedule: {
      day: 'Senin',
      time: '08:00 - 10:30 WIB',
      room: 'Ruang Teori IF-201'
    },
    maxCrossClassQuota: 6,
    whatsappGroupUrl: 'https://wa.me/62895622610606',
    pjmkUtamaSubmissionId: 'sub-pti',
    pjmkPendampingSubmissionId: null
  },
  {
    id: 'crs-algo',
    code: 'IF-ALGO',
    name: 'Algoritma & Pemrograman',
    semester: 1,
    classSection: 'IF26E',
    department: 'Teknik Informatika',
    lecturer: {
      name: 'Dosen Pengampu Algoritma',
      nip: '198705152012011001',
      email: 'algoritma.if26e@univ.ac.id',
      phone: '0813-8877-6655'
    },
    schedule: {
      day: 'Selasa',
      time: '10:30 - 13:00 WIB',
      room: 'Lab Komputasi Dasar'
    },
    maxCrossClassQuota: 6,
    whatsappGroupUrl: 'https://wa.me/6285282859860',
    pjmkUtamaSubmissionId: 'sub-algo',
    pjmkPendampingSubmissionId: null
  },
  {
    id: 'crs-os',
    code: 'IF-OS',
    name: 'Sistem Operasi',
    semester: 1,
    classSection: 'IF26E',
    department: 'Teknik Informatika',
    lecturer: {
      name: 'Dosen Pengampu Sistem Operasi',
      nip: '198503202010121004',
      email: 'os.if26e@univ.ac.id',
      phone: '0812-7766-5544'
    },
    schedule: {
      day: 'Rabu',
      time: '08:00 - 10:30 WIB',
      room: 'Ruang Teori IF-203'
    },
    maxCrossClassQuota: 6,
    whatsappGroupUrl: 'https://wa.me/6289527175100',
    pjmkUtamaSubmissionId: 'sub-os',
    pjmkPendampingSubmissionId: null
  },
  {
    id: 'crs-stat',
    code: 'IF-STAT',
    name: 'Statistika dan Probabilitas',
    semester: 1,
    classSection: 'IF26E',
    department: 'Teknik Informatika',
    lecturer: {
      name: 'Dosen Pengampu Statistika',
      nip: '199008222018032001',
      email: 'statistika.if26e@univ.ac.id',
      phone: '0819-3344-5566'
    },
    schedule: {
      day: 'Kamis',
      time: '13:00 - 15:30 WIB',
      room: 'Ruang Teori IF-204'
    },
    maxCrossClassQuota: 6,
    whatsappGroupUrl: 'https://wa.me/6285778186963',
    pjmkUtamaSubmissionId: 'sub-stat',
    pjmkPendampingSubmissionId: null
  },
  {
    id: 'crs-jarkom',
    code: 'IF-JK',
    name: 'Jaringan Komputer',
    semester: 1,
    classSection: 'IF26E',
    department: 'Teknik Informatika',
    lecturer: {
      name: 'Dosen Pengampu Jaringan Komputer',
      nip: '198811102014041003',
      email: 'jarkom.if26e@univ.ac.id',
      phone: '0812-5544-3322'
    },
    schedule: {
      day: 'Jumat',
      time: '08:00 - 10:30 WIB',
      room: 'Lab Jaringan Komputer'
    },
    maxCrossClassQuota: 6,
    whatsappGroupUrl: 'https://wa.me/6281212035575',
    pjmkUtamaSubmissionId: 'sub-jarkom',
    pjmkPendampingSubmissionId: null
  },
  {
    id: 'crs-pancasila',
    code: 'MKU-PKN',
    name: 'Pendidikan Pancasila',
    semester: 1,
    classSection: 'IF26E',
    department: 'Teknik Informatika',
    lecturer: {
      name: 'Dosen Pengampu Pancasila',
      nip: '197901182006042002',
      email: 'pancasila.if26e@univ.ac.id',
      phone: '0813-1122-3344'
    },
    schedule: {
      day: 'Selasa',
      time: '08:00 - 09:40 WIB',
      room: 'Gedung Kuliah Umum R.102'
    },
    maxCrossClassQuota: 6,
    whatsappGroupUrl: 'https://wa.me/6289531640037',
    pjmkUtamaSubmissionId: 'sub-pancasila',
    pjmkPendampingSubmissionId: null
  },
  {
    id: 'crs-kalkulus',
    code: 'MAT-KAL',
    name: 'Kalkulus',
    semester: 1,
    classSection: 'IF26E',
    department: 'Teknik Informatika',
    lecturer: {
      name: 'Dosen Pengampu Kalkulus',
      nip: '198306142009122001',
      email: 'kalkulus.if26e@univ.ac.id',
      phone: '0815-9988-7766'
    },
    schedule: {
      day: 'Rabu',
      time: '13:00 - 15:30 WIB',
      room: 'Ruang Teori IF-202'
    },
    maxCrossClassQuota: 6,
    whatsappGroupUrl: 'https://wa.me/6289623024888',
    pjmkUtamaSubmissionId: 'sub-kalkulus',
    pjmkPendampingSubmissionId: null
  }
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-pti',
    courseId: 'crs-pti',
    role: 'PJMK_UTAMA',
    student: {
      fullName: 'Faqih Hilmi Azizi',
      nim: '261401011',
      department: 'Teknik Informatika',
      classOrigin: 'IF26E',
      phone: '0895622610606',
      email: 'faqih.hilmi@mhs.univ.ac.id',
      experienceNotes: 'Koordinator Mata Kuliah PTI IF26E. Siap mengoordinasikan presensi mahasiswa lintas kelas.'
    },
    verificationStatus: 'VERIFIED',
    autoVerificationResult: {
      passed: true,
      score: 100,
      checks: [
        { id: 'nim_format', title: 'Validasi Format & Integritas NIM', passed: true, severity: 'CRITICAL', message: 'NIM 261401011 terdaftar aktif.', actualValue: '261401011', expectedValue: '8-14 Digit Numerik' },
        { id: 'whatsapp_contact', title: 'Kontak WhatsApp Aktif untuk Koordinasi', passed: true, severity: 'CRITICAL', message: 'Nomor WhatsApp 0895622610606 valid.', actualValue: '0895622610606', expectedValue: 'Nomor Aktif' },
        { id: 'class_origin', title: 'Kesesuaian Asal Kelas Angkatan', passed: true, severity: 'CRITICAL', message: 'Terdaftar resmi dari kelas IF26E.', actualValue: 'IF26E', expectedValue: 'IF26E' },
        { id: 'role_limit', title: 'Batas Penugasan Koordinasi Kelas', passed: true, severity: 'WARNING', message: 'Memegang 1 penugasan (Aman).', actualValue: '1 Mata Kuliah', expectedValue: '< 2 Mata Kuliah' },
        { id: 'commitment_notes', title: 'Kesiapan & Komitmen Koordinasi', passed: true, severity: 'INFO', message: 'Catatan koordinasi terisi jelas.', actualValue: 'Tercatat Lengkap', expectedValue: 'Tercatat Jelas' }
      ],
      timestamp: '2026-10-10T08:00:00Z',
      recommendation: 'AUTO_APPROVE',
      summaryReason: 'Identitas, kelas IF26E, dan kontak koordinasi terverifikasi resmi oleh KM Nadya Anggi Kusuma.'
    },
    submittedAt: '2026-10-10T08:00:00Z',
    verifiedAt: '2026-10-10T08:05:00Z',
    verifiedBy: 'KETUA_MAHASISWA',
    manualNotes: 'Ditetapkan resmi sebagai PJMK PTI IF26E oleh KM Nadya Anggi Kusuma.'
  },
  {
    id: 'sub-algo',
    courseId: 'crs-algo',
    role: 'PJMK_UTAMA',
    student: {
      fullName: 'Ujang',
      nim: '261401025',
      department: 'Teknik Informatika',
      classOrigin: 'IF26E',
      phone: '085282859860',
      email: 'ujang@mhs.univ.ac.id',
      experienceNotes: 'Koordinator Mata Kuliah Algoritma IF26E.'
    },
    verificationStatus: 'VERIFIED',
    autoVerificationResult: {
      passed: true,
      score: 100,
      checks: [
        { id: 'nim_format', title: 'Validasi Format & Integritas NIM', passed: true, severity: 'CRITICAL', message: 'NIM 261401025 terdaftar aktif.', actualValue: '261401025', expectedValue: '8-14 Digit Numerik' },
        { id: 'whatsapp_contact', title: 'Kontak WhatsApp Aktif untuk Koordinasi', passed: true, severity: 'CRITICAL', message: 'WhatsApp 085282859860 aktif.', actualValue: '085282859860', expectedValue: 'Nomor Aktif' },
        { id: 'class_origin', title: 'Kesesuaian Asal Kelas Angkatan', passed: true, severity: 'CRITICAL', message: 'Terdaftar dari IF26E.', actualValue: 'IF26E', expectedValue: 'IF26E' },
        { id: 'role_limit', title: 'Batas Penugasan Koordinasi Kelas', passed: true, severity: 'WARNING', message: '1 mata kuliah.', actualValue: '1 Mata Kuliah', expectedValue: '< 2 Mata Kuliah' },
        { id: 'commitment_notes', title: 'Kesiapan & Komitmen Koordinasi', passed: true, severity: 'INFO', message: 'Catatan komitmen siap.', actualValue: 'Tercatat Lengkap', expectedValue: 'Tercatat Jelas' }
      ],
      timestamp: '2026-10-10T08:10:00Z',
      recommendation: 'AUTO_APPROVE',
      summaryReason: 'Identitas, kelas IF26E, dan kontak koordinasi terverifikasi resmi oleh KM Nadya Anggi Kusuma.'
    },
    submittedAt: '2026-10-10T08:10:00Z',
    verifiedAt: '2026-10-10T08:15:00Z',
    verifiedBy: 'KETUA_MAHASISWA',
    manualNotes: 'Ditetapkan resmi sebagai PJMK Algoritma IF26E.'
  },
  {
    id: 'sub-os',
    courseId: 'crs-os',
    role: 'PJMK_UTAMA',
    student: {
      fullName: 'Asep',
      nim: '261401038',
      department: 'Teknik Informatika',
      classOrigin: 'IF26E',
      phone: '089527175100',
      email: 'asep@mhs.univ.ac.id',
      experienceNotes: 'Koordinator Mata Kuliah Sistem Operasi IF26E.'
    },
    verificationStatus: 'VERIFIED',
    autoVerificationResult: {
      passed: true,
      score: 100,
      checks: [
        { id: 'nim_format', title: 'Validasi Format & Integritas NIM', passed: true, severity: 'CRITICAL', message: 'NIM 261401038 terdaftar aktif.', actualValue: '261401038', expectedValue: '8-14 Digit Numerik' },
        { id: 'whatsapp_contact', title: 'Kontak WhatsApp Aktif untuk Koordinasi', passed: true, severity: 'CRITICAL', message: 'WhatsApp 089527175100 aktif.', actualValue: '089527175100', expectedValue: 'Nomor Aktif' },
        { id: 'class_origin', title: 'Kesesuaian Asal Kelas Angkatan', passed: true, severity: 'CRITICAL', message: 'Terdaftar dari IF26E.', actualValue: 'IF26E', expectedValue: 'IF26E' },
        { id: 'role_limit', title: 'Batas Penugasan Koordinasi Kelas', passed: true, severity: 'WARNING', message: '1 mata kuliah.', actualValue: '1 Mata Kuliah', expectedValue: '< 2 Mata Kuliah' },
        { id: 'commitment_notes', title: 'Kesiapan & Komitmen Koordinasi', passed: true, severity: 'INFO', message: 'Catatan komitmen siap.', actualValue: 'Tercatat Lengkap', expectedValue: 'Tercatat Jelas' }
      ],
      timestamp: '2026-10-10T08:20:00Z',
      recommendation: 'AUTO_APPROVE',
      summaryReason: 'Identitas, kelas IF26E, dan kontak koordinasi terverifikasi resmi oleh KM Nadya Anggi Kusuma.'
    },
    submittedAt: '2026-10-10T08:20:00Z',
    verifiedAt: '2026-10-10T08:25:00Z',
    verifiedBy: 'KETUA_MAHASISWA',
    manualNotes: 'Ditetapkan resmi sebagai PJMK Sistem Operasi IF26E.'
  },
  {
    id: 'sub-stat',
    courseId: 'crs-stat',
    role: 'PJMK_UTAMA',
    student: {
      fullName: 'Winka Amalia Zahra',
      nim: '261401052',
      department: 'Teknik Informatika',
      classOrigin: 'IF26E',
      phone: '085778186963',
      email: 'winka.zahra@mhs.univ.ac.id',
      experienceNotes: 'Koordinator Mata Kuliah Statistika dan Probabilitas IF26E.'
    },
    verificationStatus: 'VERIFIED',
    autoVerificationResult: {
      passed: true,
      score: 100,
      checks: [
        { id: 'nim_format', title: 'Validasi Format & Integritas NIM', passed: true, severity: 'CRITICAL', message: 'NIM 261401052 terdaftar aktif.', actualValue: '261401052', expectedValue: '8-14 Digit Numerik' },
        { id: 'whatsapp_contact', title: 'Kontak WhatsApp Aktif untuk Koordinasi', passed: true, severity: 'CRITICAL', message: 'WhatsApp 085778186963 aktif.', actualValue: '085778186963', expectedValue: 'Nomor Aktif' },
        { id: 'class_origin', title: 'Kesesuaian Asal Kelas Angkatan', passed: true, severity: 'CRITICAL', message: 'Terdaftar dari IF26E.', actualValue: 'IF26E', expectedValue: 'IF26E' },
        { id: 'role_limit', title: 'Batas Penugasan Koordinasi Kelas', passed: true, severity: 'WARNING', message: '1 mata kuliah.', actualValue: '1 Mata Kuliah', expectedValue: '< 2 Mata Kuliah' },
        { id: 'commitment_notes', title: 'Kesiapan & Komitmen Koordinasi', passed: true, severity: 'INFO', message: 'Catatan komitmen siap.', actualValue: 'Tercatat Lengkap', expectedValue: 'Tercatat Jelas' }
      ],
      timestamp: '2026-10-10T08:30:00Z',
      recommendation: 'AUTO_APPROVE',
      summaryReason: 'Identitas, kelas IF26E, dan kontak koordinasi terverifikasi resmi oleh KM Nadya Anggi Kusuma.'
    },
    submittedAt: '2026-10-10T08:30:00Z',
    verifiedAt: '2026-10-10T08:35:00Z',
    verifiedBy: 'KETUA_MAHASISWA',
    manualNotes: 'Ditetapkan resmi sebagai PJMK Statistika dan Probabilitas IF26E.'
  },
  {
    id: 'sub-jarkom',
    courseId: 'crs-jarkom',
    role: 'PJMK_UTAMA',
    student: {
      fullName: 'Rafa',
      nim: '261401067',
      department: 'Teknik Informatika',
      classOrigin: 'IF26E',
      phone: '081212035575',
      email: 'rafa@mhs.univ.ac.id',
      experienceNotes: 'Koordinator Mata Kuliah Jaringan Komputer IF26E.'
    },
    verificationStatus: 'VERIFIED',
    autoVerificationResult: {
      passed: true,
      score: 100,
      checks: [
        { id: 'nim_format', title: 'Validasi Format & Integritas NIM', passed: true, severity: 'CRITICAL', message: 'NIM 261401067 terdaftar aktif.', actualValue: '261401067', expectedValue: '8-14 Digit Numerik' },
        { id: 'whatsapp_contact', title: 'Kontak WhatsApp Aktif untuk Koordinasi', passed: true, severity: 'CRITICAL', message: 'WhatsApp 081212035575 aktif.', actualValue: '081212035575', expectedValue: 'Nomor Aktif' },
        { id: 'class_origin', title: 'Kesesuaian Asal Kelas Angkatan', passed: true, severity: 'CRITICAL', message: 'Terdaftar dari IF26E.', actualValue: 'IF26E', expectedValue: 'IF26E' },
        { id: 'role_limit', title: 'Batas Penugasan Koordinasi Kelas', passed: true, severity: 'WARNING', message: '1 mata kuliah.', actualValue: '1 Mata Kuliah', expectedValue: '< 2 Mata Kuliah' },
        { id: 'commitment_notes', title: 'Kesiapan & Komitmen Koordinasi', passed: true, severity: 'INFO', message: 'Catatan komitmen siap.', actualValue: 'Tercatat Lengkap', expectedValue: 'Tercatat Jelas' }
      ],
      timestamp: '2026-10-10T08:40:00Z',
      recommendation: 'AUTO_APPROVE',
      summaryReason: 'Identitas, kelas IF26E, dan kontak koordinasi terverifikasi resmi oleh KM Nadya Anggi Kusuma.'
    },
    submittedAt: '2026-10-10T08:40:00Z',
    verifiedAt: '2026-10-10T08:45:00Z',
    verifiedBy: 'KETUA_MAHASISWA',
    manualNotes: 'Ditetapkan resmi sebagai PJMK Jaringan Komputer IF26E.'
  },
  {
    id: 'sub-pancasila',
    courseId: 'crs-pancasila',
    role: 'PJMK_UTAMA',
    student: {
      fullName: 'Zahra',
      nim: '261401080',
      department: 'Teknik Informatika',
      classOrigin: 'IF26E',
      phone: '089531640037',
      email: 'zahra@mhs.univ.ac.id',
      experienceNotes: 'Koordinator Mata Kuliah Pendidikan Pancasila IF26E.'
    },
    verificationStatus: 'VERIFIED',
    autoVerificationResult: {
      passed: true,
      score: 100,
      checks: [
        { id: 'nim_format', title: 'Validasi Format & Integritas NIM', passed: true, severity: 'CRITICAL', message: 'NIM 261401080 terdaftar aktif.', actualValue: '261401080', expectedValue: '8-14 Digit Numerik' },
        { id: 'whatsapp_contact', title: 'Kontak WhatsApp Aktif untuk Koordinasi', passed: true, severity: 'CRITICAL', message: 'WhatsApp 089531640037 aktif.', actualValue: '089531640037', expectedValue: 'Nomor Aktif' },
        { id: 'class_origin', title: 'Kesesuaian Asal Kelas Angkatan', passed: true, severity: 'CRITICAL', message: 'Terdaftar dari IF26E.', actualValue: 'IF26E', expectedValue: 'IF26E' },
        { id: 'role_limit', title: 'Batas Penugasan Koordinasi Kelas', passed: true, severity: 'WARNING', message: '1 mata kuliah.', actualValue: '1 Mata Kuliah', expectedValue: '< 2 Mata Kuliah' },
        { id: 'commitment_notes', title: 'Kesiapan & Komitmen Koordinasi', passed: true, severity: 'INFO', message: 'Catatan komitmen siap.', actualValue: 'Tercatat Lengkap', expectedValue: 'Tercatat Jelas' }
      ],
      timestamp: '2026-10-10T08:50:00Z',
      recommendation: 'AUTO_APPROVE',
      summaryReason: 'Identitas, kelas IF26E, dan kontak koordinasi terverifikasi resmi oleh KM Nadya Anggi Kusuma.'
    },
    submittedAt: '2026-10-10T08:50:00Z',
    verifiedAt: '2026-10-10T08:55:00Z',
    verifiedBy: 'KETUA_MAHASISWA',
    manualNotes: 'Ditetapkan resmi sebagai PJMK Pendidikan Pancasila IF26E.'
  },
  {
    id: 'sub-kalkulus',
    courseId: 'crs-kalkulus',
    role: 'PJMK_UTAMA',
    student: {
      fullName: 'Deiva Alya',
      nim: '261401094',
      department: 'Teknik Informatika',
      classOrigin: 'IF26E',
      phone: '089623024888',
      email: 'deiva.alya@mhs.univ.ac.id',
      experienceNotes: 'Koordinator Mata Kuliah Kalkulus IF26E.'
    },
    verificationStatus: 'VERIFIED',
    autoVerificationResult: {
      passed: true,
      score: 100,
      checks: [
        { id: 'nim_format', title: 'Validasi Format & Integritas NIM', passed: true, severity: 'CRITICAL', message: 'NIM 261401094 terdaftar aktif.', actualValue: '261401094', expectedValue: '8-14 Digit Numerik' },
        { id: 'whatsapp_contact', title: 'Kontak WhatsApp Aktif untuk Koordinasi', passed: true, severity: 'CRITICAL', message: 'WhatsApp 089623024888 aktif.', actualValue: '089623024888', expectedValue: 'Nomor Aktif' },
        { id: 'class_origin', title: 'Kesesuaian Asal Kelas Angkatan', passed: true, severity: 'CRITICAL', message: 'Terdaftar dari IF26E.', actualValue: 'IF26E', expectedValue: 'IF26E' },
        { id: 'role_limit', title: 'Batas Penugasan Koordinasi Kelas', passed: true, severity: 'WARNING', message: '1 mata kuliah.', actualValue: '1 Mata Kuliah', expectedValue: '< 2 Mata Kuliah' },
        { id: 'commitment_notes', title: 'Kesiapan & Komitmen Koordinasi', passed: true, severity: 'INFO', message: 'Catatan komitmen siap.', actualValue: 'Tercatat Lengkap', expectedValue: 'Tercatat Jelas' }
      ],
      timestamp: '2026-10-10T09:00:00Z',
      recommendation: 'AUTO_APPROVE',
      summaryReason: 'Identitas, kelas IF26E, dan kontak koordinasi terverifikasi resmi oleh KM Nadya Anggi Kusuma.'
    },
    submittedAt: '2026-10-10T09:00:00Z',
    verifiedAt: '2026-10-10T09:05:00Z',
    verifiedBy: 'KETUA_MAHASISWA',
    manualNotes: 'Ditetapkan resmi sebagai PJMK Kalkulus IF26E.'
  }
];

export const INITIAL_CROSS_CLASS_ATTENDANCES: CrossClassAttendance[] = [
  {
    id: 'att-001',
    courseId: 'crs-pti', // PTI IF26E
    studentName: 'Dimas Rizky Ananda',
    nim: '261401012',
    originClass: 'IF26A',
    targetClass: 'IF26E',
    phone: '081277665511',
    meetingDate: '2026-10-13',
    meetingSession: 'Pertemuan 5 - Pengantar Arsitektur Komputer',
    reason: 'Jadwal sesi reguler di IF26A bentrok dengan agenda praktikum wajib. Sudah konfirmasi ke KM Nadya.',
    approvalStatus: 'APPROVED',
    verificationNotes: 'Dikonfirmasi hadir oleh PJMK PTI (Faqih Hilmi Azizi) & izin ke KM disetujui.',
    submittedAt: '2026-10-12T01:10:00Z',
    verifiedAt: '2026-10-12T01:30:00Z',
    verifiedBy: 'PJMK Faqih Hilmi Azizi',
    hasConfirmedKM: true
  },
  {
    id: 'att-002',
    courseId: 'crs-algo', // Algoritma IF26E
    studentName: 'Siti Fatimah',
    nim: '261401033',
    originClass: 'IF26B',
    targetClass: 'IF26E',
    phone: '081388990022',
    meetingDate: '2026-10-14',
    meetingSession: 'Pertemuan 6 - Struktur Percabangan & Perulangan',
    reason: 'Izin tugas delegasi organisasi kampus saat sesi IF26B, mengikuti materi di kelas IF26E.',
    approvalStatus: 'PENDING',
    verificationNotes: 'Menunggu konfirmasi kehadiran oleh PJMK Algoritma (Ujang) atau KM Nadya.',
    submittedAt: '2026-10-12T02:15:00Z',
    verifiedAt: null,
    verifiedBy: null,
    hasConfirmedKM: true
  },
  {
    id: 'att-003',
    courseId: 'crs-os', // Sistem Operasi IF26E
    studentName: 'Rendy Pratama Putra',
    nim: '261401058',
    originClass: 'IF26C',
    targetClass: 'IF26E',
    phone: '085711223344',
    meetingDate: '2026-10-15',
    meetingSession: 'Pertemuan 5 - Konsep Proses & Threading',
    reason: 'Mengganti kehadiran karena izin sakit pada sesi kelas asal minggu lalu.',
    approvalStatus: 'APPROVED',
    verificationNotes: 'Surat keterangan sakit dan izin terkonfirmasi oleh Wakil KM Yuda.',
    submittedAt: '2026-10-11T18:00:00Z',
    verifiedAt: '2026-10-11T19:30:00Z',
    verifiedBy: 'Wakil KM (Yuda)',
    hasConfirmedKM: true
  },
  {
    id: 'att-004',
    courseId: 'crs-stat', // Statistika IF26E
    studentName: 'Nabilah Azzahra',
    nim: '261401077',
    originClass: 'IF26D',
    targetClass: 'IF26E',
    phone: '081298765432',
    meetingDate: '2026-10-16',
    meetingSession: 'Pertemuan 6 - Distribusi Peluang & Normal',
    reason: 'Dispensasi jadwal ujian susulan di kelas asal IF26D.',
    approvalStatus: 'PENDING',
    verificationNotes: 'Menunggu konfirmasi PJMK Statistika (Winka Amalia Zahra).',
    submittedAt: '2026-10-12T03:00:00Z',
    verifiedAt: null,
    verifiedBy: null,
    hasConfirmedKM: false
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: 'act-001',
    timestamp: 'Baru saja',
    title: 'Presensi Lintas Kelas Dikonfirmasi',
    description: 'Dimas Rizky (IF26A) disetujui hadir di PTI IF26E oleh PJMK Faqih Hilmi Azizi.',
    type: 'VERIFICATION_SUCCESS',
    courseCode: 'IF-PTI',
    studentName: 'Dimas Rizky Ananda'
  },
  {
    id: 'act-002',
    timestamp: '15 menit lalu',
    title: 'Pengajuan Absensi Lintas Baru',
    description: 'Siti Fatimah (NIM 261401033, IF26B) mengisi absen pindah ke Algoritma IF26E.',
    type: 'CROSS_CLASS_ATTENDANCE',
    courseCode: 'IF-ALGO',
    studentName: 'Siti Fatimah'
  },
  {
    id: 'act-003',
    timestamp: '1 jam lalu',
    title: 'Pengajuan Absensi Lintas Statistika',
    description: 'Nabilah Azzahra (IF26D) mengajukan pindah sementara ke Statistika IF26E.',
    type: 'CROSS_CLASS_ATTENDANCE',
    courseCode: 'IF-STAT',
    studentName: 'Nabilah Azzahra'
  },
  {
    id: 'act-004',
    timestamp: '2 jam lalu',
    title: 'Pengesahan Koordinator Kelas IF26E',
    description: 'Seluruh 7 Koordinator Mata Kuliah resmi disahkan oleh Ketua Mahasiswa Nadya Anggi Kusuma.',
    type: 'VERIFICATION_SUCCESS',
    courseCode: 'IF26E',
    studentName: 'Nadya Anggi Kusuma'
  },
  {
    id: 'act-005',
    timestamp: 'Kemarin',
    title: 'Izin Lintas Kelas Disetujui',
    description: 'Rendy Pratama (IF26C) dikonfirmasi hadir di Sistem Operasi IF26E oleh Wakil KM Yuda.',
    type: 'VERIFICATION_SUCCESS',
    courseCode: 'IF-OS',
    studentName: 'Rendy Pratama Putra'
  }
];
