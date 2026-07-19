"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Zap, ShieldCheck, Activity, Terminal, ArrowRight, Server, RefreshCw, Volume2, X, MessageSquare, Github, Bell, Cloud } from "lucide-react";

const terminalLines = [
  "[23:47:02] [ALERT] P1 INCIDENT DETECTED — api-service latency spike (847ms avg)",
  "[23:47:03] [SYSTEM] DeployPilotOS: Fetching last 500 log lines...",
  "[23:47:05] [INFO] Found DB connection pool exhausted (pool_size=10, waiting=47)",
  "[23:47:06] [MATCH] Matched runbook: \"DB Connection Pool Exhaustion Recovery\"",
  "[23:47:07] [EXEC] Executing: Increase pool_size to 30, restart connection manager",
  "[23:47:11] [OK] Health checks passing. Incident auto-resolved."
];

const heroSlides = [
  {
    title: "Your Production App",
    highlight: "Just Failed.",
    highlightColors: "from-emerald-400 via-cyan-400 to-blue-500",
    text: "DeployPilotOS diagnosed the root cause in 8 seconds. Ran the recovery playbook. Restored health. Done."
  },
  {
    title: "AI-Powered",
    highlight: "Incident Resolution.",
    highlightColors: "from-purple-400 via-pink-400 to-red-500",
    text: "Eliminate alert fatigue. Let frontier reasoning models triage, debug, and patch your systems autonomously."
  },
  {
    title: "Multi-Cloud",
    highlight: "Fleet Management.",
    highlightColors: "from-blue-400 via-indigo-400 to-cyan-500",
    text: "Seamlessly monitor and manage infrastructure across AWS, Azure, GCP, and OCI from a single control plane."
  }
];

