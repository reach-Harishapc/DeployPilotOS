"use client";

import React, { use, useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { 
  useStoreState, store, Incident, 
  IncidentEvent, Service, Deploy 
} from "@/src/lib/store";
import { 
  AlertTriangle, CheckCircle2, Clock, Volume2, 
  Sparkles, Terminal, FileText, Check, ShieldAlert,
  ChevronRight, ArrowLeft, RefreshCw, FileDiff, Download
} from "lucide-react";
import Link from "next/link";

const renderMarkdown = (text: string) => {
  if (!text) return null;
  const formatInline = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-zinc-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-white/10 px-1 py-0.5 rounded text-[10px] font-mono text-cyan-400">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return text.split('\n').map((line, i) => {
    if (line.startsWith('# ')) {
      return <h1 key={i} className="text-lg font-bold text-white mb-3 mt-2 border-b border-white/10 pb-2">{line.replace('# ', '')}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-sm font-bold text-cyan-400 mb-2 mt-4">{line.replace('## ', '')}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-xs font-bold text-white mb-2 mt-3">{line.replace('### ', '')}</h3>;
    }
    if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
      return (
        <div key={i} className="ml-2 mb-1.5 flex items-start gap-2">
           <span className="text-zinc-500 mt-0.5 text-[10px] font-mono">{line.startsWith('-') ? '•' : line.split('.')[0] + '.'}</span>
           <span className="flex-1">{formatInline(line.replace(/^(-\s|\d+\.\s)/, ''))}</span>
        </div>
      );
    }
    if (line.trim() === '') {
      return <div key={i} className="h-1"></div>;
    }
    return <p key={i} className="mb-2 leading-relaxed">{formatInline(line)}</p>;
  });
};

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = use(params);
  const { incidents, services, refresh } = useStoreState();
  const [elapsedTime, setElapsedTime] = useState("0s");
  const [postMortemText, setPostMortemText] = useState("");
  const [editingPostMortem, setEditingPostMortem] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const incident = incidents.find(i => i.id === incidentId);
  const service = incident ? services.find(s => s.id === incident.serviceId) : null;
  const events = store.getEvents(incidentId);
  const deploys = service ? store.getDeploys().filter(d => d.serviceId === service.id) : [];

  // Stopwatch counting up
  useEffect(() => {
    if (!incident) return;

    const updateTimer = () => {
      const start = new Date(incident.openedAt).getTime();
      const end = incident.resolvedAt ? new Date(incident.resolvedAt).getTime() : Date.now();
      const diffSec = Math.floor((end - start) / 1000);
      
      if (diffSec < 60) {
        setElapsedTime(`${diffSec}s`);
      } else {
        const mins = Math.floor(diffSec / 60);
        const secs = diffSec % 60;
        setElapsedTime(`${mins}m ${secs}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [incident, incident?.resolvedAt]);

  // Load post-mortem text when resolved
  useEffect(() => {
    if (incident?.postMortem) {
      setPostMortemText(incident.postMortem);
    }
  }, [incident?.postMortem]);

  if (!mounted) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-xs tracking-wide">Synchronizing Mission Control...</p>
        </div>
      </AppShell>
    );
  }

  if (!incident) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-white">Incident Not Found</h2>
          <p className="text-zinc-500 mt-2">The incident ID could not be matched.</p>
          <Link href="/dashboard" className="text-cyan-400 hover:underline mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleResolveManually = () => {
    const updatedIncidents = incidents.map(i => {
      if (i.id === incidentId) {
        return {
          ...i,
          status: "resolved" as const,
          resolvedAt: new Date().toISOString(),
          resolvedBy: "human" as const,
          mttr: Math.floor((Date.now() - new Date(i.openedAt).getTime()) / 1000),
          postMortem: `# Post-Mortem Report: Manual Resolution\n\nIncident resolved manually by administrator.`
        };
      }
      return i;
    });
    store.setIncidents(updatedIncidents);

    if (service) {
      const updatedServices = services.map(s => {
        if (s.id === service.id) {
          return { ...s, status: "healthy" as const };
        }
        return s;
      });
      store.setServices(updatedServices);
    }
    
    refresh();
  };

  const handleGeneratePostMortem = () => {
    const generated = `# Post-Mortem Report: ${incident.title}\n\nIncident ID: **${incident.id}**\nSeverity: **${incident.severity}**\nService: **${service?.name}**\n\n## Timeline of Events\n${events.map(e => `- **${new Date(e.timestamp).toLocaleTimeString()}** [${e.type}] ${e.content}`).join("\n")}\n\n## Root Cause Hypothesis\n${incident.rootCause || "Under investigation"}\n\n## Mitigation Actions\n1. Automatically detected anomaly and analyzed recent deploys.\n2. Identified DB pool exhaustion regression from deploy v2.4.1.\n3. Scaled parameters to 30 and restarted connection manager container.`;
    setPostMortemText(generated);
    
    // Save to store
    const updated = incidents.map(i => {
      if (i.id === incidentId) {
        return { ...i, postMortem: generated };
      }
      return i;
    });
    store.setIncidents(updated);
    refresh();
  };

  const handleSavePostMortem = () => {
    setEditingPostMortem(false);
    const updated = incidents.map(i => {
      if (i.id === incidentId) {
        return { ...i, postMortem: postMortemText };
      }
      return i;
    });
    store.setIncidents(updated);
    refresh();
  };

  const handleDownloadPostMortem = () => {
    if (!postMortemText) return;
    const content = document.getElementById('post-mortem-content')?.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>DeployPilotOS Post-Mortem: ${incidentId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; margin-bottom: 20px; }
            h2 { font-size: 18px; margin-top: 24px; color: #333; }
            p { font-size: 14px; margin-bottom: 12px; }
            .text-zinc-500 { color: #666; }
            .text-cyan-400 { color: #0070f3; font-weight: bold; }
            strong { color: #000; }
            code { background: #f4f4f4; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; color: #d63384; }
          </style>
        </head>
        <body>
          ${content || postMortemText}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Severity indicator classes
  const isP1 = incident.severity === "P1";
  const isResolved = incident.status === "resolved";

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Back navigation */}
        <div>
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs flex items-center gap-1">
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
        </div>

        {/* Incident Header */}
        <div className="border-b border-white/5 pb-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 select-none">
              <span className={`px-2 py-0.5 rounded text-xs font-extrabold tracking-wide ${
                isP1 
                  ? "bg-red-500 text-zinc-950 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse" 
                  : "bg-orange-500 text-zinc-950"
              }`}>
                {incident.severity} CRITICAL
              </span>
              <span className="text-xs uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 font-mono">
                {service?.name}
              </span>
              <span className="text-xs text-zinc-500 font-mono flex items-center gap-1.5">
                <Clock size={12} /> Stopwatch: {elapsedTime}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {incident.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {!isResolved && (
              <Link 
                href={`/incidents/${incident.id}/voice`}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 font-bold px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5 animate-pulse"
              >
                <Volume2 size={14} fill="currentColor" /> Voice War Room
              </Link>
            )}
            {!isResolved && (
              <button
                onClick={handleResolveManually}
                className="bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-lg text-xs border border-white/10 transition-all"
              >
                Resolve Manually
              </button>
            )}
          </div>
        </div>

        {/* Stepper Status Indicators */}
        <div className="grid grid-cols-4 border border-white/5 bg-zinc-900/10 p-3.5 rounded-xl text-center text-xs select-none">
          {[
            { id: "open", label: "Anomaly Detected" },
            { id: "investigating", label: "AI Investigating" },
            { id: "mitigating", label: "Mitigating System" },
            { id: "resolved", label: "Auto-Resolved" },
          ].map((st, i) => {
            const statuses = ["open", "investigating", "mitigating", "resolved"];
            const currentIdx = statuses.indexOf(incident.status);
            const active = currentIdx >= i;
            const isLast = i === currentIdx;

            return (
              <div 
                key={st.id} 
                className={`flex flex-col items-center gap-1 relative ${
                  active ? "text-emerald-400 font-semibold" : "text-zinc-600"
                }`}
              >
                <div className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] mb-1 font-bold ${
                  active 
                    ? "bg-emerald-400/10 border-emerald-400/40 text-emerald-400" 
                    : "bg-zinc-950 border-white/5 text-zinc-700"
                }`}>
                  {active && i < currentIdx ? <Check size={10} /> : i + 1}
                </div>
                <span>{st.label}</span>
                {isLast && !isResolved && (
                  <span className="absolute top-1.5 right-1/2 translate-x-10 h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
            );
          })}
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (60%) - AI Diagnosis & Timeline */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            
            {/* Live streaming Feed */}
            <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 select-none">
                <h3 className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono">
                  <Terminal size={14} className="text-cyan-400" /> DeployPilotOS Agent — Live Investigation Feed
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Channel: #inc-diag-{incidentId.substring(4, 9)}
                </span>
              </div>

              {/* Feed lines */}
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 min-h-[300px]">
                {events.map((ev, index) => {
                  let eventIcon = <Terminal size={12} />;
                  let bgClass = "bg-zinc-950";
                  let borderClass = "border-white/[0.02]";
                  let textColor = "text-zinc-300";

                  if (ev.type === "detected") {
                    eventIcon = <AlertTriangle size={12} />;
                    bgClass = "bg-red-500/5";
                    borderClass = "border-red-500/20";
                    textColor = "text-red-400";
                  } else if (ev.type === "resolved" || ev.type === "health_check") {
                    eventIcon = <CheckCircle2 size={12} />;
                    bgClass = "bg-emerald-500/5";
                    borderClass = "border-emerald-500/20";
                    textColor = "text-emerald-400";
                  } else if (ev.type === "hypothesis") {
                    eventIcon = <Sparkles size={12} />;
                    bgClass = "bg-cyan-500/5";
                    borderClass = "border-cyan-500/20";
                    textColor = "text-cyan-400";
                  }

                  return (
                    <div 
                      key={ev.id} 
                      className={`border p-4 rounded-xl flex items-start gap-3.5 leading-relaxed ${bgClass} ${borderClass} animate-fade-in`}
                    >
                      <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        ev.type === "detected" 
                          ? "bg-red-500/10 text-red-400" 
                          : ev.type === "resolved"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/5 text-zinc-400"
                      }`}>
                        {eventIcon}
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono select-none">
                          <span>AGENT COMMANDER</span>
                          <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className={`text-xs ${textColor} leading-normal`}>{ev.content}</p>

                        {/* If event has detailed hypothesis/evidence data, display it cleanly */}
                        {ev.data && ev.data.evidence && (
                          <div className="bg-zinc-950 p-3 rounded-lg border border-white/5 mt-3 font-mono text-[10px] text-zinc-400 flex flex-col gap-2">
                            <strong className="text-zinc-300 block select-none border-b border-white/5 pb-1">Telemetry Evidence Checked:</strong>
                            {ev.data.evidence.map((line: string, i: number) => (
                              <div key={i} className="flex gap-1">
                                <span className="text-zinc-600 select-none">❯</span>
                                <span>{line}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {!isResolved && (
                  <div className="border border-white/5 p-4 rounded-xl flex items-center gap-3 bg-zinc-950/40 text-xs text-zinc-500 animate-pulse select-none">
                    <RefreshCw size={12} className="animate-spin" />
                    Agent is executing diagnostic adapters...
                  </div>
                )}
              </div>

            </div>

            {/* Post-Mortem Editor */}
            {isResolved && (
              <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <FileText size={14} /> AI Post-Mortem Draft
                  </h3>
                  {editingPostMortem ? (
                    <button
                      onClick={handleSavePostMortem}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-1 rounded border border-emerald-500/20 transition-all text-[10px]"
                    >
                      Save Report
                    </button>
                  ) : postMortemText ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadPostMortem}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold px-2.5 py-1 rounded border border-white/10 transition-all text-[10px] flex items-center gap-1"
                      >
                        <Download size={10} /> Download .pdf
                      </button>
                      <button
                        onClick={() => setEditingPostMortem(true)}
                        className="bg-white/5 hover:bg-white/10 text-white font-semibold px-2.5 py-1 rounded border border-white/10 transition-all text-[10px]"
                      >
                        Edit Report
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleGeneratePostMortem}
                      className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold px-2.5 py-1 rounded border border-cyan-500/20 transition-all text-[10px] flex items-center gap-1 select-none"
                    >
                      <Sparkles size={10} /> Generate Post-Mortem
                    </button>
                  )}
                </div>

                {editingPostMortem ? (
                  <textarea
                    value={postMortemText}
                    onChange={e => setPostMortemText(e.target.value)}
                    rows={12}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-cyan-400"
                  />
                ) : postMortemText ? (
                  <div id="post-mortem-content" className="bg-zinc-950 p-5 rounded-lg border border-white/[0.02] text-xs text-zinc-400 font-sans max-h-[400px] overflow-y-auto">
                    {renderMarkdown(postMortemText)}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-white/5 rounded-lg select-none">
                    Incident resolved. Click button above to generate a full post-mortem review.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column (40%) - Sidebar details */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            
            {/* Evidence & Deploy Details */}
            <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-white border-b border-white/5 pb-2">Investigation Evidence</h3>
              
              <div className="flex flex-col gap-3">
                {/* Outage deployment */}
                {deploys.length > 0 && (
                  <div className="bg-zinc-950 p-3 rounded-lg border border-white/[0.02]">
                    <span className="text-[10px] text-zinc-500 block uppercase mb-1 font-semibold select-none">Suspicious Deploy</span>
                    <div className="flex items-center justify-between text-xs font-bold text-white font-mono">
                      <span>{deploys[deploys.length - 1]?.version}</span>
                      <span className="text-zinc-500 font-mono text-[9px]">{deploys[deploys.length - 1]?.commitSha}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">{deploys[deploys.length - 1]?.commitMsg}</p>
                    <span className="text-[9px] text-zinc-500 block mt-2 select-none">Author: {deploys[deploys.length - 1]?.author}</span>
                  </div>
                )}

                {/* Git diff panel mockup */}
                {incident.status !== "open" && (
                  <div className="bg-zinc-950 rounded-lg border border-white/[0.02] overflow-hidden">
                    <div className="px-3 py-1.5 bg-zinc-900/60 border-b border-white/5 text-[9px] font-mono text-zinc-400 flex items-center gap-1.5 select-none">
                      <FileDiff size={10} /> database/config.py diff
                    </div>
                    <pre className="p-3 font-mono text-[9px] text-zinc-400 leading-normal select-text overflow-x-auto">
                      {`@@ -45,3 +45,3 @@
-pool_size = 25
+pool_size = 10`}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Actions checklist audit log */}
            <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-white border-b border-white/5 pb-2">Runbook Execution Checklist</h3>
              <div className="flex flex-col gap-3.5">
                {[
                  { id: "chk-1", desc: "Identify regression commits in database config", completed: events.length > 3 },
                  { id: "chk-2", desc: "Change pool_size values payload to 30", completed: events.length > 5 },
                  { id: "chk-3", desc: "Restart cluster container nodes manager", completed: events.length > 6 },
                  { id: "chk-4", desc: "Execute system-health validation checks", completed: events.length > 7 },
                ].map(chk => (
                  <div key={chk.id} className="flex items-start gap-2.5 text-xs text-zinc-400">
                    <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                      chk.completed 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "border-white/10 bg-zinc-950 text-zinc-700"
                    }`}>
                      {chk.completed ? <Check size={10} /> : <span className="h-1 w-1 rounded-full bg-zinc-700" />}
                    </div>
                    <span className={chk.completed ? "line-through text-zinc-500" : ""}>{chk.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  );
}
