"use client";

import React, { useState } from "react";
import { X, Webhook, Copy, Check, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomIncidentTriggered: (customIncident: any) => void;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({
  isOpen,
  onClose,
  onCustomIncidentTriggered
}) => {
  const [copied, setCopied] = useState(false);
  const [company, setCompany] = useState("JudgeCorp");
  const [service, setService] = useState("payment-gateway");
  const [errorText, setErrorText] = useState("504 Gateway Timeout: Bank UPI provider socket timeout after 15000ms");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const curlCommand = `curl -X POST http://localhost:3000/api/webhook \\
  -H "Content-Type: application/json" \\
  -d '{
    "company": "${company}",
    "service": "${service}",
    "error": "${errorText}",
    "severity": "SEV-1"
  }'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          service,
          error: errorText,
          severity: "SEV-1"
        })
      });
      const data = await res.json();
      if (data.success && data.incident) {
        onCustomIncidentTriggered(data.incident);
        onClose();
      }
    } catch (err) {
      console.error("Webhook trigger error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative w-full max-w-2xl rounded-2xl bg-surface-50 border border-cyan-500/40 shadow-2xl p-6 overflow-hidden glow-border-cyan"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Webhook className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Live Webhook Ingestion API</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  HTTP POST Ready
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Connect external monitoring (Datadog, Sentry, PagerDuty, or cURL) in real time
              </p>
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

        {/* cURL Snippet */}
        <div className="py-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono uppercase text-gray-400">cURL Command for Judges & SREs:</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied to clipboard" : "Copy cURL"}</span>
              </motion.button>
            </div>
            <div className="p-3 rounded-xl bg-[#07080c] border border-surface-border font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap">{curlCommand}</pre>
            </div>
          </div>

          {/* Interactive Live Form */}
          <form onSubmit={handleSendTest} className="space-y-3 pt-2 border-t border-surface-border">
            <span className="text-xs font-mono uppercase text-gray-400 block">Or Trigger a Live Custom Alert Now:</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">Target Service</label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-gray-400 block mb-1">Error Message / Stack Trace</label>
              <textarea
                value={errorText}
                onChange={(e) => setErrorText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-xs text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-gray-300 text-xs font-medium transition-all cursor-pointer"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl btn-shimmer hover:brightness-110 text-black font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-950/50 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Processing Ingest...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>Send Live Alert</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
