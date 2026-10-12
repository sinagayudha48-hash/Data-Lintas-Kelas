import React, { useState, useEffect } from 'react';
import { Header, UserRole } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DirectoryView } from './components/DirectoryView';
import { CrossClassAttendanceView } from './components/CrossClassAttendanceView';
import { SubmissionFormModal } from './components/SubmissionFormModal';
import { VerificationDetailModal } from './components/VerificationDetailModal';
import { RulesSettingsModal } from './components/RulesSettingsModal';
import { StudentTrackingModal } from './components/StudentTrackingModal';
import { CrossClassAttendanceModal } from './components/CrossClassAttendanceModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { Course, StudentSubmission, ActivityEvent, VerificationRuleConfig, CrossClassAttendance } from './types';
import { INITIAL_COURSES, INITIAL_SUBMISSIONS, INITIAL_ACTIVITY_LOGS, INITIAL_CROSS_CLASS_ATTENDANCES } from './data/initialData';
import { evaluateStudentSubmission, DEFAULT_RULES } from './utils/verificationEngine';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('STUDENT');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('admin123');

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_SUBMISSIONS);
  const [crossClassAttendances, setCrossClassAttendances] = useState<CrossClassAttendance[]>(INITIAL_CROSS_CLASS_ATTENDANCES);
  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>(INITIAL_ACTIVITY_LOGS);
  const [ruleConfig, setRuleConfig] = useState<VerificationRuleConfig>(DEFAULT_RULES);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'directory' | 'rules' | 'crossClass'>('directory');
  const [directoryStatusFilter, setDirectoryStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [submissionModalCourseId, setSubmissionModalCourseId] = useState<string | undefined>(undefined);
  const [isCrossClassModalOpen, setIsCrossClassModalOpen] = useState(false);

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedAuditSubmission, setSelectedAuditSubmission] = useState<StudentSubmission | null>(null);

  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Real-time live simulation toggle
  const [isRealtimeActive, setIsRealtimeActive] = useState(true);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminAuthModalOpen(false);
    setUserRole('ADMIN');
    setActiveTab('dashboard');
    showToast('Berhasil terautentikasi! Selamat datang di Mode Pengurus (PJMK & Ketua Mahasiswa).', 'success');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setUserRole('STUDENT');
    setActiveTab('directory');
    showToast('Akses pengurus telah dikunci. Anda beralih ke Mode Mahasiswa / Anggota.', 'info');
  };

  const handleUpdateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    showToast('Kata sandi pengurus berhasil diperbarui.', 'success');
  };

  const handleCreateCrossClassAttendance = (
    attData: Omit<CrossClassAttendance, 'id' | 'submittedAt' | 'verifiedAt' | 'verifiedBy'>
  ) => {
    const newId = `att-${Date.now()}`;
    const newAttendance: CrossClassAttendance = {
      ...attData,
      id: newId,
      submittedAt: new Date().toISOString(),
      verifiedAt: null,
      verifiedBy: null
    };

    setCrossClassAttendances(prev => [newAttendance, ...prev]);

    const targetCourse = courses.find(c => c.id === attData.courseId);
    const newLog: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      title: 'Presensi Lintas Kelas Masuk',
      description: `${attData.studentName} (${attData.nim}) mengisi absen pindah dari ${attData.originClass} ke ${attData.targetClass} untuk ${targetCourse?.name || 'Mata Kuliah'}.`,
      type: 'CROSS_CLASS_ATTENDANCE',
      courseCode: targetCourse?.code || 'LINTAS',
      studentName: attData.studentName
    };
    setActivityLogs(prev => [newLog, ...prev]);

    showToast(`Presensi pindah kelas ${attData.studentName} (${attData.originClass} → ${attData.targetClass}) berhasil dicatat.`, 'success');
  };

  const handleApproveCrossClassAttendance = (attId: string) => {
    const target = crossClassAttendances.find(a => a.id === attId);
    if (!target) return;

    setCrossClassAttendances(prev =>
      prev.map(a =>
        a.id === attId
          ? {
              ...a,
              approvalStatus: 'APPROVED',
              verifiedAt: new Date().toISOString(),
              verifiedBy: 'PJMK / Ketua Mahasiswa',
              verificationNotes: 'Dikonfirmasi hadir dalam sesi perkuliahan.'
            }
          : a
      )
    );

    const newLog: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      title: 'Kehadiran Lintas Kelas Dikonfirmasi',
      description: `Presensi ${target.studentName} (${target.originClass} → ${target.targetClass}) telah diverifikasi hadir oleh Pengurus.`,
      type: 'VERIFICATION_SUCCESS',
      courseCode: 'LINTAS',
      studentName: target.studentName
    };
    setActivityLogs(prev => [newLog, ...prev]);
    showToast(`Kehadiran lintas kelas ${target.studentName} disetujui.`, 'success');
  };

  const handleRejectCrossClassAttendance = (attId: string, reason?: string) => {
    const target = crossClassAttendances.find(a => a.id === attId);
    if (!target) return;

    setCrossClassAttendances(prev =>
      prev.map(a =>
        a.id === attId
          ? {
              ...a,
              approvalStatus: 'REJECTED',
              verifiedAt: new Date().toISOString(),
              verifiedBy: 'PJMK / Ketua Mahasiswa',
              verificationNotes: reason || 'Tidak terkonfirmasi hadir dalam sesi kelas.'
            }
          : a
      )
    );

    showToast(`Presensi lintas kelas ${target.studentName} ditolak.`, 'error');
  };

  // Real-time periodic heartbeat simulation (runs every 25 seconds if active, adds subtle realistic updates)
  useEffect(() => {
    if (!isRealtimeActive) return;

    const interval = setInterval(() => {
      // Periodic check on any pending submissions or heartbeat
      const pending = submissions.filter(s => s.verificationStatus === 'PENDING');
      if (pending.length > 0 && Math.random() > 0.6) {
        // Automatically auto-verify the first pending
        const target = pending[0];
        const course = courses.find(c => c.id === target.courseId);
        if (course && target.autoVerificationResult?.passed) {
          handleQuickApprove(target.id, true);
        }
      }
    }, 22000);

    return () => clearInterval(interval);
  }, [isRealtimeActive, submissions, courses]);

  // Handler: Add new submission
  const handleCreateSubmission = (
    newSubData: Omit<StudentSubmission, 'id' | 'submittedAt'>
  ) => {
    const newId = `sub-${Date.now()}`;
    const newSubmission: StudentSubmission = {
      ...newSubData,
      id: newId,
      submittedAt: new Date().toISOString()
    };

    setSubmissions(prev => [newSubmission, ...prev]);

    // If verified, update the course PJMK link
    const targetCourse = courses.find(c => c.id === newSubData.courseId);
    if (newSubData.verificationStatus === 'VERIFIED') {
      setCourses(prev =>
        prev.map(c => {
          if (c.id === newSubData.courseId) {
            if (newSubData.role === 'PJMK_UTAMA') {
              return { ...c, pjmkUtamaSubmissionId: newId };
            } else {
              return { ...c, pjmkPendampingSubmissionId: newId };
            }
          }
          return c;
        })
      );
    } else if (targetCourse && !targetCourse.pjmkUtamaSubmissionId && newSubData.role === 'PJMK_UTAMA') {
      // Even if pending/manual review, link it so it shows in the table
      setCourses(prev =>
        prev.map(c => (c.id === newSubData.courseId ? { ...c, pjmkUtamaSubmissionId: newId } : c))
      );
    }

    // Add activity log
    const eventType =
      newSubData.verificationStatus === 'VERIFIED'
        ? 'VERIFICATION_SUCCESS'
        : newSubData.verificationStatus === 'REJECTED'
        ? 'VERIFICATION_FAILED'
        : 'NEW_SUBMISSION';

    const newLog: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      title:
        newSubData.verificationStatus === 'VERIFIED'
          ? 'Lolos Verifikasi Otomatis (100%)'
          : newSubData.verificationStatus === 'REJECTED'
          ? 'Ditolak Otomatis Sistem'
          : 'Pengajuan Baru Masuk',
      description: `${newSubData.student.fullName} (${newSubData.student.nim}) diajukan untuk ${targetCourse?.code || 'MK'}: ${newSubData.autoVerificationResult?.summaryReason}`,
      type: eventType,
      courseCode: targetCourse?.code || 'MK',
      studentName: newSubData.student.fullName
    };

    setActivityLogs(prev => [newLog, ...prev]);
    showToast(
      `Pengajuan ${newSubData.student.fullName} berhasil diproses (${newSubData.verificationStatus}).`,
      newSubData.verificationStatus === 'VERIFIED' ? 'success' : 'info'
    );
  };

  // Handler: Quick approve
  const handleQuickApprove = (submissionId: string, isAutomated = false) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    const course = courses.find(c => c.id === sub.courseId);

    setSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? {
              ...s,
              verificationStatus: 'VERIFIED',
              verifiedAt: new Date().toISOString(),
              verifiedBy: isAutomated ? 'SISTEM_OTOMATIS' : 'KETUA_MAHASISWA',
              manualNotes: isAutomated ? 'Diverifikasi otomatis oleh engine.' : 'Disetujui manual oleh Ketua Mahasiswa.'
            }
          : s
      )
    );

    // Update course assignment
    setCourses(prev =>
      prev.map(c => {
        if (c.id === sub.courseId) {
          if (sub.role === 'PJMK_UTAMA') {
            return { ...c, pjmkUtamaSubmissionId: sub.id };
          } else {
            return { ...c, pjmkPendampingSubmissionId: sub.id };
          }
        }
        return c;
      })
    );

    // Log
    const newLog: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      title: isAutomated ? 'Verifikasi Otomatis Berhasil' : 'Persetujuan Ketua Mahasiswa',
      description: `${sub.student.fullName} resmi disetujui sebagai PJMK untuk ${course?.code} - ${course?.name}.`,
      type: 'VERIFICATION_SUCCESS',
      courseCode: course?.code || 'MK',
      studentName: sub.student.fullName
    };
    setActivityLogs(prev => [newLog, ...prev]);

    if (!isAutomated) {
      showToast(`${sub.student.fullName} berhasil disetujui sebagai PJMK resmi.`);
    }
  };

  // Handler: Quick reject
  const handleQuickReject = (submissionId: string, reason?: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    const course = courses.find(c => c.id === sub.courseId);

    setSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? {
              ...s,
              verificationStatus: 'REJECTED',
              verifiedAt: new Date().toISOString(),
              verifiedBy: 'KETUA_MAHASISWA',
              manualNotes: reason || 'Ditolak: Tidak memenuhi kriteria penugasan.'
            }
          : s
      )
    );

    // Log
    const newLog: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      title: 'Pengajuan Ditolak',
      description: `Pengajuan ${sub.student.fullName} untuk ${course?.code} ditolak. Alasan: ${reason || 'Kriteria tidak terpenuhi'}.`,
      type: 'VERIFICATION_FAILED',
      courseCode: course?.code || 'MK',
      studentName: sub.student.fullName
    };
    setActivityLogs(prev => [newLog, ...prev]);
    showToast(`Pengajuan ${sub.student.fullName} ditolak.`, 'error');
  };

  // Handler: Batch Auto-Verify for all Pending items
  const handleBatchAutoVerify = () => {
    const pendingItems = submissions.filter(s => s.verificationStatus === 'PENDING');
    if (pendingItems.length === 0) {
      showToast('Tidak ada antrean pending untuk diverifikasi.', 'info');
      return;
    }

    let approvedCount = 0;
    let manualCount = 0;
    let rejectedCount = 0;

    const updatedSubmissions = submissions.map(sub => {
      if (sub.verificationStatus !== 'PENDING') return sub;

      const course = courses.find(c => c.id === sub.courseId);
      if (!course) return sub;

      const evalResult = evaluateStudentSubmission(sub.student, course, submissions, ruleConfig, sub.id);

      if (evalResult.recommendation === 'AUTO_APPROVE') {
        approvedCount++;
        return {
          ...sub,
          verificationStatus: 'VERIFIED' as const,
          autoVerificationResult: evalResult,
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'SISTEM_OTOMATIS' as const,
          manualNotes: 'Lolos audit otomatis massal.'
        };
      } else if (evalResult.recommendation === 'FLAG_FOR_PJMK') {
        manualCount++;
        return {
          ...sub,
          verificationStatus: 'MANUAL_REVIEW' as const,
          autoVerificationResult: evalResult
        };
      } else {
        rejectedCount++;
        return {
          ...sub,
          verificationStatus: 'REJECTED' as const,
          autoVerificationResult: evalResult,
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'SISTEM_OTOMATIS' as const
        };
      }
    });

    setSubmissions(updatedSubmissions);

    // Update course references
    setCourses(prev =>
      prev.map(c => {
        const approvedSub = updatedSubmissions.find(
          s => s.courseId === c.id && s.verificationStatus === 'VERIFIED' && s.role === 'PJMK_UTAMA'
        );
        return approvedSub ? { ...c, pjmkUtamaSubmissionId: approvedSub.id } : c;
      })
    );

    const log: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      title: 'Auto-Verification Massal Selesai',
      description: `Memproses ${pendingItems.length} berkas: ${approvedCount} Disetujui, ${manualCount} Perlu Review, ${rejectedCount} Ditolak.`,
      type: 'VERIFICATION_SUCCESS',
      courseCode: 'BATCH',
      studentName: 'Sistem'
    };
    setActivityLogs(prev => [log, ...prev]);

    showToast(`Verifikasi massal selesai: ${approvedCount} disetujui otomatis.`, 'success');
  };

  // Handler: Re-evaluate single submission
  const handleReevaluateSubmission = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;
    const course = courses.find(c => c.id === sub.courseId);
    if (!course) return;

    const freshEvaluation = evaluateStudentSubmission(sub.student, course, submissions, ruleConfig, sub.id);

    setSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? {
              ...s,
              autoVerificationResult: freshEvaluation
            }
          : s
      )
    );

    if (selectedAuditSubmission && selectedAuditSubmission.id === submissionId) {
      setSelectedAuditSubmission({
        ...selectedAuditSubmission,
        autoVerificationResult: freshEvaluation
      });
    }

    showToast(`Audit ulang selesai: Skor kepatuhan ${freshEvaluation.score}%.`, 'info');
  };

  // Handler: Save Rule Config and re-audit all
  const handleSaveRules = (newRules: VerificationRuleConfig) => {
    setRuleConfig(newRules);

    // Re-evaluate all submissions with new rules
    const reaudited = submissions.map(sub => {
      const course = courses.find(c => c.id === sub.courseId);
      if (!course) return sub;
      const result = evaluateStudentSubmission(sub.student, course, submissions, newRules, sub.id);
      return {
        ...sub,
        autoVerificationResult: result
      };
    });

    setSubmissions(reaudited);

    const log: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      title: 'Aturan Koordinasi Diperbarui',
      description: `Batas kuota lintas kelas: ${newRules.maxCrossClassQuotaPerSession} mhs/sesi, batas lintas: ${newRules.maxCrossClassPerStudentPerSemester}x. Seluruh data dievaluasi ulang.`,
      type: 'SYSTEM_RECHECK',
      courseCode: 'CONFIG',
      studentName: 'Pengurus'
    };
    setActivityLogs(prev => [log, ...prev]);
    showToast('Aturan kuota dan koordinasi diperbarui dan diterapkan ke seluruh data.', 'success');
  };

  // Simulate an incoming submission (for instant tester review)
  const handleSimulateIncomingSubmission = () => {
    // 70% chance to simulate a cross-class attendance, 30% for PJMK candidate
    const simulateCrossClass = Math.random() > 0.3;

    if (simulateCrossClass) {
      const studentNames = [
        'Daffa Al-Farizi',
        'Zahra Nur Salsabila',
        'Bayu Wicaksono',
        'Citra Anindita',
        'Aldi Firmansyah',
        'Syifa Maharani'
      ];
      const randomName = studentNames[Math.floor(Math.random() * studentNames.length)];
      const randomNim = `26140${Math.floor(1000 + Math.random() * 9000)}`;
      const origins = ['IF26A', 'IF26B', 'IF26C', 'IF26D'];
      const originClass = origins[Math.floor(Math.random() * origins.length)];
      
      const targetCourse = courses[Math.floor(Math.random() * courses.length)];
      const targetClass = targetCourse.classSection || 'IF26E';
      
      const reasons = [
        'Bentrok dengan jadwal kegiatan praktikum pengganti. Sudah konfirmasi ke KM Nadya.',
        'Dispensasi mewakili tim lomba tingkat universitas pada jadwal kelas asal.',
        'Izin keperluan mendesak, mengikuti materi perkuliahan di IF26E.',
        'Mengejar materi perkuliahan yang tertinggal karena sakit.'
      ];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];

      handleCreateCrossClassAttendance({
        courseId: targetCourse.id,
        studentName: randomName,
        nim: randomNim,
        originClass: originClass === targetClass ? 'IF26A' : originClass,
        targetClass,
        phone: `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
        meetingDate: new Date().toISOString().slice(0, 10),
        meetingSession: 'Pertemuan 6 - Materi Perkuliahan',
        reason,
        approvalStatus: 'PENDING',
        verificationNotes: 'Menunggu konfirmasi kehadiran oleh PJMK atau Ketua Mahasiswa IF26E.',
        hasConfirmedKM: true
      });
      return;
    }

    // Otherwise simulate a PJMK candidate
    const candidateCourses = courses.filter(c => !c.pjmkUtamaSubmissionId);
    const targetCourse = candidateCourses.length > 0 ? candidateCourses[0] : courses[Math.floor(Math.random() * courses.length)];

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const studentNames = [
      'Gita Permata Sari',
      'Farhan Maulana',
      'Annisa Rahmadani',
      'Yusuf Hendrawan',
      'Clara Vania Putri',
      'Rian Hidayatullah'
    ];
    const pickedName = studentNames[Math.floor(Math.random() * studentNames.length)];

    const studentData = {
      fullName: pickedName,
      nim: `22140${randomNum}`,
      department: targetCourse.department,
      classOrigin: targetCourse.classSection,
      phone: `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `${pickedName.toLowerCase().replace(/\s+/g, '.')}@mhs.univ.ac.id`,
      experienceNotes: 'Siap mengoordinasikan jadwal dosen dan presensi mahasiswa lintas kelas.'
    };

    const evalResult = evaluateStudentSubmission(studentData, targetCourse, submissions, ruleConfig);

    let initialStatus: StudentSubmission['verificationStatus'] = 'PENDING';
    let verifiedBy: StudentSubmission['verifiedBy'] = null;
    let verifiedAt: string | null = null;

    if (evalResult.recommendation === 'AUTO_APPROVE') {
      initialStatus = 'VERIFIED';
      verifiedBy = 'SISTEM_OTOMATIS';
      verifiedAt = new Date().toISOString();
    } else if (evalResult.recommendation === 'FLAG_FOR_PJMK') {
      initialStatus = 'MANUAL_REVIEW';
    } else {
      initialStatus = 'REJECTED';
      verifiedBy = 'SISTEM_OTOMATIS';
      verifiedAt = new Date().toISOString();
    }

    handleCreateSubmission({
      courseId: targetCourse.id,
      role: 'PJMK_UTAMA',
      student: studentData,
      verificationStatus: initialStatus,
      autoVerificationResult: evalResult,
      verifiedAt,
      verifiedBy,
      manualNotes: evalResult.summaryReason
    });
  };

  const pendingSubmissionsCount = submissions.filter(s => s.verificationStatus === 'PENDING').length;
  const pendingCrossClassCount = crossClassAttendances.filter(a => a.approvalStatus === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Header */}
      <Header
        userRole={userRole}
        setUserRole={setUserRole}
        isAdminAuthenticated={isAdminAuthenticated}
        onPromptAdminAuth={() => setIsAdminAuthModalOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSubmissionModal={() => {
          setSubmissionModalCourseId(undefined);
          setIsSubmissionModalOpen(true);
        }}
        onOpenRulesModal={() => setIsRulesModalOpen(true)}
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
        onOpenCrossClassModal={() => setIsCrossClassModalOpen(true)}
        onBatchAutoVerify={handleBatchAutoVerify}
        pendingCount={pendingSubmissionsCount}
        pendingCrossClassCount={pendingCrossClassCount}
        isRealtimeActive={isRealtimeActive}
        onToggleRealtime={() => {
          setIsRealtimeActive(!isRealtimeActive);
          showToast(`Live update real-time: ${!isRealtimeActive ? 'Diaktifkan' : 'Dinonaktifkan'}`, 'info');
        }}
      />

      {/* Role Context Notification Banner */}
      {userRole === 'STUDENT' ? (
        <div className="bg-indigo-50 border-b border-indigo-100 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-950 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>
                <strong>Mode Mahasiswa / Anggota Kelas:</strong> Anda dapat melihat kontak WhatsApp PJMK, tautan grup kelas, serta mengisi <strong>Presensi Pindah/Lintas Kelas Sementara</strong> jika jadwal Anda berhalangan.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsCrossClassModalOpen(true)}
                className="text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                + Isi Absen Lintas Kelas
              </button>
              <button
                onClick={() => setIsTrackingModalOpen(true)}
                className="text-indigo-700 font-semibold hover:underline cursor-pointer"
              >
                Lacak Status PJMK (NIM) →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border-b border-emerald-100 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>
                <strong>Mode Pengurus Aktif (PJMK & Ketua Mahasiswa):</strong> Anda memiliki otorisasi penuh untuk menyetujui kehadiran mahasiswa lintas dan mengelola penetapan PJMK kelas.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('crossClass')}
                className="text-xs font-semibold text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Periksa Presensi Lintas ({pendingCrossClassCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            courses={courses}
            submissions={submissions}
            crossClassAttendances={crossClassAttendances}
            activityLogs={activityLogs}
            onOpenSubmissionModal={() => {
              setSubmissionModalCourseId(undefined);
              setIsSubmissionModalOpen(true);
            }}
            onOpenRulesModal={() => setIsRulesModalOpen(true)}
            onOpenCrossClassModal={() => setIsCrossClassModalOpen(true)}
            onNavigateToDirectory={(filter) => {
              setDirectoryStatusFilter(filter || 'ALL');
              setActiveTab('directory');
            }}
            onNavigateToCrossClass={() => setActiveTab('crossClass')}
            onOpenAuditModal={(sub) => {
              setSelectedAuditSubmission(sub);
              setIsAuditModalOpen(true);
            }}
            onApproveCrossClassAttendance={handleApproveCrossClassAttendance}
            onRejectCrossClassAttendance={handleRejectCrossClassAttendance}
            onBatchAutoVerify={handleBatchAutoVerify}
            onSimulateIncomingSubmission={handleSimulateIncomingSubmission}
          />
        )}

        {activeTab === 'directory' && (
          <DirectoryView
            courses={courses}
            submissions={submissions}
            userRole={userRole}
            statusFilterParam={directoryStatusFilter}
            onOpenAuditModal={(sub) => {
              setSelectedAuditSubmission(sub);
              setIsAuditModalOpen(true);
            }}
            onOpenSubmissionModalForCourse={(cId) => {
              setSubmissionModalCourseId(cId);
              setIsSubmissionModalOpen(true);
            }}
            onOpenCrossClassModalForCourse={(cId) => {
              setIsCrossClassModalOpen(true);
            }}
            onQuickApprove={(id) => handleQuickApprove(id, false)}
            onQuickReject={(id) => handleQuickReject(id, 'Ditolak cepat melalui direktori.')}
          />
        )}

        {activeTab === 'crossClass' && (
          <CrossClassAttendanceView
            attendances={crossClassAttendances}
            courses={courses}
            userRole={userRole}
            onOpenModal={() => setIsCrossClassModalOpen(true)}
            onApproveAttendance={handleApproveCrossClassAttendance}
            onRejectAttendance={handleRejectCrossClassAttendance}
          />
        )}

        {activeTab === 'rules' && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-2xl mx-auto shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Mesin Verifikasi Aturan Akademik</h2>
            <p className="text-sm text-slate-600">
              Sistem mengeksekusi validasi otomatis berlandaskan standar akademik universitas.
              Klik tombol di bawah untuk membuka panel pengaturan parameter.
            </p>
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              Buka Konfigurasi Parameter
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong>SIM-PJMK & Presensi Lintas Kelas IF26E</strong> · Koordinasi Mahasiswa Lintas, PJMK & Ketua Mahasiswa
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span>KM: Nadya (085772921368)</span>
            <span aria-hidden="true">·</span>
            <span>Wakil KM: Yuda (081262582492)</span>
          </div>
        </div>
      </footer>

      {/* Submission Form Modal */}
      <SubmissionFormModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        courses={courses}
        existingSubmissions={submissions}
        ruleConfig={ruleConfig}
        initialCourseId={submissionModalCourseId}
        onSubmit={handleCreateSubmission}
      />

      {/* Detailed Verification Audit Modal */}
      <VerificationDetailModal
        isOpen={isAuditModalOpen}
        submission={selectedAuditSubmission}
        courses={courses}
        allSubmissions={submissions}
        ruleConfig={ruleConfig}
        onClose={() => {
          setIsAuditModalOpen(false);
          setSelectedAuditSubmission(null);
        }}
        onApprove={(id, notes) => handleQuickApprove(id, false)}
        onReject={(id, reason) => handleQuickReject(id, reason)}
        onReevaluate={handleReevaluateSubmission}
      />

      {/* Rules Config Modal */}
      <RulesSettingsModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        currentRules={ruleConfig}
        onSaveRules={handleSaveRules}
        adminPassword={adminPassword}
        onUpdateAdminPassword={handleUpdateAdminPassword}
      />

      {/* Admin Authentication Password Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        currentPassword={adminPassword}
      />

      {/* Student Tracking Modal (Lacak Status Pengajuan dengan NIM) */}
      <StudentTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        submissions={submissions}
        courses={courses}
        onOpenSubmissionModal={() => {
          setSubmissionModalCourseId(undefined);
          setIsSubmissionModalOpen(true);
        }}
      />

      {/* Cross-Class Attendance Modal (Presensi Pindah Kelas Sementara) */}
      <CrossClassAttendanceModal
        isOpen={isCrossClassModalOpen}
        onClose={() => setIsCrossClassModalOpen(false)}
        courses={courses}
        onSubmit={handleCreateCrossClassAttendance}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-slate-900 text-white text-xs transition-all animate-in fade-in slide-in-from-bottom-2">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
