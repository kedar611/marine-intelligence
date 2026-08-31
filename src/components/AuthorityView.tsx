import React, { useState } from 'react';
import { 
  OceanGridCell, 
  AuthorityAdvisory, 
  VesselTrack, 
  LanguageCode 
} from '../types/marine';
import { InteractiveOceanMap } from './InteractiveOceanMap';
import { 
  ShieldAlert, 
  Radio, 
  Send, 
  AlertTriangle, 
  Ship, 
  MapPin, 
  Bell, 
  CheckCircle2, 
  FileText, 
  Eye, 
  Waves, 
  Wind, 
  Compass 
} from 'lucide-react';

interface AuthorityViewProps {
  allCells: OceanGridCell[];
  selectedCell: OceanGridCell;
  onSelectCell: (cell: OceanGridCell) => void;
  advisories: AuthorityAdvisory[];
  onAddAdvisory: (advisory: AuthorityAdvisory) => void;
  vessels: VesselTrack[];
  currentLang: LanguageCode;
}

export const AuthorityView: React.FC<AuthorityViewProps> = ({
  allCells,
  selectedCell,
  onSelectCell,
  advisories,
  onAddAdvisory,
  vessels,
  currentLang,
}) => {
  const [advisoryTitle, setAdvisoryTitle] = useState('');
  const [advisoryMsg, setAdvisoryMsg] = useState('');
  const [advisorySeverity, setAdvisorySeverity] = useState<'ADVISORY' | 'WARNING' | 'EMERGENCY'>('WARNING');
  const [targetSector, setTargetSector] = useState('All Maharashtra Coastal Grids (B2, C2, A1)');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisoryTitle || !advisoryMsg) return;

    const newAdv: AuthorityAdvisory = {
      id: `ADV-${Date.now()}`,
      title: advisoryTitle,
      severity: advisorySeverity,
      issuedBy: 'Indian Coast Guard Operations Command (HQ Western Region)',
      targetRegion: targetSector,
      message: advisoryMsg,
      affectedCells: [selectedCell.cellId],
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST Today',
      active: true,
    };

    onAddAdvisory(newAdv);
    setAdvisoryTitle('');
    setAdvisoryMsg('');
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  // Stats
  const unsafeCells = allCells.filter((c) => c.restrictedZone || c.waveHeight > 2.0 || c.windSpeed > 30);
  const activeFishingVessels = vessels.filter((v) => v.type === 'FISHING_BOAT');

  return (
    <div className="space-y-6">
      {/* Top Banner: Authority Command Deck */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-amber-950/40 rounded-3xl p-6 border-2 border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-amber-500/20 rounded-2xl border border-amber-500/40 text-amber-400">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                COAST GUARD & MARITIME BOARD CONSOLE
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              Coastal Marine Surveillance & Hazard Broadcast Center
            </h1>
            <p className="text-xs text-slate-400">
              Real-time vessel geofencing, hazard detection, and emergency advisory broadcast pipeline to registered fishermen.
            </p>
          </div>
        </div>

        {/* Quick Stats Counter */}
        <div className="flex items-center space-x-3 bg-navy-950/80 p-3 rounded-2xl border border-ocean-800">
          <div className="text-center px-3 border-r border-ocean-800">
            <div className="text-xl font-extrabold text-emerald-400">{activeFishingVessels.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Crafts</div>
          </div>
          <div className="text-center px-3 border-r border-ocean-800">
            <div className="text-xl font-extrabold text-red-400">{unsafeCells.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Hazard Sectors</div>
          </div>
          <div className="text-center px-3">
            <div className="text-xl font-extrabold text-amber-400">{advisories.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Advisories</div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Map & Surveillance on Left, Broadcast Console on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map & Sector Risk Status (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Coastal Risk Heatmap & Vessel Traffic Radar</span>
            </h2>
            <span className="text-xs text-slate-400">AIS Active Monitoring</span>
          </div>

          <InteractiveOceanMap
            gridCells={allCells}
            selectedCell={selectedCell}
            onSelectCell={onSelectCell}
            vessels={vessels}
            activeRole="authority"
          />

          {/* Sector Risk Grid Overview Table */}
          <div className="bg-[#05152b] rounded-2xl border border-ocean-800/80 p-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-ocean-400" />
              <span>Sector Risk Assessment Matrix (Grid Cells)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 bg-navy-950 uppercase border-b border-ocean-800">
                  <tr>
                    <th className="px-3 py-2">Grid Cell</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Wave / Wind</th>
                    <th className="px-3 py-2">Pressure</th>
                    <th className="px-3 py-2">Security Zone</th>
                    <th className="px-3 py-2">Risk Rating</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-900/60">
                  {allCells.map((c) => {
                    const isHazard = c.restrictedZone || c.waveHeight > 2.0 || c.windSpeed > 30;
                    const isSelected = c.cellId === selectedCell.cellId;

                    return (
                      <tr
                        key={c.cellId}
                        onClick={() => onSelectCell(c)}
                        className={`cursor-pointer transition-all hover:bg-ocean-900/40 ${
                          isSelected ? 'bg-ocean-900/60 border-l-4 border-amber-400' : ''
                        }`}
                      >
                        <td className="px-3 py-2.5 font-bold text-slate-100 flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                          <span>Cell {c.cellId}</span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-300 font-mono text-[11px]">
                          {c.lat.toFixed(2)}°N, {c.lon.toFixed(2)}°E
                        </td>
                        <td className="px-3 py-2.5 text-slate-200">
                          {c.waveHeight}m • {c.windSpeed} km/h
                        </td>
                        <td className="px-3 py-2.5 text-slate-300 font-mono">
                          {c.pressure} hPa
                        </td>
                        <td className="px-3 py-2.5">
                          {c.restrictedZone ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-300 border border-red-500/40">
                              RESTRICTED
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">CLEAR</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              c.restrictedZone || c.waveHeight > 2.2
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : c.waveHeight > 1.3
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {c.restrictedZone ? 'PROHIBITED' : c.waveHeight > 2.2 ? 'SEVERE RISK' : c.waveHeight > 1.3 ? 'MODERATE' : 'LOW RISK'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <button
                            onClick={() => onSelectCell(c)}
                            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 underline"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Broadcast Advisory Composer & Active Warnings */}
        <div className="space-y-4">
          {/* Broadcast Advisory Composer Form */}
          <div className="bg-[#05152b] rounded-2xl border border-amber-500/40 p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Broadcast Marine Emergency Advisory</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Pushes instant multilingual safety warning to all fishermen operating in selected marine sectors.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Advisory Title</label>
                <input
                  type="text"
                  value={advisoryTitle}
                  onChange={(e) => setAdvisoryTitle(e.target.value)}
                  placeholder="e.g. Squally Wind Warning - Return to Port"
                  className="w-full bg-navy-950 border border-ocean-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Severity Level</label>
                  <select
                    value={advisorySeverity}
                    onChange={(e) => setAdvisorySeverity(e.target.value as any)}
                    className="w-full bg-navy-950 border border-ocean-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="ADVISORY">ℹ️ Advisory (Information)</option>
                    <option value="WARNING">⚠️ Warning (Rough Sea)</option>
                    <option value="EMERGENCY">🚨 Emergency (Immediate Return)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Sector</label>
                  <input
                    type="text"
                    value={targetSector}
                    onChange={(e) => setTargetSector(e.target.value)}
                    className="w-full bg-navy-950 border border-ocean-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Message Content (Fisherman Instructions)</label>
                <textarea
                  value={advisoryMsg}
                  onChange={(e) => setAdvisoryMsg(e.target.value)}
                  rows={3}
                  placeholder="e.g. Wave heights exceeding 2.5m near offshore zones. All fishing crafts must return to harbor immediately..."
                  className="w-full bg-navy-950 border border-ocean-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-900/40 flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Broadcast Live Advisory</span>
              </button>

              {publishSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Advisory broadcasted to all registered marine VHF & mobile devices!</span>
                </div>
              )}
            </form>
          </div>

          {/* Active Advisories Stream */}
          <div className="bg-[#05152b] rounded-2xl border border-ocean-800/80 p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Active Broadcast Advisories ({advisories.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {advisories.map((adv) => (
                <div
                  key={adv.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    adv.severity === 'EMERGENCY'
                      ? 'bg-red-950/40 border-red-500/50 text-red-200'
                      : adv.severity === 'WARNING'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                      : 'bg-sky-950/40 border-sky-500/50 text-sky-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white">{adv.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{adv.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{adv.message}</p>
                  <div className="flex justify-between items-center pt-1 text-[10px] text-slate-400">
                    <span>Issued By: {adv.issuedBy}</span>
                    <span className="text-amber-400 font-semibold">Active Transmission</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
