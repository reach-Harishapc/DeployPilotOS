"use client";

import React, { useState, useEffect, useRef } from "react";
import { use } from "react";
import { AppShell } from "@/components/AppShell";
import { 
  useStoreState, store, startSimulation, 
  Service, MetricSample, LogEntry 
} from "@/src/lib/store";
import { 
  Server, Clock, ShieldCheck, Zap, RefreshCw, 
  Settings, Terminal, Sparkles, CheckCircle2, 
  AlertTriangle, Play, Info, ArrowLeft, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: serviceId } = use(params);
  const router = useRouter();
  const { services, incidents, refresh } = useStoreState();
  const [activeTab, setActiveTab] = useState<"latency" | "errors" | "cpu" | "memory">("latency");
  const [runningHealthCheck, setRunningHealthCheck] = useState(false);
  const [healthCheckResult, setHealthCheckResult] = useState<"pass" | "fail" | null>(null);
  const [aiAnalyzingLogs, setAiAnalyzingLogs] = useState(false);
  const [aiLogSummary, setAiLogSummary] = useState<string | null>(null);
  
  const service = services.find(s => s.id === serviceId);
  const serviceMetrics = store.getMetrics(serviceId);
  const serviceRunbooks = store.getRunbooks().filter(r => r.serviceId === serviceId);
  const serviceDeploys = store.getDeploys().filter(d => d.serviceId === serviceId);

  // Simulated log stream
  const [logs, setLogs] = useState<string[]>([]);
  const logTerminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!service) return;

    // Initial logs
    const initialLogsList = [
      `[${new Date().toISOString()}] INFO  [system] Starting service container v${serviceDeploys[0]?.version || "2.4.0"}`,
      `[${new Date().toISOString()}] INFO  [db] Pool initialization completed (size=25)`,
      `[${new Date().toISOString()}] INFO  [web] Listening on port 8080`,
    ];
    setLogs(initialLogsList);

    // Stream logs periodically based on service state
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      let logLine = "";
      
      if (service.status === "down") {
        const errorType = Math.random() > 0.5 
          ? "ERROR [db] Connection pool timeout after 30000ms. Active: 10, Waiting: 38"
          : "ERROR [web] Internal Server Error 500 - GET /api/v1/checkout - PoolExhaustedException";
        logLine = `[${now}] ${errorType}`;
      } else if (service.status === "degraded") {
        logLine = `[${now}] WARN  [db] Connection pool utilization at 96% (size=10, active=9)`;
      } else {
        const path = ["/api/v1/users", "/api/v1/products", "/healthz", "/api/v1/auth/session"][Math.floor(Math.random() * 4)];
        const latency = 12 + Math.floor(Math.random() * 20);
        logLine = `[${now}] INFO  [web] 200 OK - GET ${path} - ${latency}ms`;
      }

      setLogs(prev => {
        const updated = [...prev, logLine];
        return updated.slice(-100); // limit to 100 lines
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [serviceId, service?.status]);

  // Scroll to bottom of log terminal
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [logs]);

  if (!service) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-white">Service Not Found</h2>
          <p className="text-zinc-500 mt-2">The service ID could not be matched.</p>
          <Link href="/dashboard" className="text-cyan-400 hover:underline mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleRunHealthCheck = () => {
    setRunningHealthCheck(true);
    setHealthCheckResult(null);
    setTimeout(() => {
      setRunningHealthCheck(false);
      setHealthCheckResult(service.status === "down" ? "fail" : "pass");
    }, 1500);
  };

  const handleSimulate = () => {
    startSimulation(service.id, () => {
      refresh();
    });
    // Redirect to incident details
    setTimeout(() => {
      const activeInc = store.getIncidents().find(i => i.status !== "resolved");
      if (activeInc) {
        router.push(`/incidents/${activeInc.id}`);
      }
    }, 800);
  };

  const handleAnalyzeLogs = () => {
    setAiAnalyzingLogs(true);
    setAiLogSummary(null);
    setTimeout(() => {
      setAiAnalyzingLogs(false);
      if (service.status === "down") {
        setAiLogSummary(
          "DeployPilotOS SRE Summary:\n• Critical error rate spike detected (23% error rate).\n• Connection pool saturation verified in logs (Waiting threads count: 38).\n• Correlation: Incidents started exactly 21 seconds after Deploy v2.4.1."
        );
      } else if (service.status === "degraded") {
        setAiLogSummary(
          "DeployPilotOS SRE Summary:\n• System is operational but degraded.\n• Database connection pool utilization is warning-level (96%).\n• Risk of connection timeout cascade if load increases."
        );
      } else {
        setAiLogSummary(
          "DeployPilotOS SRE Summary:\n• No anomalies detected in active logs.\n• Performance meets baseline thresholds (latency avg: 42ms, error rate: 0%)."
        );
      }
    }, 1200);
  };

  const handleTestRunbook = (rbName: string) => {
    alert(`Dry Run of "${rbName}" triggered. No active changes applied in dry run mode.`);
  };

  // Status indicators
  let statusBadge = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  let statusText = "Healthy";
  let statusDot = "bg-emerald-400 shadow-[0_0_8px_#34d399]";
  
  if (service.status === "down") {
    statusBadge = "bg-red-500/10 border-red-500/25 text-red-400";
    statusText = "Down / Critical Alert";
    statusDot = "bg-red-400 animate-pulse shadow-[0_0_8px_#f87171]";
  } else if (service.status === "degraded") {
    statusBadge = "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
    statusText = "Degraded Health";
    statusDot = "bg-yellow-400 shadow-[0_0_8px_#facc15]";
  }

  // Latency, errors, cpu, memory arrays for responsive SVGs
  const svgWidth = 500;
  const svgHeight = 150;
  const metricsCount = serviceMetrics.length;

  const getPointsForMetric = (key: keyof MetricSample) => {
    return serviceMetrics.map((m, idx) => {
      const x = (idx / (metricsCount - 1)) * svgWidth;
      let val = Number(m[key]) || 0;
      
      // Scale val appropriately
      let y = svgHeight - 20; // default near bottom
      if (key === "latencyMs") {
        // max latency represents 1000ms
        y = svgHeight - (val / 1000) * (svgHeight - 40) - 20;
      } else if (key === "errorRate") {
        // max error rate represents 100%
        y = svgHeight - (val / 1.0) * (svgHeight - 40) - 20;
      } else if (key === "cpuPercent" || key === "memPercent") {
        // max represents 100%
        y = svgHeight - (val / 100) * (svgHeight - 40) - 20;
      }
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Back Link */}
        <div>
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs flex items-center gap-1">
            <ArrowLeft size={12} /> Back to Mission Control
          </Link>
        </div>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold border ${statusBadge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                {statusText}
              </span>
              <span className="text-xs uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 font-mono">
                {service.provider.toUpperCase()}
              </span>
              <span className="text-xs text-zinc-500 capitalize">
                {service.environment}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{service.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunHealthCheck}
              disabled={runningHealthCheck}
              className="bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-lg text-xs border border-white/10 transition-all flex items-center gap-1.5"
            >
              <RefreshCw size={12} className={runningHealthCheck ? "animate-spin" : ""} />
              {runningHealthCheck ? "Polling..." : "Run Health Check"}
            </button>
            <button
              onClick={handleSimulate}
              disabled={service.status === "down"}
              className={`font-semibold px-4 py-2 rounded-lg text-xs border transition-all flex items-center gap-1.5 ${
                service.status === "down"
                  ? "bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-red-500/10 hover:bg-red-500/15 border-red-500/20 hover:border-red-500/40 text-red-400"
              }`}
            >
              <Zap size={12} fill="currentColor" />
              Simulate Outage
            </button>
          </div>
        </div>

        {/* Health Check Result Alert */}
        {healthCheckResult && (
          <div className={`p-4 border rounded-xl text-xs flex items-center gap-2.5 ${
            healthCheckResult === "pass" 
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
              : "bg-red-500/10 border-red-500/25 text-red-400"
          }`}>
            {healthCheckResult === "pass" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <div>
              <strong>Health check finished:</strong> {healthCheckResult === "pass" 
                ? `SUCCESS — Host returned 200 OK. Latency is stable at ${service.avgLatency}ms.`
                : "FAILED — Host returned 500 Internal Server Error. Connection pool timeout."}
            </div>
          </div>
        )}

        {/* Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column - Service Info */}
          <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-6 lg:col-span-1">
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Service Statistics</h3>
              <div className="flex flex-col gap-3">
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-zinc-500 text-xs">Uptime 30d</span>
                  <span className="text-white text-xs font-bold font-mono">{service.uptimePercent}%</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-zinc-500 text-xs">Avg Latency</span>
                  <span className="text-white text-xs font-bold font-mono">{service.avgLatency}ms</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-zinc-500 text-xs">Error Rate</span>
                  <span className="text-white text-xs font-bold font-mono">{(service.currentErrorRate * 100).toFixed(3)}%</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-zinc-500 text-xs">Release Deploy Count</span>
                  <span className="text-white text-xs font-bold font-mono">{serviceDeploys.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Linked Integrations</h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Slack Alerts", status: "Active", linked: true },
                  { name: "GitHub Repository", status: "Linked", linked: true },
                  { name: "Vercel Platform", status: "Connected", linked: true },
                ].map((int, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                    <span className="text-zinc-400">{int.name}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 select-none">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {int.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Metrics & Logs */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Chart Module */}
            <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
                <h3 className="text-xs font-semibold text-white">Performance Telemetry</h3>
                <div className="flex gap-1 bg-white/5 p-0.5 rounded-lg">
                  {[
                    { id: "latency", label: "Latency" },
                    { id: "errors", label: "Error Rate" },
                    { id: "cpu", label: "CPU" },
                    { id: "memory", label: "Memory" },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                        activeTab === tab.id 
                          ? "bg-white/10 text-white shadow-sm" 
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="relative h-44 bg-zinc-950/40 border border-white/[0.02] rounded-lg p-2 flex items-end overflow-hidden">
                {serviceMetrics.length > 1 ? (
                  <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="metricGradRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Horizontal grid lines */}
                    <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                    <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                    <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

                    {/* Area path */}
                    <path
                      d={`M 0,${svgHeight} L ${getPointsForMetric(
                        activeTab === "latency" ? "latencyMs" : activeTab === "errors" ? "errorRate" : activeTab === "cpu" ? "cpuPercent" : "memPercent"
                      )} L ${svgWidth},${svgHeight} Z`}
                      fill={`url(#${service.status === "down" ? "metricGradRed" : "metricGrad"})`}
                    />

                    {/* Line path */}
                    <path
                      d={`M ${getPointsForMetric(
                        activeTab === "latency" ? "latencyMs" : activeTab === "errors" ? "errorRate" : activeTab === "cpu" ? "cpuPercent" : "memPercent"
                      )}`}
                      fill="none"
                      stroke={service.status === "down" ? "#f87171" : "#22d3ee"}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <div className="text-zinc-600 text-xs w-full text-center pb-16 select-none">No telemetry samples loaded</div>
                )}
                <div className="absolute top-2 left-2 text-[9px] text-zinc-500 font-mono">
                  {activeTab === "latency" ? "Latency (ms)" : activeTab === "errors" ? "HTTP Error Rate (%)" : activeTab === "cpu" ? "CPU (%)" : "Memory (%)"}
                </div>
              </div>
            </div>

            {/* Simulated Live Log Terminal */}
            <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex-1 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3 select-none">
                <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Terminal size={14} /> Live Logs Stream
                </h3>
                <button
                  onClick={handleAnalyzeLogs}
                  disabled={aiAnalyzingLogs}
                  className="bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 font-semibold px-2.5 py-1 rounded border border-white/5 transition-all text-[10px] flex items-center gap-1"
                >
                  <Sparkles size={10} />
                  {aiAnalyzingLogs ? "Analyzing..." : "AI Analyze Logs"}
                </button>
              </div>

              {/* AI Log summary banner */}
              {aiLogSummary && (
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-xs text-cyan-300 font-medium mb-3 relative animate-fade-in">
                  <button 
                    onClick={() => setAiLogSummary(null)} 
                    className="absolute top-2 right-2 text-cyan-500 hover:text-cyan-300 text-xs select-none"
                  >
                    ×
                  </button>
                  <div className="whitespace-pre-wrap leading-normal font-sans">{aiLogSummary}</div>
                </div>
              )}

              {/* Logs terminal box */}
              <div 
                ref={logTerminalRef}
                className="flex-1 overflow-y-auto font-mono text-[11px] text-zinc-400 leading-normal p-3 rounded-lg bg-zinc-950 border border-white/[0.02] flex flex-col gap-1 max-h-[320px] min-h-[220px]"
              >
                {logs.map((line, idx) => {
                  let textStyle = "text-zinc-400";
                  if (line.includes("ERROR")) textStyle = "text-red-400 font-semibold";
                  else if (line.includes("WARN")) textStyle = "text-yellow-400 font-medium";
                  else if (line.includes("SUCCESS") || line.includes("OK")) textStyle = "text-emerald-400";

                  return (
                    <div key={idx} className={textStyle}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column - Runbooks List */}
          <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl lg:col-span-1 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <h3 className="text-xs font-semibold text-white">Available Runbooks</h3>
              </div>
              <div className="flex flex-col gap-3">
                {serviceRunbooks.length > 0 ? (
                  serviceRunbooks.map(rb => (
                    <div key={rb.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-3 hover:bg-white/[0.04] transition-all">
                      <div>
                        <strong className="text-xs text-zinc-200 block truncate">{rb.name}</strong>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                          {rb.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-zinc-400 select-none">
                        <span>{rb.steps.length} Automated Steps</span>
                        <span>Used {rb.useCount}x</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 select-none">
                        <button
                          onClick={() => handleTestRunbook(rb.name)}
                          className="bg-white/5 hover:bg-white/10 text-white font-semibold py-1.5 rounded text-[9px] transition-all border border-white/5"
                        >
                          Dry Run
                        </button>
                        <Link
                          href={`/runbooks/${rb.id}`}
                          className="bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/20 hover:border-cyan-500/35 text-cyan-400 font-semibold py-1.5 rounded text-[9px] transition-all text-center"
                        >
                          Edit Steps
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 text-xs py-8 text-center border border-dashed border-white/5 rounded-lg select-none">
                    No runbooks configured
                  </div>
                )}
              </div>
            </div>

            {/* Recent Deploys */}
            <div>
              <h3 className="text-xs font-semibold text-white mb-3 border-b border-white/5 pb-2">Recent Releases</h3>
              <div className="flex flex-col gap-2">
                {serviceDeploys.map(dep => {
                  let statusDotColor = "bg-emerald-400";
                  if (dep.status === "rolled-back") statusDotColor = "bg-orange-400";
                  else if (dep.status === "failed") statusDotColor = "bg-red-400";

                  return (
                    <div key={dep.id} className="bg-white/[0.01] border border-white/5 p-3 rounded-lg text-xs leading-normal">
                      <div className="flex items-center justify-between mb-1 select-none">
                        <strong className="text-zinc-300 font-mono text-[10px]">{dep.version}</strong>
                        <span className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase font-semibold">
                          <span className={`h-1 w-1 rounded-full ${statusDotColor}`} />
                          {dep.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate">{dep.commitMsg}</p>
                      <div className="flex justify-between items-center text-[9px] text-zinc-600 mt-2 font-mono select-none">
                        <span>{dep.commitSha}</span>
                        <span>{new Date(dep.deployedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
