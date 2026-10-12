import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  Plus,
  Phone,
  Check
} from 'lucide-react';
import { Course, CrossClassAttendance } from '../types';

interface CrossClassAttendanceViewProps {
  attendances: CrossClassAttendance[];
  courses: Course[];
  userRole: 'ADMIN' | 'STUDENT';
  onOpenModal: () => void;
  onApproveAttendance: (id: string) => void;
  onRejectAttendance: (id: string, reason?: string) => void;
}

export const CrossClassAttendanceView: React.FC<CrossClassAttendanceViewProps> = ({
  attendances,
  courses,
  userRole,
  onOpenModal,
  onApproveAttendance,
  onRejectAttendance
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');

  const filteredAttendances = attendances.filter((att) => {
    const course = courses.find((c) => c.id === att.courseId);
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      !term ||
      att.studentName.toLowerCase().includes(term) ||
      att.nim.includes(term) ||
      att.originClass.toLowerCase().includes(term) ||
      att.targetClass.toLowerCase().includes(term) ||
      (course && course.name.toLowerCase().includes(term)) ||
      (course && course.code.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (statusFilter !== 'ALL' && att.approvalStatus !== statusFilter) {
      return false;
    }

    if (courseFilter !== 'ALL' && att.courseId !== courseFilter) {
      return false;
    }

    return true;
  });

  // KPI counts
  const totalCount = attendances.length;
  const approvedCount = attendances.filter((a) => a.approvalStatus === 'APPROVED').length;
  const pendingCount = attendances.filter((a) => a.approvalStatus === 'PENDING').length;
  const rejectedCount = attendances.filter((a) => a.approvalStatus === 'REJECTED').length;

  const handleExportCSV = () => {
    const headers = [
      'NIM',
      'Nama Lengkap',
      'Asal Kelas',
      'Kelas Tujuan',
      'Mata Kuliah',
      'Tanggal Sesi',
      'Pertemuan',
      'Alasan Pindah Kelas',
      'No WhatsApp',
      'Status Presensi',
      'Diverifikasi Oleh'
    ];

    const rows = filteredAttendances.map((a) => {
      const c = courses.find((crs) => crs.id === a.courseId);
      return [
        `"${a.nim}"`,
        `"${a.studentName}"`,
        `"${a.originClass}"`,
        `"${a.targetClass}"`,
        `"${c ? `${c.code} - ${c.name}` : ''}"`,
        `"${a.meetingDate}"`,
        `"${a.meetingSession}"`,
        `"${a.reason}"`,
        `"${a.phone}"`,
        `"${a.approvalStatus}"`,
        `"${a.verifiedBy || ''}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Presensi_Lintas_Kelas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>Sistem Presensi Mahasiswa Angkatan</span>
              <span aria-hidden="true">·</span>
              <span>Koordinasi Mahasiswa Lintas & PJMK</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Presensi Mahasiswa Pindah / Lintas Kelas Sementara
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Fasilitas resmi bagi mahasiswa yang berhalangan di kelas asalnya dan sementara mengikuti perkuliahan di sesi kelas paralel lain.
              Setiap presensi divalidasi oleh PJMK kelas tujuan dan Ketua Mahasiswa.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={onOpenModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Isi Absen Pindah Kelas</span>
            </button>
          </div>
        </div>

        {/* 4 Mini KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Total Pengajuan</span>
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">{totalCount} Mahasiswa</span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-medium block">Dikonfirmasi Hadir</span>
            <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">{approvedCount} Mahasiswa</span>
          </div>
          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-100">
            <span className="text-[11px] text-amber-700 font-medium block">Menunggu Konfirmasi</span>
            <span className="text-xl font-bold font-mono text-amber-700 tabular-nums">{pendingCount} Mahasiswa</span>
          </div>
          <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-100">
            <span className="text-[11px] text-rose-700 font-medium block">Ditolak</span>
            <span className="text-xl font-bold font-mono text-rose-700 tabular-nums">{rejectedCount} Mahasiswa</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama mahasiswa, NIM, atau kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="APPROVED">Dikonfirmasi Hadir</option>
              <option value="PENDING">Menunggu Konfirmasi</option>
              <option value="REJECTED">Ditolak</option>
            </select>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Kelas Kuliah</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.classSection}
                </option>
              ))}
            </select>

            {(searchTerm || statusFilter !== 'ALL' || courseFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setCourseFilter('ALL');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 p-2 font-medium cursor-pointer"
                title="Reset filter"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attendance List */}
      {filteredAttendances.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <ArrowRightLeft className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">Tidak ada data presensi lintas kelas</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Belum ada mahasiswa yang mengajukan absensi pindah kelas dengan filter yang dipilih.
          </p>
          <button
            onClick={onOpenModal}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            + Isi Absen Lintas Kelas Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Menampilkan <strong>{filteredAttendances.length}</strong> catatan presensi lintas kelas</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredAttendances.map((att) => {
              const course = courses.find((c) => c.id === att.courseId);

              return (
                <div
                  key={att.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Student & Class Transition info */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {att.studentName}
                        </span>
                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                          ({att.nim})
                        </span>
                        {/* Class Movement Badge */}
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded">
                          <span className="font-semibold text-slate-700">{att.originClass}</span>
                          <span className="text-indigo-600">→</span>
                          <span className="font-bold text-indigo-700">{att.targetClass}</span>
                        </div>
                        {att.hasConfirmedKM && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ✓ Izin KM Terkonfirmasi
                          </span>
                        )}
                        {att.phone && (
                          <a
                            href={`https://wa.me/62${att.phone.replace(/[^0-9]/g, '').replace(/^0/, '')}?text=Halo%20${encodeURIComponent(att.studentName)},%20mengenai%20presensi%20lintas%20kelas%20ke%20${encodeURIComponent(att.targetClass)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100 transition-colors"
                            title="Chat WhatsApp Mahasiswa Lintas"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{att.phone}</span>
                          </a>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-slate-800">
                            {course?.code} - {course?.name} ({course?.classSection})
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500 font-mono">{att.meetingDate}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500">{att.meetingSession}</span>
                        </div>
                        <p className="text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          &quot;{att.reason}&quot;
                        </p>
                      </div>

                      {att.verificationNotes && (
                        <p className="text-[11px] text-slate-500">
                          Catatan: {att.verificationNotes}
                        </p>
                      )}
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                      <div>
                        {att.approvalStatus === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Dikonfirmasi Hadir
                          </span>
                        )}
                        {att.approvalStatus === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Menunggu Konfirmasi
                          </span>
                        )}
                        {att.approvalStatus === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Ditolak
                          </span>
                        )}
                      </div>

                      {/* Approval controls in Admin role */}
                      {userRole === 'ADMIN' && att.approvalStatus === 'PENDING' && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => onApproveAttendance(att.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                            title="Konfirmasi bahwa mahasiswa hadir di sesi kelas ini"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Konfirmasi Hadir</span>
                          </button>
                          <button
                            onClick={() => onRejectAttendance(att.id, 'Tidak terkonfirmasi di sesi kelas.')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="Tolak kehadiran lintas kelas"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        </div>
                      )}

                      {att.verifiedBy && (
                        <span className="text-[10px] text-slate-400">
                          Oleh: {att.verifiedBy}
                        </span>
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
