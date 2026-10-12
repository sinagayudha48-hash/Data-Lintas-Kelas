import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Phone,
  UserPlus,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Sparkles,
  Calendar,
  Building2,
  GraduationCap,
  ArrowRightLeft,
  Users,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { Course, StudentSubmission } from '../types';
import { CLASS_OFFICERS, COORDINATION_RULES } from '../data/initialData';

interface DirectoryViewProps {
  courses: Course[];
  submissions: StudentSubmission[];
  userRole?: 'ADMIN' | 'STUDENT';
  onOpenAuditModal: (submission: StudentSubmission) => void;
  onOpenSubmissionModalForCourse: (courseId: string) => void;
  onOpenCrossClassModalForCourse?: (courseId: string) => void;
  onQuickApprove: (submissionId: string) => void;
  onQuickReject: (submissionId: string) => void;
  statusFilterParam?: string;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  courses,
  submissions,
  userRole = 'ADMIN',
  onOpenAuditModal,
  onOpenSubmissionModalForCourse,
  onOpenCrossClassModalForCourse,
  onQuickApprove,
  onQuickReject,
  statusFilterParam = 'ALL'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(statusFilterParam);
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [isRulesExpanded, setIsRulesExpanded] = useState<boolean>(true);

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const subUtama = submissions.find((s) => s.id === course.pjmkUtamaSubmissionId);
    const subPendamping = submissions.find((s) => s.id === course.pjmkPendampingSubmissionId);

