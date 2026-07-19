"use client";

import { useState, useEffect } from "react";

// --- Types ---
export type CloudProvider = "aws" | "azure" | "gcp" | "oci";
export type ServiceStatus = "healthy" | "degraded" | "down" | "unknown";
export type IncidentSeverity = "P1" | "P2" | "P3" | "P4";
export type IncidentStatus = "open" | "investigating" | "mitigating" | "resolved";

export type Service = {
  id: string;
  name: string;
  environment: string; // production | staging | development
  provider: CloudProvider;
  status: ServiceStatus;
  latencyThreshold: number; // ms
  errorRateThreshold: number; // decimal e.g. 0.05
  uptimePercent: number;
  avgLatency: number;
  currentErrorRate: number;
  slackWebhook?: string;
  notifyEmails?: string; // comma separated
  platformConfig?: string; // JSON configuration
  isPublic: boolean;
};

export type IncidentEvent = {
  id: string;
  incidentId: string;
  timestamp: string;
  type: "detected" | "agent_started" | "hypothesis" | "action" | "health_check" | "resolved" | "notification" | "human_comment";
  content: string;
  actor: "agent" | "human";
  data?: any;
};

export type Incident = {
  id: string;
  serviceId: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  rootCause?: string;
  rootCauseConfidence?: number;
  triggerMetric?: string;
  triggerValue?: string;
  diagnosis?: string; // Detailed JSON string
  runbookId?: string;
  actionsLog?: string; // JSON array of executed actions
  resolvedBy?: "agent" | "human";
  mttr?: number; // seconds
  postMortem?: string; // Markdown post-mortem
  voiceTranscript?: string; // Transcript of voice Commander session
  openedAt: string;
  resolvedAt?: string;
};

export type RunbookStep = {
  id: string;
  type: "restart" | "scale" | "rollback" | "command" | "notify" | "wait" | "check";
  name: string;
  params: Record<string, any>;
  requireApproval: boolean;
};

export type Runbook = {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  steps: RunbookStep[];
  isEnabled: boolean;
  requireApproval: boolean;
  useCount: number;
  lastUsed?: string;
};

export type MetricSample = {
  timestamp: string;
  latencyMs: number;
  errorRate: number;
  cpuPercent: number;
  memPercent: number;
};

export type Deploy = {
  id: string;
  serviceId: string;
  version: string;
  commitSha: string;
  commitMsg: string;
  author: string;
  platform: string;
  status: "success" | "failed" | "rolled-back" | "pending";
  deployedAt: string;
  rollbackOf?: string;
};

export type LogEntry = {
  id: string;
  serviceId: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  timestamp: string;
};

export type OrgSettings = {
  name: string;
  timezone: string;
  autonomy: "ask" | "notify" | "full"; // Autonomy levels
  rollbackConfidence: number; // slider e.g. 0.8
  aiModel?: string;
  aiTemperature?: number;
  systemPrompt?: string;
  slackWebhook?: string;
  vercelToken?: string;
  railwayToken?: string;
  githubToken?: string;
};

// --- Seed Data ---
const initialServices: Service[] = [
  {
    id: "api-service",
    name: "api-service",
    environment: "production",
    provider: "aws",
    status: "healthy",
    latencyThreshold: 500,
    errorRateThreshold: 0.05,
    uptimePercent: 99.98,
    avgLatency: 42,
    currentErrorRate: 0.001,
    isPublic: true,
  },
  {
    id: "web-frontend",
    name: "web-frontend",
    environment: "production",
    provider: "aws",
    status: "healthy",
    latencyThreshold: 350,
    errorRateThreshold: 0.02,
    uptimePercent: 100.0,
    avgLatency: 85,
    currentErrorRate: 0.0,
    isPublic: true,
  },
  {
    id: "database-primary",
    name: "database-primary",
    environment: "production",
    provider: "aws",
    status: "degraded",
    latencyThreshold: 200,
    errorRateThreshold: 0.01,
    uptimePercent: 99.95,
    avgLatency: 4,
    currentErrorRate: 0.005,
    isPublic: false,
  },
  {
    id: "worker-service",
    name: "worker-service",
    environment: "production",
    provider: "gcp",
    status: "healthy",
    latencyThreshold: 1000,
    errorRateThreshold: 0.08,
    uptimePercent: 99.91,
    avgLatency: 120,
    currentErrorRate: 0.002,
    isPublic: true,
  },
];