export default function Home() {
  const [animatedLines, setAnimatedLines] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    let index = 0;
    setAnimatedLines([terminalLines[0]]);

    const interval = setInterval(() => {
      index++;
      if (index < terminalLines.length) {
        setAnimatedLines(prev => [...prev, terminalLines[index]]);
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="landing min-h-screen relative overflow-x-clip flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Background glow grids */}
      <div className="absolute inset-0 grid-glow pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-4 sm:top-6 z-50 w-full flex items-center justify-between border border-white/10 py-4 px-5 sm:px-8 bg-zinc-950/80 backdrop-blur-2xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-8">
        <div className="flex items-center gap-2">
          <span className="brand-mark font-bold text-lg select-none flex items-center justify-center bg-white/10 rounded h-6 w-6"><Activity size={14} /></span>
          <span className="text-xl font-bold tracking-tight text-white">DeployPilotOS</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/status/demo-org" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            Status Page
          </Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className="text-sm bg-white/10 hover:bg-white/15 text-white font-medium px-4 py-2 rounded-lg border border-white/10 transition-all flex items-center gap-1.5">
              Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="text-sm bg-white/10 hover:bg-white/15 text-white font-medium px-4 py-2 rounded-lg border border-white/10 transition-all flex items-center gap-1.5">
              Sign In <ArrowRight size={14} />
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto text-center mt-12 mb-12 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase select-none animate-pulse mb-6">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
          Autonomous Agent System Active
        </div>

        <div className="relative group p-[2px] rounded-[3rem] w-full shadow-[0_0_80px_rgba(52,211,153,0.15)]">
          {/* Subtle moving light shadow behind the container */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-[3rem] blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse pointer-events-none" />

          {/* The moving border light effect */}
          <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
            <div
              className="absolute -top-[100%] -left-[50%] w-[200%] h-[300%]"
              style={{
                background: "conic-gradient(from 0deg, transparent 35%, rgba(52,211,153,1) 45%, rgba(6,182,212,1) 50%, rgba(59,130,246,1) 55%, transparent 65%)",
                animation: "spin 8s linear infinite"
              }}
            />
          </div>

          <div className="relative bg-zinc-950/90 backdrop-blur-3xl rounded-[calc(3rem-2px)] px-6 py-10 sm:px-16 sm:py-12 flex flex-col items-center gap-6 overflow-hidden">
            <div className="relative h-[260px] sm:h-[320px] lg:h-[340px] w-full flex flex-col items-center justify-center">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
                >
                  <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05] max-w-4xl relative z-10">
                    {slide.title} <br />
                    <span className={`bg-gradient-to-r ${slide.highlightColors} bg-clip-text text-transparent`}>
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="text-zinc-400 text-xl sm:text-2xl max-w-2xl relative z-10 leading-relaxed mt-8">
                    {slide.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-5 mt-4 w-full sm:w-auto relative z-10">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard?simulate=true" className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-95 text-zinc-950 font-bold px-10 py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(52,211,153,0.2)] flex items-center justify-center gap-2 text-lg">
                    <Zap size={20} fill="currentColor" /> Simulate Outage
                  </Link>
                  <Link href="/dashboard" className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-10 py-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-lg">
                    Mission Control
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={() => setShowLoginModal(true)} className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-95 text-zinc-950 font-bold px-10 py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(52,211,153,0.2)] flex items-center justify-center gap-2 text-lg">
                    <Zap size={20} fill="currentColor" /> Simulate Outage
                  </button>
                  <button onClick={() => setShowLoginModal(true)} className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-10 py-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-lg">
                    Mission Control
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Terminal View */}
      <section className="relative z-10 max-w-3xl w-full mx-auto border border-white/10 rounded-xl bg-zinc-950/80 backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 select-none">
            <Terminal size={12} /> deploypilot-agent.log
          </span>
        </div>
        <div className="p-5 font-mono text-xs sm:text-sm text-cyan-400/90 leading-relaxed min-h-[180px] flex flex-col gap-2">
          {animatedLines.map((line, idx) => {
            const isRed = line.includes("[ALERT]");
            const isGreen = line.includes("[OK]");
            const isAgent = line.includes("[SYSTEM]");
            let textColor = "text-cyan-400";
            if (isRed) textColor = "text-red-400 font-semibold";
            else if (isGreen) textColor = "text-emerald-400 font-semibold";
            else if (isAgent) textColor = "text-zinc-300";

            return (
              <div key={idx} className={`${textColor} flex items-start gap-1 animate-fade-in`}>
                <span className="text-zinc-600 select-none">❯</span>
                <span className="break-all">{line}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Integrations Marquee */}
      <section className="relative z-10 w-full overflow-hidden mt-12 mb-8 border-y border-white/5 bg-zinc-950/40 py-8">
        <div className="flex w-max animate-marquee items-center opacity-60 hover:opacity-100 transition-opacity duration-700">
          {[1, 2].map((group) => (
            <div key={group} className="flex items-center gap-16 px-8">
              <span className="flex items-center gap-3 text-2xl font-bold tracking-tight whitespace-nowrap">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg" alt="AWS" className="w-8 h-8 invert opacity-90" /> <span className="text-orange-400">AWS</span>
              </span>
              <span className="flex items-center gap-3 text-2xl font-bold tracking-tight whitespace-nowrap">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftazure.svg" alt="Azure" className="w-8 h-8 invert opacity-90" /> <span className="text-blue-500">Azure</span>
              </span>
              <span className="flex items-center gap-3 text-2xl font-bold tracking-tight whitespace-nowrap">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg" alt="GCP" className="w-8 h-8 invert opacity-90" /> <span className="text-red-400">GCP</span>
              </span>
              <span className="flex items-center gap-3 text-2xl font-bold tracking-tight whitespace-nowrap">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg" alt="OpenAI" className="w-8 h-8 invert opacity-90" /> <span className="text-emerald-400">OpenAI</span>
              </span>
              <span className="flex items-center gap-3 text-2xl font-bold tracking-tight whitespace-nowrap">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/datadog.svg" alt="Datadog" className="w-8 h-8 invert opacity-90" /> <span className="text-purple-400">Datadog</span>
              </span>
              <span className="flex items-center gap-3 text-2xl font-bold tracking-tight whitespace-nowrap">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg" alt="Slack" className="w-8 h-8 invert opacity-90" /> <span className="text-pink-400">Slack</span>
              </span>
              <span className="flex items-center gap-3 text-2xl font-bold tracking-tight whitespace-nowrap">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg" alt="GitHub" className="w-8 h-8 invert opacity-90" /> <span className="text-white">GitHub</span>
              </span>
              <span className="flex items-center gap-3 text-2xl font-bold tracking-tight whitespace-nowrap">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/pagerduty.svg" alt="PagerDuty" className="w-8 h-8 invert opacity-90" /> <span className="text-green-400">PagerDuty</span>
              </span>
              <span className="flex items-center gap-3 text-2xl font-bold tracking-tight whitespace-nowrap">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/kubernetes.svg" alt="Kubernetes" className="w-8 h-8 invert opacity-90" /> <span className="text-blue-400">Kubernetes</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Strip */}
      <section className="relative z-10 max-w-7xl mx-auto w-full mt-24 mb-10 px-4 sm:px-6">
        <div className="relative group p-[2px] rounded-[3rem] w-full shadow-[0_0_80px_rgba(52,211,153,0.15)]">
          {/* Subtle moving light shadow behind the container */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-[3rem] blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse pointer-events-none" />

          {/* The moving border light effect */}
          <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
            <div
              className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%]"
              style={{
                background: "conic-gradient(from 0deg, transparent 35%, rgba(52,211,153,1) 45%, rgba(6,182,212,1) 50%, rgba(59,130,246,1) 55%, transparent 65%)",
                animation: "spin 12s linear infinite"
              }}
            />
          </div>

          <div className="relative bg-zinc-950/90 backdrop-blur-3xl rounded-[calc(3rem-2px)] p-8 sm:p-12 md:p-16 w-full flex flex-col items-center overflow-hidden">
            {/* Subtle top glow inside the container */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="text-center mb-14 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                The Autonomous SRE Lifecycle
              </h2>
              <p className="text-zinc-400 mt-4 max-w-2xl mx-auto text-lg">
                DeployPilotOS doesn't just alert you. It actively investigates, mitigates, and resolves production incidents end-to-end without human intervention.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10">
              {[
                { icon: <Activity size={24} className="text-cyan-400" />, title: "Detect", desc: "Ingest logs, metrics, and traces globally across all cloud providers." },
                { icon: <Server size={24} className="text-cyan-400" />, title: "Diagnose", desc: "Correlate logs, metrics, and git deploys instantly." },
                { icon: <Zap size={24} className="text-cyan-400" />, title: "Execute", desc: "Run pre-approved runbooks and playbooks automatically." },
                { icon: <RefreshCw size={24} className="text-cyan-400" />, title: "Rollback", desc: "Undo broken releases and patch configurations in under 15 seconds." },
                { icon: <Volume2 size={24} className="text-cyan-400" />, title: "Voice CMD", desc: "Command the incident war room natively via Realtime Voice." },
                { icon: <ShieldCheck size={24} className="text-cyan-400" />, title: "Audit Log", desc: "Immutable compliance history of every autonomous agent action." },
              ].map((f, i) => (
                <div key={i} className="relative group p-[1px] rounded-2xl w-full h-full">
                  {/* The moving border light effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                    <div
                      className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%]"
                      style={{
                        background: "conic-gradient(from 0deg, transparent 35%, rgba(52,211,153,1) 45%, rgba(6,182,212,1) 50%, rgba(59,130,246,1) 55%, transparent 65%)",
                        animation: `spin ${6 + (i % 3)}s linear infinite`
                      }}
                    />
                  </div>

                  <div className="relative border border-white/5 bg-zinc-950/90 backdrop-blur-xl p-8 rounded-[calc(1rem-1px)] flex flex-col gap-3 hover:bg-white/[0.04] transition-colors cursor-default h-full">
                    <span className="text-3xl mb-1 relative z-10">{f.icon}</span>
                    <h3 className="text-lg font-semibold text-white tracking-tight relative z-10">{f.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed relative z-10">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="relative z-10 max-w-5xl mx-auto w-full mt-10 mb-24 px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The ROI of Autonomy
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto text-lg">
            Compare traditional, manual on-call workflows with DeployPilotOS's autonomous resolution.
          </p>
        </div>

        <div className="w-full overflow-x-auto rounded-3xl border border-white/10 shadow-2xl bg-zinc-900/40 backdrop-blur-xl">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-white/10 bg-zinc-950/80">
              <div className="p-6 text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-widest flex items-center">Capabilities</div>
              <div className="p-6 text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-widest border-l border-white/5 flex items-center">Traditional SRE</div>
              <div className="p-6 text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest border-l border-white/5 bg-emerald-500/10 flex items-center gap-2">
                <Activity size={16} /> DeployPilotOS
              </div>
            </div>

            {/* Rows */}
            {[
              { label: "Root Cause Analysis", trad: "Manual log hunting & dashboard scanning (25m+)", new: "Instant AI-driven graph traversal (8s)" },
              { label: "Alert Fatigue", trad: "Hundreds of noisy, disconnected alerts daily", new: "Correlated signals, zero noise, high context" },
              { label: "Remediation", trad: "Wait for on-call engineer to wake up & diagnose", new: "Autonomous playbook execution instantly" },
              { label: "Average MTTR", trad: "1 - 4 hours depending on severity", new: "< 2 minutes for standard incidents" },
              { label: "Scaling Cost", trad: "Expensive 24/7 global on-call rotations", new: "Fractional compute cost, infinite parallel scale" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                <div className="p-5 sm:p-6 text-white font-medium flex items-center">{row.label}</div>
                <div className="p-5 sm:p-6 text-zinc-400 border-l border-white/5 flex items-center leading-relaxed text-sm sm:text-base">{row.trad}</div>
                <div className="p-5 sm:p-6 text-emerald-300 font-medium border-l border-white/5 bg-emerald-500/[0.03] flex items-center leading-relaxed text-sm sm:text-base">
                  <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500 shrink-0" /> {row.new}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center border-t border-white/5 pt-6 mt-16 text-xs text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 DeployPilotOS SRE. Built for OpenAI Build Week.</span>
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5">
          <Link href="/docs" className="hover:text-zinc-400 transition-colors">Docs</Link>
          <Link href="/security" className="hover:text-zinc-400 transition-colors">Security</Link>
          <span className="hidden sm:inline text-white/5">|</span>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
          <Link href="/gdpr" className="hover:text-zinc-400 transition-colors">GDPR</Link>
          <Link href="/cookies" className="hover:text-zinc-400 transition-colors">Cookies</Link>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 flex flex-col gap-6 animate-fade-in">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <Terminal size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">DeployPilotOS Access</h2>
                <p className="text-sm text-zinc-400 mt-1">Sign in to your Mission Control workspace.</p>
              </div>
            </div>

            <form className="flex flex-col gap-4 mt-4" onSubmit={e => {
              e.preventDefault();
              localStorage.setItem("isLoggedIn", "true");
              window.location.href = "/dashboard";
            }}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 text-left">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value="demo@deploypilotos.com"
                  className="bg-zinc-950 border border-white/10 rounded-lg p-3 text-sm text-white outline-none cursor-not-allowed opacity-80"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 text-left">Password</label>
                <input
                  type="password"
                  readOnly
                  value="••••••••••••••••"
                  className="bg-zinc-950 border border-white/10 rounded-lg p-3 text-sm text-zinc-500 outline-none cursor-not-allowed opacity-80 font-mono tracking-widest"
                />
              </div>

              <div className="text-[10px] text-zinc-500 text-center bg-zinc-950 p-2 rounded border border-white/5 font-mono">
                Demo Mode Active: Auto-filled credentials.
              </div>

              <button type="submit" className="w-full mt-2 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-95 text-zinc-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                Sign In <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
