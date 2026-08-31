import React, { useState } from 'react';
import { 
  OceanGridCell, 
  AgentDecisionResult, 
  LanguageCode, 
  VesselTrack 
} from '../types/marine';
import { TRANSLATIONS } from '../services/languageService';
import { InteractiveOceanMap } from './InteractiveOceanMap';
import { 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Fish, 
  Navigation, 
  Clock, 
  Compass, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Mic, 
  Info, 
  Fuel, 
  Radio 
} from 'lucide-react';

interface FishermanViewProps {
  decision: AgentDecisionResult;
  selectedCell: OceanGridCell;
  allCells: OceanGridCell[];
  onSelectCell: (cell: OceanGridCell) => void;
  currentLang: LanguageCode;
  isOffline: boolean;
  vessels: VesselTrack[];
  onOpenCatchModal: () => void;
  onOpenSosModal: () => void;
  onOpenReasoningModal: () => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  isInsideDeviceFrame?: boolean;
  isSosActive?: boolean;
}

export const FishermanView: React.FC<FishermanViewProps> = ({
  decision,
  selectedCell,
  allCells,
  onSelectCell,
  currentLang,
  isOffline,
  vessels,
  onOpenCatchModal,
  onOpenSosModal,
  onOpenReasoningModal,
  isPlayingAudio,
  onToggleAudio,
  isInsideDeviceFrame = false,
  isSosActive = false,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [voiceQueryInput, setVoiceQueryInput] = useState('');
  const [aiAssistantReply, setAiAssistantReply] = useState<string | null>(null);

  const handleAskAssistant = (query: string) => {
    setVoiceQueryInput(query);
    if (
      query.toLowerCase().includes('tomorrow') ||
      query.toLowerCase().includes('safe') ||
      query.toLowerCase().includes('fishing') ||
      query.includes('मासेमारी') ||
      query.includes('मछली')
    ) {
      if (decision.dispatchApproved) {
        setAiAssistantReply(
          `SagarMitra: ✅ ${t.status_suitable}. ${t.best_pfz_zone}: Cell ${decision.bestCell.cellId} (${decision.bestCell.distanceFromCoastKm} km SW). ${t.best_window}: 06:00 - 10:00 AM. ${t.return_before}: ${decision.returnBefore}.`
        );
      } else {
        setAiAssistantReply(
          `SagarMitra: ⚠️ ${t.status_unsafe}. Waves: ${decision.bestCell.waveHeight}m, Wind: ${decision.bestCell.windSpeed} km/h. Please stay safely in harbor!`
        );
      }
    } else {
      setAiAssistantReply(
        `SagarMitra: Live observation for Cell ${selectedCell.cellId} -> Chlorophyll: ${selectedCell.chlorophyll} mg/m³, SST: ${selectedCell.sst}°C, Wave: ${selectedCell.waveHeight}m, Tide: ${selectedCell.tide} (${selectedCell.tideHeight}m).`
      );
    }
  };

  const statusTheme = {
    SAFE_TO_GO: {
      bg: 'bg-emerald-600 dark:bg-emerald-700 text-white',
      border: 'border-emerald-500',
      title: t.status_suitable,
      sub: 'Sea state is safe for fishing. Productive feeding zone detected.',
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      spokenText: t.voice_script_suitable,
    },
    MODERATE_CAUTION: {
      bg: 'bg-amber-600 dark:bg-amber-700 text-white',
      border: 'border-amber-500',
      title: t.status_moderate,
      sub: 'Marginal conditions. Undertake short inshore trips only and return before afternoon.',
      icon: <AlertTriangle className="w-8 h-8 text-white" />,
      spokenText: t.voice_script_moderate,
    },
    DANGER_DO_NOT_GO: {
      bg: 'bg-red-600 dark:bg-red-700 text-white',
      border: 'border-red-500',
      title: t.status_unsafe,
      sub: decision.decisionRationale || 'Dangerous sea state or restricted zone. Stay safely at port.',
      icon: <ShieldAlert className="w-8 h-8 text-white" />,
      spokenText: t.voice_script_unsafe,
    },
  }[decision.verdictBadge];

  // In Device Frame, use single-column layout so nothing ever squishes
  const grid4Cols = isInsideDeviceFrame ? 'grid-cols-2 gap-2.5' : 'grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4';
  const mainGridCols = isInsideDeviceFrame ? 'flex flex-col space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6';

  return (
    <div className="space-y-4">
      {/* Telemetry Strip */}
      <div className="flex flex-wrap items-center justify-between gap-1 px-1 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="font-bold text-sky-700 dark:text-sky-400">ISRO • IMD • INCOIS • AIS</span>
        <span className="font-mono text-[10px]">{selectedCell.lastUpdated}</span>
      </div>

      {/* 1. HERO DECISION CARD */}
      <div className={`rounded-3xl p-5 sm:p-6 ${statusTheme.bg} shadow-md border-2 ${statusTheme.border}`}>
        <div className="flex flex-col space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl flex-shrink-0">
              {statusTheme.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                {decision.verdictBadge === 'SAFE_TO_GO' ? 'GO (SAFE)' : decision.verdictBadge === 'MODERATE_CAUTION' ? 'CAUTION' : 'NO-GO'}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
                {statusTheme.title}
              </h1>
              <p className="text-xs text-white/90 mt-0.5 leading-relaxed">
                {statusTheme.sub}
              </p>
            </div>
          </div>

          {/* Action Buttons inside Card */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={onToggleAudio}
              className={`flex-1 min-w-[140px] flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl font-extrabold text-xs shadow-md transition-all ${
                isPlayingAudio
                  ? 'bg-amber-300 text-slate-950 animate-pulse'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-red-600" />
                  <span>Stop Speaking</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>{t.listen_audio}</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenReasoningModal}
              className="flex items-center justify-center space-x-1 py-3 px-3.5 rounded-2xl bg-black/25 hover:bg-black/35 text-xs font-semibold text-white/90 border border-white/30"
            >
              <Info className="w-4 h-4" />
              <span>{t.btn_inspect_reasoning}</span>
            </button>
          </div>
        </div>

        {/* Live Subtitle Transcript */}
        {isPlayingAudio && (
          <div className="mt-3.5 pt-3 border-t border-white/20 space-y-1 animate-fadeIn">
            <div className="flex items-center justify-between text-[11px] text-white/90 font-bold">
              <span className="flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 animate-spin" />
                <span>Voice Audio ({currentLang.toUpperCase()}):</span>
              </span>
              <span className="text-[10px] opacity-80">Playing</span>
            </div>
            <div className="p-2.5 bg-black/25 rounded-xl text-xs font-medium text-white/95 leading-relaxed">
              "{statusTheme.spokenText}"
            </div>
          </div>
        )}
      </div>

      {/* 2. SUMMARY TILES */}
      <div className={`grid ${grid4Cols}`}>
        {/* Safety Score */}
        <div className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t.safety_score}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          </div>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{decision.safetyScore}</span>
            <span className="text-slate-500 text-xs font-semibold">/100</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                decision.safetyScore >= 75
                  ? 'bg-emerald-500'
                  : decision.safetyScore >= 50
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${decision.safetyScore}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 truncate">
            Wave: <strong className="text-slate-700 dark:text-slate-200">{selectedCell.waveHeight}m</strong> • Wind: <strong className="text-slate-700 dark:text-slate-200">{selectedCell.windSpeed}km/h</strong>
          </div>
        </div>

        {/* Best PFZ */}
        <div className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t.best_pfz_zone}</span>
            <Fish className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
          </div>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-sky-700 dark:text-sky-300">
              {decision.bestCell.distanceFromCoastKm} km SW
            </span>
            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-0.5 truncate">
              Cell {decision.bestCell.cellId} • Match: <span className="text-emerald-600 dark:text-emerald-400">{decision.pfzSuitabilityScore}%</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 truncate">
            Chl: <strong className="text-slate-700 dark:text-slate-200">{selectedCell.chlorophyll}</strong> • SST: <strong className="text-slate-700 dark:text-slate-200">{selectedCell.sst}°C</strong>
          </div>
        </div>

        {/* Best Window */}
        <div className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t.best_window}</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          </div>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-400">
              06:00 – 10:00
            </span>
            <div className="text-[10px] font-medium text-slate-600 dark:text-slate-300 mt-0.5 truncate">
              Morning feeding window
            </div>
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-1.5 truncate">
            ⏱️ {t.return_before}: <strong className="text-slate-900 dark:text-white">{decision.returnBefore}</strong>
          </div>
        </div>

        {/* Voyage ROI */}
        <div className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Voyage ROI</span>
            <Fuel className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          </div>
          <div className="mt-1">
            <span className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
              +12% Fuel Saved
            </span>
            <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5 truncate">
              ~₹850 savings via current
            </div>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 truncate">
            Route: <strong className="text-emerald-600 dark:text-emerald-400">Fairway B</strong>
          </div>
        </div>
      </div>

      {/* 3. MAP + SIDEBAR (PROPERLY RESPONSIVE IN DEVICE FRAME) */}
      <div className={mainGridCols}>
        {/* Map Container */}
        <div className="space-y-2.5 w-full lg:col-span-2">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Nautical Chart & Safe Navigation Route</span>
            </h2>
            <span className="text-[10px] text-slate-500">Tap cell to select</span>
          </div>

          <InteractiveOceanMap
            gridCells={allCells}
            selectedCell={selectedCell}
            onSelectCell={onSelectCell}
            recommendedRoute={decision.recommendedRoute}
            vessels={vessels}
            activeRole="fisherman"
            isSosActive={isSosActive}
          />

          {decision.avoidInstructions.length > 0 && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <strong>{t.avoid_corridor}:</strong> {decision.avoidInstructions.join(' • ')}
              </div>
            </div>
          )}
        </div>

        {/* Hourly Forecast & Species Side Panels */}
        <div className="space-y-3 w-full">
          {/* Hourly Timeline */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 mb-2.5">
              <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Hourly Sea Safety Timeline</span>
            </h3>

            <div className="space-y-1.5">
              {[
                { time: '06:00 - 09:00', status: 'SAFE', wave: selectedCell.waveHeight, wind: selectedCell.windSpeed, note: 'Calm water, optimal for nets' },
                { time: '09:00 - 11:30', status: 'SAFE', wave: +(selectedCell.waveHeight + 0.1).toFixed(1), wind: selectedCell.windSpeed + 2, note: 'Good visibility, favorable tide' },
                { time: '11:30 - 14:00', status: selectedCell.waveHeight > 1.8 ? 'UNSAFE' : 'MODERATE', wave: +(selectedCell.waveHeight + 0.4).toFixed(1), wind: selectedCell.windSpeed + 6, note: 'Thermal breeze building' },
                { time: '14:00 - 18:00', status: 'UNSAFE', wave: +(selectedCell.waveHeight + 0.8).toFixed(1), wind: selectedCell.windSpeed + 12, note: 'Rough chop; return to port' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border flex items-center justify-between text-[11px] ${
                    item.status === 'SAFE'
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : item.status === 'MODERATE'
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                      : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold">{item.time}</div>
                    <div className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">{item.note}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                        item.status === 'SAFE'
                          ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                          : item.status === 'MODERATE'
                          ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
                          : 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-200'
                      }`}
                    >
                      {item.status}
                    </span>
                    <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5">{item.wave}m • {item.wind}kph</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Likely Species */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 mb-2">
              <Fish className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{t.species_likely} (Sector {selectedCell.cellId})</span>
            </h3>

            <div className="space-y-1.5">
              {selectedCell.dominantSpecies.map((species, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1.5 truncate pr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{species}</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex-shrink-0">{Math.max(65, 92 - idx * 10)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catch Report & SOS Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenCatchModal}
              className="py-2.5 px-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm flex items-center justify-center space-x-1.5 transition-all truncate"
            >
              <Send className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{t.btn_submit_catch}</span>
            </button>

            <button
              onClick={onOpenSosModal}
              className="py-2.5 px-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm flex items-center justify-center space-x-1.5 transition-all animate-pulse truncate"
            >
              <PhoneCall className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{t.btn_sos}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. CONVERSATIONAL VOICE ASSISTANT */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
        <div className="flex items-center space-x-1.5">
          <div className="p-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            Conversational Voice Assistant
          </h3>
        </div>

        <div className="flex items-center space-x-1.5">
          <input
            type="text"
            value={voiceQueryInput}
            onChange={(e) => setVoiceQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant(voiceQueryInput)}
            placeholder={t.ask_ai_placeholder}
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 min-w-0"
          />
          <button
            onClick={() => handleAskAssistant(voiceQueryInput || 'Can I go fishing tomorrow morning?')}
            className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-sm flex-shrink-0"
          >
            Ask
          </button>
        </div>

        {aiAssistantReply && (
          <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl text-[11px] text-sky-950 dark:text-sky-100 flex items-start space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">{aiAssistantReply}</div>
          </div>
        )}
      </div>
    </div>
  );
};
