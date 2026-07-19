"use client";
import { AppShell } from "@/components/AppShell";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EfficiencyPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <Link href="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="text-purple-400" /> Resolution Efficiency Metrics
          </h1>
          <p className="text-sm text-zinc-400 mt-2">Mean Time To Resolution (MTTR) comparison between DeployPilotOS AI and human baselines over the last 30 days.</p>
        </div>

        <div className="flex flex-col gap-6 mt-4 bg-zinc-950 border border-white/5 p-8 rounded-xl shadow-2xl">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-zinc-300">DeployPilotOS AI Agent</div>
              <div className="text-sm text-purple-400 font-mono font-bold">3m 42s</div>
            </div>
            <div className="w-full bg-zinc-900 h-8 rounded-full overflow-hidden relative shadow-inner">
              <div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-purple-500 to-cyan-500 w-[12%] animate-pulse" />
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-zinc-500">Human Operations Team Baseline</div>
              <div className="text-sm text-zinc-400 font-mono font-bold">45m 10s</div>
            </div>
            <div className="w-full bg-zinc-900 h-8 rounded-full overflow-hidden relative shadow-inner">
              <div className="absolute top-0 left-0 bottom-0 bg-zinc-700 w-[95%]" />
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-8 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">12x</div>
              <div className="text-xs text-zinc-500 font-mono mt-3 uppercase tracking-widest">Faster Resolution</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">99.8%</div>
              <div className="text-xs text-zinc-500 font-mono mt-3 uppercase tracking-widest">Automated Mitigation</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
