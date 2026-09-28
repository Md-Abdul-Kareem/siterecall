"use client";

import React, { useEffect, useState } from "react";
import { SystemicReflection } from "../types/incident";
import { X, BrainCircuit, Sparkles, ShieldCheck, ArrowRight, Lightbulb } from "lucide-react";

interface ReflectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReflectionsModal: React.FC<ReflectionsModalProps> = ({ isOpen, onClose }) => {
  const [reflections, setReflections] = useState<SystemicReflection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/incident/reflect")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.reflections) {
            setReflections(data.reflections);
          }
        })
        .catch(err => console.error("Failed to fetch reflections:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-surface-50 border border-brand-500/40 shadow-2xl p-6 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-600/20 text-brand-300 border border-brand-500/30">
              <BrainCircuit className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Hindsight Reflect Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Institutional Wisdom
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Cross-incident synthesis discovering recurring architectural weaknesses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-gray-400 text-sm font-mono">
              <Sparkles className="w-6 h-6 text-brand-400 animate-spin" />
              <span>Synthesizing multi-week incident patterns from Hindsight memory bank...</span>
            </div>
          ) : (
            reflections.map((refl) => (
              <div
                key={refl.id}
                className="p-4 rounded-xl bg-surface-100/70 border border-surface-border hover:border-brand-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-brand-400 bg-brand-950/40 px-2 py-0.5 rounded border border-brand-500/30">
                      {refl.id}
                    </span>
                    <h4 className="text-sm font-bold text-gray-200">{refl.title}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">
                    Confidence: {Math.round(refl.confidence * 100)}%
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {refl.insight}
                </p>

                <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-xs text-red-200">
                  <strong className="text-red-400">Recurring Pattern:</strong> {refl.recurringPattern}
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-200 flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-400">Systemic Recommendation:</strong> {refl.preventativeRecommendation}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-400 pt-1">
                  <span>Impacted Services:</span>
                  {refl.affectedServices.map(svc => (
                    <span key={svc} className="px-2 py-0.5 rounded bg-surface-200 text-gray-300 border border-surface-border">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-surface-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-gray-200 text-xs font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
