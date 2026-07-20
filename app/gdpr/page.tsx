import Link from "next/link";
import { ArrowLeft, GlobeLock } from "lucide-react";

export default function GDPRPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col py-12 px-6 max-w-3xl mx-auto relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-12 w-fit relative z-10">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      
      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <GlobeLock size={20} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">GDPR & Compliance</h1>
      </div>
      
      <div className="flex flex-col gap-6 text-zinc-400 text-sm leading-relaxed relative z-10">
        <p className="text-zinc-500">Last updated: July 20, 2026</p>
        
        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Data Processing Agreement</h2>
        <p>
          DeployPilotOS fully complies with the General Data Protection Regulation (GDPR). As a data processor, we provide robust tooling for data controllers to manage, export, and delete PII (Personally Identifiable Information) that may inadvertently appear in infrastructure logs.
        </p>

        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Right to be Forgotten</h2>
        <p>
          Organization administrators can invoke data deletion requests via the Security dashboard. Upon request, all associated telemetry, logs, and account metadata will be permanently expunged from our global clusters within 72 hours.
        </p>

        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Data Locality</h2>
        <p>
          Enterprise customers may strictly enforce data locality requirements. DeployPilotOS supports localizing all telemetry storage and AI processing exclusively within the EU (Frankfurt, Paris, Dublin) or US data centers.
        </p>
      </div>
    </main>
  );
}
