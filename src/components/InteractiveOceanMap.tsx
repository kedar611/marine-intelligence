import React, { useState } from 'react';
import { 
  OceanGridCell, 
  OptimizedRoute, 
  VesselTrack, 
  AppRole 
} from '../types/marine';
import { 
  SHIPPING_LANE_POLYGON, 
  RESTRICTED_ZONE_POLYGON, 
  HARBOR_START_LOCATION 
} from '../data/mockOceanGrid';
import { 
  Layers, 
  Compass, 
  Fish, 
  Ship, 
  ShieldCheck, 
  Waves 
} from 'lucide-react';

interface OceanMapProps {
  gridCells: OceanGridCell[];
  selectedCell: OceanGridCell;
  onSelectCell: (cell: OceanGridCell) => void;
  recommendedRoute?: OptimizedRoute;
  vessels: VesselTrack[];
  activeRole: AppRole;
}

export const InteractiveOceanMap: React.FC<OceanMapProps> = ({
  gridCells,
  selectedCell,
  onSelectCell,
  recommendedRoute,
  vessels,
  activeRole,
}) => {
  const [mapLayer, setMapLayer] = useState<'pfz' | 'safety' | 'sst' | 'waves'>('pfz');
  const [showShippingLanes, setShowShippingLanes] = useState(true);
  const [showRestrictedZones, setShowRestrictedZones] = useState(true);
  const [showVessels, setShowVessels] = useState(true);

  // SVG coordinate transformation helpers
  const minLat = 18.15;
  const maxLat = 19.05;
  const minLon = 72.35;
  const maxLon = 73.05;

  const latToY = (lat: number) => {
    return 600 - ((lat - minLat) / (maxLat - minLat)) * 580 - 10;
  };

  const lonToX = (lon: number) => {
    return ((lon - minLon) / (maxLon - minLon)) * 760 + 20;
  };

  const harborX = lonToX(HARBOR_START_LOCATION.lon);
  const harborY = latToY(HARBOR_START_LOCATION.lat);

  const shippingPoints = SHIPPING_LANE_POLYGON.map(([lat, lon]) => `${lonToX(lon)},${latToY(lat)}`).join(' ');
  const restrictedPoints = RESTRICTED_ZONE_POLYGON.map(([lat, lon]) => `${lonToX(lon)},${latToY(lat)}`).join(' ');

  return (
    <div className="relative w-full h-[720px] min-h-[500px] bg-[#0c2444] rounded-3xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-md flex flex-col">
      {/* Map Header / Layer Toggles */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Selector */}
        <div className="pointer-events-auto flex items-center space-x-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
          <span className="text-slate-500 px-2 py-0.5 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Layer:</span>
          </span>
          <button
            onClick={() => setMapLayer('pfz')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              mapLayer === 'pfz'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🐟 Fish Zones (PFZ)
          </button>
          <button
            onClick={() => setMapLayer('safety')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              mapLayer === 'safety'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🛡️ Sea Safety
          </button>
          <button
            onClick={() => setMapLayer('sst')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              mapLayer === 'sst'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🌡️ SST Fronts
          </button>
          <button
            onClick={() => setMapLayer('waves')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              mapLayer === 'waves'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🌊 Wave Swell
          </button>
        </div>

        {/* Feature Toggles */}
        <div className="pointer-events-auto flex items-center space-x-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-[11px]">
          <label className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={showShippingLanes}
              onChange={(e) => setShowShippingLanes(e.target.checked)}
              className="rounded accent-amber-600"
            />
            <span>Shipping Corridor</span>
          </label>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <label className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={showRestrictedZones}
              onChange={(e) => setShowRestrictedZones(e.target.checked)}
              className="rounded accent-red-600"
            />
            <span>Naval Restricted</span>
          </label>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <label className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={showVessels}
              onChange={(e) => setShowVessels(e.target.checked)}
              className="rounded accent-sky-600"
            />
            <span>AIS Vessels</span>
          </label>
        </div>
      </div>

      {/* Nautical Chart Canvas */}
      <div className="relative w-full flex-1 overflow-hidden select-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="nauticalSea" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0b2242" />
              <stop offset="60%" stopColor="#0e2a52" />
              <stop offset="100%" stopColor="#143666" />
            </linearGradient>

            <pattern id="nauticalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1d4478" strokeWidth="0.5" strokeDasharray="2 2" />
            </pattern>

            <pattern id="shippingPattern" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
            </pattern>

            <pattern id="restrictedPattern" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.6" />
            </pattern>
          </defs>

          {/* Base Sea Background */}
          <rect width="800" height="600" fill="url(#nauticalSea)" />
          <rect width="800" height="600" fill="url(#nauticalGrid)" />

          {/* Bathymetry Contours */}
          <path
            d="M 680,20 Q 640,180 620,300 T 590,580 L 800,580 L 800,20 Z"
            fill="#103868"
            opacity="0.5"
          />
          <path
            d="M 720,20 Q 690,180 670,300 T 650,580 L 800,580 L 800,20 Z"
            fill="#16467e"
            opacity="0.6"
          />

          {/* Maharashtra / Mumbai Coastline (Warm coastal sand/stone color) */}
          <path
            d="M 750,0 Q 730,120 740,200 T 710,340 Q 690,420 700,500 T 680,600 L 800,600 L 800,0 Z"
            fill="#dbe4ee"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Sassoon Docks Jetty */}
          <path
            d="M 730,160 Q 700,180 710,210 T 735,230 Z"
            fill="#cbd5e1"
            stroke="#64748b"
            strokeWidth="1"
          />
          <text x="718" y="195" fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="end">
            Mumbai Coast / Sassoon Docks
          </text>

          {/* Shipping Lane Corridor */}
          {showShippingLanes && (
            <g>
              <polygon
                points={shippingPoints}
                fill="url(#shippingPattern)"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={lonToX(72.685)}
                y={latToY(18.82)}
                fill="#fde68a"
                fontSize="9.5"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(-75 ${lonToX(72.685)} ${latToY(18.82)})`}
              >
                ▲ COMMERCIAL SHIPPING CORRIDOR (AVOID) ▲
              </text>
            </g>
          )}

          {/* Restricted Naval Zone */}
          {showRestrictedZones && (
            <g>
              <polygon
                points={restrictedPoints}
                fill="url(#restrictedPattern)"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={lonToX(72.515)}
                y={latToY(18.675)}
                fill="#fca5a5"
                fontSize="9.5"
                fontWeight="bold"
                textAnchor="middle"
              >
                🚫 NAVAL ENCLAVE (B1) - PROHIBITED
              </text>
            </g>
          )}

          {/* Recommended Safe Fairway Route */}
          {recommendedRoute && (
            <g>
              <polyline
                points={recommendedRoute.waypoints.map(([lat, lon]) => `${lonToX(lon)},${latToY(lat)}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray="8 4"
                strokeLinecap="round"
              />

              {recommendedRoute.waypoints.map(([lat, lon], idx) => (
                <circle
                  key={idx}
                  cx={lonToX(lon)}
                  cy={latToY(lat)}
                  r={idx === 0 || idx === recommendedRoute.waypoints.length - 1 ? 5 : 3.5}
                  fill={idx === 0 ? '#38bdf8' : idx === recommendedRoute.waypoints.length - 1 ? '#10b981' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          )}

          {/* Grid Cells */}
          {gridCells.map((cell) => {
            const cx = lonToX(cell.lon);
            const cy = latToY(cell.lat);
            const isSelected = selectedCell.cellId === cell.cellId;

            let haloColor = '#10b981';
            let labelValue = `${cell.chlorophyll} mg/m³`;

            if (mapLayer === 'pfz') {
              haloColor = cell.chlorophyll > 2.0 && !cell.restrictedZone ? '#10b981' : cell.chlorophyll > 1.2 ? '#f59e0b' : '#ef4444';
              labelValue = `Chl: ${cell.chlorophyll}`;
            } else if (mapLayer === 'safety') {
              haloColor = cell.restrictedZone || cell.waveHeight > 2.2 ? '#ef4444' : cell.waveHeight > 1.3 ? '#f59e0b' : '#10b981';
              labelValue = `Wave: ${cell.waveHeight}m`;
            } else if (mapLayer === 'sst') {
              haloColor = cell.sst <= 29.0 ? '#10b981' : '#f97316';
              labelValue = `SST: ${cell.sst}°C`;
            } else if (mapLayer === 'waves') {
              haloColor = cell.waveHeight > 2.0 ? '#ef4444' : cell.waveHeight > 1.2 ? '#f59e0b' : '#38bdf8';
              labelValue = `${cell.waveHeight}m wave`;
            }

            return (
              <g
                key={cell.cellId}
                className="cursor-pointer transition-all"
                onClick={() => onSelectCell(cell)}
              >
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="44"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r="32"
                  fill={haloColor}
                  fillOpacity={isSelected ? 0.45 : 0.25}
                  stroke={haloColor}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                />

                {/* Center Marker */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="13"
                  fill={cell.restrictedZone ? '#991b1b' : isSelected ? '#0284c7' : '#1e3a8a'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                <text
                  x={cx}
                  y={cy + 4}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {cell.cellId}
                </text>

                {/* Telemetry Pill */}
                <rect
                  x={cx - 34}
                  y={cy + 17}
                  width="68"
                  height="16"
                  rx="4"
                  fill="#ffffff"
                  stroke={haloColor}
                  strokeWidth="1"
                />
                <text
                  x={cx}
                  y={cy + 29}
                  fill="#0f172a"
                  fontSize="8.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {labelValue}
                </text>
              </g>
            );
          })}

          {/* Harbor Start Dot */}
          <circle
            cx={harborX}
            cy={harborY}
            r="8"
            fill="#0284c7"
            stroke="#ffffff"
            strokeWidth="2"
          />

          {/* AIS Vessels */}
          {showVessels &&
            vessels.map((vessel) => {
              const vx = lonToX(vessel.lon);
              const vy = latToY(vessel.lat);
              const isUserBoat = vessel.id === 'V-01';

              return (
                <g key={vessel.id} transform={`translate(${vx}, ${vy})`}>
                  <g transform={`rotate(${vessel.heading})`}>
                    <polygon
                      points="0,-8 5,6 -5,6"
                      fill={isUserBoat ? '#10b981' : vessel.type === 'COAST_GUARD' ? '#f59e0b' : '#38bdf8'}
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  </g>
                  <text
                    x="0"
                    y="-11"
                    fill="#ffffff"
                    fontSize="7.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {vessel.name}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Footer Info Bar */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Selected: Cell {selectedCell.cellId}</span>
          <span className="text-slate-500 font-normal">({selectedCell.name})</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>High Fish</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Caution</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Unsafe/Naval</span>
          </span>
        </div>
      </div>
    </div>
  );
};