    // Search term check
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      course.name.toLowerCase().includes(term) ||
      course.code.toLowerCase().includes(term) ||
      course.lecturer.name.toLowerCase().includes(term) ||
      (subUtama && subUtama.student.fullName.toLowerCase().includes(term)) ||
      (subUtama && subUtama.student.nim.includes(term)) ||
      (subPendamping && subPendamping.student.fullName.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    // Status filter
    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'UNASSIGNED') {
        if (subUtama) return false;
      } else if (selectedStatus === 'VERIFIED') {
        if (!subUtama || subUtama.verificationStatus !== 'VERIFIED') return false;
      } else if (selectedStatus === 'PENDING') {
        if (!subUtama || subUtama.verificationStatus !== 'PENDING') return false;
      } else if (selectedStatus === 'MANUAL_REVIEW') {
        if (!subUtama || subUtama.verificationStatus !== 'MANUAL_REVIEW') return false;
      } else if (selectedStatus === 'REJECTED') {
        if (!subUtama || subUtama.verificationStatus !== 'REJECTED') return false;
      }
    }

    // Semester filter
    if (selectedSemester !== 'ALL' && course.semester.toString() !== selectedSemester) {
      return false;
    }

    // Department filter
    if (selectedDepartment !== 'ALL' && course.department !== selectedDepartment) {
      return false;
    }

    return true;
  });

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'Kode MK',
      'Nama Mata Kuliah',
      'Kelas',
      'Kuota Lintas Kelas',
      'Dosen Pengampu',
      'PJMK Utama',
      'NIM PJMK',
      'Asal Kelas PJMK',
      'No WA PJMK',
      'Status Verifikasi',
      'Skor Koordinasi (%)'
    ];

    const rows = filteredCourses.map((c) => {
      const sub = submissions.find((s) => s.id === c.pjmkUtamaSubmissionId);
      return [
        `"${c.code}"`,
        `"${c.name}"`,
        `"${c.classSection}"`,
        c.maxCrossClassQuota,
        `"${c.lecturer.name}"`,
        sub ? `"${sub.student.fullName}"` : '"Belum Ditunjuk"',
        sub ? `"${sub.student.nim}"` : '""',
        sub ? `"${sub.student.classOrigin}"` : '""',
        sub ? `"${sub.student.phone}"` : '""',
        sub ? `"${sub.verificationStatus}"` : '"UNASSIGNED"',
        sub?.autoVerificationResult?.score ?? 0
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_PJMK_IF26E_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Pengurus Kelas IF26E & Peraturan Koordinasi Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Struktur Kelas IF26E</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              DATA PENGURUS KELAS & KOORDINATOR MATA KULIAH IF26E
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Pusat koordinasi resmi antara Mahasiswa Lintas Kelas, Koordinator Mata Kuliah (PJMK), dan Ketua Mahasiswa
            </p>
          </div>

          {onOpenCrossClassModalForCourse && (
            <button
              onClick={() => onOpenCrossClassModalForCourse(courses[0]?.id || '')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>+ Isi Absen Lintas ke IF26E</span>
            </button>
          )}
        </div>

        {/* KM & Wakil KM Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {CLASS_OFFICERS.map((officer) => (
            <div
              key={officer.role}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 backdrop-blur-xs hover:bg-white/10 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                  👤 {officer.role}
                </span>
                <h4 className="text-base font-bold text-white">{officer.name}</h4>
                <p className="text-xs font-mono text-emerald-400 font-medium">📞 {officer.phone}</p>
                <p className="text-[11px] text-slate-400">{officer.notes}</p>
              </div>

              <a
                href={officer.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shrink-0 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat WA</span>
              </a>
            </div>
          ))}
        </div>

        {/* Note Konfirmasi & 7 Peraturan Koordinasi */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <button
            onClick={() => setIsRulesExpanded(!isRulesExpanded)}
            className="w-full flex items-center justify-between text-left text-xs font-semibold text-amber-300 hover:text-amber-200 cursor-pointer py-1"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>📌 NOTE KONFIRMASI & PERATURAN KOORDINASI KELAS IF26E (Wajib Dipatuhi)</span>
            </span>
            {isRulesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isRulesExpanded && (
            <div className="mt-3 bg-white/5 rounded-xl p-4 border border-white/10 space-y-2 text-xs text-slate-200">
              <p className="text-[11px] text-slate-300 italic mb-2">
                Teman-teman, apabila ingin menghubungi koordinator mata kuliah atau ada keperluan lintas kelas, mohon mengikuti ketentuan berikut:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed text-slate-200">
                {COORDINATION_RULES.map((rule, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="text-slate-100">{rule}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Header bar of Directory */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Direktori Koordinator Mata Kuliah (PJMK IF26E)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Daftar mata kuliah, nomor kontak PJMK resmi, jadwal perkuliahan, dan kuota mahasiswa lintas.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Unduh data dalam format CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Cetak Berita Acara Penetapan"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Cetak Berita Acara</span>
            </button>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama mata kuliah, dosen, nama PJMK (Faqih, Ujang, Asep, Winka, Rafa, Zahra, Deiva), atau nomor HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {[
              { id: 'ALL', label: 'Semua Status' },
              { id: 'VERIFIED', label: 'Terverifikasi' },
              { id: 'PENDING', label: 'Menunggu Verifikasi' },
              { id: 'MANUAL_REVIEW', label: 'Perlu Review Ketua' },
              { id: 'REJECTED', label: 'Ditolak' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedStatus === st.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('ALL');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Course List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">Tidak ada mata kuliah yang cocok</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau bersihkan filter status verifikasi.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Menampilkan <strong>{filteredCourses.length}</strong> mata kuliah IF26E</span>
            <span className="font-mono tabular-nums">Total: 7 Mata Kuliah</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredCourses.map((course) => {
              const subUtama = submissions.find((s) => s.id === course.pjmkUtamaSubmissionId);
              const subPendamping = submissions.find((s) => s.id === course.pjmkPendampingSubmissionId);

              return (
                <div
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Course & Schedule Details */}
                    <div className="space-y-2 lg:max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          Kelas {course.classSection}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
                          Kuota Lintas: {course.maxCrossClassQuota} Mhs
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {course.name}
                      </h3>

                      <div className="text-xs text-slate-500 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{course.schedule.day}, {course.schedule.time} ({course.schedule.room})</span>
                        </div>
                        <p className="text-slate-700">
                          Dosen: <strong className="font-medium text-slate-900">{course.lecturer.name}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Coordinator (PJMK Utama) Card */}
                    <div className="flex-1 bg-slate-50/80 border border-slate-100 rounded-lg p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 tracking-wider">
                          KOORDINATOR MATA KULIAH (PJMK)
                        </span>

                        {subUtama ? (
                          <div className="flex items-center gap-1.5">
                            {subUtama.verificationStatus === 'VERIFIED' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Terverifikasi Resmi
                              </span>
                            )}
                            {subUtama.verificationStatus === 'PENDING' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Menunggu Verifikasi
                              </span>
                            )}
                            {subUtama.verificationStatus === 'MANUAL_REVIEW' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                                <AlertTriangle className="w-3 h-3 text-blue-600" />
                                Review Ketua
                              </span>
                            )}
                            {subUtama.verificationStatus === 'REJECTED' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                Ditolak
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded">
                            Belum Ada PJMK
                          </span>
                        )}
                      </div>

                      {subUtama ? (
                        <div className="space-y-1.5">
                          <div className="flex items-baseline justify-between">
                            <h4 className="text-sm font-bold text-slate-900">
                              {subUtama.student.fullName}
                            </h4>
                            <span className="font-mono text-xs text-slate-500 tabular-nums">
                              NIM: {subUtama.student.nim}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                            <span>Kelas: <strong className="text-slate-800">{subUtama.student.classOrigin}</strong></span>
                            <span aria-hidden="true">·</span>
                            <a
                              href={`https://wa.me/62${subUtama.student.phone.replace(/[^0-9]/g, '').replace(/^0/, '')}?text=Halo%20PJMK%20${encodeURIComponent(subUtama.student.fullName)},%20saya%20ingin%20koordinasi%20mata%20kuliah%20${encodeURIComponent(course.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
                              title="Buka WhatsApp untuk koordinasi"
                            >
                              <Phone className="w-3 h-3" />
                              <span className="font-mono">{subUtama.student.phone}</span>
                            </a>
                          </div>

                          {subPendamping && (
                            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
                              <span className="text-slate-500 font-medium">Wakil PJMK:</span>
                              <span className="font-medium text-slate-800">{subPendamping.student.fullName}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-2 text-center">
                          <p className="text-xs text-slate-500">
                            Belum ada mahasiswa yang ditugaskan sebagai penanggung jawab kelas ini.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
                      {userRole === 'STUDENT' ? (
                        <>
                          {onOpenCrossClassModalForCourse && (
                            <button
                              onClick={() => onOpenCrossClassModalForCourse(course.id)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                              <span>Isi Absen Lintas Disini</span>
                            </button>
                          )}

                          {subUtama && (
                            <a
                              href={`https://wa.me/62${subUtama.student.phone.replace(/[^0-9]/g, '').replace(/^0/, '')}?text=Halo%20PJMK%20${encodeURIComponent(subUtama.student.fullName)},%20saya%20ingin%20koordinasi%20mata%20kuliah%20${encodeURIComponent(course.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Hubungi PJMK (WA)</span>
                            </a>
                          )}
                        </>
                      ) : (
                        <>
                          {subUtama ? (
                            <>
                              <button
                                onClick={() => onOpenAuditModal(subUtama)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Detail & Status PJMK</span>
                              </button>

                              {subUtama.verificationStatus !== 'VERIFIED' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => onQuickApprove(subUtama.id)}
                                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                                    title="Setujui penunjukan ini"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Setujui</span>
                                  </button>
                                  <button
                                    onClick={() => onQuickReject(subUtama.id)}
                                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                    title="Tolak pengajuan ini"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Tolak</span>
                                  </button>
                                </div>
                              )}

                              <button
                                onClick={() => onOpenSubmissionModalForCourse(course.id)}
                                className="text-[11px] text-slate-500 hover:text-indigo-600 text-center cursor-pointer py-1"
                              >
                                + Ubah / Ganti PJMK
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onOpenSubmissionModalForCourse(course.id)}
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-sm"
                            >
                              <UserPlus className="w-4 h-4" />
                              <span>Tetapkan PJMK Kelas</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
