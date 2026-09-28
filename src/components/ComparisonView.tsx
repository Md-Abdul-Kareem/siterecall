"use client";

import React, { useState } from "react";
import { AgentComparisonResult } from "../types/incident";
import { AlertOctagon, CheckCircle2, ShieldAlert, Sparkles, Terminal, ArrowRight, Zap, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ComparisonViewProps {
  comparison: AgentComparisonResult | null;
  onExecuteRunbook: (command: string) => void;
  isExecuting: boolean;
  isResolved: boolean;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  comparison,
  onExecuteRunbook,
  isExecuting,
  isResolved
}) => {
  const [viewMode, setViewMode] = useState<"split" | "hindsight" | "stateless">("split");

  if (!comparison) {
    return (
      <div className="p-8 rounded-2xl bg-surface-50 border border-surface-border flex items-center justify-center text-gray-400 font-mono text-sm">
        <Sparkles className="w-5 h-5 text-cyan-400 animate-spin mr-3" />
        Traversing Hindsight Memory Graph & Synthesizing Diagnoses via Gemini 3.8 Flash...
      </div>
    );
  }

  const { stateless, hindsight } = comparison;

  return (
    <div className="space-y-4">
      {/* View Mode Toggle Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-semibold uppercase text-gray-400">
            HEAD-TO-HEAD SHOWDOWN:
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-100 text-cyan-300 border border-surface-border">
            Hindsight Memory vs. Stateless LLM
          </span>
        </div>

        <div className="inline-flex rounded-xl p-1 bg-surface-100 border border-surface-border text-xs font-mono">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setViewMode("split")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "split"
                ? "bg-surface-200 text-white font-semibold shadow-md shadow-black/40"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Split Comparison
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setViewMode("hindsight")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "hindsight"
                ? "bg-cyan-500/25 text-cyan-300 font-semibold shadow-md shadow-cyan-950/50"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            SiteRecall (Memory)
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setViewMode("stateless")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "stateless"
                ? "bg-red-500/25 text-red-300 font-semibold shadow-md shadow-red-950/50"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Stateless AI
          </motion.button>
        </div>
      </div>

      {/* Grid Showdown */}
      <div className={`grid gap-4 ${viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* LEFT: Stateless AI (Without Memory) */}
        {(viewMode === "split" || viewMode === "stateless") && (
          <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col justify-between p-5 rounded-2xl bg-surface-50 border border-red-500/20 shadow-md relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-red-500/5 rounded-full blur-2xl"></div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-200">
                      Stateless Agent
                    </h3>
                    <p className="text-[11px] font-mono text-gray-400">Zero memory retention across sessions</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  Downtime: {stateless.estimatedDowntime}
                </span>
              </div>

              {/* Diagnosis */}
              <div className="space-y-3 mb-5">
                <div>
                  <span className="text-[11px] font-mono uppercase text-gray-400">Diagnosis:</span>
                  <p className="text-xs text-gray-300 leading-relaxed mt-1 p-3 rounded-xl bg-surface-100/60 border border-surface-border">
                    {stateless.diagnosis}
                  </p>
                </div>

                {/* Proposed Action */}
                <div>
                  <span className="text-[11px] font-mono uppercase text-gray-400">Proposed Blind Action:</span>
                  <div className="mt-1 p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-xs font-mono text-red-300 flex items-center space-x-2">
                    <Terminal className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span>{stateless.proposedAction}</span>
                  </div>
                </div>

                {/* Catastrophic Failure Pitfall */}
                <div>
                  <span className="text-[11px] font-mono uppercase text-red-400 font-bold flex items-center space-x-1">
                    <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                    <span>Fatal Flaw (Why this fails):</span>
                  </span>
                  <div className="mt-1 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 leading-relaxed">
                    ⚠️ {stateless.dangerousPitfall}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border text-center">
              <span className="text-[11px] font-mono text-gray-400">
                Confidence: <strong className="text-gray-300">{Math.round(stateless.confidence * 100)}%</strong> (Uncalibrated generic guess)
              </span>
            </div>
          </motion.div>
        )}

        {/* RIGHT: SiteRecall (With Hindsight Memory) */}
        {(viewMode === "split" || viewMode === "hindsight") && (
          <motion.div
            layout
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col justify-between p-5 rounded-2xl bg-surface-50 border border-cyan-500/40 shadow-xl shadow-cyan-950/20 relative overflow-hidden glow-border-cyan"
          >
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-extrabold text-white">
                        SiteRecall Brain
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        HINDSIGHT ACTIVE
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-cyan-300">
                      Recalled: {hindsight.recalledMemory.matchedIncidentId} ({hindsight.recalledMemory.daysAgo} days ago by {hindsight.recalledMemory.originalResolver})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    MTTR: {hindsight.estimatedDowntime}
                  </span>
                </div>
              </div>

              {/* Memory Match & Warning Card */}
              <div className="space-y-3 mb-5">
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono uppercase text-cyan-300 font-bold flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>Hindsight Memory Insight</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      Match: {Math.round(hindsight.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed font-sans">
                    {hindsight.diagnosis}
                  </p>
                </div>

                {/* Critical Antipattern Guard */}
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono text-amber-300 font-bold mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Memory Guardrail (Saved from past failure):</span>
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    {hindsight.recalledMemory.criticalWarning}
                  </p>
                </div>

                {/* Action Plan */}
                <div>
                  <span className="text-[11px] font-mono uppercase text-gray-400">Hindsight Orchestration Plan:</span>
                  <div className="mt-1.5 space-y-1.5">
                    {hindsight.actionablePlan.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-gray-300 bg-surface-100/60 p-2 rounded-lg border border-surface-border">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Runbook Action Button with Tactile Shimmer Feedback */}
            <div className="pt-3 border-t border-surface-border">
              {isResolved ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-center space-x-2 text-xs font-mono font-bold shadow-lg shadow-emerald-950/30"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>INCIDENT RESOLVED & RETAINED IN HINDSIGHT GRAPH</span>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 450, damping: 17 }}
                  onClick={() => onExecuteRunbook(hindsight.safeCommand)}
                  disabled={isExecuting}
                  className="w-full py-3 px-4 rounded-xl btn-shimmer hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-cyan-950/60 cursor-pointer disabled:opacity-50"
                >
                  {isExecuting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-black" />
                      <span>Executing Runbook & Retaining Memory in Hindsight...</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-4 h-4 text-black" />
                      <span>Execute Verified Runbook ({hindsight.recalledMemory.recommendedRunbook.name})</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
