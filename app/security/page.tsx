import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Key, Server } from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <header className="flex items-center gap-4 border-b border-white/5 pb-6">
          <Link href="/" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-400" /> Security & Trust
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Enterprise-grade security policies and compliance</p>
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={18} className="text-blue-400" />
              <h2 className="text-sm font-bold text-white">Data Encryption & Privacy</h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-1">
              All infrastructure logs, telemetry, and environment variables are encrypted at rest using AES-256 and in transit using TLS 1.3. DeployPilotOS agents operate under strict sandboxing protocols and never store plain-text secrets.
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Key size={18} className="text-yellow-400" />
              <h2 className="text-sm font-bold text-white">Agent Permissions (RBAC)</h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-1">
              DeployPilotOS agents enforce granular Role-Based Access Control. Any action that modifies live infrastructure (like executing a runbook) requires explicit cryptographic signing via short-lived tokens.
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Server size={18} className="text-purple-400" />
              <h2 className="text-sm font-bold text-white">Compliance Overview</h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-1">
              We are actively pursuing SOC 2 Type II and ISO 27001 certifications. Security audits are performed quarterly by independent penetration testing firms. If you have specific compliance requirements, please contact our enterprise security team.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
