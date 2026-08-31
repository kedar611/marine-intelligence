import React from 'react';
import { LanguageCode } from '../types/marine';
import { SUPPORTED_LANGUAGES } from '../services/languageService';
import { Globe, X, Check, Volume2 } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLang,
}) => {
  if (!isOpen) return null;

  const handleSelect = (code: LanguageCode) => {
    onSelectLang(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-600 to-blue-700 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">अपनी भाषा चुनें / Select Your Language</h2>
              <p className="text-xs text-sky-100">Supports all coastal languages of India with Voice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 shadow-md ring-2 ring-sky-400/40'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-sky-50/50 hover:border-sky-300'
                }`}
              >
                <div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {lang.nativeLabel}
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {lang.label} • <span className="text-sky-600 dark:text-sky-400">{lang.region}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
          🌐 Voice recommendations will use the selected language when you tap "Listen".
        </div>
      </div>
    </div>
  );
};
