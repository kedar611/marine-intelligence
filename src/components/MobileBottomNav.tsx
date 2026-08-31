import React, { useState } from 'react';
import { AppRole, LanguageCode } from '../types/marine';
import { Anchor, ShieldAlert, Volume2, VolumeX, Globe, ChevronUp, BarChart3, Database } from 'lucide-react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../services/languageService';

interface MobileBottomNavProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  currentLang: LanguageCode;
  onOpenLanguageModal: () => void;
  onPlayVoice: () => void;
  isPlayingVoice: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  onRoleChange,
  currentLang,
  onOpenLanguageModal,
  onPlayVoice,
  isPlayingVoice,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [showLangDrawer, setShowLangDrawer] = useState(false);
  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);

  const navItems: { role: AppRole; icon: React.ReactNode; label: string; activeColor: string }[] = [
    {
      role: 'fisherman',
      icon: <Anchor className="w-5 h-5" />,
      label: t.role_fisherman,
      activeColor: 'text-sky-600 dark:text-sky-400',
    },
    {
      role: 'authority',
      icon: <ShieldAlert className="w-5 h-5" />,
      label: t.role_authority,
      activeColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      role: 'researcher',
      icon: <BarChart3 className="w-5 h-5" />,
      label: t.role_researcher,
      activeColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      role: 'data_fusion',
      icon: <Database className="w-5 h-5" />,
      label: t.role_data_fusion,
      activeColor: 'text-teal-600 dark:text-teal-400',
    },
  ];

  return (
    <>
      {/* Language Quick-Picker Drawer (slides up from bottom) */}
      {showLangDrawer && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLangDrawer(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-700 shadow-2xl max-h-[60vh] overflow-y-auto safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-sky-600" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  भाषा / Language
                </span>
              </div>
              <button
                onClick={() => setShowLangDrawer(false)}
                className="text-xs font-bold text-sky-600 px-3 py-1 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950"
              >
                Done
              </button>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onOpenLanguageModal();
                      setShowLangDrawer(false);
                      // Directly open the full language modal for selection
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 ring-2 ring-sky-300/40'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 active:bg-sky-50'
                    }`}
                  >
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {lang.nativeLabel}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {lang.label} • {lang.region}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 safe-area-bottom shadow-[0_-2px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around px-2 py-1.5">
          {/* Role nav items */}
          {navItems.map((item) => {
            const isActive = currentRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => onRoleChange(item.role)}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-w-0 ${
                  isActive
                    ? `${item.activeColor} font-extrabold`
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className={`mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-[9px] leading-tight truncate max-w-[52px]">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-current mt-0.5" />
                )}
              </button>
            );
          })}

          {/* Voice button */}
          <button
            onClick={onPlayVoice}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              isPlayingVoice
                ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {isPlayingVoice ? (
              <VolumeX className="w-5 h-5 mb-0.5 animate-pulse" />
            ) : (
              <Volume2 className="w-5 h-5 mb-0.5" />
            )}
            <span className="text-[9px] leading-tight">
              {isPlayingVoice ? 'Stop' : 'Listen'}
            </span>
          </button>

          {/* Language quick-switch */}
          <button
            onClick={() => setShowLangDrawer(true)}
            className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-sky-600 transition-all"
          >
            <div className="relative mb-0.5">
              <Globe className="w-5 h-5 text-sky-500" />
              <ChevronUp className="w-2.5 h-2.5 absolute -top-1 -right-1.5 text-sky-500" />
            </div>
            <span className="text-[9px] leading-tight font-bold text-sky-600 dark:text-sky-400">
              {currentLangMeta?.nativeLabel?.substring(0, 4) || currentLang.toUpperCase()}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
