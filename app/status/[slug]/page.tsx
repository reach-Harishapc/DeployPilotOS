"use client";

import React, { use, useState, useEffect } from "react";
import { useStoreState, store, Service, Incident } from "@/src/lib/store";
import { 
  CheckCircle2, AlertTriangle, AlertCircle, Info, 
  Mail, Globe, ShieldCheck, ArrowRight, ArrowLeft, Activity 
} from "lucide-react";
import Link from "next/link";

export default function PublicStatusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { services, incidents, settings } = useStoreState();
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const publicServices = services.filter(s => s.isPublic);
  const activeIncident = incidents.find(i => i.status !== "resolved");
  const pastIncidents = incidents.filter(i => i.status === "resolved");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const isAllHealthy = publicServices.every(s => s.status === "healthy");
  const isAnyDown = publicServices.some(s => s.status === "down");

  let globalStatusText = "All Systems Operational";
  let globalStatusBg = "bg-emerald-500/10 border-emerald-500/25 text-emerald-400";
  let globalStatusDot = "bg-emerald-400";

  if (isAnyDown) {
    globalStatusText = "Active Service Incident Detected";
    globalStatusBg = "bg-red-500/10 border-red-500/25 text-red-400";
    globalStatusDot = "bg-red-400 animate-pulse";
  } else if (!isAllHealthy) {
    globalStatusText = "Partial Operational Degradation";
    globalStatusBg = "bg-yellow-500/10 border-yellow-500/25 text-yellow-400";
    globalStatusDot = "bg-yellow-400";
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col justify-between py-12 px-6 max-w-4xl mx-auto">
      {/* Glow backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col gap-8 relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/5 pb-4 select-none">
          <div className="flex items-center gap-2">
            <span className="brand-mark text-zinc-950 font-bold h-6 w-6 rounded bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-xs">
              <Activity size={14} />
            </span>
            <span className="text-base font-bold tracking-tight text-white capitalize">
              {settings.name.replace("'s Workspace", "")} Status Page
            </span>
          </div>
          
          <Link 
            href="/" 
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={12} /> Back to Main Page
          </Link>
        </header>

        {/* Global System Health Summary Banner */}
        <div className={`p-5 rounded-xl border flex items-center gap-3.5 ${globalStatusBg}`}>
          <div className={`h-2.5 w-2.5 rounded-full ${globalStatusDot}`} />
          <h2 className="text-base font-bold tracking-tight">
            {globalStatusText}
          </h2>
        </div>

        {/* Active Outage Explanation */}
        {activeIncident && (
          <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase select-none">
              <AlertCircle size={14} /> Active Outage report
            </div>
            <h3 className="text-sm font-bold text-white mt-1">
              {activeIncident.title}
            </h3>
            <p className="text-xs text-zinc-400 leading-normal">
              Our engineering team is actively investigating degraded metrics. DeployPilotOS autonomous agents are matching telemetry data configurations and execution parameters to rollback updates or adjust capacities. Uptime updates will post here.
            </p>
          </div>
        )}

        {/* Services Status Grid */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-1 select-none">
            Active Services Health
          </h3>
          <div className="border border-white/5 bg-zinc-900/10 rounded-xl divide-y divide-white/5">
            {publicServices.map(s => {
              let statusLabel = "Operational";
              let statusColor = "text-emerald-400";
              let statusDot = "bg-emerald-400";

              if (s.status === "down") {
                statusLabel = "Major Outage";
                statusColor = "text-red-400";
                statusDot = "bg-red-400 animate-pulse";
              } else if (s.status === "degraded") {
                statusLabel = "Degraded Uptime";
                statusColor = "text-yellow-400";
                statusDot = "bg-yellow-400";
              }

              return (
                <div key={s.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white">{s.name}</span>
                    <span className="text-[9px] uppercase bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-500 font-mono">
                      {s.environment}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Visual 90-day uptime lines mockup */}
                    <div className="hidden sm:flex items-center gap-0.5 select-none">
                      {Array.from({ length: 30 }).map((_, idx) => {
                        const isSpikeIdx = idx === 22 && s.status === "down";
                        const barColor = isSpikeIdx ? "bg-red-500" : "bg-emerald-500/80";
                        return (
                          <div 
                            key={idx} 
                            className={`h-4.5 w-0.75 rounded-sm ${barColor}`} 
                            title={isSpikeIdx ? "Outage detected" : "Operational"}
                            style={{ width: "2px" }}
                          />
                        );
                      })}
                    </div>
                    
                    <span className={`font-semibold flex items-center gap-2 ${statusColor}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })}
            {publicServices.length === 0 && (
              <div className="p-8 text-center text-zinc-500 select-none">No services marked as public.</div>
            )}
          </div>
        </section>

        {/* Subscribe updates form */}
        <section className="bg-zinc-900/10 border border-white/5 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-md">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Mail size={16} className="text-cyan-400" /> Subscribe to Updates
            </h4>
            <p className="text-xs text-zinc-500 leading-normal mt-1">
              Receive status notifications via email whenever service incidents occur or resolve.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <input 
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="name@company.com"
              required
              className="bg-zinc-950 border border-white/10 rounded-lg p-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors flex-1 md:w-56"
            />
            <button
              type="submit"
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-4 py-2 rounded-lg text-xs border border-white/5 transition-all flex items-center gap-1 select-none shrink-0"
            >
              {subscribed ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </section>

        {/* Incident History past 90 days */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-1 select-none">
            Past Incident History
          </h3>
          <div className="flex flex-col gap-4">
            {pastIncidents.map(inc => (
              <div key={inc.id} className="border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono select-none">
                  <span>{new Date(inc.openedAt).toLocaleDateString()}</span>
                  <span className="text-emerald-400 font-bold">RESOLVED</span>
                </div>
                <strong className="text-xs font-bold text-white">{inc.title}</strong>
                <p className="text-[11px] text-zinc-400 leading-normal">{inc.rootCause}</p>
                <span className="text-[9px] text-zinc-500 font-mono mt-1 select-none">
                  Incident MTTR: {inc.mttr ? `${inc.mttr}s` : "n/a"} • Automated recovery by DeployPilotOS SRE
                </span>
              </div>
            ))}
            {pastIncidents.length === 0 && (
              <div className="text-center py-8 text-zinc-600 text-xs select-none">No incidents reported.</div>
            )}
          </div>
        </section>

      </div>

      <footer className="text-center text-[10px] text-zinc-600 select-none border-t border-white/5 pt-6 mt-12">
        Powered by DeployPilotOS Autonomous DevOps Agent.
      </footer>
    </main>
  );
}
