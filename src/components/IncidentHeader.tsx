"use client";

import React from "react";
import { Incident } from "../types/incident";
import { AlertTriangle, Clock, Flame, Server, TrendingUp, DollarSign } from "lucide-react";

interface IncidentHeaderProps {
  incident: Incident;
  selectedScenarioIndex: number;
  onSelectScenario: (index: number) => void;
  onTriggerNew: () => void;
  isAnalyzing: boolean;
}

export const IncidentHeader: React.FC<IncidentHeaderProps> = ({
  incident,
  selectedScenarioIndex,
  onSelectScenario,
  onTriggerNew,
  isAnalyzing
}) => {
  const getSeverityBadge = () => {
    switch (incident.severity) {
      case "SEV-1":
        return "bg-red-500/20 text-red-400 border-red-500/50 shadow-red-950/50";
      case "SEV-2":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-950/50";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-blue-950/50";
    }
  };

  const getStatusBadge = () => {
    switch (incident.status) {
      case "RESOLVED":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "MITIGATING":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
      default:
        return "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse";
    }
  };

  return (
    <section className="mb-6">
      {/* Top Scenario Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
          <span>SELECT PRODUCTION OUTAGE SCENARIO:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectScenario(0)}
            disabled={isAnalyzing}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedScenarioIndex === 0
                ? "bg-red-500/20 border border-red-500/50 text-red-300 shadow-sm"
                : "bg-surface-100 border border-surface-border text-gray-400 hover:text-gray-200 hover:bg-surface-200"
            }`}
          >
            🍔 Swiggy (Payment 504)
          </button>

          <button
            onClick={() => onSelectScenario(1)}
            disabled={isAnalyzing}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedScenarioIndex === 1
                ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-sm"
                : "bg-surface-100 border border-surface-border text-gray-400 hover:text-gray-200 hover:bg-surface-200"
            }`}
          >
            ⚡ Blinkit (Inventory Desync)
          </button>

          <button
            onClick={() => onSelectScenario(2)}
            disabled={isAnalyzing}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedScenarioIndex === 2
                ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-sm"
                : "bg-surface-100 border border-surface-border text-gray-400 hover:text-gray-200 hover:bg-surface-200"
            }`}
          >
            🛵 Zomato (Rider GPS Freeze)
          </button>

          <button
            onClick={onTriggerNew}
            disabled={isAnalyzing}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center space-x-1"
          >
            <span>+ Custom Alert</span>
          </button>
        </div>
      </div>

      {/* Main Incident Card */}
      <div className={`p-5 rounded-2xl bg-surface-50 border transition-all ${
        incident.status === "RESOLVED"
          ? "border-emerald-500/40 shadow-lg shadow-emerald-950/20"
          : "border-red-500/30 shadow-lg shadow-red-950/20"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-3">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border shadow-sm ${getSeverityBadge()}`}>
                {incident.severity}
              </span>
              <span className="text-sm font-mono text-cyan-400 font-semibold">
                [{incident.id}]
              </span>
              <span className="text-sm text-gray-400 font-medium">
                Target: <strong className="text-gray-200 font-mono">{incident.company} / {incident.service}</strong>
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium border ${getStatusBadge()}`}>
                {incident.status}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <AlertTriangle className={`w-5 h-5 ${incident.status === "RESOLVED" ? "text-emerald-400" : "text-red-400 animate-bounce"}`} />
              <span>{incident.title}</span>
            </h2>
            <p className="text-xs font-mono text-red-300/80 bg-red-950/30 px-2.5 py-1 rounded-md border border-red-900/40 inline-block">
              {incident.errorSnippet}
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
            <div className="flex items-center space-x-1.5 bg-surface-100 px-3 py-2 rounded-xl border border-surface-border">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{incident.timestamp}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-red-500/10 text-red-300 px-3 py-2 rounded-xl border border-red-500/30">
              <DollarSign className="w-3.5 h-3.5 text-red-400" />
              <span>Downtime Cost: ~$18,500/min</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          <div className="p-3 rounded-xl bg-surface-100/70 border border-surface-border">
            <span className="text-[11px] font-mono text-gray-400 uppercase">CPU Saturation</span>
            <div className="text-lg font-bold font-mono text-red-400 mt-0.5">{incident.telemetry.cpuUsage}</div>
            <div className="w-full bg-surface-200 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: incident.telemetry.cpuUsage }}></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-100/70 border border-surface-border">
            <span className="text-[11px] font-mono text-gray-400 uppercase">P99 Latency</span>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">{incident.telemetry.p99Latency}</div>
            <span className="text-[10px] text-red-400 font-mono">SLA Breach (&gt; 250ms)</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-100/70 border border-surface-border">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Error Rate</span>
            <div className="text-lg font-bold font-mono text-red-400 mt-0.5">{incident.telemetry.errorRate}</div>
            <span className="text-[10px] text-gray-400 font-mono">Failing 5xx responses</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-100/70 border border-surface-border">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Active Threads/Conn</span>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">{incident.telemetry.activeConnections.toLocaleString()}</div>
            <span className="text-[10px] text-cyan-300 font-mono">Socket starvation</span>
          </div>
        </div>
      </div>
    </section>
  );
};
