import React, { useState, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Info,
  ArrowRight
} from 'lucide-react';
import { Course, StudentData, StudentSubmission, VerificationRuleConfig } from '../types';
import { evaluateStudentSubmission } from '../utils/verificationEngine';

interface SubmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  existingSubmissions: StudentSubmission[];
  ruleConfig: VerificationRuleConfig;
  initialCourseId?: string;
  onSubmit: (submission: Omit<StudentSubmission, 'id' | 'submittedAt'>) => void;
}

export const SubmissionFormModal: React.FC<SubmissionFormModalProps> = ({
  isOpen,
  onClose,
  courses,
  existingSubmissions,
  ruleConfig,
  initialCourseId,
  onSubmit
}) => {
  if (!isOpen) return null;

  // Selected course
  const [courseId, setCourseId] = useState<string>(
    initialCourseId || (courses.length > 0 ? courses[0].id : '')
  );
  const [role, setRole] = useState<'PJMK_UTAMA' | 'PJMK_PENDAMPING'>('PJMK_UTAMA');

  // Student details
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [department, setDepartment] = useState('Teknik Informatika');
  const [classOrigin, setClassOrigin] = useState('Kelas A');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experienceNotes, setExperienceNotes] = useState('');

  // Currently selected course object
  const selectedCourse = useMemo(() => {
    return courses.find((c) => c.id === courseId) || courses[0];
  }, [courses, courseId]);

  // Prepared student object for live evaluation
  const liveStudentData: StudentData = useMemo(() => {
    return {
      fullName: fullName || 'Nama Mahasiswa',
      nim: nim || '221401000',
      department,
      classOrigin,
      phone: phone || '081234567890',
      email: email || 'mahasiswa@univ.ac.id',
      experienceNotes
    };
  }, [fullName, nim, department, classOrigin, phone, email, experienceNotes]);

  // Live Auto-Verification Evaluation
  const liveEvaluation = useMemo(() => {
    if (!selectedCourse) return null;
    return evaluateStudentSubmission(liveStudentData, selectedCourse, existingSubmissions, ruleConfig);
  }, [liveStudentData, selectedCourse, existingSubmissions, ruleConfig]);

  // Quick preset fills
  const handlePrefillPass = () => {
    setFullName('Bagus Wicaksono');
    setNim('221401099');
    setDepartment('Teknik Informatika');
    setClassOrigin('Kelas A');
    setPhone('081234567891');
    setEmail('bagus.wicaksono@mhs.univ.ac.id');
    setExperienceNotes('Siap mengoordinasikan jadwal kelas dan presensi mahasiswa lintas kelas.');
  };

  const handlePrefillFail = () => {
    setFullName('Kevin Andrian');
    setNim('23ABC999'); // Invalid NIM
    setDepartment('Teknik Informatika');
    setClassOrigin('Kelas B');
    setPhone('');
    setEmail('kevin.andrian@mhs.univ.ac.id');
    setExperienceNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !nim || !phone) {
      alert('Mohon lengkapi Nama Mahasiswa, NIM, dan Nomor WhatsApp.');
      return;
    }

    if (!liveEvaluation) return;

    let initialStatus: StudentSubmission['verificationStatus'] = 'PENDING';
    let verifiedBy: StudentSubmission['verifiedBy'] = null;
    let verifiedAt: string | null = null;

    if (liveEvaluation.recommendation === 'AUTO_APPROVE') {
      initialStatus = 'VERIFIED';
      verifiedBy = 'SISTEM_OTOMATIS';
      verifiedAt = new Date().toISOString();
    } else if (liveEvaluation.recommendation === 'FLAG_FOR_PJMK') {
      initialStatus = 'MANUAL_REVIEW';
      verifiedBy = null;
    } else if (liveEvaluation.recommendation === 'AUTO_REJECT') {
      initialStatus = 'REJECTED';
      verifiedBy = 'SISTEM_OTOMATIS';
      verifiedAt = new Date().toISOString();
    }

    onSubmit({
      courseId,
      role,
      student: {
        fullName,
        nim,
        department,
        classOrigin,
        phone,
        email,
        experienceNotes
      },
      verificationStatus: initialStatus,
      autoVerificationResult: liveEvaluation,
      verifiedAt,
      verifiedBy,
      manualNotes: liveEvaluation.summaryReason
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Input Data Penanggung Jawab Mata Kuliah (PJMK)</h2>
              <p className="text-xs text-slate-400">Verifikasi identitas dan kontak koordinasi mahasiswa aktif antar-kelas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Presets Bar */}
        <div className="px-6 py-2.5 bg-indigo-50/70 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-indigo-900 font-medium flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            Uji Coba Cepat (Auto-Fill Data):
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrefillPass}
              className="px-2.5 py-1 rounded bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium transition-colors cursor-pointer"
            >
              ✓ Contoh Mahasiswa Lengkap (100%)
            </button>
            <button
              type="button"
              onClick={handlePrefillFail}
              className="px-2.5 py-1 rounded bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-medium transition-colors cursor-pointer"
            >
              ✕ Contoh Data Belum Lengkap
            </button>
          </div>
        </div>

        {/* Form Body: 2 Columns */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Select Mata Kuliah */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Mata Kuliah & Kelas *
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name} ({c.classSection})
                    </option>
                  ))}
                </select>
                {selectedCourse && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    Dosen: {selectedCourse.lecturer.name} · Kuota Lintas Kelas: {selectedCourse.maxCrossClassQuota} Mahasiswa
                  </p>
                )}
              </div>

              {/* Peran & Asal Kelas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan Koordinasi
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="PJMK_UTAMA">PJMK Utama (Koordinator 1)</option>
                    <option value="PJMK_PENDAMPING">PJMK Pendamping (Wakil 2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asal Kelas Mahasiswa *
                  </label>
                  <select
                    value={classOrigin}
                    onChange={(e) => setClassOrigin(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="Kelas A">Kelas A</option>
                    <option value="Kelas B">Kelas B</option>
                    <option value="Kelas C">Kelas C</option>
                    <option value="Kelas Reguler">Kelas Reguler</option>
                    <option value="Kelas SI-1">Kelas SI-1</option>
                    <option value="Kelas SI-2">Kelas SI-2</option>
                    <option value="Kelas DS-A">Kelas DS-A</option>
                  </select>
                </div>
              </div>

              {/* Full Name & NIM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Mahasiswa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bagus Wicaksono"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Mahasiswa (NIM) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="8-14 Digit Numerik"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Program Studi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Studi
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Sains Data">Sains Data</option>
                </select>
              </div>

              {/* Phone WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No WhatsApp Aktif (Wajib untuk Koordinasi) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Narahubung utama bagi mahasiswa lintas dan dosen.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Mahasiswa *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@mhs.univ.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Kesiapan & Komitmen Koordinasi
                </label>
                <textarea
                  rows={2}
                  placeholder="Kesiapan mengelola grup WhatsApp kelas, rekapitulasi presensi mahasiswa lintas..."
                  value={experienceNotes}
                  onChange={(e) => setExperienceNotes(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                ></textarea>
              </div>
            </div>

            {/* Right Column: Live Auto-Verification Inspector (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Validasi Kelengkapan Koordinasi
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                    Skor: {liveEvaluation?.score ?? 0}%
                  </span>
                </div>

                {/* Outcome Badge Banner */}
                {liveEvaluation && (
                  <div
                    className={`p-3 rounded-lg mb-4 text-xs ${
                      liveEvaluation.recommendation === 'AUTO_APPROVE'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : liveEvaluation.recommendation === 'FLAG_FOR_PJMK'
                        ? 'bg-amber-50 border border-amber-200 text-amber-800'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {liveEvaluation.recommendation === 'AUTO_APPROVE' && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Status: Terverifikasi Lengkap</span>
                        </>
                      )}
                      {liveEvaluation.recommendation === 'FLAG_FOR_PJMK' && (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Status: Perlu Konfirmasi Ketua</span>
                        </>
                      )}
                      {liveEvaluation.recommendation === 'AUTO_REJECT' && (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Status: Data Belum Lengkap</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed">{liveEvaluation.summaryReason}</p>
                  </div>
                )}

                {/* Checklist */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Pemeriksaan Syarat Koordinasi:
                  </span>

                  {liveEvaluation?.checks.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          {c.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : c.severity === 'CRITICAL' ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className="text-[11px]">{c.title}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            c.passed
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-rose-700 bg-rose-50'
                          }`}
                        >
                          {c.actualValue}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 pl-5">{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Simpan Data Penugasan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
