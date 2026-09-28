"use client";

import React from "react";
import { X, Activity, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { HindsightLogEntry } from "../lib/hindsight";

interface AuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: HindsightLogEntry[];
}

export const AuditDrawer: React.FC<AuditDrawerProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="w-full max-w-md h-full bg-surface-50 border-l border-surface-border p-6 shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Hindsight Audit Stream</h3>
              <p className="text-[11px] font-mono text-gray-400">Live Retain, Recall & Reflect events</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Logs Feed */}
        <div className="py-4 space-y-3 flex-1 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs font-mono">
              No audit logs captured yet. Trigger an incident to observe Hindsight memory operations.
            </div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-surface-100 border border-surface-border space-y-1.5 text-xs font-mono shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.operation === "RECALL"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : log.operation === "RETAIN"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                      }`}
                    >
                      {log.operation}
                    </span>
                    <span className="text-gray-400">{log.timestamp}</span>
                  </div>

                  <span className="text-cyan-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{log.latencyMs}ms</span>
                  </span>
                </div>

                <div className="text-gray-300 font-sans text-xs">
                  {log.details}
                </div>

                <div className="text-[10px] text-gray-400 truncate">
                  Bank: <span className="text-gray-300">{log.targetBank}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[11px] font-mono text-gray-400">
          <span>Engine: Hindsight v0.10.1</span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-surface-200 text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            Close Drawer
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
