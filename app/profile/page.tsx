"use client";
import { AppShell } from "@/components/AppShell";
import { User, ShieldCheck, Mail, Key } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="text-emerald-400" /> User Profile
          </h1>
          <p className="text-sm text-zinc-400 mt-2">Manage your personal account settings and access credentials.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Avatar Section */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-6 flex flex-col items-center text-center gap-3 shadow-lg">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-3xl font-black text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                D
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Demo User</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono mt-2 inline-block uppercase tracking-widest">SRE Admin</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-6 flex flex-col gap-5 shadow-lg">
              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-4">
                <label className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5"><Mail size={14}/> Email Address</label>
                <div className="text-sm text-white font-mono bg-zinc-950 p-2.5 rounded-lg border border-white/5 cursor-not-allowed opacity-80 select-none">demo@deploypilot.com</div>
              </div>
              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-4">
                <label className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5"><ShieldCheck size={14}/> Account Role</label>
                <div className="text-sm text-white font-medium">Organization Administrator</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5"><Key size={14}/> API Keys</label>
                <div className="text-xs text-zinc-400 flex justify-between items-center bg-zinc-950 p-3 rounded-lg border border-white/5">
                  <span className="font-mono">dp_live_••••••••••••••••</span>
                  <button className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Regenerate</button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button 
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  window.location.href = "/";
                }}
                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-5 py-2.5 rounded-lg text-xs font-bold border border-red-500/20 transition-all shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