const initialRunbooks: Runbook[] = [
  {
    id: "rb-conn-pool",
    serviceId: "api-service",
    name: "DB Connection Pool Exhaustion Recovery",
    description: "Triggers when connection pool is saturated, causing latency spikes.",
    isEnabled: true,
    requireApproval: false,
    useCount: 4,
    lastUsed: "2026-07-16T10:14:00Z",
    steps: [
      { id: "step-1", type: "command", name: "Increase pool_size to 30", params: { configKey: "pool_size", value: 30 }, requireApproval: false },
      { id: "step-2", type: "restart", name: "Restart connection manager", params: { component: "connection-manager" }, requireApproval: false },
      { id: "step-3", type: "check", name: "Verify api-service healthcheck", params: { checkPath: "/healthz" }, requireApproval: false },
    ],
  },
  {
    id: "rb-cpu-scale",
    serviceId: "database-primary",
    name: "High CPU Scaling Playbook",
    description: "Triggers when CPU utilization stays above 85% for 5 minutes.",
    isEnabled: true,
    requireApproval: true,
    useCount: 1,
    lastUsed: "2026-07-10T14:22:00Z",
    steps: [
      { id: "step-1", type: "scale", name: "Scale replicas to 5", params: { replicas: 5 }, requireApproval: true },
      { id: "step-2", type: "check", name: "Run query stats analyzer", params: {}, requireApproval: false },
    ],
  },
  {
    id: "rb-error-rollback",
    serviceId: "web-frontend",
    name: "Error Spike Auto-Rollback",
    description: "Triggers when 5xx errors spike above 10% in 1 minute.",
    isEnabled: true,
    requireApproval: false,
    useCount: 2,
    lastUsed: "2026-07-14T08:30:00Z",
    steps: [
      { id: "step-1", type: "rollback", name: "Roll back to last stable build", params: {}, requireApproval: false },
      { id: "step-2", type: "notify", name: "Slack alert and page primary engineer", params: { channel: "#incidents" }, requireApproval: false },
    ],
  },
];

const initialIncidents: Incident[] = [
  {
    id: "inc-past-1",
    serviceId: "worker-service",
    title: "High Memory Usage — Worker Pool Leak",
    severity: "P3",
    status: "resolved",
    rootCause: "Memory leak in queue parsing worker under high-throughput batch task.",
    rootCauseConfidence: 89,
    resolvedBy: "agent",
    mttr: 222, // 3m 42s
    openedAt: "2026-07-18T10:14:00Z",
    resolvedAt: "2026-07-18T10:17:42Z",
    postMortem: `# Post-Mortem: worker-service Memory Leak\n\n## Summary\nworker-service experienced degraded performance due to a memory leak in queue parsing.\n\n## Timeline\n- **10:14:00** Anomaly detected (92% memory)\n- **10:15:30** Runbook executed: Worker restart\n- **10:17:42** Health check passed and incident resolved.`,
  },
  {
    id: "inc-past-2",
    serviceId: "api-service",
    title: "Route Optimization Fail — Route /optimize 500 Spike",
    severity: "P2",
    status: "resolved",
    rootCause: "Null pointer exception when route points payload had empty addresses list.",
    rootCauseConfidence: 95,
    resolvedBy: "human",
    mttr: 310, // 5m 10s
    openedAt: "2026-07-17T15:20:00Z",
    resolvedAt: "2026-07-17T15:25:10Z",
    postMortem: `# Post-Mortem: Route Optimization Fail\n\n## Summary\nA P2 incident occurred on api-service due to an unhandled exception in the '/optimize' endpoint.`,
  },
];

const initialDeploys: Deploy[] = [
  {
    id: "dep-1",
    serviceId: "api-service",
    version: "v2.4.0",
    commitSha: "f8b9d31",
    commitMsg: "Merge pull request #112: Optimize database lookup keys",
    author: "harish@deploypilotos.com",
    platform: "vercel",
    status: "success",
    deployedAt: "2026-07-16T12:00:00Z",
  },
  {
    id: "dep-2",
    serviceId: "api-service",
    version: "v2.4.1",
    commitSha: "e9a8f27",
    commitMsg: "feat: Reduce DB connection pool size from 25 to 10 to limit idle ports",
    author: "harish@deploypilotos.com",
    platform: "vercel",
    status: "success",
    deployedAt: "2026-07-18T23:46:30Z",
  },
  {
    id: "dep-3",
    serviceId: "web-frontend",
    version: "v1.8.2",
    commitSha: "a1c2d34",
    commitMsg: "fix: Update navigation headers for responsive layouts",
    author: "harish@deploypilotos.com",
    platform: "vercel",
    status: "success",
    deployedAt: "2026-07-18T18:30:00Z",
  },
];

