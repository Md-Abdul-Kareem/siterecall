import { Incident } from "../types/incident";

export const SAMPLE_INCIDENTS: Incident[] = [
  {
    id: "INC-8821",
    company: "Swiggy",
    title: "Checkout 504 Gateway Timeout during Dinner Rush",
    service: "payment-gateway",
    severity: "SEV-1",
    status: "TRIGGERED",
    timestamp: "Just now (Peak 20:30 IST)",
    errorSnippet: "HTTP 504 Gateway Timeout: Bank UPI provider socket timeout after 15000ms",
    stackTrace: [
      "at Pool.acquireConnection (node_modules/generic-pool/lib/Pool.js:284:17)",
      "at PaymentOrchestrator.dispatchTransaction (/app/dist/services/payment.js:142:9)",
      "at routeHandler (/app/dist/routes/checkout.js:89:12)",
      "Error: Connection pool exhausted (max_pool_size: 200, waiting_requests: 3841)",
      "WARNING: Cascading thread starvation across 12 worker pods"
    ],
    telemetry: {
      cpuUsage: "94.2%",
      memoryUsage: "88.6%",
      errorRate: "68.4%",
      p99Latency: "14,800ms",
      activeConnections: 4200,
      impactSummary: "4,200 transactions/min failing. Estimated revenue loss: $18,500/min."
    }
  },
  {
    id: "INC-9140",
    company: "Blinkit",
    title: "Dark Store Stock Counter Negative Drift during Flash Sale",
    service: "inventory-sync",
    severity: "SEV-2",
    status: "TRIGGERED",
    timestamp: "2 mins ago",
    errorSnippet: "PostgresSerializationFailure: could not serialize access due to concurrent update on darkstore_inventory",
    stackTrace: [
      "ERROR: 40001: could not serialize access due to read/write dependencies among transactions",
      "DETAIL: Reason code: Canceled on identification as a pivot, during conflict out checking.",
      "at Query.read (/node_modules/pg/lib/query.js:142)",
      "at InventoryWorker.decrementSku (/app/workers/inventory.go:420)",
      "SKU-49192 in DarkStore BLR-14 drifting to -42 units!"
    ],
    telemetry: {
      cpuUsage: "78.0%",
      memoryUsage: "64.1%",
      errorRate: "34.2%",
      p99Latency: "3,200ms",
      activeConnections: 1850,
      impactSummary: "14 dark stores experiencing inventory lock contention. Overselling milk & bread."
    }
  },
  {
    id: "INC-7419",
    company: "Zomato",
    title: "Rider Live GPS Tracking WebSocket Disconnect Storm",
    service: "rider-telemetry-socket",
    severity: "SEV-2",
    status: "TRIGGERED",
    timestamp: "5 mins ago",
    errorSnippet: "WebSocketPingTimeout: 18,000 active rider clients failed ping/pong within 10000ms",
    stackTrace: [
      "SocketCluster.Worker: Event loop lag exceeded 480ms threshold",
      "at GeoBroadcastService.batchPush (/app/services/geo.js:312:15)",
      "at emitToProximitySubscribers (/app/services/sockets.js:98:21)",
      "Redis PUB/SUB queue buffer overflow: 85,000 pending geo-frames dropped"
    ],
    telemetry: {
      cpuUsage: "89.5%",
      memoryUsage: "74.8%",
      errorRate: "41.0%",
      p99Latency: "8,900ms",
      activeConnections: 38000,
      impactSummary: "Customers seeing frozen rider map markers across Mumbai & Delhi clusters."
    }
  }
];

