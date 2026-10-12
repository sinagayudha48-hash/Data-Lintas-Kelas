import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  Send,
  FileCheck2,
  Phone
} from 'lucide-react';
import { Course, StudentSubmission, VerificationRuleConfig } from '../types';

interface VerificationDetailModalProps {
  submission: StudentSubmission | null;
  courses: Course[];
  allSubmissions: StudentSubmission[];
  ruleConfig: VerificationRuleConfig;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (submissionId: string, notes?: string) => void;
  onReject: (submissionId: string, reason?: string) => void;
  onReevaluate: (submissionId: string) => void;
}

export const VerificationDetailModal: React.FC<VerificationDetailModalProps> = ({
  submission,
  courses,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onReevaluate
}) => {
  if (!isOpen || !submission) return null;

  const [copiedWA, setCopiedWA] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const course = courses.find((c) => c.id === submission.courseId);

  // Generate WhatsApp official confirmation message
  const generateWAMessage = () => {
    const isApproved = submission.verificationStatus === 'VERIFIED';
    if (isApproved) {
      return `*PEMBERITAHUAN PENETAPAN PENANGGUNG JAWAB MATA KULIAH (PJMK)*
Universitas - Koordinasi Angkatan

Halo Sdr/i *${submission.student.fullName}* (${submission.student.nim}),
Selamat! Pengajuan Anda telah *DISETUJUI RESMI* sebagai *${submission.role === 'PJMK_UTAMA' ? 'PJMK Utama' : 'PJMK Pendamping'}* untuk:

*Mata Kuliah:* ${course?.code} - ${course?.name} (${course?.classSection})
*Dosen Pengampu:* ${course?.lecturer.name}
*Jadwal:* ${course?.schedule.day}, ${course?.schedule.time} (${course?.schedule.room})
*Asal Kelas:* ${submission.student.classOrigin}
*Tugas Utama:* Narahubung kelas, mengelola grup koordinasi, dan konfirmasi presensi mahasiswa lintas kelas.

Silakan segera bergabung ke grup koordinasi:
${course?.whatsappGroupUrl || 'Tautan grup kelas tersedia di web portal.'}

Terima kasih atas kesiapan dan dedikasi Anda.
_Ketua Mahasiswa & Koordinator Angkatan_`;
    } else {
      return `*PEMBERITAHUAN VERIFIKASI PENUGASAN PJMK*
Universitas - Koordinasi Angkatan

Halo Sdr/i *${submission.student.fullName}* (${submission.student.nim}),
Pengajuan Anda sebagai PJMK untuk mata kuliah *${course?.code} - ${course?.name}* saat ini berstatus *${submission.verificationStatus === 'REJECTED' ? 'BELUM MEMENUHI SYARAT' : 'PERLU KONFIRMASI KETUA'}*.

*Catatan:* ${submission.autoVerificationResult?.summaryReason || 'Silakan lengkapi kontak WhatsApp aktif dan koordinasikan dengan Ketua Mahasiswa.'}

Silakan menghubungi Ketua Mahasiswa untuk informasi lebih lanjut.
_Ketua Mahasiswa & Koordinator Angkatan_`;
    }
  };

  const handleCopyWA = () => {
    const text = generateWAMessage();
    navigator.clipboard.writeText(text);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Lembar Audit Verifikasi PJMK Kelas</h2>
              <p className="text-xs text-slate-400">
                Pemeriksaan validasi identitas, asal kelas, dan kontak koordinasi mahasiswa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Summary Candidate & Course Overview Card */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Mata Kuliah & Kelas
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {course?.code} - {course?.name} ({course?.classSection})
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {course?.department} · Dosen: <strong className="text-slate-800">{course?.lecturer.name}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Status Verifikasi
                </span>
                <div className="inline-flex items-center gap-1.5">
                  {submission.verificationStatus === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Terverifikasi Resmi
                    </span>
                  )}
                  {submission.verificationStatus === 'PENDING' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Menunggu Verifikasi
                    </span>
                  )}
                  {submission.verificationStatus === 'MANUAL_REVIEW' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
                      Review Ketua Mahasiswa
                    </span>
                  )}
                  {submission.verificationStatus === 'REJECTED' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-md">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Ditolak
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Student Profile Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Nama Mahasiswa</span>
                <span className="font-bold text-slate-800">{submission.student.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">NIM</span>
                <span className="font-mono font-bold text-slate-800">{submission.student.nim}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Asal Kelas</span>
                <span className="font-bold text-slate-800">{submission.student.classOrigin}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Kontak WhatsApp</span>
                <span className="font-mono font-bold text-slate-800">{submission.student.phone}</span>
              </div>
            </div>
          </div>

          {/* Verification Score & Recommendation Banner */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <div>
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                Hasil Audit Sistem Verifikasi
              </span>
              <p className="text-xs text-indigo-800 font-medium mt-1">
                {submission.autoVerificationResult?.summaryReason}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center px-4 py-1.5 bg-white rounded-lg border border-indigo-200">
                <span className="text-[10px] text-slate-400 block font-medium">Skor Koordinasi</span>
                <span className="text-lg font-bold font-mono text-indigo-600 tabular-nums">
                  {submission.autoVerificationResult?.score}%
                </span>
              </div>
              <button
                onClick={() => onReevaluate(submission.id)}
                className="px-3 py-2 text-xs font-medium text-indigo-700 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Evaluasi ulang data dengan aturan sistem terbaru"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cek Ulang</span>
              </button>
            </div>
          </div>

          {/* Detailed Checkpoints Audit List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Rincian Parameter Validasi Penugasan PJMK
            </h4>

            <div className="space-y-2.5">
              {submission.autoVerificationResult?.checks.map((check) => (
                <div
                  key={check.id}
                  className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : check.severity === 'CRITICAL' ? (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span className="font-bold text-slate-800">{check.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{check.severity}]</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">{check.message}</p>
                  </div>

                  <div className="flex sm:flex-col items-end gap-1 shrink-0 pl-6 sm:pl-0">
                    <span className="text-[11px] text-slate-400">Data Terdaftar:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded font-medium ${
                          check.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {check.actualValue}
                      </span>
                      <span className="text-slate-400 text-[10px]">/ Syarat: {check.expectedValue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Notification Generator */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  Format Pemberitahuan WhatsApp
                </span>
              </div>
              <button
                onClick={handleCopyWA}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer border border-emerald-200"
              >
                {copiedWA ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Pesan WA</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto">
              {generateWAMessage()}
            </pre>
          </div>

          {/* Rejection Note Form (If Rejecting) */}
          {isRejecting && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
              <label className="text-xs font-bold text-rose-900 block">
                Alasan / Catatan Penolakan untuk Mahasiswa:
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Nomor WhatsApp tidak aktif atau koordinasi belum terkonfirmasi..."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              ></textarea>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onReject(submission.id, rejectNote || 'Belum memenuhi kriteria koordinasi kelas.');
                    setIsRejecting(false);
                    onClose();
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
                >
                  Konfirmasi Tolak Pengajuan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Diverifikasi oleh: <strong className="text-slate-800">{submission.verifiedBy || 'Menunggu Keputusan'}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRejecting(true)}
              className="px-3 py-2 text-xs font-medium text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              Tolak Pengajuan
            </button>
            <button
              onClick={() => {
                onApprove(submission.id, 'Disetujui oleh Ketua Mahasiswa.');
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tetapkan Sebagai PJMK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
