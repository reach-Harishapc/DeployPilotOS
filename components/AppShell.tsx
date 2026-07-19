"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  Server, Sliders, Settings, Globe, Plus, Zap, 
  Activity, Shield, AlertCircle, Clock, Volume2, User, Terminal
} from "lucide-react";
import { useStoreState, Incident } from "@/src/lib/store";
import { ToastProvider, useToast } from "./ToastProvider";
import { CommandPalette } from "./CommandPalette";

function GlobalToastListener() {
  const { incidents } = useStoreState();
  const { addToast } = useToast();
  const prevIncidentsRef = useRef<Incident[] | null>(null);

  useEffect(() => {
    const prevIncidents = prevIncidentsRef.current;
    if (!prevIncidents || prevIncidents.length === 0) {
      prevIncidentsRef.current = incidents;
      return;
    }
    
    // Check for new incidents
    if (incidents.length > prevIncidents.length) {
      const newInc = incidents[0]; // most recent is first
      addToast({
        title: "P1 Incident Detected",
        message: newInc.title,
        type: "error"
      });
    } else if (incidents.length === prevIncidents.length) {
      // Check for resolution
      const newlyResolved = incidents.find(i => 
        i.status === "resolved" && 
        prevIncidents.find(p => p.id === i.id && p.status !== "resolved")
      );
      if (newlyResolved) {
        addToast({
          title: "Incident Resolved",
          message: `${newlyResolved.title} was resolved automatically.`,
          type: "success"
        });
      }
    }
    
    prevIncidentsRef.current = incidents;
  }, [incidents, addToast]);

  return null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { services, incidents } = useStoreState();
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeIncident = incidents.find(i => i.status !== "resolved");
  const systemStatus = activeIncident ? "incident" : "healthy";

  const groupedServices = services.reduce((acc, s) => {
    const p = s.provider || "unknown";
    if (!acc[p]) acc[p] = [];
    acc[p].push(s);
    return acc;
  }, {} as Record<string, typeof services>);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <CommandPalette />
      <GlobalToastListener />
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Sidebar Nav */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col justify-between shrink-0 select-none">
        <div className="flex flex-col gap-6 p-5">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="brand-mark text-zinc-950 font-bold h-6 w-6 rounded bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-xs">
              <Terminal size={12} />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">DeployPilotOS</span>
          </Link>
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-2 mb-1">
              Control Plane
            </p>
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/dashboard" 
                  ? "bg-white/10 text-white" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Activity size={16} />
              Mission Control
            </Link>
            <Link 
              href="/settings" 
              className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/settings" 
                  ? "bg-white/10 text-white" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Settings size={16} />
              Settings
            </Link>
            <Link 
              href="/status/demo-org" 
              className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname.startsWith("/status") 
                  ? "bg-white/10 text-white" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Globe size={16} />
              Public Status
            </Link>
          </nav>

          {/* Services List */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-2">
              <span suppressHydrationWarning className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Services ({services.length})
              </span>
              <Link href="/services/new" className="text-zinc-400 hover:text-white transition-colors">
                <Plus size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto pr-1 pb-4">
              {Object.entries(groupedServices).map(([provider, providerServices]) => (
                <div key={provider} className="mb-2">
                  <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 mb-1.5 mt-1 select-none">
                    {provider === "aws" ? "Amazon Web Services" : 
                     provider === "gcp" ? "Google Cloud" : 
                     provider === "azure" ? "Microsoft Azure" : 
                     provider === "oci" ? "Oracle Cloud" : 
                     provider.toUpperCase()}
                  </div>
                  {providerServices.map(s => {
                    let dotColor = "bg-emerald-400 shadow-[0_0_8px_#34d399]";
                    if (s.status === "down") dotColor = "bg-red-400 animate-pulse shadow-[0_0_8px_#f87171]";
                    else if (s.status === "degraded") dotColor = "bg-yellow-400 shadow-[0_0_8px_#facc15]";

                    return (
                      <Link 
                        key={s.id} 
                        href={`/services/${s.id}`} 
                        className={`flex items-center justify-between px-3 py-1.5 mb-0.5 text-xs rounded-lg transition-colors group ${
                          pathname === `/services/${s.id}` 
                            ? "bg-white/5 text-white" 
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                        }`}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                          <span className="truncate max-w-[100px]">{s.name}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 capitalize group-hover:text-zinc-400 shrink-0">
                          {s.environment}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
              <Link 
                href="/services/new" 
                className="flex items-center justify-center gap-1.5 px-3 py-2 mt-2 text-xs border border-dashed border-white/10 hover:border-white/20 text-zinc-500 hover:text-zinc-400 rounded-lg transition-all"
              >
                <Plus size={12} /> Add Service
              </Link>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Panel */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex items-center gap-3">
            {systemStatus === "incident" ? (
              <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/25 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide text-red-400 animate-pulse">
                <AlertCircle size={10} /> 1 ACTIVE INCIDENT
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide text-emerald-400">
                <Shield size={10} /> AGENT SECURED
              </div>
            )}
            <span className="text-[10px] text-zinc-500 font-mono hidden md:inline select-none">
              | {time || "00:00:00"}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {activeIncident && pathname !== `/incidents/${activeIncident.id}/voice` && (
              <Link 
                href={`/incidents/${activeIncident.id}/voice`} 
                className="bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 font-bold px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 animate-pulse"
              >
                <Volume2 size={12} fill="currentColor" /> Enter War Room
              </Link>
            )}
            <Link 
              href="/profile"
              className="flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-white/10 px-1.5 py-1.5 rounded-full transition-all group"
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-zinc-950 text-[10px] font-black shadow-inner">
                D
              </div>
              <div className="flex flex-col mr-3">
                <span className="text-[10px] font-bold text-white leading-none group-hover:text-emerald-400 transition-colors">Demo User</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
    </ToastProvider>
  );
}
