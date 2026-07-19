"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { 
  useStoreState, startSimulation, store, 
  clearSimulation, Service, Incident 
} from "@/src/lib/store";
import { 
  Server, AlertTriangle, Clock, ShieldCheck, 
  Zap, Play, CheckCircle2, ChevronRight, Sparkles, Volume2
} from "lucide-react";
import Link from "next/link";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { services, incidents, refresh } = useStoreState();
  const [simulationRunning, setSimulationRunning] = useState(false);
  const activeIncident = incidents.find(i => i.status !== "resolved");

  const [chartData, setChartData] = useState(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      x: i * (100 / 23),
      y: 85, // Fixed initial value to prevent SSR mismatch before mount
      timestamp: "",
      value: 15
    }));
  });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [aiInsights, setAiInsights] = useState([
    {
      title: "Staging Validation Rec",
      desc: "worker-service has crashed 3 times this week, all during deploy triggers between 2-4 PM. Consider adding validation steps."
    }
  ]);

  // Simulate Live AI Insights Streaming
  useEffect(() => {
    if (!mounted) return;
    const t1 = setTimeout(() => {
      setAiInsights(prev => [
        {
          title: "Database CPU Anomaly",
          desc: "database-primary experiences minor CPU degradations (up to 78%) around 00:00 UTC. Suspect cron queue parsing."
        },
        ...prev
      ]);
    }, 5000);
    const t2 = setTimeout(() => {
      setAiInsights(prev => [
        {
          title: "Memory Leak Detected",
          desc: "frontend-node memory usage grows 2% daily without GC cleanup. Expected OOM in 14 days."
        },
        ...prev
      ]);
    }, 15000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mounted]);

  // Live stream chart updates
  useEffect(() => {
    setMounted(true);
    
    // Initialize chart with correct times once mounted
    setChartData(Array.from({ length: 24 }).map((_, i) => ({
      x: i * (100 / 23),
      y: 85 - Math.random() * 5,
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: 15 + Math.floor(Math.random() * 10)
    })));

    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastVal = newData[newData.length - 1].value;
        const isSpike = activeIncident !== undefined;
        
        // Generate contextual fake value based on system status
        let newVal = isSpike 
          ? 200 + Math.random() * 400 // Massive spike
          : Math.max(10, Math.min(60, lastVal + (Math.random() * 16 - 8))); // Nominal
          
        newData.push({
          x: 100,
          y: Math.max(10, 100 - (newVal / 300 * 80)), // Scale Y to fit
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: Math.floor(newVal)
        });
        
        // Recalculate X spacing
        return newData.map((d, i) => ({ ...d, x: i * (100 / 23) }));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [activeIncident?.id]);

  const pathD = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${d.x},${d.y}`).join(" ");
  const fillD = `${pathD} L 100,100 L 0,100 Z`;

  // Check if simulation was requested via URL search parameters
  useEffect(() => {
    if (searchParams.get("simulate") === "true") {
      handleSimulate();
    }
  }, [searchParams]);

  const pastIncidents = incidents.filter(i => i.status === "resolved");

  const handleSimulate = () => {
    if (simulationRunning || activeIncident) return;
    setSimulationRunning(true);
    
    // Simulate api-service failure
    startSimulation("api-service", () => {
      // Re-trigger state sync
      refresh();
    });

    // Automatically navigate to the new active incident details after 1 second so user can watch live diagnostics
    setTimeout(() => {
      const updatedIncidents = store.getIncidents();
      const currentActive = updatedIncidents.find(i => i.status !== "resolved");
      if (currentActive) {
        router.push(`/incidents/${currentActive.id}`);
      }
      setSimulationRunning(false);
    }, 1000);
  };

  const handleReset = () => {
    clearSimulation();
    store.resetStore();
    refresh();
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-5">
          <div>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              Live Operations
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Good evening, Harish
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Your server environments are monitored. 4 nodes active.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold border border-white/5 transition-all"
            >
              Reset Data
            </button>
            <button
              onClick={handleSimulate}
              disabled={simulationRunning || !!activeIncident}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                activeIncident 
                  ? "bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-95 text-zinc-950 border-emerald-400/25 shadow-[0_0_20px_rgba(52,211,153,0.1)]"
              }`}
            >
              <Zap size={14} fill="currentColor" />
              {activeIncident ? "Incident Active" : simulationRunning ? "Triggering..." : "Simulate Incident"}
            </button>
          </div>
        </div>

        {/* Active Incident Banner */}
        {activeIncident && (
          <div className="bg-gradient-to-r from-red-500/15 via-red-500/5 to-transparent border border-red-500/25 rounded-xl p-5 shadow-[0_0_30px_rgba(239,68,68,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-red-500 text-zinc-950 font-extrabold px-1.5 py-0.5 rounded tracking-wide select-none">
                    P1 CRITICAL
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    Open for 1m 12s
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">
                  {activeIncident.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  DeployPilotOS is investigating logs and release diffs automatically...
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Link 
                href={`/incidents/${activeIncident.id}/voice`}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold px-4 py-2 rounded-lg text-xs border border-red-500/30 transition-all flex items-center justify-center gap-1.5 flex-1 md:flex-none text-center"
              >
                Start War Room <Volume2 size={14} className="ml-1" />
              </Link>
              <Link 
                href={`/incidents/${activeIncident.id}`}
                className="bg-white/10 hover:bg-white/15 text-white font-bold px-4 py-2 rounded-lg text-xs border border-white/5 transition-all flex items-center justify-center gap-1 flex-1 md:flex-none text-center"
              >
                Watch Diagnostics <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Metrics Grid Cards */}
        <div className="relative w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                icon: <Server size={20} className="text-cyan-400" />, 
                title: "Infrastructure", 
                value: services.length.toString(), 
                label: "Monitored Services", 
                desc: "All endpoints are securely connected and routing traffic across multi-cloud regions.",
                glow: "from-cyan-500/20 to-transparent",
                href: "/infrastructure"
              },
              { 
                icon: <AlertTriangle size={20} className={activeIncident ? "text-red-400" : "text-emerald-400"} />, 
                title: "System Health", 
                value: activeIncident ? "1" : "0", 
                label: "Active Incidents", 
                desc: activeIncident ? "Critical anomaly detected. DeployPilotOS is actively mitigating." : "All systems nominal. DeployPilotOS is monitoring logs.",
                glow: activeIncident ? "from-red-500/20 to-transparent" : "from-emerald-500/20 to-transparent",
                href: "/health"
              },
              { 
                icon: <Clock size={20} className="text-purple-400" />, 
                title: "Efficiency", 
                value: "3m 42s", 
                label: "Average MTTR", 
                desc: "DeployPilotOS is resolving incidents 12x faster than human operators this week.",
                glow: "from-purple-500/20 to-transparent",
                href: "/efficiency"
              },
              { 
                icon: <ShieldCheck size={20} className="text-blue-400" />, 
                title: "Reliability", 
                value: "99.97%", 
                label: "Uptime SLA", 
                desc: "Successfully meeting and exceeding enterprise compliance reliability targets.",
                glow: "from-blue-500/20 to-transparent",
                href: "/reliability"
              },
            ].map((st, i) => (
              <Link 
                key={i} 
                href={st.href}
                className="w-full border border-white/5 bg-zinc-900/30 backdrop-blur-md p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 hover:bg-zinc-900/50 transition-all cursor-pointer"
              >
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${st.glow} opacity-40 pointer-events-none group-hover:opacity-70 transition-opacity`} />
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="h-10 w-10 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-center shadow-lg shrink-0">
                    {st.icon}
                  </div>
                  <span className="text-sm font-semibold text-white tracking-wide">{st.title}</span>
                </div>
                
                <div className="relative z-10 mt-1">
                  <div className="text-3xl font-extrabold text-white">{st.value}</div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1.5">{st.label}</div>
                </div>
                
                <p className="text-xs text-zinc-500 leading-relaxed relative z-10 mt-2 font-medium">
                  {st.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Service Health Timeline */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-white/5 bg-zinc-900/20 p-6 rounded-xl lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">
              Service Health Timeline (Last 24 Hours)
            </h3>
            
            {/* Custom SVG Line Chart for premium visual design */}
            <div 
              className="relative h-60 w-full bg-zinc-950/40 rounded-lg border border-white/[0.02] p-4 flex items-end group"
              onMouseLeave={() => setHoverIndex(null)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const xPct = ((e.clientX - rect.left) / rect.width) * 100;
                const closestIdx = chartData.reduce((prev, curr, idx) => {
                  return (Math.abs(curr.x - xPct) < Math.abs(chartData[prev].x - xPct) ? idx : prev);
                }, 0);
                setHoverIndex(closestIdx);
              }}
            >
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeIncident ? "#f87171" : "#34d399"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={activeIncident ? "#f87171" : "#34d399"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                
                {/* Filled area */}
                <path 
                  d={fillD} 
                  fill="url(#chartGlow)" 
                  className="transition-all duration-[2000ms] ease-linear"
                />
                
                {/* Trend line */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke={activeIncident ? "#f87171" : "#34d399"} 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-[2000ms] ease-linear"
                />
                
                {/* Interactive Crosshair */}
                {hoverIndex !== null && (
                  <>
                    <line 
                      x1={chartData[hoverIndex].x} 
                      y1="0" 
                      x2={chartData[hoverIndex].x} 
                      y2="100" 
                      stroke="rgba(255,255,255,0.2)" 
                      strokeWidth="0.5" 
                      strokeDasharray="2,2" 
                    />
                    <circle 
                      cx={chartData[hoverIndex].x} 
                      cy={chartData[hoverIndex].y} 
                      r="3.5" 
                      fill="#18181b" 
                      stroke={activeIncident ? "#f87171" : "#34d399"} 
                      strokeWidth="2" 
                    />
                  </>
                )}
              </svg>

              {/* Tooltip HTML overlay (Absolute positioned to match SVG coordinates) */}
              {hoverIndex !== null && (
                <div 
                  className="absolute z-20 bg-zinc-900 border border-white/10 px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full min-w-[70px]"
                  style={{ 
                    left: `calc(1rem + ${chartData[hoverIndex].x}% * calc(100% - 2rem) / 100)`, 
                    top: `calc(1rem + ${chartData[hoverIndex].y}% * calc(100% - 2rem) / 100 - 12px)` 
                  }}
                >
                  <div className="text-[9px] text-zinc-500 font-mono mb-0.5 whitespace-nowrap">{chartData[hoverIndex].timestamp}</div>
                  <div className="text-xs font-bold text-white whitespace-nowrap flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${activeIncident ? 'bg-red-400 shadow-[0_0_8px_#f87171]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`} />
                    {chartData[hoverIndex].value} ms
                  </div>
                </div>
              )}
              
              {/* Y-Axis Grid Labels */}
              <div className="absolute top-[20%] left-4 -translate-y-1/2 text-[9px] text-zinc-600 font-mono pointer-events-none">
                600ms
              </div>
              <div className="absolute top-[50%] left-4 -translate-y-1/2 text-[9px] text-zinc-600 font-mono pointer-events-none">
                375ms
              </div>
              <div className="absolute top-[80%] left-4 -translate-y-1/2 text-[9px] text-zinc-600 font-mono pointer-events-none">
                150ms
              </div>
              
              {/* Chart labels */}
              <div className="absolute top-2 left-4 text-[10px] text-zinc-500 font-mono tracking-wide">
                Latency (ms)
              </div>
              <div className="absolute bottom-2 left-4 text-[9px] text-zinc-500 font-mono">
                -24h
              </div>
              <div className="absolute bottom-2 right-4 text-[9px] text-emerald-400/80 font-mono flex items-center gap-1.5 font-bold">
                 <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span> LIVE SYNC
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-zinc-500 mt-4 select-none">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Rolling Baseline (42ms)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" /> Active Outage Spikes
              </span>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="border border-white/5 bg-zinc-900/20 p-6 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  AI Insights
                </h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold tracking-widest">Live Scan</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 text-xs mt-4">
                {aiInsights.map((insight, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-lg animate-fade-in relative z-0">
                    <strong className="text-zinc-300 flex items-center gap-2 mb-1">
                      {insight.title}
                      {i === 0 && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded uppercase tracking-wider font-mono">New</span>}
                    </strong>
                    <p className="text-zinc-500 leading-normal">
                      {insight.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Link 
              href="/settings"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-semibold flex items-center gap-1 mt-4"
            >
              Configure AI Policies <ChevronRight size={12} />
            </Link>
          </div>
        </section>

        {/* Incident History Table */}
        <section className="border border-white/5 bg-zinc-900/20 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">
              Incident History
            </h3>
            <span className="text-xs text-zinc-500">
              Showing last {pastIncidents.length} resolved events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 font-semibold uppercase tracking-wider select-none">
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Incident Description</th>
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Opened</th>
                  <th className="pb-3">Resolution</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pastIncidents.map(inc => {
                  const svc = services.find(s => s.id === inc.serviceId);
                  return (
                    <tr key={inc.id} className="text-zinc-400 hover:text-zinc-300">
                      <td className="py-3 font-semibold text-zinc-300">
                        {svc ? svc.name : inc.serviceId}
                      </td>
                      <td className="py-3 font-medium">
                        {inc.title}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          inc.severity === "P1" 
                            ? "bg-red-500/10 text-red-400" 
                            : inc.severity === "P2"
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[10px]" suppressHydrationWarning>
                        {new Date(inc.openedAt).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 size={12} />
                          {inc.resolvedBy === "agent" ? "Auto-Resolved" : "Resolved"} ({inc.mttr ? `${inc.mttr}s` : "n/a"})
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link 
                          href={`/incidents/${inc.id}`}
                          className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                        >
                          Details <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-zinc-950 text-zinc-400 items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-t-cyan-400 border-zinc-800 animate-spin" />
          <span className="text-xs">Loading Mission Control...</span>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
