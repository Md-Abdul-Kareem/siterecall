"use client";

import React, { useState, useEffect } from "react";
import { SAMPLE_INCIDENTS } from "@/lib/scenarios";
import { Incident, AgentComparisonResult, HindsightMemoryRecall } from "@/types/incident";
import { HindsightLogEntry } from "@/lib/hindsight";
import { Navbar } from "@/components/Navbar";
import { IncidentHeader } from "@/components/IncidentHeader";
import { ComparisonView } from "@/components/ComparisonView";
import { MemoryGraphVisualizer } from "@/components/MemoryGraphVisualizer";
import { RunbookTerminal } from "@/components/RunbookTerminal";
import { ReflectionsModal } from "@/components/ReflectionsModal";
import { WebhookModal } from "@/components/WebhookModal";
import { AuditDrawer } from "@/components/AuditDrawer";

export default function Home() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [incident, setIncident] = useState<Incident>(SAMPLE_INCIDENTS[0]);
  const [comparison, setComparison] = useState<AgentComparisonResult | null>(null);
  const [memory, setMemory] = useState<HindsightMemoryRecall | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<HindsightLogEntry[]>([]);

  // Modals state
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);
  const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Analyze incident whenever scenario changes
  const runAnalysis = async (targetIncident: Incident) => {
    setIsAnalyzing(true);
    setIsResolved(false);
    setTerminalLogs([]);
    try {
      const res = await fetch("/api/incident/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId: targetIncident.id,
          service: targetIncident.service
        })
      });
      const data = await res.json();
      if (data.success) {
        setIncident(data.incident);
        setMemory(data.memory);
        setComparison(data.comparison);
        if (data.auditLogs) {
          setAuditLogs(data.auditLogs);
        }
      }
    } catch (err) {
      console.error("Failed to analyze incident:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis(SAMPLE_INCIDENTS[0]);
  }, []);

  const handleSelectScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    runAnalysis(SAMPLE_INCIDENTS[index]);
  };

  const handleExecuteRunbook = async (command: string) => {
    setIsExecuting(true);
    try {
      const res = await fetch("/api/incident/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId: incident.id,
          command: command,
          postMortem: `Incident resolved successfully via Hindsight-guided runbook.`
        })
      });
      const data = await res.json();
      if (data.success) {
        setTerminalLogs(data.executionOutput || []);
        setIsResolved(true);
        setIncident(prev => ({ ...prev, status: "RESOLVED" }));
        if (data.auditLogs) {
          setAuditLogs(data.auditLogs);
        }
      }
    } catch (err) {
      console.error("Failed to execute runbook:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCustomIncident = (customIncident: Incident) => {
    setSelectedScenarioIndex(-1);
    setIncident(customIncident);
    runAnalysis(customIncident);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 bg-grid-pattern selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        onOpenWebhook={() => setIsWebhookOpen(true)}
        onOpenReflections={() => setIsReflectionsOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        auditCount={auditLogs.length}
      />

      {/* Main War Room Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Outage Banner & Telemetry Grid */}
        <IncidentHeader
          incident={incident}
          selectedScenarioIndex={selectedScenarioIndex}
          onSelectScenario={handleSelectScenario}
          onTriggerNew={() => setIsWebhookOpen(true)}
          isAnalyzing={isAnalyzing}
        />

        {/* Head-to-Head Comparison (Stateless AI vs INCIDEX Memory) */}
        <ComparisonView
          comparison={comparison}
          onExecuteRunbook={handleExecuteRunbook}
          isExecuting={isExecuting}
          isResolved={isResolved}
        />

        {/* Interactive Hindsight Memory Graph */}
        {memory && (
          <MemoryGraphVisualizer
            nodes={memory.connectedEntities}
            similarityScore={memory.similarityScore}
          />
        )}

        {/* Live Interactive Runbook Execution Terminal */}
        {comparison && (
          <RunbookTerminal
            command={comparison.hindsight.safeCommand}
            isExecuting={isExecuting}
            logs={terminalLogs}
            isResolved={isResolved}
            onRunbookTriggered={() => handleExecuteRunbook(comparison.hindsight.safeCommand)}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <ReflectionsModal
        isOpen={isReflectionsOpen}
        onClose={() => setIsReflectionsOpen(false)}
      />

      <WebhookModal
        isOpen={isWebhookOpen}
        onClose={() => setIsWebhookOpen(false)}
        onCustomIncidentTriggered={handleCustomIncident}
      />

      <AuditDrawer
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
}
