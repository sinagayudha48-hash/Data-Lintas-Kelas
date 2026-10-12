import React, { useState, useMemo } from 'react';
import {
  X,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  MessageCircle,
  ShieldAlert
} from 'lucide-react';
import { Course, CrossClassAttendance } from '../types';
import { CLASS_OFFICERS } from '../data/initialData';

interface CrossClassAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSubmit: (attendance: Omit<CrossClassAttendance, 'id' | 'submittedAt' | 'verifiedAt' | 'verifiedBy'>) => void;
}

export const CrossClassAttendanceModal: React.FC<CrossClassAttendanceModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSubmit
}) => {
  if (!isOpen) return null;

  const [studentName, setStudentName] = useState('');
  const [nim, setNim] = useState('');
  const [originClass, setOriginClass] = useState('IF26A');
  const [customOriginClass, setCustomOriginClass] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 10));
  const [meetingSession, setMeetingSession] = useState('Pertemuan 5 - Materi Kuliah Reguler');
  const [reason, setReason] = useState('');
  const [hasConfirmedKM, setHasConfirmedKM] = useState(true);

  const selectedCourse = useMemo(() => {
    return courses.find(c => c.id === selectedCourseId) || courses[0];
  }, [courses, selectedCourseId]);

  const targetClass = selectedCourse?.classSection || 'IF26E';
  const effectiveOriginClass = originClass === 'OTHER' ? customOriginClass.trim() : originClass;

  // Validation
  const isNimValid = /^\d{8,14}$/.test(nim.trim());
  const isClassDifferent = effectiveOriginClass.toLowerCase().trim() !== targetClass.toLowerCase().trim();

  // Quick preset fills
  const handlePrefill1 = () => {
    setStudentName('Aditya Pratama Putra');
    setNim('261401015');
    setOriginClass('IF26A');
    setPhone('081234567890');
    if (courses.length > 0) {
      setSelectedCourseId(courses[0].id); // PTI
    }
    setMeetingSession('Pertemuan 5 - Pengantar Arsitektur Komputer');
    setReason('Jadwal sesi reguler di IF26A bentrok dengan Praktikum Dasar. Sudah konfirmasi ke KM Nadya.');
    setHasConfirmedKM(true);
  };

  const handlePrefill2 = () => {
    setStudentName('Nadia Azzahra');
    setNim('261401042');
    setOriginClass('IF26B');
    setPhone('081398765432');
    if (courses.length > 1) {
      setSelectedCourseId(courses[1].id); // Algoritma
    }
    setMeetingSession('Pertemuan 6 - Percabangan dan Struktur Data');
    setReason('Izin dispensasi kepanitiaan di jadwal IF26B, hadir mengikuti materi di IF26E.');
    setHasConfirmedKM(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !nim.trim()) {
      alert('Mohon lengkapi Nama Lengkap dan NIM.');
      return;
    }

    if (!isNimValid) {
      alert('Format NIM tidak valid (harus 8-14 digit numerik).');
      return;
    }

    if (!effectiveOriginClass) {
      alert('Mohon pilih atau masukkan Asal Kelas Anda.');
      return;
    }

    if (!isClassDifferent) {
      alert(`Asal kelas (${effectiveOriginClass}) tidak boleh sama dengan kelas tujuan (${targetClass}). Formulir ini khusus untuk mahasiswa yang ingin lintas/pindah kelas sementara.`);
      return;
    }

    onSubmit({
      courseId: selectedCourseId,
      studentName: studentName.trim(),
      nim: nim.trim(),
      originClass: effectiveOriginClass,
      targetClass,
      phone: phone.trim() || '081234567890',
      meetingDate,
      meetingSession,
      reason: reason.trim() || 'Pindah kelas sementara untuk penyesuaian jadwal kuliah.',
      approvalStatus: 'PENDING',
      verificationNotes: 'Menunggu konfirmasi kehadiran oleh PJMK kelas tujuan atau Ketua Mahasiswa IF26E.',
      hasConfirmedKM
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Presensi Lintas / Pindah Kelas Sementara ke IF26E</h2>
              <p className="text-xs text-slate-400">
                Pendataan presensi mahasiswa angkatan yang hadir sementara di sesi kelas IF26E
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

        {/* Banner Ketentuan Konfirmasi KM/Wakil KM */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-900">
                Penting (Aturan Kelas IF26E): Wajib konfirmasi terlebih dahulu ke KM / Wakil KM
              </p>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Sebelum melakukan lintas kelas atau menghubungi pihak luar, mohon sampaikan izin ke:{' '}
                <strong>{CLASS_OFFICERS[0].name} (KM: {CLASS_OFFICERS[0].phone})</strong> atau{' '}
                <strong>{CLASS_OFFICERS[1].name} (Wakil KM: {CLASS_OFFICERS[1].phone})</strong>.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://wa.me/62${CLASS_OFFICERS[0].phone.replace(/^0/, '')}?text=Halo%20KM%20Nadya,%20saya%20ingin%20izin%20konfirmasi%20lintas%20kelas%20sementara%20ke%20IF26E`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Chat WhatsApp KM Nadya</span>
                </a>
                <a
                  href={`https://wa.me/62${CLASS_OFFICERS[1].phone.replace(/^0/, '')}?text=Halo%20Wakil%20KM%20Yuda,%20saya%20ingin%20izin%20konfirmasi%20lintas%20kelas%20sementara%20ke%20IF26E`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-medium text-[11px] transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Chat Wakil KM Yuda</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Demo Pre-fill */}
        <div className="px-6 py-2.5 bg-indigo-50/70 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-indigo-900 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Contoh Pengisian Cepat:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrefill1}
              className="px-2.5 py-1 rounded bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium transition-colors cursor-pointer"
            >
              Contoh: Pindah IF26A → IF26E (PTI)
            </button>
            <button
              type="button"
              onClick={handlePrefill2}
              className="px-2.5 py-1 rounded bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium transition-colors cursor-pointer"
            >
              Contoh: Pindah IF26B → IF26E (Algoritma)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Identitas Mahasiswa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Mahasiswa *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Aditya Pratama Putra"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
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
                placeholder="Contoh: 261401015"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className={`w-full text-xs font-mono bg-slate-50 border rounded-lg p-2.5 focus:ring-2 focus:bg-white ${
                  nim && !isNimValid
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-indigo-500'
                }`}
              />
              {nim && !isNimValid && (
                <p className="text-[11px] text-rose-600 mt-1">NIM harus 8-14 digit angka numerik.</p>
              )}
            </div>
          </div>

          {/* Nomor WhatsApp Mahasiswa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor WhatsApp Aktif Mahasiswa Lintas *
            </label>
            <input
              type="tel"
              required
              placeholder="Contoh: 081234567890 (Untuk konfirmasi dari PJMK & KM)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              PJMK mata kuliah atau KM akan menghubungi kontak ini jika ada perubahan jadwal atau verifikasi kehadiran.
            </p>
          </div>

          {/* Asal Kelas & Mata Kuliah Tujuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Asal Kelas Terdaftar *
              </label>
              <select
                value={originClass}
                onChange={(e) => setOriginClass(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="IF26A">Kelas IF26A</option>
                <option value="IF26B">Kelas IF26B</option>
                <option value="IF26C">Kelas IF26C</option>
                <option value="IF26D">Kelas IF26D</option>
                <option value="IF26F">Kelas IF26F</option>
                <option value="OTHER">Kelas Lainnya (Ketik manual)...</option>
              </select>
              {originClass === 'OTHER' && (
                <input
                  type="text"
                  required
                  placeholder="Ketik asal kelas Anda..."
                  value={customOriginClass}
                  onChange={(e) => setCustomOriginClass(e.target.value)}
                  className="w-full mt-2 text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              )}
              <p className="text-[11px] text-slate-500 mt-1">Kelas asal yang tertera di KRS resmi Anda.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Mata Kuliah Tujuan (Kelas IF26E) *
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {selectedCourse && (
                <div className="mt-1.5 p-2 bg-indigo-50/70 border border-indigo-100 rounded-lg text-[11px] text-indigo-900 space-y-0.5">
                  <div>
                    <strong>Jadwal:</strong> {selectedCourse.schedule.day}, {selectedCourse.schedule.time} ({selectedCourse.schedule.room})
                  </div>
                  <div>
                    <strong>PJMK:</strong>{' '}
                    <span className="font-semibold text-indigo-800">
                      {selectedCourse.name.includes('PTI') ? 'Faqih Hilmi Azizi (0895622610606)' :
                       selectedCourse.name.includes('Algoritma') ? 'Ujang (085282859860)' :
                       selectedCourse.name.includes('Operasi') ? 'Asep (089527175100)' :
                       selectedCourse.name.includes('Statistika') ? 'Winka Amalia Zahra (085778186963)' :
                       selectedCourse.name.includes('Jaringan') ? 'Rafa (081212035575)' :
                       selectedCourse.name.includes('Pancasila') ? 'Zahra (089531640037)' :
                       selectedCourse.name.includes('Kalkulus') ? 'Deiva Alya (089623024888)' : 'Koordinator MK'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Warning if origin == target */}
          {!isClassDifferent && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Asal Kelas Anda ({effectiveOriginClass}) sama dengan Kelas Tujuan ({targetClass}). Fitur ini khusus untuk absensi pindah/lintas kelas sementara.
              </span>
            </div>
          )}

          {/* Tanggal & Sesi Pertemuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Kehadiran Sesi Kuliah *
              </label>
              <input
                type="date"
                required
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sesi / Materi Pertemuan Kuliah *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Pertemuan 5 - Materi Modul Kuliah"
                value={meetingSession}
                onChange={(e) => setMeetingSession(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Alasan Pindah Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alasan Pindah / Lintas Kelas Sementara *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Contoh: Jadwal sesi kelas asal bentrok dengan praktikum wajib, izin dispensasi lomba/organisasi, susulan sakit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            ></textarea>
          </div>

          {/* Checkbox Konfirmasi KM */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={hasConfirmedKM}
                onChange={(e) => setHasConfirmedKM(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-slate-700">
                <strong>Saya mengonfirmasi bahwa saya mematuhi Peraturan Koordinasi Kelas IF26E</strong> dan telah menyampaikan izin kepada KM Nadya Anggi Kusuma / Wakil KM Yuda atau PJMK yang bersangkutan.
              </span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isNimValid || !isClassDifferent}
              className={`px-5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                isNimValid && isClassDifferent
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Absen Lintas Kelas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
