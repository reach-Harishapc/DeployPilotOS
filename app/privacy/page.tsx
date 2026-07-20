import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col py-12 px-6 max-w-3xl mx-auto relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-12 w-fit relative z-10">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      
      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <Shield size={20} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Privacy Policy</h1>
      </div>
      
      <div className="flex flex-col gap-6 text-zinc-400 text-sm leading-relaxed relative z-10">
        <p className="text-zinc-500">Last updated: July 20, 2026</p>
        
        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">1. Information Collection</h2>
        <p>
          At DeployPilotOS, we are committed to safeguarding the privacy of our users. We only collect telemetry, logs, and infrastructure metadata strictly necessary to perform automated root-cause analysis and incident remediation. We do not inspect the content of user databases or application payloads unless explicitly whitelisted by your security team.
        </p>

        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">2. Use of Information</h2>
        <p>
          The infrastructure data we ingest is processed exclusively by our isolated AI agents to identify anomalies, trigger playbooks, and resolve outages. Your telemetry data is never sold, rented, or shared with third parties for marketing purposes.
        </p>

        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">3. Data Retention</h2>
        <p>
          System logs and metrics used for incident resolution are retained for a maximum of 30 days unless an extended retention policy is configured in your organization settings. Audit logs of AI agent actions are retained indefinitely for compliance purposes.
        </p>
      </div>
    </main>
  );
}
