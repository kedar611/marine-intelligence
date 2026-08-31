import React from 'react';
import { Wifi, WifiOff, Battery, Signal, Monitor } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  isOffline: boolean;
  onExitMobileView: () => void;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  isOffline,
  onExitMobileView,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 min-h-[85vh] animate-fadeIn">
      {/* Presentation Switcher Header */}
      <div className="mb-3 flex items-center justify-between w-full max-w-[420px] px-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Live Smartphone App View
          </span>
        </div>

        <button
          onClick={onExitMobileView}
          className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all shadow-sm"
        >
          <Monitor className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Exit to Full Desktop</span>
        </button>
      </div>

      {/* Realistic Smartphone Frame (420px width - perfectly proportioned for modern devices) */}
      <div className="relative w-full max-w-[420px] h-[860px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-[6px] border-slate-700 ring-1 ring-slate-600/50 flex flex-col overflow-hidden">
        {/* Physical Button Accents */}
        <div className="absolute -left-[9px] top-28 w-[4px] h-12 bg-slate-600 rounded-l-md"></div>
        <div className="absolute -left-[9px] top-44 w-[4px] h-12 bg-slate-600 rounded-l-md"></div>
        <div className="absolute -right-[9px] top-36 w-[4px] h-16 bg-slate-600 rounded-r-md"></div>

        {/* Screen Display */}
        <div className="relative w-full h-full bg-slate-100 dark:bg-slate-950 rounded-[40px] overflow-hidden flex flex-col border border-slate-800 shadow-inner">
          {/* Status Bar */}
          <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 pt-2.5 pb-1.5 flex justify-between items-center text-[11px] font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200/60 dark:border-slate-800/60 select-none">
            <span>06:00</span>

            {/* Notch / Dynamic Island */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center space-x-1.5 px-2">
              <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-sky-900"></div>
            </div>

            {/* Status Icons */}
            <div className="flex items-center space-x-1.5">
              <Signal className="w-3 h-3 text-slate-700 dark:text-slate-300" />
              {isOffline ? (
                <WifiOff className="w-3 h-3 text-amber-500" />
              ) : (
                <Wifi className="w-3 h-3 text-emerald-500" />
              )}
              <div className="flex items-center space-x-0.5">
                <span className="text-[10px]">98%</span>
                <Battery className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Inner App Body (Smooth Scrolling) */}
          <div className="flex-1 overflow-y-auto px-3 py-3 pb-24 scroll-smooth">
            {children}
          </div>

          {/* Navigation Bar Home Indicator Pill */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full z-50 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};
