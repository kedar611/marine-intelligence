import React, { useState, useEffect, useMemo } from 'react';
import { 
  AppRole, 
  LanguageCode, 
  SystemScenario, 
  OceanGridCell, 
  AuthorityAdvisory, 
  CatchReport, 
  VesselTrack 
} from './types/marine';
import { 
  INITIAL_OCEAN_GRID, 
  INITIAL_ADVISORIES, 
  INITIAL_CATCH_REPORTS, 
  INITIAL_VESSELS 
} from './data/mockOceanGrid';
import { AgenticMarineCore } from './services/agenticCore';
import { OfflineCacheService } from './services/offlineCacheService';
import { TRANSLATIONS } from './services/languageService';
import { VoiceSynthesisService } from './services/voiceService';
import { Navbar } from './components/Navbar';
import { FishermanView } from './components/FishermanView';
import { AuthorityView } from './components/AuthorityView';
import { ResearcherView } from './components/ResearcherView';
import { DataFusionInspector } from './components/DataFusionInspector';
import { AgenticReasoningModal } from './components/AgenticReasoningModal';
import { CatchReportModal } from './components/CatchReportModal';
import { SosModal } from './components/SosModal';
import { LanguageModal } from './components/LanguageModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { SihPitchModal } from './components/SihPitchModal';
import { WifiOff, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<AppRole>('fisherman');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('mr');
  const [scenario, setScenario] = useState<SystemScenario>('normal');
  const [isOffline, setIsOffline] = useState(false);
  const [isDaylightMode, setIsDaylightMode] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDeviceFrameView, setIsDeviceFrameView] = useState(false);

  const [gridCells, setGridCells] = useState<OceanGridCell[]>(INITIAL_OCEAN_GRID);
  const [selectedCellId, setSelectedCellId] = useState<string>('B2');
  const [advisories, setAdvisories] = useState<AuthorityAdvisory[]>(INITIAL_ADVISORIES);
  const [catchReports, setCatchReports] = useState<CatchReport[]>(INITIAL_CATCH_REPORTS);
  const [vessels, setVessels] = useState<VesselTrack[]>(INITIAL_VESSELS);

  // Modals
  const [isReasoningModalOpen, setIsReasoningModalOpen] = useState(false);
  const [isCatchModalOpen, setIsCatchModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);

  // Adjusted cells based on scenario
  const effectiveGridCells = useMemo(() => {
    return gridCells.map((c) => {
      if (scenario === 'high_pfz_rough_sea' && c.cellId === 'B2') {
        return {
          ...c,
          chlorophyll: 3.1,
          waveHeight: 2.8,
          windSpeed: 38,
          pressure: 1002,
        };
      }
      if (scenario === 'cyclone_alert') {
        return {
          ...c,
          waveHeight: +(c.waveHeight + 1.8).toFixed(1),
          windSpeed: c.windSpeed + 20,
          pressure: 996,
          rainfall: c.rainfall + 25,
        };
      }
      if (scenario === 'restricted_zone_surge' && c.cellId === 'B1') {
        return {
          ...c,
          restrictedZone: true,
          restrictedZoneName: 'Naval Active Live-Fire Exercise Perimeter',
        };
      }
      return c;
    });
  }, [gridCells, scenario]);

  const selectedCell = useMemo(() => {
    return effectiveGridCells.find((c) => c.cellId === selectedCellId) || effectiveGridCells[0];
  }, [effectiveGridCells, selectedCellId]);

  // Execute Agentic AI Decision Core
  const decisionResult = useMemo(() => {
    return AgenticMarineCore.executeAgenticPipeline(selectedCell, effectiveGridCells, scenario);
  }, [selectedCell, effectiveGridCells, scenario]);

  // Persist to Offline Cache
  useEffect(() => {
    OfflineCacheService.saveToOfflineCache(effectiveGridCells, decisionResult, advisories);
  }, [effectiveGridCells, decisionResult, advisories]);

  // Handlers
  const handleSelectCell = (cell: OceanGridCell) => {
    setSelectedCellId(cell.cellId);
  };

  const handleAddAdvisory = (newAdvisory: AuthorityAdvisory) => {
    setAdvisories([newAdvisory, ...advisories]);
  };

  const handleAddCatchReport = (newReport: CatchReport) => {
    setCatchReports([newReport, ...catchReports]);
  };

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      VoiceSynthesisService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      VoiceSynthesisService.speakRecommendation(
        currentLang,
        decisionResult.verdictBadge,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // View Content Switcher
  const renderMainContent = () => (
    <>
      {currentRole === 'fisherman' && (
        <FishermanView
          decision={decisionResult}
          selectedCell={selectedCell}
          allCells={effectiveGridCells}
          onSelectCell={handleSelectCell}
          currentLang={currentLang}
          isOffline={isOffline}
          vessels={vessels}
          onOpenCatchModal={() => setIsCatchModalOpen(true)}
          onOpenSosModal={() => setIsSosModalOpen(true)}
          onOpenReasoningModal={() => setIsReasoningModalOpen(true)}
          isPlayingAudio={isPlayingAudio}
          onToggleAudio={handleToggleVoice}
          isInsideDeviceFrame={isDeviceFrameView}
          isSosActive={isSosActive}
        />
      )}

      {currentRole === 'authority' && (
        <AuthorityView
          allCells={effectiveGridCells}
          selectedCell={selectedCell}
          onSelectCell={handleSelectCell}
          advisories={advisories}
          onAddAdvisory={handleAddAdvisory}
          vessels={vessels}
          currentLang={currentLang}
        />
      )}

      {currentRole === 'researcher' && (
        <ResearcherView
          allCells={effectiveGridCells}
          selectedCell={selectedCell}
          onSelectCell={handleSelectCell}
        />
      )}

      {currentRole === 'data_fusion' && (
        <DataFusionInspector
          allCells={effectiveGridCells}
          selectedCell={selectedCell}
          onSelectCell={handleSelectCell}
        />
      )}
    </>
  );

  return (
    <div className={isDaylightMode ? 'theme-light' : 'theme-dark dark'}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        {/* Navigation */}
        <Navbar
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          currentLang={currentLang}
          onOpenLangModal={() => setIsLangModalOpen(true)}
          scenario={scenario}
          onScenarioChange={setScenario}
          isOffline={isOffline}
          onToggleOffline={() => setIsOffline(!isOffline)}
          isDaylightMode={isDaylightMode}
          onToggleTheme={() => setIsDaylightMode(!isDaylightMode)}
          isDeviceFrameView={isDeviceFrameView}
          onToggleDeviceFrame={() => setIsDeviceFrameView(!isDeviceFrameView)}
          onOpenReasoningModal={() => setIsReasoningModalOpen(true)}
          onOpenPitchModal={() => setIsPitchModalOpen(true)}
        />

        {/* Offline Alert Strip */}
        {isOffline && (
          <div className="bg-amber-100 dark:bg-amber-950/60 border-b border-amber-300 dark:border-amber-700 px-4 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>{t.offline_mode_active}:</strong> {t.last_synced} {selectedCell.lastUpdated}. Cached maps and navigation routes remain fully available offline at sea.
              </span>
            </div>
            <button
              onClick={() => setIsOffline(false)}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reconnect</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
          {isDeviceFrameView ? (
            <MobileDeviceFrame
              isOffline={isOffline}
              onExitMobileView={() => setIsDeviceFrameView(false)}
            >
              {renderMainContent()}
            </MobileDeviceFrame>
          ) : (
            renderMainContent()
          )}
        </main>

        {/* Footer */}
        {!isDeviceFrameView && (
          <footer className="hidden md:block bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="font-bold text-sky-600 dark:text-sky-400">SagarMitra | AquaIntel</span>
              <span>•</span>
              <span>Multi-Source Satellite, Radar & Ocean Data Fusion</span>
              <span>•</span>
              <span>Agentic Decision Core (Safety First)</span>
            </div>
            <p className="text-[11px] text-slate-500 italic max-w-xl mx-auto">
              "We will not just tell the fisherman the weather; we will tell him when to go, where to go, and how to get there safely."
            </p>
          </footer>
        )}

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          currentLang={currentLang}
          onOpenLanguageModal={() => setIsLangModalOpen(true)}
          onPlayVoice={handleToggleVoice}
          isPlayingVoice={isPlayingAudio}
        />

        {/* Modals */}
        <LanguageModal
          isOpen={isLangModalOpen}
          onClose={() => setIsLangModalOpen(false)}
          currentLang={currentLang}
          onSelectLang={(l) => {
            setCurrentLang(l);
            setIsLangModalOpen(false);
          }}
        />

        <AgenticReasoningModal
          isOpen={isReasoningModalOpen}
          onClose={() => setIsReasoningModalOpen(false)}
          decision={decisionResult}
        />

        <SihPitchModal
          isOpen={isPitchModalOpen}
          onClose={() => setIsPitchModalOpen(false)}
          onSetScenario={setScenario}
        />

        <CatchReportModal
          isOpen={isCatchModalOpen}
          onClose={() => setIsCatchModalOpen(false)}
          selectedCell={selectedCell}
          onSubmitReport={handleAddCatchReport}
        />

        <SosModal
          isOpen={isSosModalOpen}
          onClose={() => setIsSosModalOpen(false)}
          selectedCell={selectedCell}
          onSosActivated={() => setIsSosActive(true)}
        />
      </div>
    </div>
  );
};

export default App;
