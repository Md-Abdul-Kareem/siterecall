"use client";

import React, { useState, useEffect } from "react";
import { Terminal, CheckCircle2, Copy, Check, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface RunbookTerminalProps {
  command: string;
  isExecuting: boolean;
  logs: string[];
  isResolved: boolean;
  onRunbookTriggered: () => void;
}

export const RunbookTerminal: React.FC<RunbookTerminalProps> = ({
  command,
  isExecuting,
  logs,
  isResolved,
  onRunbookTriggered
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isResolved) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#10b981", "#6366f1"]
      });
    }
  }, [isResolved]);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#07080c] border border-surface-border overflow-hidden shadow-2xl">
      {/* Terminal Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-100/90 border-b border-surface-border">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono text-gray-400 pl-2 flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>sre-war-room@prod-cluster-01: ~</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-surface-200 hover:bg-surface-300 text-gray-300 hover:text-white text-[11px] font-mono transition-all"
            title="Copy command to clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 font-mono text-xs space-y-2 max-h-72 overflow-y-auto">
        {/* Runbook Command Display */}
        <div className="flex items-start space-x-2 text-cyan-300 pb-2 border-b border-surface-border/50">
          <span className="text-emerald-400 select-none">$</span>
          <span className="break-all font-semibold">{command}</span>
        </div>

        {/* Live Logs Streaming */}
        {logs.length === 0 && !isExecuting && (
          <div className="text-gray-500 py-3 text-center italic">
            Ready to execute verified mitigation runbook. Click "Execute Verified Runbook" above or press trigger below.
          </div>
        )}

        {isExecuting && (
          <div className="flex items-center space-x-2 text-amber-300 py-2">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>Executing cluster hot-patch and recording post-mortem to Hindsight memory bank...</span>
          </div>
        )}

        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`leading-relaxed ${
              log.includes("[INFO]")
                ? "text-gray-400"
                : log.includes("[APPLIED]") || log.includes("[VERIFIED]")
                ? "text-emerald-300 font-semibold"
                : log.includes("Error")
                ? "text-red-400"
                : "text-cyan-300"
            }`}
          >
            {log}
          </div>
        ))}

        {isResolved && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold">Outage Mitigated in 34 Seconds!</div>
                <div className="text-[11px] text-emerald-400/80">
                  Zero downtime, zero double charges. Memory saved in Hindsight bank: <code>incidex_production_sre</code>
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              100% HEALTHY
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
