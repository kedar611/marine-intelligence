import React, { useState } from 'react';
import { OceanGridCell, CatchReport } from '../types/marine';
import { Fish, X, Send, CheckCircle2 } from 'lucide-react';

interface CatchReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCell: OceanGridCell;
  onSubmitReport: (report: CatchReport) => void;
}

export const CatchReportModal: React.FC<CatchReportModalProps> = ({
  isOpen,
  onClose,
  selectedCell,
  onSubmitReport,
}) => {
  const [fishermanName, setFishermanName] = useState('Ramesh Koli (Boat: Sagar Laxmi)');
  const [boatNumber, setBoatNumber] = useState('IND-MH-01-MM-4421');
  const [species, setSpecies] = useState(selectedCell.dominantSpecies[0] || 'Indian Mackerel');
  const [weightKg, setWeightKg] = useState('85');
  const [notes, setNotes] = useState('Calm morning sea, mild 1.0m swell, high phytoplankton bloom spotted');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: CatchReport = {
      id: `CR-${Date.now()}`,
      fishermanName,
      boatNumber,
      cellId: selectedCell.cellId,
      species,
      catchWeightKg: parseFloat(weightKg) || 50,
      seaConditionObserved: notes,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST Today',
    };

    onSubmitReport(newReport);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#05152b] rounded-3xl border-2 border-ocean-600/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 to-ocean-950 p-5 border-b border-ocean-800 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300">
              <Fish className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Fisherman Catch & Observation Feedback</h2>
              <p className="text-[11px] text-slate-400">Updates the Knowledge Loop & ML Training Dataset</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-navy-950">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {isSuccess ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-white">Catch Logged Successfully!</h3>
              <p className="text-slate-400 text-xs">Thank you for contributing to Indian Marine Decision Intelligence.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Fisherman / Boat Name</label>
                  <input
                    type="text"
                    value={fishermanName}
                    onChange={(e) => setFishermanName(e.target.value)}
                    className="w-full bg-navy-950 border border-ocean-700 rounded-xl px-3 py-2 text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Registration No.</label>
                  <input
                    type="text"
                    value={boatNumber}
                    onChange={(e) => setBoatNumber(e.target.value)}
                    className="w-full bg-navy-950 border border-ocean-700 rounded-xl px-3 py-2 text-white text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Dominant Species Caught</label>
                  <input
                    type="text"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full bg-navy-950 border border-ocean-700 rounded-xl px-3 py-2 text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Total Catch Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full bg-navy-950 border border-ocean-700 rounded-xl px-3 py-2 text-white text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Observed Sea State & Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-navy-950 border border-ocean-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-ocean-600 to-sky-600 hover:from-ocean-500 hover:to-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Field Report</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
