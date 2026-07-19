"use client";
import { AppShell } from "@/components/AppShell";
import { useStoreState } from "@/src/lib/store";
import { AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HealthPage() {
  const { incidents, services } = useStoreState();
  const activeIncident = incidents.find(i => i.status !== "resolved");

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <Link href="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className={activeIncident ? "text-red-400" : "text-emerald-400"} /> System Health Log
          </h1>
          <p className="text-sm text-zinc-400 mt-2">Current active incident queues and real-time mitigation status.</p>
        </div>

        {activeIncident ? (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-xl">
            <div className="text-red-400 font-bold mb-4 flex items-center gap-3 text-2xl">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
              P1 Critical Alert: {activeIncident.title}
            </div>
            <div className="text-base text-red-400/80 leading-relaxed font-mono">
              AI Agent is actively pursuing root-cause isolation. Traffic is being rerouted.
              <br/><br/>
              Trigger Metric: {activeIncident.triggerMetric} at {activeIncident.triggerValue}
            </div>
            <Link href={`/incidents/${activeIncident.id}`} className="mt-8 inline-block bg-red-500/20 text-red-400 hover:bg-red-500/30 px-6 py-3 rounded-lg text-sm font-bold border border-red-500/30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              Join AI War Room
            </Link>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-12 rounded-xl flex items-center justify-center gap-4 flex-col text-center">
            <CheckCircle2 className="text-emerald-400" size={64} />
            <div>
              <div className="text-emerald-400 font-bold text-2xl">All Systems Nominal</div>
              <div className="text-base text-emerald-400/80 mt-2 max-w-md mx-auto">No active incidents across {services.length} monitored regions. Agents are in standby mode monitoring metrics.</div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
