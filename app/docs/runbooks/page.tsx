import Link from "next/link";
import { ArrowLeft, Zap, FileCode2, Info } from "lucide-react";

export default function RunbooksDocPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans p-8 flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col gap-8 relative z-10">
        <header className="flex items-center gap-4 border-b border-white/5 pb-6">
          <Link href="/docs" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <Zap size={20} className="text-yellow-400" /> Runbook Triggers
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Learn how to write custom automated playbooks.</p>
          </div>
        </header>

        <section className="flex flex-col gap-6 text-sm leading-relaxed text-zinc-400">
          <p>
            Runbooks in DeployPilotOS are YAML definitions of standard operating procedures. When the agent diagnoses a root cause with high confidence (<span className="text-emerald-400 font-mono text-xs">{">"}80%</span>), it will attempt to match the root cause to a predefined runbook.
          </p>

          <h2 className="text-xl font-bold text-white mt-4 tracking-tight border-b border-white/5 pb-2">Runbook Schema</h2>
          <p>
            A runbook defines triggers (regex patterns to match against AI diagnosis) and steps (actions to perform).
          </p>

          <div className="bg-[#0D0D11] border border-white/10 rounded-xl overflow-hidden font-mono text-xs shadow-2xl">
            <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center gap-2 text-zinc-500 font-semibold tracking-wider uppercase text-[10px]">
              <FileCode2 size={14} /> db-recovery.yaml
            </div>
            <pre className="p-5 text-emerald-300 overflow-x-auto leading-loose">
              <code>{`name: DB Connection Pool Exhaustion Recovery
description: Automatically restarts the connection manager and bumps pool limits.
triggers:
  - match: "connection pool exhausted"
  - match: "too many connections"
steps:
  - type: shell
    command: "kubectl scale deployment api-service --replicas=0"
  - type: sql
    query: "ALTER SYSTEM SET max_connections = 300;"
  - type: shell
    command: "kubectl scale deployment api-service --replicas=3"`}</code>
            </pre>
          </div>

          <h2 className="text-xl font-bold text-white mt-4 tracking-tight border-b border-white/5 pb-2">Human-in-the-Loop Mode</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl flex items-start gap-4 text-blue-200 mt-2">
            <Info className="shrink-0 mt-0.5 text-blue-400" size={18} />
            <p className="text-sm">
              For critical infrastructure (like databases), you can add <code className="bg-black/40 border border-blue-500/30 px-1.5 py-0.5 rounded text-blue-300 font-mono text-xs">requireApproval: true</code> to the runbook YAML. DeployPilotOS will halt execution and ping the on-call engineer via Slack or Voice War Room for manual sign-off before proceeding.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
