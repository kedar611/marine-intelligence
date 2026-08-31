import React from 'react';
import { 
  Anchor, 
  ShieldAlert, 
  Compass, 
  Database, 
  Globe, 
  Wifi, 
  WifiOff, 
  Sun, 
  Moon, 
  Flame, 
  Smartphone, 
  Monitor, 
  Trophy,
  HelpCircle
} from 'lucide-react';
import { AppRole, LanguageCode, SystemScenario } from '../types/marine';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../services/languageService';

interface NavbarProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  currentLang: LanguageCode;
  onOpenLangModal: () => void;
  scenario: SystemScenario;
  onScenarioChange: (scenario: SystemScenario) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  isDaylightMode: boolean;
  onToggleTheme: () => void;
  isDeviceFrameView: boolean;
  onToggleDeviceFrame: () => void;
  onOpenReasoningModal: () => void;
  onOpenPitchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentLang,
  onOpenLangModal,
  scenario,
  onScenarioChange,
  isOffline,
  onToggleOffline,
  isDaylightMode,
  onToggleTheme,
  isDeviceFrameView,
  onToggleDeviceFrame,
  onOpenReasoningModal,
  onOpenPitchModal,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-slate-100 dark:bg-slate-950 px-4 py-1 text-xs border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-600 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-sky-700 dark:text-sky-400">
            Govt. of India • SIH 2026
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline font-medium text-slate-700 dark:text-slate-300">
            Marine Intelligence & Decision Support Platform
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* SIH Pitch Walkthrough Button */}
          <button
            onClick={onOpenPitchModal}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-extrabold shadow-sm transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>SIH Judge Pitch</span>
          </button>

          {/* Scenario Trigger */}
          <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 font-semibold hidden md:inline">Scenario:</span>
            <select
              value={scenario}
              onChange={(e) => onScenarioChange(e.target.value as SystemScenario)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="normal" className="bg-white dark:bg-slate-900">☀️ Normal Calm Day (Cell B2 Safe)</option>
              <option value="high_pfz_rough_sea" className="bg-white dark:bg-slate-900">🌊 High Fish + Rough Waves (Safety Override)</option>
              <option value="cyclone_alert" className="bg-white dark:bg-slate-900">🌀 Squall / Cyclone Warning (NO-GO)</option>
              <option value="restricted_zone_surge" className="bg-white dark:bg-slate-900">🚫 Naval Restricted Zone Defense</option>
            </select>
          </div>

          {/* Sunlight Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            title="Toggle between Daylight High-Contrast Mode and Night Mode"
          >
            {isDaylightMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Sunlight</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Night</span>
              </>
            )}
          </button>

          {/* Offline Mode Indicator */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-bold transition-all border ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            <span className="hidden sm:inline">{isOffline ? 'OFFLINE' : 'LIVE'}</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                  {t.app_title}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[11px] font-bold border border-sky-200 dark:border-sky-800">
                  AquaIntel
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                {t.app_subtitle}
              </p>
            </div>
          </div>

          {/* Persona Tabs (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onRoleChange('fisherman')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'fisherman'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Anchor className="w-4 h-4" />
              <span>{t.role_fisherman}</span>
            </button>

            <button
              onClick={() => onRoleChange('authority')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'authority'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t.role_authority}</span>
            </button>

            <button
              onClick={() => onRoleChange('researcher')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'researcher'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{t.role_researcher}</span>
            </button>

            <button
              onClick={() => onRoleChange('data_fusion')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'data_fusion'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{t.role_data_fusion}</span>
            </button>
          </div>

          {/* Right Controls: Device Mode Switcher & Language Picker */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Presentation Device Mode Switcher (Mobile App View / Desktop View) */}
            <button
              onClick={onToggleDeviceFrame}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all border ${
                isDeviceFrameView
                  ? 'bg-sky-600 text-white border-sky-500 ring-2 ring-sky-300 dark:ring-sky-800'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
              title="Toggle presentation view: Show inside a Smartphone frame or full Desktop command center"
            >
              {isDeviceFrameView ? (
                <>
                  <Monitor className="w-4 h-4" />
                  <span className="hidden sm:inline">Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span className="hidden sm:inline">Mobile App View</span>
                  <span className="sm:hidden">App View</span>
                </>
              )}
            </button>

            {/* Language Modal Trigger */}
            <button
              onClick={onOpenLangModal}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 border border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-200 text-xs font-extrabold shadow-sm transition-all"
            >
              <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{currentLangMeta.nativeLabel}</span>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono">({currentLang.toUpperCase()})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
