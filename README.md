# INCIDEX: Autonomous SRE War Room & Memory Engine

> **Stop fighting recurring outages with amnesiac AI.**  
> Built with [Vectorize Hindsight](https://github.com/vectorize-io/hindsight) biomimetic graph memory and **Google Gemini 3.8 Flash**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Hindsight Memory](https://img.shields.io/badge/Memory-Hindsight%20v0.10.1-06b6d4)](https://hindsight.vectorize.io)
[![LLM: Gemini 3.8 Flash](https://img.shields.io/badge/LLM-Gemini%203.8%20Flash-10b981)](https://aistudio.google.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org)

---

## ⚡ The Problem: Amnesiac AI Destroys Production

Every time a production incident occurs at 2 AM, on-call engineers face alert fatigue. When engineers ask traditional, stateless LLMs for assistance, disaster strikes:
- **Stateless AI has zero organizational memory**: It forgets past root causes, team post-mortems, and critical runbooks.
- **Hallucinated Antipatterns**: A standard LLM often suggests *"restart the master database worker"* or *"reboot pods"*, which wipes in-flight socket locks, drops thousands of transactions, and triggers catastrophic cascading failures.
- **Recurring Outages**: Teams waste hours re-investigating the exact same bug that a teammate solved three weeks ago.

---

## 🧠 The Solution: INCIDEX

**INCIDEX** transforms incident response by giving AI persistent, entity-aware cognitive memory using **Vectorize Hindsight**:

1. **`Recall` (Sub-100ms Associative Traversal):** The moment an alert triggers, INCIDEX traverses historical incident graphs to locate identical failure signatures, the original resolver, and past post-mortems.
2. **Antipattern Guardrails:** Warns engineers against deadly actions that previously caused cascading outages.
3. **Verified Safe Runbooks:** Pre-loads the verified mitigation command for 1-click execution.
4. **`Retain` (Continuous Learning):** Once mitigated, the resolution and post-mortem are retained in the Hindsight knowledge graph.
5. **`Reflect` (Systemic Wisdom):** Synthesizes cross-incident trends to identify systemic infrastructure vulnerabilities before they cause the next outage.

---

## 🏗️ Architecture

```
[Prometheus / Sentry / Datadog / Webhook]
                   │
                   ▼
       [ INCIDEX Ingress Gateway ]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
  [ Hindsight Recall ]    [ Live Telemetry ]
  (Multi-hop Graph)       (CPU, P99, Conn)
         │                   │
         └─────────┬─────────┘
                   ▼
    [ Gemini 3.8 Flash Reasoner ]
                   │
                   ▼
  [ SRE War Room Mission Control UI ]
  ├── Head-to-Head Comparison (Stateless vs Hindsight)
  ├── Interactive Hindsight Memory Graph
  ├── 1-Click Verified Runbook Terminal
  └── Systemic Reflections Engine
```

---

## 🚀 Quickstart Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/YOUR_USERNAME/incidex.git
cd incidex
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your keys:
```bash
cp .env.example .env.local
```

Inside `.env.local`:
```bash
# Hindsight Cloud (Use promo code: MEMHACK99 on ui.hindsight.vectorize.io for $50 free credits)
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BANK_ID=incidex_production_sre

# Google Vertex AI / Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

### 3. Run Locally
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📡 Live Webhook API for External Integrations

Any external system (Datadog, Sentry, PagerDuty, or cURL) can trigger an incident in real time:

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Swiggy",
    "service": "payment-gateway",
    "error": "504 Gateway Timeout: Bank UPI provider socket timeout after 15000ms",
    "severity": "SEV-1"
  }'
```

---

## 🛡️ Security & Privacy
- **Zero API Key Leakage**: API credentials are saved exclusively in `.env.local`, strictly filtered by `.gitignore`.
- **Runtime Enclave**: All memory and reasoning transactions happen server-side; client browsers never receive private API tokens.

---

## 📜 Links & Documentation
- [Vectorize Hindsight GitHub](https://github.com/vectorize-io/hindsight)
- [Hindsight Documentation](https://hindsight.vectorize.io/)
- [Vectorize Agent Memory](https://vectorize.io/what-is-agent-memory)
