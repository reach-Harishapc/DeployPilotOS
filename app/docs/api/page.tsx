import Link from "next/link";
import { ArrowLeft, Code } from "lucide-react";

export default function ApiPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <header className="flex items-center gap-4 border-b border-white/5 pb-6">
          <Link href="/docs" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code size={20} className="text-blue-400" /> API Reference
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Integrate with our REST API to push external monitoring metrics.</p>
          </div>
        </header>

        <div className="prose prose-invert prose-sm max-w-none text-zinc-400 font-sans pb-20">
          <p className="mb-6">
            The DeployPilotOS REST API provides programmatic access to your entire SRE workspace. 
            Integrate seamlessly with CI/CD pipelines, external APM tools (Datadog, New Relic), and custom internal dashboards.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-8 flex items-start gap-3">
            <div className="h-8 w-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><Code size={16}/></div>
            <div>
              <h4 className="text-blue-400 font-bold mb-1">Global Base URL</h4>
              <code className="text-white font-mono text-xs">https://api.deploypilotos.com/v1</code>
            </div>
          </div>

          <h2 className="text-white text-xl font-bold mb-4 mt-8 border-b border-white/10 pb-2">Authentication & Rate Limits</h2>
          <p className="mb-4 text-sm">
            Pass your workspace API key in the <code className="bg-white/10 px-1 rounded">Authorization</code> header. 
            All API endpoints are rate-limited to <strong className="text-white">1,000 requests per minute</strong> per workspace IP.
          </p>
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg font-mono text-[11px] text-cyan-400 mb-8">
            Authorization: Bearer dp_live_abc123def456ghi789
          </div>

          {/* ENDPOINT 1 */}
          <h2 className="text-white text-xl font-bold mb-4 mt-12 border-b border-white/10 pb-2">1. Telemetry & Metrics</h2>
          
          <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><span className="bg-emerald-400/20 px-2 py-0.5 rounded text-emerald-400 text-[10px] tracking-wide">POST</span> /telemetry/ingest</h3>
          <p className="mb-4 text-xs">Push high-frequency metrics to the AI diagnosis engine. Automatically triggers an incident if thresholds are breached.</p>
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg font-mono text-[11px] text-zinc-300 mb-8 whitespace-pre overflow-x-auto">
<span className="text-zinc-500">// Request Payload</span>
{`{
  "serviceId": "api-gateway",
  "timestamp": "2026-07-18T23:47:02Z",
  "metrics": {
    "cpu_percent": 89.4,
    "memory_mb": 4021,
    "latency_ms": 1205
  },
  "tags": ["region:us-east-1", "env:production"]
}`}
          </div>

          {/* ENDPOINT 2 */}
          <h2 className="text-white text-xl font-bold mb-4 mt-12 border-b border-white/10 pb-2">2. Incident Management</h2>

          <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2"><span className="bg-blue-400/20 px-2 py-0.5 rounded text-blue-400 text-[10px] tracking-wide">GET</span> /incidents</h3>
          <p className="mb-4 text-xs">Retrieve a paginated list of all active or resolved incidents in the workspace.</p>
          <div className="bg-zinc-900 border border-white/5 p-3 rounded-lg font-mono text-[11px] text-zinc-300 mb-4 whitespace-pre overflow-x-auto">
<span className="text-zinc-500">// Query Parameters</span>
?status=open&severity=P1&limit=50
          </div>
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg font-mono text-[11px] text-zinc-300 mb-8 whitespace-pre overflow-x-auto">
<span className="text-zinc-500">// Response (200 OK)</span>
{`{
  "data": [
    {
      "id": "inc_78432",
      "status": "open",
      "severity": "P1",
      "title": "API Timeout Cascade",
      "mttr": null,
      "aiDiagnosis": { "rootCause": "DB Connection Pool Exhausted", "confidence": 98 }
    }
  ],
  "pagination": { "hasMore": false }
}`}
          </div>

          <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2"><span className="bg-yellow-400/20 px-2 py-0.5 rounded text-yellow-400 text-[10px] tracking-wide">PUT</span> /incidents/:id/resolve</h3>
          <p className="mb-8 text-xs">Manually mark an incident as resolved. This will automatically trigger the AI Post-Mortem generator.</p>
          
          {/* ENDPOINT 3 */}
          <h2 className="text-white text-xl font-bold mb-4 mt-12 border-b border-white/10 pb-2">3. Runbooks & Automations</h2>

          <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2"><span className="bg-purple-400/20 px-2 py-0.5 rounded text-purple-400 text-[10px] tracking-wide">POST</span> /runbooks/execute</h3>
          <p className="mb-4 text-xs">Manually dispatch a specific automated playbook against a service cluster.</p>
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-lg font-mono text-[11px] text-zinc-300 mb-8 whitespace-pre overflow-x-auto">
<span className="text-zinc-500">// Request Payload</span>
{`{
  "runbookId": "rb_restart_pods",
  "serviceId": "api-gateway",
  "overrideParams": {
    "force": true,
    "gracePeriodSeconds": 0
  }
}`}
          </div>

        </div>
      </div>
    </main>
  );
}
