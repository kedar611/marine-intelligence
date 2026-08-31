import React from 'react';
import { AgentDecisionResult, AgentReasoningStep } from '../types/marine';
import { 
  Cpu, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowDown, 
  Radio, 
  Zap, 
  Compass 
} from 'lucide-react';

interface AgenticReasoningModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: AgentDecisionResult;
}

export const AgenticReasoningModal: React.FC<AgenticReasoningModalProps> = ({
  isOpen,
  onClose,
  decision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#05152b] rounded-3xl border-2 border-indigo-500/50 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-950 via-indigo-950/60 to-purple-950/60 p-6 border-b border-indigo-500/30 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  MULTI-AGENT COORDINATION ENGINE
                </span>
                <span className="text-xs text-slate-400 font-mono">Observe → Reason → Decide → Recommend</span>
              </div>
              <h2 className="text-lg font-extrabold text-white mt-0.5">
                Agentic AI Autonomous Reasoning Chain
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-navy-950 text-slate-400 hover:text-white hover:bg-ocean-900 border border-ocean-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Reasoning Trace Flow */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Priority Rule Enforcement Notice */}
          <div className={`p-4 rounded-2xl border text-xs flex items-start space-x-3 ${
            decision.safetyOverrideOccurred 
              ? 'bg-red-950/40 border-red-500/50 text-red-200' 
              : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
          }`}>
            <Zap className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong className="text-white text-sm">
                {decision.safetyOverrideOccurred ? '🚨 SAFETY OVERRIDE ACTIVE' : '✅ SAFETY & SUITABILITY BALANCED'}
              </strong>
              <p className="mt-1 leading-relaxed text-[11px] text-slate-300">
                {decision.decisionRationale}
              </p>
            </div>
          </div>

          {/* Step-by-Step Multi-Agent Trace */}
          <div className="space-y-3 pt-2">
            {decision.reasoningTrace.map((step, idx) => (
              <div key={idx} className="relative">
                {idx > 0 && (
                  <div className="flex justify-center -my-1.5">
                    <ArrowDown className="w-4 h-4 text-indigo-400/60" />
                  </div>
                )}

                <div className={`p-4 rounded-2xl border transition-all ${
                  step.status === 'alert'
                    ? 'bg-red-950/30 border-red-500/40'
                    : step.status === 'overridden'
                    ? 'bg-amber-950/30 border-amber-500/40'
                    : 'bg-navy-950/80 border-indigo-900/60'
                }`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] flex items-center justify-center border border-indigo-500/40">
                        {step.stepNumber}
                      </span>
                      <strong className="text-xs font-bold text-sky-300">{step.agentName}</strong>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">({step.action})</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-[#030c18] border border-ocean-900/60">
                      <span className="text-slate-400 font-semibold block text-[10px]">OBSERVATION:</span>
                      <span className="text-slate-300 text-[11px]">{step.observation}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                      <span className="text-indigo-400 font-semibold block text-[10px]">INFERENCE / REASONING:</span>
                      <span className="text-indigo-200 text-[11px] font-medium">{step.inference}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#030c18] p-4 border-t border-ocean-800 flex justify-between items-center text-xs">
          <div className="text-slate-400">
            Decision Result: <strong className="text-white">{decision.verdictText}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
