import React from 'react';
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  XCircle,
  BookOpen,
  ArrowRight,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  UserCheck,
  Users,
  Calendar,
  Check,
  Phone
} from 'lucide-react';
import { Course, StudentSubmission, ActivityEvent, CrossClassAttendance } from '../types';

interface DashboardViewProps {
  courses: Course[];
  submissions: StudentSubmission[];
  crossClassAttendances: CrossClassAttendance[];
  activityLogs: ActivityEvent[];
  onOpenSubmissionModal: () => void;
  onOpenRulesModal: () => void;
  onOpenCrossClassModal: () => void;
  onNavigateToDirectory: (statusFilter?: string) => void;
  onNavigateToCrossClass: () => void;
  onOpenAuditModal: (submission: StudentSubmission) => void;
  onApproveCrossClassAttendance: (attId: string) => void;
  onRejectCrossClassAttendance: (attId: string, reason?: string) => void;
  onBatchAutoVerify: () => void;
  onSimulateIncomingSubmission: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  courses,
  submissions,
  crossClassAttendances,
  activityLogs,
  onOpenSubmissionModal,
  onOpenRulesModal,
  onOpenCrossClassModal,
  onNavigateToDirectory,
  onNavigateToCrossClass,
  onOpenAuditModal,
  onApproveCrossClassAttendance,
  onRejectCrossClassAttendance,
  onBatchAutoVerify,
  onSimulateIncomingSubmission
}) => {
  // Compute metrics
  const totalCourses = courses.length;
  const verifiedPjmkCount = submissions.filter(s => s.verificationStatus === 'VERIFIED').length;
  const pendingPjmkCount = submissions.filter(s => s.verificationStatus === 'PENDING').length;

  const coursesWithAssignedPjmk = courses.filter(c => {
    const subUtama = submissions.find(s => s.id === c.pjmkUtamaSubmissionId);
    return subUtama && subUtama.verificationStatus === 'VERIFIED';
  }).length;

  const readinessPercentage = totalCourses > 0
    ? Math.round((coursesWithAssignedPjmk / totalCourses) * 100)
    : 0;

  // Cross class attendance metrics
  const totalCrossClass = crossClassAttendances.length;
  const approvedCrossClass = crossClassAttendances.filter(a => a.approvalStatus === 'APPROVED').length;
  const pendingCrossClass = crossClassAttendances.filter(a => a.approvalStatus === 'PENDING').length;
  const rejectedCrossClass = crossClassAttendances.filter(a => a.approvalStatus === 'REJECTED').length;

  // Pending cross class items for quick action
  const urgentCrossClass = crossClassAttendances
    .filter(a => a.approvalStatus === 'PENDING')
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Hero Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-700">Tahun Akademik 2026/2027</span>
              <span aria-hidden="true">·</span>
              <span>Koordinasi Angkatan Kuliah</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sistem Aktif Real-Time
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard Monitoring Presensi Lintas Kelas & PJMK
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl">
              Pusat monitoring dan verifikasi mahasiswa pindah/lintas kelas sementara antar-kelas kuliah.
              Memfasilitasi koordinasi langsung antara <strong>Mahasiswa Lintas</strong>, <strong>Penanggung Jawab Mata Kuliah (PJMK)</strong>, dan <strong>Ketua Mahasiswa</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenCrossClassModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>+ Isi Absen Lintas Kelas</span>
            </button>
            <button
              onClick={onSimulateIncomingSubmission}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Simulasikan ada presensi lintas kelas baru yang masuk"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulasi Presensi Masuk</span>
            </button>
          </div>
        </div>

        {/* Readiness Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Kesiapan Penunjukan Narahubung PJMK Kelas
            </span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {coursesWithAssignedPjmk} dari {totalCourses} Kelas Memiliki PJMK ({readinessPercentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${readinessPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* KPI 5 Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Presensi Lintas */}
        <div
          onClick={onNavigateToCrossClass}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Presensi Lintas</span>
            <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{totalCrossClass}</span>
            <span className="text-xs text-slate-500">Mahasiswa</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 truncate">Total izin pindah kelas</p>
        </div>

        {/* Card 2: Disetujui Hadir */}
        <div
          onClick={onNavigateToCrossClass}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Disetujui Hadir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">{approvedCrossClass}</span>
            <span className="text-xs text-slate-500">Mahasiswa</span>
          </div>
          <p className="mt-1 text-xs text-emerald-700 truncate">Dikonfirmasi PJMK / Ketua</p>
        </div>

        {/* Card 3: Menunggu Konfirmasi */}
        <div
          onClick={onNavigateToCrossClass}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Antrean Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-600">{pendingCrossClass}</span>
            <span className="text-xs text-slate-500">Menunggu</span>
          </div>
          <p className="mt-1 text-xs text-amber-700 truncate">Perlu tindakan PJMK</p>
        </div>

        {/* Card 4: Kelas Kuliah Terdaftar */}
        <div
          onClick={() => onNavigateToDirectory('ALL')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kelas Terdaftar</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{totalCourses}</span>
            <span className="text-xs text-slate-500">Kelas</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 truncate">Kelas di angkatan aktif</p>
        </div>

        {/* Card 5: PJMK Resmi */}
        <div
          onClick={() => onNavigateToDirectory('VERIFIED')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">PJMK Resmi Aktif</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-600">{verifiedPjmkCount}</span>
            <span className="text-xs text-slate-500">PJMK</span>
          </div>
          <p className="mt-1 text-xs text-blue-700 truncate">Narahubung terverifikasi</p>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols wide on desktop): Urgent Cross-Class Submissions & Class Flow */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Urgent Cross-Class Queue */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                  Antrean Presensi Lintas Kelas Menunggu Konfirmasi
                </h2>
                <p className="text-xs text-slate-500">
                  Mahasiswa yang telah mengisi formulir absen pindah kelas dan menunggu persetujuan kehadiran oleh PJMK atau Ketua Mahasiswa
                </p>
              </div>
              <button
                onClick={onNavigateToCrossClass}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Buka Presensi Lintas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {urgentCrossClass.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-medium text-slate-800">Semua Presensi Lintas Kelas Telah Dikonfirmasi</p>
                <p className="text-xs text-slate-500 mt-1">Tidak ada antrean mahasiswa yang menunggu persetujuan hadir.</p>
                <button
                  onClick={onOpenCrossClassModal}
                  className="mt-4 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer"
                >
                  + Tambah Presensi Lintas Kelas
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {urgentCrossClass.map((att) => {
                  const course = courses.find(c => c.id === att.courseId);
                  return (
                    <div key={att.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900">
                            {att.studentName}
                          </span>
                          <span className="font-mono text-xs text-slate-500">
                            ({att.nim})
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {att.originClass} → {att.targetClass}
                          </span>
                          <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                            Menunggu Konfirmasi
                          </span>
                        </div>

                        <div className="mt-1.5 text-xs text-slate-600 space-y-0.5">
                          <div className="flex items-center gap-2 text-slate-500">
                            <span className="font-medium text-slate-800">{course?.code} - {course?.name}</span>
                            <span aria-hidden="true">·</span>
                            <span>{att.meetingSession}</span>
                            <span aria-hidden="true">·</span>
                            <span>{att.meetingDate}</span>
                          </div>
                          <p className="text-slate-600 italic">
                            &quot;{att.reason}&quot;
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => onApproveCrossClassAttendance(att.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Konfirmasi Hadir</span>
                        </button>
                        <button
                          onClick={() => onRejectCrossClassAttendance(att.id)}
                          className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Monitoring Kuota & Sesi Perkuliahan */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Status Kuota Mahasiswa Lintas per Kelas
                </h2>
                <p className="text-xs text-slate-500">
                  Pemantauan kapasitas penerimaan mahasiswa lintas untuk menjaga kenyamanan ruang kelas kuliah
                </p>
              </div>
              <button
                onClick={onOpenRulesModal}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Atur Batas Kuota</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {courses.map((course) => {
                const subUtama = submissions.find(s => s.id === course.pjmkUtamaSubmissionId);
                const activeCrossClass = crossClassAttendances.filter(
                  a => a.courseId === course.id && a.approvalStatus === 'APPROVED'
                ).length;
                const quota = course.maxCrossClassQuota || 8;
                const percentage = Math.min(100, Math.round((activeCrossClass / quota) * 100));

                return (
                  <div key={course.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="font-semibold text-slate-900 truncate pr-2">
                        {course.code} ({course.classSection})
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-700 tabular-nums shrink-0">
                        {activeCrossClass} / {quota} Mahasiswa
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2 truncate">
                      {course.name} · PJMK: {subUtama ? subUtama.student.fullName : 'Belum Ada'}
                    </p>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentage >= 100
                            ? 'bg-rose-500'
                            : percentage >= 75
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide on desktop): Real-Time Activity Stream & Guidelines */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Live Audit Feed
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                Real-Time
              </span>
            </div>

            <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {activityLogs.map((log) => {
                let badgeColor = 'text-slate-600 bg-slate-100';
                if (log.type === 'VERIFICATION_SUCCESS') badgeColor = 'text-emerald-700 bg-emerald-50';
                if (log.type === 'CROSS_CLASS_ATTENDANCE') badgeColor = 'text-indigo-700 bg-indigo-50';
                if (log.type === 'VERIFICATION_FAILED') badgeColor = 'text-rose-700 bg-rose-50';
                if (log.type === 'NEW_SUBMISSION') badgeColor = 'text-blue-700 bg-blue-50';

                return (
                  <div key={log.id} className="relative pl-4 pb-4 border-l-2 border-slate-200 last:border-l-0 last:pb-0">
                    <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-600"></span>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-medium text-slate-600">{log.courseCode}</span>
                      <span className="font-mono tabular-nums">{log.timestamp}</span>
                    </div>
                    <p className={`text-xs font-semibold ${badgeColor} inline-block px-1.5 py-0.5 rounded mb-1`}>
                      {log.title}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {log.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                onClick={onOpenCrossClassModal}
                className="w-full py-2 px-3 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              >
                + Isi Presensi Lintas Kelas Baru
              </button>
            </div>
          </div>

          {/* Quick Notice Card: SOP Koordinasi */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>SOP Mahasiswa Lintas Kelas & PJMK</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
              <li>Mahasiswa yang ingin pindah kelas sementara wajib mengisi presensi ini sebelum atau saat sesi dimulai.</li>
              <li>Wajib menyertakan Nama, NIM, Asal Kelas, serta alasan perpindahan yang jelas.</li>
              <li>PJMK kelas tujuan memverifikasi ketersediaan kuota dan mencatat kehadiran.</li>
              <li>Ketua Mahasiswa memegang otoritas supervisi dan rekapitulasi presensi lintas angkatan.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
