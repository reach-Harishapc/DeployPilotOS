import Link from "next/link";
import { ArrowLeft, Book, Activity, BrainCircuit, Database, Mic2 } from "lucide-react";

export default function ArchitectureDocPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans p-8 flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col gap-8 relative z-10">
        <header className="flex items-center gap-4 border-b border-white/5 pb-6">
          <Link href="/docs" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <Book size={20} className="text-purple-400" /> System Architecture
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Deep dive into the underlying multi-agent simulation framework.</p>
          </div>
        </header>

        <section className="flex flex-col gap-8 text-sm leading-relaxed text-zinc-400">
          <p className="text-base text-zinc-300">
            DeployPilotOS is a full-stack Next.js application that operates as a completely autonomous System Reliability Engineering (SRE) agent.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Layer 1 */}
            <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-xl hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center">
                  <Activity size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">1. Data Ingestion Layer</h3>
              </div>
              <p>
                The frontend continuously polls the simulated data store for metrics across CPU, Memory, and Network latency. In a production environment, this layer acts as an adapter for Datadog or Prometheus.
              </p>
            </div>

            {/* Layer 2 */}
            <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-xl hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center">
                  <BrainCircuit size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">2. The Diagnosis Engine (LLM)</h3>
              </div>
              <p>
                When anomaly thresholds are breached, the incident payload (logs, stack traces, git commit diffs) is injected into the Diagnosis Engine. This engine leverages OpenAI's structured outputs to produce a deterministic <code className="bg-black/30 px-1 rounded text-cyan-300">rootCause</code> and a <code className="bg-black/30 px-1 rounded text-cyan-300">confidenceScore</code>.
              </p>
            </div>

            {/* Layer 3 */}
            <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-xl hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center">
                  <Database size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">3. State Management</h3>
              </div>
              <p>
                We use an in-memory client-side store combined with <code className="bg-black/30 px-1 rounded text-blue-300">localStorage</code> persistence. A global pub-sub event listener synchronizes state across the React component tree (e.g., updating the Command Palette instantly when a new incident is detected).
              </p>
            </div>

            {/* Layer 4 */}
            <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-xl hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center">
                  <Mic2 size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">4. Realtime Voice Interfacing</h3>
              </div>
              <p>
                The application natively integrates with OpenAI Voice (Streaming realtime audio) to allow operators to enter a "Voice War Room". Voice commands are transcibed, analyzed for intent, and mapped to specific runbook execution functions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
