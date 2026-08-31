import React from 'react';
import { AppRole, LanguageCode } from '../types/marine';
import { Anchor, Compass, Mic, Globe, ShieldAlert, Database, Flame } from 'lucide-react';
import { TRANSLATIONS } from '../services/languageService';

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

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      {/* 1. Fisherman View (Home) */}
      <button
        onClick={() => onRoleChange('fisherman')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
          currentRole === 'fisherman'
            ? 'text-sky-600 dark:text-sky-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Anchor className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">{t.role_fisherman}</span>
      </button>

      {/* 2. Voice Audio Play (Center Action Button) */}
      <button
        onClick={onPlayVoice}
        className={`flex flex-col items-center justify-center -mt-5 px-3 py-2 rounded-2xl shadow-xl transition-all ${
          isPlayingVoice
            ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-300/40'
            : 'bg-sky-600 hover:bg-sky-500 text-white ring-4 ring-sky-100 dark:ring-sky-950'
        }`}
      >
        <Mic className="w-6 h-6 mb-0.5" />
        <span className="text-[9px] font-extrabold uppercase tracking-wide">
          {isPlayingVoice ? 'Speaking' : 'Listen'}
        </span>
      </button>

      {/* 3. Authority / Data Mode */}
      <button
        onClick={() => onRoleChange(currentRole === 'authority' ? 'fisherman' : 'authority')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
          currentRole === 'authority'
            ? 'text-amber-600 dark:text-amber-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <ShieldAlert className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">{t.role_authority}</span>
      </button>

      {/* 4. Language Selector Trigger */}
      <button
        onClick={onOpenLanguageModal}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-sky-600"
      >
        <Globe className="w-5 h-5 mb-0.5 text-sky-500" />
        <span className="text-[10px] font-bold">{currentLang.toUpperCase()}</span>
      </button>
    </nav>
  );
};
