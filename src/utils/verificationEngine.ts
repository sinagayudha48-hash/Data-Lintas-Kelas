import {
  StudentData,
  Course,
  StudentSubmission,
  VerificationRuleConfig,
  AutoVerificationResult,
  VerificationCheckItem,
  CrossClassAttendance
} from '../types';

export const DEFAULT_RULES: VerificationRuleConfig = {
  maxCrossClassQuotaPerSession: 8,
  maxCrossClassPerStudentPerSemester: 4,
  maxCoordinatorRolesPerStudent: 2,
  requireValidWhatsApp: true,
  allowKetuaManualOverride: true,
};

export function evaluateStudentSubmission(
  student: StudentData,
  course: Course,
  existingSubmissions: StudentSubmission[],
  rules: VerificationRuleConfig = DEFAULT_RULES,
  currentSubmissionId?: string
): AutoVerificationResult {
  const checks: VerificationCheckItem[] = [];

  // Check 1: Format & Validitas NIM Mahasiswa Angkatan
  const nimClean = student.nim.trim();
  const isNimNumeric = /^\d{8,14}$/.test(nimClean);
  checks.push({
    id: 'nim_format',
    title: 'Validasi Format & Integritas NIM',
    passed: isNimNumeric,
    severity: 'CRITICAL',
    message: isNimNumeric
      ? `NIM ${nimClean} terdaftar sebagai mahasiswa aktif angkatan.`
      : `Format NIM tidak valid (${nimClean}). Harus berupa 8-14 digit angka numerik resmi.`,
    actualValue: nimClean || 'Kosong',
    expectedValue: '8-14 Digit Numerik'
  });

  // Check 2: Kontak WhatsApp Aktif untuk Narahubung Kelas & Mahasiswa Lintas
  const phoneClean = student.phone.replace(/[^0-9]/g, '');
  const isPhoneValid = phoneClean.length >= 10 && phoneClean.length <= 15;
  checks.push({
    id: 'whatsapp_contact',
    title: 'Kontak WhatsApp Aktif untuk Koordinasi',
    passed: isPhoneValid,
    severity: 'CRITICAL',
    message: isPhoneValid
      ? `Nomor WhatsApp ${student.phone} aktif untuk koordinasi dengan Ketua Mahasiswa dan mahasiswa lintas.`
      : 'Nomor WhatsApp wajib diisi (10-15 digit) sebagai narahubung utama kelas.',
    actualValue: student.phone || 'Kosong',
    expectedValue: 'Nomor Aktif (10-15 digit)'
  });

  // Check 3: Validasi Asal Kelas Angkatan
  const hasClassOrigin = Boolean(student.classOrigin && student.classOrigin.trim());
  checks.push({
    id: 'class_origin',
    title: 'Kesesuaian Asal Kelas Angkatan',
    passed: hasClassOrigin,
    severity: 'CRITICAL',
    message: hasClassOrigin
      ? `Mahasiswa terdaftar resmi dari ${student.classOrigin} untuk kelas ${course.classSection}.`
      : 'Asal kelas mahasiswa belum ditentukan.',
    actualValue: student.classOrigin || 'Belum dipilih',
    expectedValue: 'Kelas Terdaftar Angkatan'
  });

  // Check 4: Batas Rangkap Penugasan PJMK
  const otherActiveRoles = existingSubmissions.filter(sub => {
    if (currentSubmissionId && sub.id === currentSubmissionId) return false;
    return (
      sub.student.nim === student.nim &&
      (sub.verificationStatus === 'VERIFIED' || sub.verificationStatus === 'PENDING')
    );
  });
  const currentAssignedCount = otherActiveRoles.length;
  const isRoleCountSafe = currentAssignedCount < rules.maxCoordinatorRolesPerStudent;
  checks.push({
    id: 'role_limit',
    title: 'Batas Penugasan Koordinasi Kelas',
    passed: isRoleCountSafe,
    severity: 'WARNING',
    message: isRoleCountSafe
      ? `Mahasiswa terdaftar pada ${currentAssignedCount} penugasan kelas lain (Aman).`
      : `Mahasiswa sudah memegang ${currentAssignedCount} kelas. Melebihi batas maksimal (${rules.maxCoordinatorRolesPerStudent} kelas). Perlu persetujuan Ketua Mahasiswa.`,
    actualValue: `${currentAssignedCount} Kelas`,
    expectedValue: `< ${rules.maxCoordinatorRolesPerStudent} Kelas`
  });

  // Check 5: Kesiapan & Catatan Komitmen Koordinasi
  const hasNotes = Boolean(student.experienceNotes && student.experienceNotes.trim().length >= 8);
  checks.push({
    id: 'commitment_notes',
    title: 'Kesiapan & Komitmen Koordinasi',
    passed: hasNotes,
    severity: 'INFO',
    message: hasNotes
      ? 'Catatan kesiapan koordinasi terisi dengan jelas.'
      : 'Catatan koordinasi belum diisi lengkap (opsional, disarankan terisi).',
    actualValue: hasNotes ? 'Tercatat Lengkap' : 'Singkat / Kosong',
    expectedValue: 'Tercatat Jelas'
  });

  // Calculate compliance score
  const totalChecks = checks.length;
  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / totalChecks) * 100);

  const hasCriticalFailure = checks.some(c => !c.passed && c.severity === 'CRITICAL');
  const hasWarningOnly = checks.some(c => !c.passed && c.severity === 'WARNING');

  let recommendation: 'AUTO_APPROVE' | 'FLAG_FOR_PJMK' | 'AUTO_REJECT';
  let summaryReason = '';

  if (!hasCriticalFailure && !hasWarningOnly) {
    recommendation = 'AUTO_APPROVE';
    summaryReason = 'Identitas, asal kelas, dan kontak koordinasi mahasiswa terverifikasi lengkap.';
  } else if (!hasCriticalFailure && hasWarningOnly) {
    recommendation = 'FLAG_FOR_PJMK';
    summaryReason = 'Memerlukan konfirmasi Ketua Mahasiswa terkait pembagian tugas kelas.';
  } else {
    recommendation = 'AUTO_REJECT';
    const failedCriticals = checks.filter(c => !c.passed && c.severity === 'CRITICAL').map(c => c.title);
    summaryReason = `Data koordinasi belum memenuhi syarat: ${failedCriticals.join(', ')}.`;
  }

  return {
    passed: recommendation === 'AUTO_APPROVE',
    score,
    checks,
    timestamp: new Date().toISOString(),
    recommendation,
    summaryReason
  };
}