const initialLogs: LogEntry[] = [
  { id: "log-1", serviceId: "api-service", level: "INFO", message: "Listening on port 8080", timestamp: "2026-07-18T23:40:00Z" },
  { id: "log-2", serviceId: "api-service", level: "INFO", message: "Database connection established successfully", timestamp: "2026-07-18T23:40:01Z" },
  { id: "log-3", serviceId: "api-service", level: "INFO", message: "Server ready to handle requests", timestamp: "2026-07-18T23:40:02Z" },
];

const initialSettings: OrgSettings = {
  name: "Harish's Workspace",
  timezone: "UTC -05:00",
  autonomy: "full",
  rollbackConfidence: 0.8,
  aiModel: "gpt-5.6-sol",
  aiTemperature: 0.2,
  systemPrompt: "You are an elite SRE Agent for DeployPilotOS. Analyze logs, deduce root causes, and execute runbooks with extreme precision.",
  slackWebhook: "https://hooks.slack.com/services/T00/B00/X00",
};

// --- Storage Keys ---
const KEYS = {
  SERVICES: "dp_services",
  RUNBOOKS: "dp_runbooks",
  INCIDENTS: "dp_incidents",
  EVENTS: "dp_events",
  DEPLOYS: "dp_deploys",
  SETTINGS: "dp_settings",
  METRICS: "dp_metrics",
};

// --- Custom Event System for Cross-Component Updates ---
const EVENT_NAME = "deploypilot_store_update";

function triggerUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

// --- Local Storage Getters & Setters ---
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
    triggerUpdate();
  }
}

// --- Store API Actions ---
export const store = {
  getServices: () => getStored<Service[]>(KEYS.SERVICES, initialServices),
  setServices: (services: Service[]) => setStored(KEYS.SERVICES, services),
  
  getRunbooks: () => getStored<Runbook[]>(KEYS.RUNBOOKS, initialRunbooks),
  setRunbooks: (runbooks: Runbook[]) => setStored(KEYS.RUNBOOKS, runbooks),

  getIncidents: () => getStored<Incident[]>(KEYS.INCIDENTS, initialIncidents),
  setIncidents: (incidents: Incident[]) => setStored(KEYS.INCIDENTS, incidents),

  getDeploys: () => getStored<Deploy[]>(KEYS.DEPLOYS, initialDeploys),
  setDeploys: (deploys: Deploy[]) => setStored(KEYS.DEPLOYS, deploys),

  getSettings: () => getStored<OrgSettings>(KEYS.SETTINGS, initialSettings),
  setSettings: (settings: OrgSettings) => setStored(KEYS.SETTINGS, settings),

  getEvents: (incidentId: string) => {
    const allEvents = getStored<IncidentEvent[]>(KEYS.EVENTS, []);
    return allEvents.filter(e => e.incidentId === incidentId);
  },
  
  addEvent: (event: Omit<IncidentEvent, "id" | "timestamp">) => {
    const allEvents = getStored<IncidentEvent[]>(KEYS.EVENTS, []);
    const newEvent: IncidentEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    allEvents.push(newEvent);
    setStored(KEYS.EVENTS, allEvents);
    return newEvent;
  },

  getMetrics: (serviceId: string): MetricSample[] => {
    const allMetrics = getStored<Record<string, MetricSample[]>>(KEYS.METRICS, {});
    if (!allMetrics[serviceId]) {
      // Seed metrics
      const samples: MetricSample[] = [];
      const now = Date.now();
      for (let i = 60; i >= 0; i--) {
        samples.push({
          timestamp: new Date(now - i * 60000).toISOString(),
          latencyMs: 35 + Math.random() * 15,
          errorRate: Math.random() < 0.02 ? 0.001 : 0.0,
          cpuPercent: 12 + Math.random() * 6,
          memPercent: 44 + Math.random() * 2,
        });
      }
      allMetrics[serviceId] = samples;
      setTimeout(() => setStored(KEYS.METRICS, allMetrics), 0);
    }
    return allMetrics[serviceId];
  },

  setMetrics: (serviceId: string, samples: MetricSample[]) => {
    const allMetrics = getStored<Record<string, MetricSample[]>>(KEYS.METRICS, {});
    allMetrics[serviceId] = samples;
    setStored(KEYS.METRICS, allMetrics);
  },

  addLogEntry: (serviceId: string, level: LogEntry["level"], message: string) => {
    // Save to temp or persistent
    console.log(`[LOG] [${level}] [${serviceId}] ${message}`);
  },

  resetStore: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(KEYS.SERVICES);
      localStorage.removeItem(KEYS.RUNBOOKS);
      localStorage.removeItem(KEYS.INCIDENTS);
      localStorage.removeItem(KEYS.EVENTS);
      localStorage.removeItem(KEYS.DEPLOYS);
      localStorage.removeItem(KEYS.SETTINGS);
      localStorage.removeItem(KEYS.METRICS);
      triggerUpdate();
    }
  }
};

