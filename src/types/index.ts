export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'MANUAL_REVIEW';

export type CheckSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface VerificationCheckItem {
  id: string;
  title: string;
  passed: boolean;
  severity: CheckSeverity;
  message: string;
  actualValue: string | number;
  expectedValue: string | number;
}

export interface AutoVerificationResult {
  passed: boolean;
  score: number; // 0 - 100
  checks: VerificationCheckItem[];
  timestamp: string;
  recommendation: 'AUTO_APPROVE' | 'FLAG_FOR_PJMK' | 'AUTO_REJECT';
  summaryReason: string;
}

export interface StudentData {
  fullName: string;
  nim: string;
  department: string;
  classOrigin: string; // Asal kelas mahasiswa (misal: "Kelas A", "Kelas B", "Kelas C")
  phone: string; // WhatsApp untuk koordinasi
  email: string;
  experienceNotes: string;
}

export interface StudentSubmission {
  id: string;
  courseId: string;
  role: 'PJMK_UTAMA' | 'PJMK_PENDAMPING';
  student: StudentData;
  verificationStatus: VerificationStatus;
  autoVerificationResult: AutoVerificationResult;
  submittedAt: string;
  verifiedAt: string | null;
  verifiedBy: 'SISTEM_OTOMATIS' | 'KETUA_MAHASISWA' | 'PJMK' | null;
  manualNotes?: string;
}

export interface Lecturer {
  name: string;
  nip: string;
  email: string;
  phone: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  semester: number;
  classSection: string; // e.g. "Kelas A", "Kelas B", "Kelas C"
  department: string;
  lecturer: Lecturer;
  schedule: {
    day: string;
    time: string;
    room: string;
  };
  maxCrossClassQuota: number; // Kuota maksimal mahasiswa lintas per sesi (misal 8 orang)
  whatsappGroupUrl?: string;
  pjmkUtamaSubmissionId?: string | null;
  pjmkPendampingSubmissionId?: string | null;
}

export interface VerificationRuleConfig {
  maxCrossClassQuotaPerSession: number; // Kuota maksimal mahasiswa lintas per pertemuan (default 8)
  maxCrossClassPerStudentPerSemester: number; // Maksimal pindah kelas per mahasiswa per semester (default 4x)
  maxCoordinatorRolesPerStudent: number; // Maksimal penugasan PJMK per mahasiswa (default 2)
  requireValidWhatsApp: boolean; // Wajib nomor WhatsApp aktif
  allowKetuaManualOverride: boolean; // Otorisasi override manual Ketua Mahasiswa / PJMK
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'VERIFICATION_SUCCESS' | 'VERIFICATION_FAILED' | 'NEW_SUBMISSION' | 'MANUAL_APPROVAL' | 'SYSTEM_RECHECK' | 'CROSS_CLASS_ATTENDANCE';
  courseCode: string;
  studentName: string;
}

export interface CrossClassAttendance {
  id: string;
  courseId: string; // Mata kuliah dan kelas tujuan
  studentName: string;
  nim: string;
  originClass: string; // Asal kelas mahasiswa (misal: "Kelas A")
  targetClass: string; // Kelas tujuan (misal: "Kelas B")
  phone: string; // Nomor WhatsApp mahasiswa lintas
  meetingDate: string; // Tanggal sesi perkuliahan
  meetingSession: string; // Sesi pertemuan (misal: "Pertemuan 7")
  reason: string; // Alasan lintas kelas sementara
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  verificationNotes?: string;
  submittedAt: string;
  verifiedAt: string | null;
  verifiedBy: string | null; // Dikonfirmasi oleh PJMK atau Ketua Mahasiswa
  hasConfirmedKM?: boolean;
}

export interface ClassOfficer {
  role: string;
  name: string;
  phone: string;
  whatsappUrl: string;
  notes: string;
}
