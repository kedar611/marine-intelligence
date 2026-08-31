import React, { useState } from 'react';
import { 
  Trophy, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Fish, 
  Layers, 
  Cpu, 
  Zap, 
  TrendingUp, 
  Globe, 
  Sparkles,
  Smartphone,
  Anchor
} from 'lucide-react';
import { SystemScenario } from '../types/marine';

interface SihPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetScenario: (sc: SystemScenario) => void;
}

export const SihPitchModal: React.FC<SihPitchModalProps> = ({
  isOpen,
  onClose,
  onSetScenario,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: '1. The Problem & The Core 3 Pillars',
      subtitle: 'Transforming complex oceanographic data into simple, life-saving decisions',
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Over 4 million small-scale fishermen in India head out to sea with fragmented weather warnings and zero integrated intelligence on where fish are feeding safely or how to avoid maritime hazards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>SAFETY</span>
              </div>
              <strong className="text-slate-900 dark:text-white block text-sm">"Can I go fishing?"</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Dynamic 0-100 Safety Score & hourly sea state forecast windows.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800">
              <div className="flex items-center space-x-2 text-sky-800 dark:text-sky-300 font-bold mb-1">
                <Fish className="w-4 h-4" />
                <span>PRODUCTIVITY</span>
              </div>
              <strong className="text-slate-900 dark:text-white block text-sm">"Where should I go?"</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Bio-thermal PFZ habitat model (Chlorophyll gradients + SST thermal fronts).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800">
              <div className="flex items-center space-x-2 text-purple-800 dark:text-purple-300 font-bold mb-1">
                <Zap className="w-4 h-4" />
                <span>INTELLIGENCE</span>
              </div>
              <strong className="text-slate-900 dark:text-white block text-sm">"What is happening?"</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Isolation forest marine anomaly detection & extreme squall warnings.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2. The Data Fusion Layer (Grid Cell B2)',
      subtitle: 'Harmonizing 6 disparate sources into standardized 0.1° geospatial ocean grids',
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 flex items-start space-x-2.5">
            <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="text-teal-950 dark:text-teal-200">
              <strong>Target Demonstration: Grid Cell B2 (Lat 18.50°N, Lon 72.80°E)</strong>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Chlorophyll 2.1 mg/m³ • SST 28.7°C • Wind 18 km/h (240° SW) • Waves 1.1m • Tide 2.8m • Historical Catch 72 kg.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">The 5 Jobs of Data Fusion:</div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border font-bold">1. Ingestion (6 APIs)</div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border font-bold">2. Cleaning (Cloud Filter)</div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border font-bold">3. Spatial Align (0.1° Grid)</div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border font-bold">4. Time Sync (Hourly)</div>
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900 border text-teal-900 dark:text-teal-200 font-extrabold">5. 12D Vector</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '3. Agentic AI Core & Safety Priority Override',
      subtitle: 'Why Agentic AI? Because Life Safety unconditionally overrides Catch Potential',
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Standard apps only show static weather or fish maps. Our <strong>Agentic AI</strong> actively reasons and resolves conflicting signals:
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-900 dark:text-amber-300 text-sm">
              <Cpu className="w-5 h-5" />
              <span>Safety Priority Rule Example:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              Suppose the PFZ model detects 92% high fish density in Sector B2, but the Safety Model detects 2.8m waves and a barometric pressure drop. The Agentic Core enforces a strict <strong>NO-GO</strong>:
            </p>
            <blockquote className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[11px] border">
              "High fishing potential detected, but current sea conditions are dangerous. Do not enter this region until conditions improve."
            </blockquote>
          </div>
        </div>
      ),
    },
    {
      title: '4. National Impact & 10-Language Voice Inclusivity',
      subtitle: 'Built for grassroots coastal fishermen across all 9 maritime states of India',
      content: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">₹850 - ₹1,200</div>
              <div className="text-slate-700 dark:text-slate-300 font-bold text-xs">Fuel Saved Per Voyage</div>
              <div className="text-[10px] text-slate-500 mt-0.5">+12% fuel efficiency via following tidal currents</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">10 Languages</div>
              <div className="text-slate-700 dark:text-slate-300 font-bold text-xs">Native Spoken Voice</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Marathi, Tamil, Hindi, Telugu, Bengali, Gujarati, etc.</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs flex items-center justify-between">
            <div className="font-bold">Pitch Line to SIH Judges:</div>
            <div className="italic text-[11px]">"We will not just tell the fisherman the weather; we will tell him when to go, where to go, and how to get there safely."</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-white/20">
              <Trophy className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase">
                  SIH 2026 Pitch Deck
                </span>
                <span className="text-xs text-sky-100">Step {currentSlide + 1} of {slides.length}</span>
              </div>
              <h2 className="text-base font-extrabold mt-0.5">{slides[currentSlide].title}</h2>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-semibold">
            {slides[currentSlide].subtitle}
          </div>
          {slides[currentSlide].content}
        </div>

        {/* Live Scenario Presets for Judges */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-bold">1-Click Demo Scenarios:</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => { onSetScenario('normal'); onClose(); }}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px]"
            >
              ☀️ Normal Catch (B2)
            </button>
            <button
              onClick={() => { onSetScenario('high_pfz_rough_sea'); onClose(); }}
              className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[11px]"
            >
              🌊 Safety Override
            </button>
            <button
              onClick={() => { onSetScenario('cyclone_alert'); onClose(); }}
              className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold text-[11px]"
            >
              🌀 Cyclone Alert
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide ? 'bg-sky-600 w-6' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (currentSlide < slides.length - 1) {
                setCurrentSlide(currentSlide + 1);
              } else {
                onClose();
              }
            }}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md"
          >
            <span>{currentSlide === slides.length - 1 ? 'Start Interactive Demo' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