// --- Custom React Hook for Store updates ---
export function useStoreState() {
  const [, setTick] = useState(0);
  
  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    window.addEventListener(EVENT_NAME, listener);
    return () => window.removeEventListener(EVENT_NAME, listener);
  }, []);

  const services = store.getServices();
  const incidents = store.getIncidents();
  const runbooks = store.getRunbooks();
  const deploys = store.getDeploys();
  const settings = store.getSettings();

  return {
    services,
    incidents,
    runbooks,
    deploys,
    settings,
    refresh: () => setTick(t => t + 1),
  };
}

// --- Simulation Engine ---
let simTimeoutIds: ReturnType<typeof setTimeout>[] = [];

export function clearSimulation() {
  simTimeoutIds.forEach(id => clearTimeout(id));
  simTimeoutIds = [];
}

export function startSimulation(serviceId: string, onStep?: (stepContent: string) => void) {
  clearSimulation();
  
  const services = store.getServices();
  const updatedServices = services.map(s => {
    if (s.id === serviceId) {
      return { ...s, status: "down" as const, avgLatency: 847, currentErrorRate: 0.234 };
    }
    return s;
  });
  store.setServices(updatedServices);

  // Create active incident
  const incidentId = "inc-active-" + Date.now();
  const newIncident: Incident = {
    id: incidentId,
    serviceId,
    title: "API Timeout Cascade — DB Connection Pool Exhausted",
    severity: "P1",
    status: "open",
    openedAt: new Date().toISOString(),
  };
  
  const incidents = store.getIncidents();
  store.setIncidents([newIncident, ...incidents]);

  const addEv = (type: IncidentEvent["type"], content: string, data?: any) => {
    store.addEvent({
      incidentId,
      type,
      content,
      actor: "agent",
      data,
    });
    if (onStep) onStep(content);
  };

  // Timeline of Simulation steps
  const scheduleStep = (ms: number, fn: () => void) => {
    const id = setTimeout(fn, ms);
    simTimeoutIds.push(id);
  };

  // Step 1: Detect
  scheduleStep(100, () => {
    addEv("detected", "Anomaly detected: latency crossed the 500ms threshold (847ms avg). Status degraded to down.", { latencyMs: 847, errorRate: 0.234 });
    
    // Push metric spike to telemetry
    const currentMetrics = store.getMetrics(serviceId);
    const updatedMetrics = [...currentMetrics, {
      timestamp: new Date().toISOString(),
      latencyMs: 847,
      errorRate: 0.234,
      cpuPercent: 45.2,
      memPercent: 55.4,
    }];
    store.setMetrics(serviceId, updatedMetrics);
  });

  // Step 2: Investigation & Log Collection
  scheduleStep(1200, () => {
    addEv("agent_started", "Fetching recent log logs and deployment history (last 500 lines)...");
  });

  // Step 3: Analysis & Error detection
  scheduleStep(2400, () => {
    addEv("hypothesis", "Found connection pool timeouts (pool_size=10, waiting=47 concurrent threads) beginning 21 seconds after commit e9a8f27.");
  });

  // Step 4: Deploy correlation
  scheduleStep(3600, () => {
    addEv("hypothesis", "Recent deploy analysis: Deploy v2.4.1 (commit e9a8f27) changed pool_size from 25 to 10 in database/config.py.");
  });

  // Step 5: Root Cause Identification
  scheduleStep(4800, () => {
    const diagnosis = {
      confidence: 94,
      rootCause: "Deploy v2.4.1 reduced database pool size from 25 to 10 under concurrent peak volume.",
      evidence: [
        "23:46:30 — Deploy v2.4.1 completed",
        "23:46:51 — DB connection timeouts began",
        "Normal peak loads require 18+ active connections; pool limit is 10"
      ],
      actions: [
        { action: "Increase pool_size to 30", risk: "low", rationale: "Mitigate connection queuing" },
        { action: "Restart connection manager", risk: "low", rationale: "Apply new pool limits immediately" }
      ]
    };
    
    addEv("hypothesis", "Root cause identified with 94% confidence: config regression. Matched recovery playbook: DB Connection Pool Exhaustion Recovery.", diagnosis);
    
    const incs = store.getIncidents();
    const updated = incs.map(i => {
      if (i.id === incidentId) {
        return {
          ...i,
          status: "investigating" as const,
          rootCause: diagnosis.rootCause,
          rootCauseConfidence: diagnosis.confidence,
          diagnosis: JSON.stringify(diagnosis),
          runbookId: "rb-conn-pool"
        };
      }
      return i;
    });
    store.setIncidents(updated);
  });

  // Step 6: Execute Runbook Step 1
  scheduleStep(6000, () => {
    addEv("action", "Executing Runbook Step 1/3: Increasing pool_size limit to 30.");
    
    const incs = store.getIncidents();
    const updated = incs.map(i => {
      if (i.id === incidentId) {
        return { ...i, status: "mitigating" as const };
      }
      return i;
    });
    store.setIncidents(updated);
  });

  // Step 7: Execute Runbook Step 2
  scheduleStep(7200, () => {
    addEv("action", "Executing Runbook Step 2/3: Restarting connection-manager cluster services.");
  });

  // Step 8: Health Check & Recovery Verification
  scheduleStep(8500, () => {
    addEv("health_check", "Executing Runbook Step 3/3: Running system integrity checks... API response latency: 38ms, HTTP error rate: 0.001% success.");
    
    // Add healthy metric point
    const currentMetrics = store.getMetrics(serviceId);
    const updatedMetrics = [...currentMetrics, {
      timestamp: new Date().toISOString(),
      latencyMs: 38,
      errorRate: 0.001,
      cpuPercent: 14.5,
      memPercent: 44.8,
    }];
    store.setMetrics(serviceId, updatedMetrics);
  });

  // Step 9: Resolve Incident
  scheduleStep(9600, () => {
    // Revert service status to healthy
    const currentServices = store.getServices();
    const resolvedServices = currentServices.map(s => {
      if (s.id === serviceId) {
        return { ...s, status: "healthy" as const, avgLatency: 41, currentErrorRate: 0.001 };
      }
      return s;
    });
    store.setServices(resolvedServices);

    // Rollback Deploy status
    const currentDeploys = store.getDeploys();
    const updatedDeploys = currentDeploys.map(d => {
      if (d.version === "v2.4.1" && d.serviceId === serviceId) {
        return { ...d, status: "rolled-back" as const };
      }
      return d;
    });
    store.setDeploys(updatedDeploys);

    // Update incident in store
    const incs = store.getIncidents();
    const resolvedIncident = incs.map(i => {
      if (i.id === incidentId) {
        return {
          ...i,
          status: "resolved" as const,
          resolvedAt: new Date().toISOString(),
          resolvedBy: "agent" as const,
          mttr: 10,
          postMortem: `# Post-Mortem Report: API Timeout Cascade\n\nIncident ID: **${incidentId}**\nSeverity: **P1**\nService: **api-service**\nMTTR: **10 seconds**\n\n## Summary\nAt 23:47:02, api-service latency spiked to 847ms causing automated P1 alerts. DeployPilotOS diagnosed a database connection pool regression from deploy v2.4.1 and automatically increased connection limits to restore service in 10 seconds.\n\n## Root Cause\nDeploy v2.4.1 reduced \`pool_size\` from 25 to 10 in \`database/config.py\`. Under active demand, this caused threads to block waiting for database connections.\n\n## Mitigation Steps Taken\n1. Automatically detected anomaly and collected diagnostics.\n2. Matched DB connection pool exhaustion runbook.\n3. Increased active pool connections parameters to 30.\n4. Restarted connection manager.\n5. Verified healthy telemetry and auto-resolved.`
        };
      }
      return i;
    });
    store.setIncidents(resolvedIncident);

    addEv("resolved", "Incident resolved automatically. Services verified 100% operational. Slack post-mortem sent.", { mttr: 10 });
  });
}