export const MOCK_KNOWLEDGE_BASE = {
  "payment-gateway": {
    matchedIncidentId: "INC-412",
    similarityScore: 0.97,
    originalResolver: "Priya Sharma (Principal SRE)",
    daysAgo: 18,
    rootCause: "HDFC Bank partner API rotated public certs without updating downstream pool timeouts, causing pool queue exhaustion.",
    criticalWarning: "DO NOT RESTART THE WORKER PODS! Restarting wipes in-flight idempotency locks and will double-charge 3,400 customers who already authorized funds!",
    recommendedRunbook: {
      name: "runbooks/payment/hot-bump-bank-timeout.sh",
      command: "kubectl patch configmap bank-provider-cfg --patch '{\"data\":{\"POOL_MAX\":\"600\",\"SOCKET_TIMEOUT_MS\":\"4500\"}}' && kubectl rollout restart deployment/bank-proxy-sidecar",
      estimatedTimeToResolve: "35 seconds",
      successRate: "99.4%"
    },
    connectedEntities: [
      {
        id: "node-svc",
        label: "payment-gateway",
        type: "SERVICE" as const,
        description: "Core transaction dispatcher handling UPI & Card checkout."
      },
      {
        id: "node-inc",
        label: "INC-412 (Diwali Peak Outage)",
        type: "INCIDENT" as const,
        description: "Previous Sev-1 outage on Oct 14 resolved in 4 minutes."
      },
      {
        id: "node-eng",
        label: "Priya Sharma",
        type: "ENGINEER" as const,
        description: "Author of bank proxy connection pooling runbook."
      },
      {
        id: "node-rb",
        label: "hot-bump-bank-timeout.sh",
        type: "RUNBOOK" as const,
        description: "Patches sidecar connection ceiling without killing active pods."
      },
      {
        id: "node-anti",
        label: "AVOID: Master Pod Restart",
        type: "ANTIPATTERN" as const,
        description: "Causes double-charge financial dispute & cascading bank bans."
      }
    ]
  },
  "inventory-sync": {
    matchedIncidentId: "INC-289",
    similarityScore: 0.94,
    originalResolver: "Rahul Verma (Lead Backend Eng)",
    daysAgo: 32,
    rootCause: "Concurrent worker goroutines competing for row-level locks on popular SKU rows during localized flash sales.",
    criticalWarning: "DO NOT VACUUM FULL the Postgres table! It acquires an exclusive table lock that will freeze all checkout writes for 15 minutes.",
    recommendedRunbook: {
      name: "runbooks/inventory/partition-lock-drain.sh",
      command: "redis-cli EVALSHA $(redis-cli SCRIPT LOAD \"$(cat /scripts/sync-sku-redis-cas.lua)\") 1 'darkstore:blr-14' && psql -c 'SET LOCAL lock_timeout = 2000;'",
      estimatedTimeToResolve: "48 seconds",
      successRate: "98.1%"
    },
    connectedEntities: [
      {
        id: "node-inv",
        label: "inventory-sync",
        type: "SERVICE" as const,
        description: "Dark store SKU allocation & optimistic lock coordinator."
      },
      {
        id: "node-inc-289",
        label: "INC-289 (IPL Weekend Sale)",
        type: "INCIDENT" as const,
        description: "Row lock contention on milk & soft-drinks SKU partition."
      },
      {
        id: "node-eng-rahul",
        label: "Rahul Verma",
        type: "ENGINEER" as const,
        description: "Designed the Redis CAS optimistic inventory decrementor."
      },
      {
        id: "node-rb-lua",
        label: "sync-sku-redis-cas.lua",
        type: "RUNBOOK" as const,
        description: "Switches hot SKU counters to Redis Atomic CAS to relieve Postgres."
      },
      {
        id: "node-anti-vac",
        label: "AVOID: Table-level VACUUM",
        type: "ANTIPATTERN" as const,
        description: "Locks all 120 dark stores from updating inventory."
      }
    ]
  },
  "rider-telemetry-socket": {
    matchedIncidentId: "INC-533",
    similarityScore: 0.91,
    originalResolver: "Sarah Chen (Infra Architect)",
    daysAgo: 45,
    rootCause: "Geo-hash broadcast ring buffer filled up due to unbatched rider position emits under 100k subscriber fan-out.",
    criticalWarning: "DO NOT REBOOT the cluster nodes! It triggers a thundering herd reconnection wave that will exhaust TCP socket descriptors.",
    recommendedRunbook: {
      name: "runbooks/geo/enable-h3-broadcast-batching.sh",
      command: "curl -X POST http://geo-internal:8080/admin/config/compression -d '{\"batch_window_ms\": 250, \"max_h3_depth\": 8}'",
      estimatedTimeToResolve: "20 seconds",
      successRate: "99.8%"
    },
    connectedEntities: [
      {
        id: "node-geo",
        label: "rider-telemetry-socket",
        type: "SERVICE" as const,
        description: "High-throughput WebSocket gateway streaming 50k rider GPS ticks/sec."
      },
      {
        id: "node-inc-533",
        label: "INC-533 (Monsoon Surge Outage)",
        type: "INCIDENT" as const,
        description: "Subscribers choked event loop due to single-point geo broadcasts."
      },
      {
        id: "node-eng-sarah",
        label: "Sarah Chen",
        type: "ENGINEER" as const,
        description: "Implemented H3 hexagonal spatial batching index."
      },
      {
        id: "node-rb-h3",
        label: "enable-h3-broadcast-batching.sh",
        type: "RUNBOOK" as const,
        description: "Compacts 50,000 spatial pings into 250ms batched frame pulses."
      }
    ]
  }
};
