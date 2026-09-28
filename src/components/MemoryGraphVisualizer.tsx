"use client";

import React, { useState } from "react";
import { HindsightMemoryNode } from "../types/incident";
import { Network, Database, ShieldAlert, Wrench, User, FileText, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryGraphVisualizerProps {
  nodes: HindsightMemoryNode[];
  similarityScore: number;
}

export const MemoryGraphVisualizer: React.FC<MemoryGraphVisualizerProps> = ({
  nodes,
  similarityScore
}) => {
  const [selectedNode, setSelectedNode] = useState<HindsightMemoryNode | null>(nodes[0] || null);

  const getNodeIcon = (type: HindsightMemoryNode["type"]) => {
    switch (type) {
      case "SERVICE":
        return <Database className="w-4 h-4 text-cyan-400" />;
      case "INCIDENT":
        return <FileText className="w-4 h-4 text-amber-400" />;
      case "ENGINEER":
        return <User className="w-4 h-4 text-emerald-400" />;
      case "RUNBOOK":
        return <Wrench className="w-4 h-4 text-purple-400" />;
      case "ANTIPATTERN":
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      default:
        return <Network className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getNodeBadgeColor = (type: HindsightMemoryNode["type"]) => {
    switch (type) {
      case "SERVICE":
        return "border-cyan-500/40 bg-cyan-950/30 text-cyan-300";
      case "INCIDENT":
        return "border-amber-500/40 bg-amber-950/30 text-amber-300";
      case "ENGINEER":
        return "border-emerald-500/40 bg-emerald-950/30 text-emerald-300";
      case "RUNBOOK":
        return "border-purple-500/40 bg-purple-950/30 text-purple-300";
      case "ANTIPATTERN":
        return "border-red-500/40 bg-red-950/30 text-red-300";
      default:
        return "border-gray-500/40 bg-gray-950/30 text-gray-300";
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface-50 border border-surface-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Hindsight Multi-Hop Entity Graph</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Vectorize Biomimetic Memory
              </span>
            </h3>
            <p className="text-[11px] font-mono text-gray-400">
              Traversing associative links, causal dependencies & historical resolutions
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-gray-400">Recall Precision:</span>
          <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
            {Math.round(similarityScore * 100)}% Match
          </span>
        </div>
      </div>

      {/* Nodes Interactive Ribbon with Spring Touch */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {nodes.map((node, index) => {
          const isSelected = selectedNode?.id === node.id;
          return (
            <React.Fragment key={node.id}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 450, damping: 15 }}
                onClick={() => setSelectedNode(node)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-500/25 text-white shadow-xl shadow-cyan-950/60 ring-2 ring-cyan-400/50"
                    : `${getNodeBadgeColor(node.type)} hover:brightness-125`
                }`}
              >
                {getNodeIcon(node.type)}
                <span>{node.label}</span>
              </motion.button>
              {index < nodes.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-600 hidden md:inline-block flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Detailed Node Inspector Panel with Smooth Slide Animation */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="p-3.5 rounded-xl bg-surface-100 border border-surface-border flex items-start space-x-3 shadow-md"
          >
            <div className="p-2 rounded-lg bg-surface-200 text-cyan-400 border border-surface-border flex-shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white font-mono">{selectedNode.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${getNodeBadgeColor(selectedNode.type)}`}>
                  {selectedNode.type}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {selectedNode.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
