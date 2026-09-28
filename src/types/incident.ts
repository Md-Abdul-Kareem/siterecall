export type Severity = "SEV-1" | "SEV-2" | "SEV-3";

export type IncidentStatus = "TRIGGERED" | "INVESTIGATING" | "MITIGATING" | "RESOLVED";

export interface IncidentTelemetry {
  cpuUsage: string;
  memoryUsage: string;
  errorRate: string;
  p99Latency: string;
  activeConnections: number;
  impactSummary: string;
}

export interface Incident {
  id: string;
  title: string;
  company: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  timestamp: string;
  errorSnippet: string;
  stackTrace: string[];
  telemetry: IncidentTelemetry;
}

export interface HindsightMemoryNode {
  id: string;
  label: string;
  type: "SERVICE" | "INCIDENT" | "ENGINEER" | "RUNBOOK" | "ANTIPATTERN" | "POSTMORTEM";
  description: string;
  relevanceScore?: number;
  highlighted?: boolean;
}

export interface HindsightMemoryRecall {
  matchedIncidentId: string;
  similarityScore: number;
  originalResolver: string;
  daysAgo: number;
  rootCause: string;
  criticalWarning: string;
  recommendedRunbook: {
    name: string;
    command: string;
    estimatedTimeToResolve: string;
    successRate: string;
  };
  connectedEntities: HindsightMemoryNode[];
}

export interface AgentComparisonResult {
  stateless: {
    agentName: string;
    diagnosis: string;
    proposedAction: string;
    dangerousPitfall: string;
    estimatedDowntime: string;
    confidence: number;
  };
  hindsight: {
    agentName: string;
    diagnosis: string;
    recalledMemory: HindsightMemoryRecall;
    actionablePlan: string[];
    safeCommand: string;
    estimatedDowntime: string;
    confidence: number;
  };
}

export interface SystemicReflection {
  id: string;
  title: string;
  insight: string;
  recurringPattern: string;
  affectedServices: string[];
  preventativeRecommendation: string;
  confidence: number;
}
