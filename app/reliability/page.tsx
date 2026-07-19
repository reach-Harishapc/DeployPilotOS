"use client";
import { AppShell } from "@/components/AppShell";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReliabilityPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <Link href="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-blue-400" /> SLA Reliability Targets
          </h1>
          <p className="text-sm text-zinc-400 mt-2">Historical Uptime guarantees across all mission-critical APIs and databases.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-zinc-950 border border-white/5 rounded-xl p-8 text-center flex flex-col justify-center items-center shadow-lg">
            <div className="text-4xl font-black text-white">99.99%</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-3 uppercase tracking-widest">7-Day Trailing</div>
          </div>
          
          <div className="bg-zinc-950 border border-blue-500/30 rounded-xl p-8 text-center flex flex-col justify-center items-center relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-110 z-10 mx-2">
            <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
            <div className="text-5xl font-black text-blue-400 relative z-10 drop-shadow-md">99.97%</div>
            <div className="text-[11px] text-blue-400/80 font-mono mt-3 uppercase tracking-widest relative z-10">30-Day SLA Target</div>
          </div>
          
          <div className="bg-zinc-950 border border-white/5 rounded-xl p-8 text-center flex flex-col justify-center items-center shadow-lg">
            <div className="text-4xl font-black text-white">99.92%</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-3 uppercase tracking-widest">90-Day Trailing</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
