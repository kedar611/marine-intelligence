import React, { useState } from 'react';
import { OceanGridCell } from '../types/marine';
import { 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  ZAxis 
} from 'recharts';
import { 
  Flame, 
  Search, 
  Download, 
  Sliders, 
  TrendingUp, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Fish, 
  Waves 
} from 'lucide-react';

interface ResearcherViewProps {
  allCells: OceanGridCell[];
  selectedCell: OceanGridCell;
  onSelectCell: (cell: OceanGridCell) => void;
}

export const ResearcherView: React.FC<ResearcherViewProps> = ({
  allCells,
  selectedCell,
  onSelectCell,
}) => {
  const [searchQuery, setSearchQuery] = useState(
    'Show areas where chlorophyll increased significantly while SST remained stable between 28-29°C'
  );
  const [queryResults, setQueryResults] = useState<OceanGridCell[]>(allCells);
  const [queryFeedback, setQueryFeedback] = useState<string | null>(
    'AI Query Parser matched 3 high-productivity bio-thermal upwelling zones (Cells B2, C2, C1).'
  );

  // Time series mock data for selected cell
  const timeSeriesData = [
    { day: '25 Aug', chl: +(selectedCell.chlorophyll * 0.8).toFixed(1), sst: 28.9, wave: 1.4, catchKg: 52 },
    { day: '26 Aug', chl: +(selectedCell.chlorophyll * 0.85).toFixed(1), sst: 28.8, wave: 1.3, catchKg: 58 },
    { day: '27 Aug', chl: +(selectedCell.chlorophyll * 0.95).toFixed(1), sst: 28.7, wave: 1.2, catchKg: 64 },
    { day: '28 Aug', chl: +(selectedCell.chlorophyll * 1.05).toFixed(1), sst: 28.6, wave: 1.0, catchKg: 70 },
    { day: '29 Aug', chl: +(selectedCell.chlorophyll * 1.1).toFixed(1), sst: 28.7, wave: 0.9, catchKg: 78 },
    { day: '30 Aug', chl: +(selectedCell.chlorophyll * 1.0).toFixed(1), sst: 28.7, wave: 1.1, catchKg: selectedCell.historicalCatch },
    { day: '31 Aug', chl: selectedCell.chlorophyll, sst: selectedCell.sst, wave: selectedCell.waveHeight, catchKg: selectedCell.historicalCatch },
  ];

  // Scatter data across all cells (Chlorophyll vs SST vs Catch)
  const scatterData = allCells.map((c) => ({
    name: `Cell ${c.cellId}`,
    sst: c.sst,
    chlorophyll: c.chlorophyll,
    catchKg: c.historicalCatch,
    cellId: c.cellId,
  }));

  const handleExecuteQuery = () => {
    const q = searchQuery.toLowerCase();
    let filtered = allCells;

    if (q.includes('chlorophyll') && (q.includes('2') || q.includes('high') || q.includes('increased'))) {
      filtered = filtered.filter((c) => c.chlorophyll >= 1.8);
    }
    if (q.includes('sst') && q.includes('28')) {
      filtered = filtered.filter((c) => c.sst >= 28.0 && c.sst <= 29.0);
    }

    setQueryResults(filtered);
    setQueryFeedback(
      `Spatio-Temporal Natural Language Filter: Filtered ${filtered.length} matching grid cells (${filtered.map((f) => f.cellId).join(', ')}) matching bio-thermal constraints.`
    );
  };

  const handleExportCSV = () => {
    const headers = 'CellID,Lat,Lon,Chlorophyll_mg_m3,SST_C,Wind_kmh,Wave_m,Current_ms,Pressure_hPa,Tide,HistoricalCatch_kg\n';
    const rows = allCells
      .map(
        (c) =>
          `${c.cellId},${c.lat},${c.lon},${c.chlorophyll},${c.sst},${c.windSpeed},${c.waveHeight},${c.currentSpeed},${c.pressure},${c.tide},${c.historicalCatch}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquaintel_marine_ocean_data_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Research Studio */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-purple-950/50 rounded-3xl p-6 border-2 border-purple-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-purple-500/20 rounded-2xl border border-purple-500/40 text-purple-300">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              OCEANOGRAPHIC RESEARCH & SCIENTIFIC ANALYTICS
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              Marine Bio-Thermal & Spatio-Temporal Intelligence Studio
            </h1>
            <p className="text-xs text-slate-400">
              Examine multi-variable correlations (Chlorophyll-a, SST, Currents, Bathymetry) and historical catch records.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-950 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Fused Dataset (CSV)</span>
        </button>
      </div>

      {/* 1. NATURAL LANGUAGE RESEARCH QUERY ENGINE (SECTION 13 OF SIH) */}
      <div className="bg-[#05152b] rounded-2xl border border-ocean-800/80 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Natural Language Spatio-Temporal Query Engine</span>
          </h3>
          <span className="text-xs text-purple-300 font-mono">LLM + PostGIS Query Parser</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteQuery()}
              placeholder="e.g. Show areas where chlorophyll increased significantly while SST remained stable..."
              className="w-full bg-navy-950 border border-ocean-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 pl-10"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            onClick={handleExecuteQuery}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            Execute Query
          </button>
        </div>

        {queryFeedback && (
          <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl text-xs text-purple-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>{queryFeedback}</span>
          </div>
        )}
      </div>

      {/* 2. SCIENTIFIC CHARTS: SCATTER & TIME-SERIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chlorophyll vs SST Scatter Plot */}
        <div className="bg-[#05152b] rounded-2xl border border-ocean-800/80 p-5 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Fish className="w-4 h-4 text-emerald-400" />
                <span>Chlorophyll-a vs Sea Surface Temperature (SST)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Identifies prime thermal front upwelling clusters across all grid cells
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              Bio-Thermal Matrix
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="sst"
                  name="SST"
                  unit="°C"
                  domain={[27, 30.5]}
                  stroke="#94a3b8"
                  fontSize={10}
                  label={{ value: 'Sea Surface Temp (°C)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="chlorophyll"
                  name="Chlorophyll"
                  unit="mg/m³"
                  domain={[0.5, 3.5]}
                  stroke="#94a3b8"
                  fontSize={10}
                  label={{ value: 'Chlorophyll-a (mg/m³)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                />
                <ZAxis type="number" dataKey="catchKg" range={[60, 240]} name="Catch Volume" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-navy-950 p-2.5 rounded-xl border border-ocean-700 text-xs shadow-xl text-slate-200">
                          <strong className="text-sky-300">{data.name}</strong>
                          <div>SST: <span className="text-white font-mono">{data.sst}°C</span></div>
                          <div>Chlorophyll: <span className="text-emerald-400 font-mono">{data.chlorophyll} mg/m³</span></div>
                          <div>Historical Catch: <span className="text-amber-300 font-mono">{data.catchKg} kg</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Grid Cells" data={scatterData} fill="#10b981" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Spatio-Temporal Time Series */}
        <div className="bg-[#05152b] rounded-2xl border border-ocean-800/80 p-5 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>Multi-Day Temporal Evolution (Cell {selectedCell.cellId})</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Temporal trends in Phytoplankton biomass vs Catch vs Wave swell
              </p>
            </div>
            <select
              value={selectedCell.cellId}
              onChange={(e) => {
                const found = allCells.find((c) => c.cellId === e.target.value);
                if (found) onSelectCell(found);
              }}
              className="bg-navy-950 border border-ocean-700 text-xs text-sky-300 rounded-lg px-2 py-1"
            >
              {allCells.map((c) => (
                <option key={c.cellId} value={c.cellId}>
                  Cell {c.cellId}
                </option>
              ))}
            </select>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={10} label={{ value: 'Chl (mg/m³)', angle: -90, position: 'insideLeft', fill: '#10b981', fontSize: 9 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} label={{ value: 'Catch (kg)', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#06152a', borderColor: '#1e3a8a', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line yAxisId="left" type="monotone" dataKey="chl" name="Chlorophyll-a" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="catchKg" name="Catch Volume (kg)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="left" type="monotone" dataKey="wave" name="Wave Height (m)" stroke="#38bdf8" strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
