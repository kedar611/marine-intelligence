import React, { useState } from 'react';
import { OceanGridCell } from '../types/marine';
import { PhoneCall, X, AlertTriangle, CheckCircle2, Radio } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCell: OceanGridCell;
  onSosActivated?: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  selectedCell,
  onSosActivated,
}) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSOS = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmitted(true);
      if (onSosActivated) onSosActivated();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#1a0808] rounded-3xl border-2 border-red-500/60 shadow-2xl overflow-hidden p-6 text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-black/40 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto animate-pulse">
          <PhoneCall className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-extrabold text-white">EMERGENCY DISTRESS BEACON</h2>
        <p className="text-xs text-red-200/90 leading-relaxed">
          Transmits your vessel GPS coordinates (Lat {selectedCell.lat.toFixed(2)}°N, Lon {selectedCell.lon.toFixed(2)}°E near Cell {selectedCell.cellId}) via VHF Ch-16 & Coastal SAR Satellite network.
        </p>

        {transmitted ? (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="font-bold">MAYDAY SIGNAL BROADCASTED</div>
            <p className="text-[11px] text-slate-300">Indian Coast Guard Patrol ICGS Samarth & Sassoon MRCC notified.</p>
          </div>
        ) : (
          <button
            onClick={handleTriggerSOS}
            disabled={isTransmitting}
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-red-950 border border-red-400 flex items-center justify-center space-x-2 transition-all"
          >
            {isTransmitting ? (
              <>
                <Radio className="w-5 h-5 animate-spin" />
                <span>Transmitting Distress Signal...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                <span>CONFIRM & TRANSMIT MAYDAY (SOS)</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