export interface CrossClassValidationResult {
  isValid: boolean;
  canAutoApprove: boolean;
  reasons: string[];
  remainingQuota: number;
}

export function evaluateCrossClassAttendance(
  attendance: {
    nim: string;
    studentName: string;
    originClass: string;
    targetClass: string;
    courseId: string;
    meetingDate: string;
    phone: string;
  },
  course: Course,
  existingAttendances: CrossClassAttendance[],
  rules: VerificationRuleConfig = DEFAULT_RULES
): CrossClassValidationResult {
  const reasons: string[] = [];
  let isValid = true;
  let canAutoApprove = true;

  // 1. NIM Check
  const nimClean = attendance.nim.trim();
  if (!/^\d{8,14}$/.test(nimClean)) {
    isValid = false;
    canAutoApprove = false;
    reasons.push('Format NIM tidak valid (harus 8-14 digit numerik).');
  }

  // 2. Class Origin vs Target
  if (attendance.originClass.trim().toLowerCase() === attendance.targetClass.trim().toLowerCase()) {
    isValid = false;
    canAutoApprove = false;
    reasons.push('Asal kelas tidak boleh sama dengan kelas tujuan (hanya untuk mahasiswa lintas).');
  }

  // 3. Quota Check for the specific course and session date
  const sameSessionAttendances = existingAttendances.filter(
    (a) => a.courseId === attendance.courseId && a.meetingDate === attendance.meetingDate && a.approvalStatus !== 'REJECTED'
  );
  const maxQuota = course.maxCrossClassQuota || rules.maxCrossClassQuotaPerSession;
  const remainingQuota = Math.max(0, maxQuota - sameSessionAttendances.length);

  if (remainingQuota <= 0) {
    canAutoApprove = false;
    reasons.push(`Kuota lintas kelas untuk sesi ini telah penuh (Maksimal ${maxQuota} mahasiswa). Perlu konfirmasi khusus PJMK.`);
  }

  // 4. Frequency Check
  const studentPastAttendances = existingAttendances.filter(
    (a) => a.nim.trim() === nimClean && a.approvalStatus === 'APPROVED'
  );
  if (studentPastAttendances.length >= rules.maxCrossClassPerStudentPerSemester) {
    canAutoApprove = false;
    reasons.push(`Mahasiswa telah melakukan lintas kelas ${studentPastAttendances.length} kali (Batas wajar: ${rules.maxCrossClassPerStudentPerSemester} kali).`);
  }

  // 5. WhatsApp Contact Check
  const phoneDigits = attendance.phone.replace(/[^0-9]/g, '');
  if (rules.requireValidWhatsApp && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
    canAutoApprove = false;
    reasons.push('Nomor WhatsApp wajib aktif untuk konfirmasi dengan PJMK kelas.');
  }

  return {
    isValid,
    canAutoApprove: isValid && canAutoApprove,
    reasons,
    remainingQuota
  };
}
