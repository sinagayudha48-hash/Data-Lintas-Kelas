import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Send,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Course, StudentSubmission } from '../types';

interface StudentTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: StudentSubmission[];
  courses: Course[];
  onOpenSubmissionModal: () => void;
}

export const StudentTrackingModal: React.FC<StudentTrackingModalProps> = ({
  isOpen,
  onClose,
  submissions,
  courses,
  onOpenSubmissionModal
}) => {
  if (!isOpen) return null;

  const [nimInput, setNimInput] = useState('');
  const [searchedNim, setSearchedNim] = useState('');
  const [copiedWA, setCopiedWA] = useState(false);

  const matchedSubmissions = submissions.filter(
    (s) => searchedNim && s.student.nim.trim() === searchedNim.trim()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedNim(nimInput.trim());
  };

  const handleQuickPick = (nim: string) => {
    setNimInput(nim);
    setSearchedNim(nim);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Lacak Status Pengajuan PJMK Mahasiswa</h2>
            <p className="text-xs text-slate-400">
              Masukkan NIM Anda untuk mengecek hasil evaluasi verifikasi otomatis sistem
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Masukkan Nomor Induk Mahasiswa (NIM)..."
                  value={nimInput}
                  onChange={(e) => setNimInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Cek Status
              </button>
            </div>

            {/* Quick test chips */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span>Coba NIM Terdaftar:</span>
              <button
                type="button"
                onClick={() => handleQuickPick('221401045')}
                className="text-xs text-indigo-600 hover:underline font-mono cursor-pointer"
              >
                221401045 (Lolos)
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => handleQuickPick('221401112')}
                className="text-xs text-indigo-600 hover:underline font-mono cursor-pointer"
              >
                221401112 (Review)
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => handleQuickPick('231401005')}
                className="text-xs text-indigo-600 hover:underline font-mono cursor-pointer"
              >
                231401005 (Ditolak)
              </button>
            </div>
          </form>

          {/* Results Area */}
          {searchedNim && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {matchedSubmissions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-sm font-semibold text-slate-800">
                    Tidak ditemukan pengajuan dengan NIM: <span className="font-mono">{searchedNim}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Pastikan NIM yang dimasukkan sesuai atau ajukan pendaftaran baru.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSubmissionModal();
                    }}
                    className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
                  >
                    + Ajukan Pendaftaran Calon PJMK
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Ditemukan {matchedSubmissions.length} Pengajuan untuk NIM {searchedNim}:
                  </span>

                  {matchedSubmissions.map((sub) => {
                    const course = courses.find((c) => c.id === sub.courseId);

                    return (
                      <div
                        key={sub.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-mono font-bold text-slate-500">
                              {course?.code} · {course?.classSection}
                            </span>
                            <h3 className="text-base font-bold text-slate-900">{course?.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Dosen: {course?.lecturer.name}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {sub.verificationStatus === 'VERIFIED' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Terverifikasi Resmi
                              </span>
                            )}
                            {sub.verificationStatus === 'PENDING' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200">
                                <Clock className="w-4 h-4 text-amber-600" />
                                Menunggu Verifikasi
                              </span>
                            )}
                            {sub.verificationStatus === 'MANUAL_REVIEW' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200">
                                <AlertTriangle className="w-4 h-4 text-blue-600" />
                                Menunggu Review Ketua Mahasiswa
                              </span>
                            )}
                            {sub.verificationStatus === 'REJECTED' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200">
                                <XCircle className="w-4 h-4 text-rose-600" />
                                Ditolak Otomatis
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Summary details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
                          <div>
                            <span className="text-slate-400 block">Mahasiswa</span>
                            <span className="font-bold text-slate-800">{sub.student.fullName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Asal Kelas</span>
                            <span className="font-bold text-slate-800">{sub.student.classOrigin}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">WhatsApp</span>
                            <span className="font-mono font-bold text-slate-800">{sub.student.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Skor Sistem</span>
                            <span className="font-mono font-bold text-indigo-600">{sub.autoVerificationResult?.score}%</span>
                          </div>
                        </div>

                        {/* Rationale / message */}
                        <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <strong className="text-slate-800 block mb-1">Catatan Sistem Verifikasi:</strong>
                          <p className="text-slate-600">{sub.autoVerificationResult?.summaryReason}</p>
                        </div>

                        {/* Next steps */}
                        {sub.verificationStatus === 'VERIFIED' && course?.whatsappGroupUrl && (
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-xs text-emerald-700 font-medium">
                              Silakan bergabung ke grup koordinasi kelas:
                            </span>
                            <a
                              href={course.whatsappGroupUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Buka Grup WhatsApp</span>
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
