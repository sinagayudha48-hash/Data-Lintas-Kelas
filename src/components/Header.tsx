import React from 'react';
import { ShieldCheck, Plus, Settings2, Search, Lock, ArrowRightLeft, Users } from 'lucide-react';

export type UserRole = 'ADMIN' | 'STUDENT';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdminAuthenticated: boolean;
  onPromptAdminAuth: () => void;
  onLogoutAdmin: () => void;
  activeTab: 'dashboard' | 'directory' | 'rules' | 'crossClass';
  setActiveTab: (tab: 'dashboard' | 'directory' | 'rules' | 'crossClass') => void;
  onOpenSubmissionModal: () => void;
  onOpenRulesModal: () => void;
  onOpenTrackingModal: () => void;
  onOpenCrossClassModal: () => void;
  onBatchAutoVerify: () => void;
  pendingCount: number;
  pendingCrossClassCount: number;
  isRealtimeActive: boolean;
  onToggleRealtime: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  setUserRole,
  isAdminAuthenticated,
  onPromptAdminAuth,
  onLogoutAdmin,
  activeTab,
  setActiveTab,
  onOpenSubmissionModal,
  onOpenRulesModal,
  onOpenTrackingModal,
  onOpenCrossClassModal,
  pendingCrossClassCount,
  isRealtimeActive,
  onToggleRealtime
}) => {
  const handleSelectAdminRole = () => {
    if (isAdminAuthenticated) {
      setUserRole('ADMIN');
      setActiveTab('dashboard');
    } else {
      onPromptAdminAuth();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <a
                href="#dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(userRole === 'ADMIN' ? 'dashboard' : 'directory');
                }}
                className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-indigo-600 transition-colors flex items-center gap-2 leading-tight"
              >
                <span>SIM-PJMK & Lintas Kelas</span>
                <span className="font-mono text-xs bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                  IF26E
                </span>
              </a>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Koordinasi Mahasiswa Lintas · PJMK · Ketua Mahasiswa
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
            {userRole === 'ADMIN' ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                    activeTab === 'dashboard'
                      ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Dashboard Monitoring
                </button>
                <button
                  onClick={() => setActiveTab('crossClass')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                    activeTab === 'crossClass'
                      ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Presensi Lintas Kelas</span>
                  {pendingCrossClassCount > 0 && (
                    <span className="font-mono text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                      {pendingCrossClassCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('directory')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                    activeTab === 'directory'
                      ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Direktori PJMK
                </button>
                <button
                  onClick={onOpenRulesModal}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                    activeTab === 'rules'
                      ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Settings2 className="w-4 h-4 text-slate-400" />
                  <span>Aturan Kuota & Izin</span>
                </button>
                <button
                  onClick={onToggleRealtime}
                  className="whitespace-nowrap shrink-0 text-xs font-mono px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Toggle status live feed"
                >
                  <span className={`w-2 h-2 rounded-full ${isRealtimeActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  <span>Live: {isRealtimeActive ? 'ON' : 'OFF'}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('directory')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                    activeTab === 'directory'
                      ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Daftar PJMK & Kontak WA
                </button>
                <button
                  onClick={() => setActiveTab('crossClass')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                    activeTab === 'crossClass'
                      ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Presensi Mahasiswa Lintas</span>
                </button>
                <button
                  onClick={onOpenTrackingModal}
                  className="whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors cursor-pointer py-1 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Lacak Pengajuan (NIM)</span>
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                    activeTab === 'dashboard'
                      ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Status Kesiapan Kelas
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Role Switcher & Primary Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Role Switcher Pill */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200/60">
              <button
                onClick={() => {
                  setUserRole('STUDENT');
                  setActiveTab('directory');
                }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  userRole === 'STUDENT'
                    ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Beralih ke tampilan Mahasiswa & Anggota Kelas"
              >
                Mahasiswa / Anggota
              </button>
              <button
                onClick={handleSelectAdminRole}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  userRole === 'ADMIN'
                    ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Masuk ke fitur Pengurus: PJMK & Ketua Mahasiswa (Memerlukan Password)"
              >
                {!isAdminAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
                <span>Pengurus (PJMK & Ketua)</span>
              </button>
            </div>

            {/* Logout / Lock Admin Mode button */}
            {userRole === 'ADMIN' && (
              <button
                onClick={onLogoutAdmin}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Kunci dan keluar dari mode Pengurus"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Kunci Akses</span>
              </button>
            )}

            {/* Quick action: Absen Pindah Kelas button */}
            <button
              onClick={onOpenCrossClassModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              title="Isi presensi pindah kelas sementara"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Isi Absen Lintas</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
