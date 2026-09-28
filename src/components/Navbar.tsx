"use client";

import React from "react";
import { ShieldAlert, Cpu, Database, Webhook, BrainCircuit, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarProps {
  onOpenWebhook: () => void;
  onOpenReflections: () => void;
  onOpenAudit: () => void;
  auditCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWebhook,
  onOpenReflections,
  onOpenAudit,
  auditCount
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-[#090a0f]/85 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3.5">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-brand-600/30 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-950/40 cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </motion.div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold tracking-tight text-lg text-white">
                SiteRecall<span className="text-cyan-400">.ai</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold uppercase tracking-wider">
                SRE Memory War Room
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              Autonomous Incident Intelligence & Runbook Memory
            </p>
          </div>
        </div>

        {/* Live System Status Badges */}
        <div className="hidden md:flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-100 border border-surface-border text-gray-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-400">Brain:</span>
            <span className="text-emerald-400 font-semibold">Gemini 3.8 Flash</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-100 border border-surface-border text-gray-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400">Memory:</span>
            <span className="text-cyan-400 font-semibold">Hindsight Cloud</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          </div>
        </div>

        {/* Action Controls with Satisfying Spring Physics */}
        <div className="flex items-center space-x-2.5">
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 450, damping: 17 }}
            onClick={onOpenWebhook}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-border hover:border-cyan-500/40 text-gray-200 text-xs font-medium transition-colors shadow-sm group hover:shadow-cyan-950/30"
          >
            <Webhook className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            <span>Test Webhook API</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 450, damping: 17 }}
            onClick={onOpenReflections}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/35 border border-brand-500/40 text-brand-300 hover:text-brand-100 text-xs font-medium transition-colors shadow-sm hover:shadow-brand-950/40"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
            <span className="hidden sm:inline">Reflections (3)</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 450, damping: 17 }}
            onClick={onOpenAudit}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-border text-gray-300 hover:text-white text-xs font-medium transition-colors shadow-sm"
            title="View live Hindsight Retain / Recall audit trail"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Audit Logs</span>
            {auditCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                {auditCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
