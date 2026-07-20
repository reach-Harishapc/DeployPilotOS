import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col py-12 px-6 max-w-3xl mx-auto relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-12 w-fit relative z-10">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      
      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <Cookie size={20} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Cookie Policy</h1>
      </div>
      
      <div className="flex flex-col gap-6 text-zinc-400 text-sm leading-relaxed relative z-10">
        <p className="text-zinc-500">Last updated: July 20, 2026</p>
        
        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Essential Cookies</h2>
        <p>
          DeployPilotOS utilizes strict, necessary cookies to manage authentication states, maintain session security, and ensure the Mission Control dashboard functions properly. These cookies cannot be disabled, as the platform cannot function without them.
        </p>

        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Performance Cookies</h2>
        <p>
          We use anonymized telemetry cookies to understand how our users navigate the dashboard during high-stress incidents. This data helps us optimize page load speeds and streamline the UX for critical incident remediation paths.
        </p>

        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Managing Cookies</h2>
        <p>
          You can instruct your browser to refuse all non-essential cookies. However, please note that disabling session cookies will prevent you from authenticating into the DeployPilotOS control plane.
        </p>

        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Cache Management</h2>
        <p>
          To ensure lightning-fast dashboard performance during high-severity incidents, DeployPilotOS heavily utilizes local browser caching for non-sensitive static assets and telemetry graph configurations. This caching is strictly temporary and is automatically invalidated upon new deployments or critical security patches.
        </p>
      </div>
    </main>
  );
}
