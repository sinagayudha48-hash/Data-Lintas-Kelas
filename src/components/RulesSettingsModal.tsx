import React, { useState } from 'react';
import { X, Sliders, Check, RotateCcw, ShieldCheck, AlertCircle, ArrowRightLeft, Users, Lock } from 'lucide-react';
import { VerificationRuleConfig } from '../types';

interface RulesSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRules: VerificationRuleConfig;
  onSaveRules: (newRules: VerificationRuleConfig) => void;
  adminPassword?: string;
  onUpdateAdminPassword?: (newPassword: string) => void;
}

export const RulesSettingsModal: React.FC<RulesSettingsModalProps> = ({
  isOpen,
  onClose,
  currentRules,
  onSaveRules,
  adminPassword = 'admin123',
  onUpdateAdminPassword
}) => {
  if (!isOpen) return null;

  const [maxQuota, setMaxQuota] = useState<number>(currentRules.maxCrossClassQuotaPerSession || 8);
  const [maxPerStudent, setMaxPerStudent] = useState<number>(currentRules.maxCrossClassPerStudentPerSemester || 4);
  const [maxRoles, setMaxRoles] = useState<number>(currentRules.maxCoordinatorRolesPerStudent || 2);
  const [requireWA, setRequireWA] = useState<boolean>(currentRules.requireValidWhatsApp ?? true);
  const [allowKetuaOverride, setAllowKetuaOverride] = useState<boolean>(currentRules.allowKetuaManualOverride ?? true);
  const [customPassword, setCustomPassword] = useState<string>(adminPassword);

  const handleResetDefaults = () => {
    setMaxQuota(8);
    setMaxPerStudent(4);
    setMaxRoles(2);
    setRequireWA(true);
    setAllowKetuaOverride(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateAdminPassword && customPassword.trim()) {
      onUpdateAdminPassword(customPassword.trim());
    }
    onSaveRules({
      maxCrossClassQuotaPerSession: maxQuota,
      maxCrossClassPerStudentPerSemester: maxPerStudent,
      maxCoordinatorRolesPerStudent: maxRoles,
      requireValidWhatsApp: requireWA,
      allowKetuaManualOverride: allowKetuaOverride
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Aturan Verifikasi Koordinasi & Presensi Lintas</h2>
              <p className="text-xs text-slate-400">Atur batasan kuota mahasiswa lintas, batas tugas PJMK, dan hak akses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Rule 1: Max Cross Class Quota per Session */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                    1. Kuota Maksimal Mahasiswa Lintas per Sesi Perkuliahan
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Batas jumlah mahasiswa dari kelas lain yang diizinkan hadir dalam satu sesi kelas.
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-indigo-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded tabular-nums">
                  {maxQuota} Mahasiswa
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={maxQuota}
                onChange={(e) => setMaxQuota(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>3 Mahasiswa (Ketat)</span>
                <span>8 Mahasiswa (Standar)</span>
                <span>15 Mahasiswa (Bebas)</span>
              </div>
            </div>

            {/* Rule 2: Max Cross-Class Per Student Per Semester */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">
                    2. Batas Frekuensi Pindah Kelas per Mahasiswa
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Maksimal berapa kali seorang mahasiswa diperkenankan lintas kelas dalam 1 semester.
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-indigo-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded tabular-nums">
                  Maks {maxPerStudent}x
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={maxPerStudent}
                onChange={(e) => setMaxPerStudent(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1x (Darurat Saja)</span>
                <span>4x (Standar Wajar)</span>
                <span>8x</span>
              </div>
            </div>

            {/* Rule 3: Max Roles */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    3. Batas Penugasan PJMK per Mahasiswa
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Maksimal jumlah kelas yang boleh dipegang oleh seorang mahasiswa sebagai penanggung jawab.
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-indigo-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded tabular-nums">
                  Maks {maxRoles} Kelas
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={maxRoles}
                onChange={(e) => setMaxRoles(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 Kelas (Fokus)</span>
                <span>2 Kelas (Disarankan)</span>
                <span>4 Kelas</span>
              </div>
            </div>

            {/* Rule 4 & 5: Checkbox toggles */}
            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={requireWA}
                  onChange={(e) => setRequireWA(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Wajib Nomor WhatsApp Aktif</span>
                  <span className="text-slate-500">Mahasiswa lintas dan calon PJMK wajib menyertakan nomor WA untuk koordinasi.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={allowKetuaOverride}
                  onChange={(e) => setAllowKetuaOverride(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Otorisasi Supervisi & Override oleh Ketua Mahasiswa</span>
                  <span className="text-slate-500">Ketua Mahasiswa berhak menyetujui dispensasi kehadiran saat kuota kelas penuh.</span>
                </div>
              </label>

              {/* Password Setting */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" />
                    Keamanan: Kata Sandi Pengurus (PJMK & Ketua Mahasiswa)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Password Akses</span>
                </div>
                <input
                  type="text"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru..."
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
                <p className="text-[11px] text-slate-500">
                  Kata sandi ini digunakan untuk masuk ke mode Pengurus guna menyetujui presensi dan mengelola direktori PJMK.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan ke Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Simpan & Terapkan Aturan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
