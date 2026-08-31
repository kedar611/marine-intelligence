import React, { useState } from 'react';
import { OceanGridCell } from '../types/marine';
import { DataFusionService } from '../services/dataFusionService';
import { 
  Database, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  ShieldCheck, 
  FileCode, 
  Table, 
  Sliders 
} from 'lucide-react';

interface DataFusionInspectorProps {
  allCells: OceanGridCell[];
  selectedCell: OceanGridCell;
  onSelectCell: (cell: OceanGridCell) => void;
}

export const DataFusionInspector: React.FC<DataFusionInspectorProps> = ({
  allCells,
  selectedCell,
  onSelectCell,
}) => {
  const [activeTab, setActiveTab] = useState<'b2_focus' | 'pipeline_steps' | 'raw_sources' | 'vector'>('b2_focus');

  const pipelineSteps = DataFusionService.getFusionPipelineSteps(selectedCell);
  const rawSources = DataFusionService.getRawSourceBreakdown(selectedCell);
  const featureVector = DataFusionService.extractFeatureVector(selectedCell);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-teal-100 dark:bg-teal-950/60 rounded-2xl text-teal-700 dark:text-teal-400">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              DATA FUSION & TELEMETRY ENGINE
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Data Fusion Layer & Grid Cell Inspection
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Harmonizing ISRO satellite, IMD Doppler weather, ocean buoy, tide gauge, and AIS vessel feeds into unified 0.1° grids.
            </p>
          </div>
        </div>

        {/* Cell Switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold pl-2">Cell:</span>
          <select
            value={selectedCell.cellId}
            onChange={(e) => {
              const c = allCells.find((cell) => cell.cellId === e.target.value);
              if (c) onSelectCell(c);
            }}
            className="bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 font-bold border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
          >
            {allCells.map((c) => (
              <option key={c.cellId} value={c.cellId}>
                Cell {c.cellId} {c.cellId === 'B2' ? '★ (SIH Target)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('b2_focus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'b2_focus'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📍 Grid Cell B2 Telemetry Matrix
        </button>
        <button
          onClick={() => setActiveTab('pipeline_steps')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'pipeline_steps'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ⚙️ 5 Jobs of Data Fusion Layer
        </button>
        <button
          onClick={() => setActiveTab('raw_sources')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'raw_sources'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📡 Raw Multi-Source Telemetry
        </button>
        <button
          onClick={() => setActiveTab('vector')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'vector'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🔢 12-Dimensional Feature Vector
        </button>
      </div>

      {/* TAB 1: EXACT GRID CELL B2 INSPECTOR (REPLICATING SIH SPECIFICATION) */}
      {activeTab === 'b2_focus' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  GRID CELL {selectedCell.cellId} — FUSED MARINE OBSERVATION
                </h2>
              </div>
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                {selectedCell.lastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Latitude</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{selectedCell.lat.toFixed(2)}° N</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Longitude</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{selectedCell.lon.toFixed(2)}° E</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <span className="text-teal-900 dark:text-teal-300 font-bold">Chlorophyll-a (Phytoplankton)</span>
                <span className="text-teal-700 dark:text-teal-300 font-mono font-bold text-sm">{selectedCell.chlorophyll} mg/m³</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <span className="text-teal-900 dark:text-teal-300 font-bold">Sea Surface Temp (SST)</span>
                <span className="text-teal-700 dark:text-teal-300 font-mono font-bold text-sm">{selectedCell.sst}°C</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Wind Speed & Direction</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{selectedCell.windSpeed} km/h @ {selectedCell.windDirection}° SW</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Rainfall</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{selectedCell.rainfall} mm</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Pressure</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{selectedCell.pressure} hPa</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Wave Height</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{selectedCell.waveHeight} m</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Current Speed</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{selectedCell.currentSpeed} m/s @ {selectedCell.currentDirection}°</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Tide & Tide Height</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{selectedCell.tide} ({selectedCell.tideHeight} m)</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Shipping Activity</span>
                <span className="text-amber-700 dark:text-amber-400 font-mono font-bold text-sm">{selectedCell.shippingActivity}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Restricted Zone</span>
                <span className={`font-mono font-bold text-sm ${selectedCell.restrictedZone ? 'text-red-600' : 'text-emerald-600'}`}>
                  {selectedCell.restrictedZone ? 'YES (RESTRICTED)' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 sm:col-span-2">
                <span className="text-emerald-900 dark:text-emerald-300 font-bold">Historical Catch Benchmark</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-mono font-bold text-sm">{selectedCell.historicalCatch} kg / trip</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>SIH Presentation Grounding</span>
            </h3>

            <blockquote className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border-l-4 border-teal-500 text-xs text-teal-900 dark:text-teal-200 italic leading-relaxed">
              "Our Data Fusion Layer integrates heterogeneous satellite, weather, oceanographic, fisheries and vessel data by cleaning, spatially aligning and temporally synchronizing them into a common geospatial dataset."
            </blockquote>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Chlorophyll alone cannot identify fish, and weather alone cannot determine safety. Combining all parameters at the same grid cell empowers our AI models to provide safe and productive fishing routes.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: 5 JOBS */}
      {activeTab === 'pipeline_steps' && (
        <div className="space-y-4">
          {pipelineSteps.map((step) => (
            <div
              key={step.stepIndex}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-extrabold flex items-center justify-center text-xs">
                    J{step.stepIndex}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {step.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-500">Input:</strong> <span className="text-slate-700 dark:text-slate-300">{step.inputSummary}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                  <strong className="text-teal-800 dark:text-teal-400">Output:</strong> <span className="text-teal-900 dark:text-teal-200">{step.outputSummary}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RAW SOURCES */}
      {activeTab === 'raw_sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rawSources.map((source, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-sky-700 dark:text-sky-400 uppercase">{source.sourceName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {source.qualityFlag}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {Object.entries(source.rawParams).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700/60">
                    <span className="text-slate-500 text-[11px]">{k}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: 12-DIMENSIONAL FEATURE VECTOR */}
      {activeTab === 'vector' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Normalized Feature Vector (Cell {featureVector.cellId})</h3>
              <p className="text-xs text-slate-500">Fed directly into Safety & PFZ Decision Models</p>
            </div>
            <span className="text-xs font-mono text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
              Dim: 12x1
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {featureVector.labels.map((label, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300">{label}</span>
                  <span className="text-teal-700 dark:text-teal-400 font-mono font-bold">
                    Raw: {featureVector.vector[i]} | Norm: {featureVector.normalizedVector[i].toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div
                    className="h-full bg-teal-600 dark:bg-teal-400 rounded-full"
                    style={{ width: `${Math.min(100, featureVector.normalizedVector[i] * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
