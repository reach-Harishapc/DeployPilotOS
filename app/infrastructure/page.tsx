"use client";
import { AppShell } from "@/components/AppShell";
import { useStoreState } from "@/src/lib/store";
import { Server } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function InfrastructurePage() {
  const { services } = useStoreState();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <Link href="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Server className="text-cyan-400" /> Infrastructure Overview
          </h1>
          <p className="text-sm text-zinc-400 mt-2">Detailed breakdown of the {services.length} monitored nodes and their current geographical routing distribution.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {services.map(s => (
            <div key={s.id} className="bg-zinc-950 border border-white/5 p-5 rounded-xl flex flex-col gap-3 hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">{s.name}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-1 uppercase">{s.provider} • {s.environment}</div>
                </div>
                <div className={`h-3 w-3 rounded-full ${s.status === 'healthy' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-400 shadow-[0_0_8px_#f87171]'}`} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 border-t border-white/5 pt-3">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Uptime SLA</div>
                  <div className="text-sm text-zinc-300 font-bold">{s.uptimePercent}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Avg Latency</div>
                  <div className="text-sm text-zinc-300 font-bold">{s.avgLatency}ms</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
