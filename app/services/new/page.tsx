"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { store, useStoreState, Service, CloudProvider, startSimulation } from "@/src/lib/store";
import { 
  ArrowLeft, ArrowRight, Check, Server, 
  Activity, ShieldAlert, CheckCircle2, Webhook 
} from "lucide-react";
import Link from "next/link";

export default function NewServiceWizard() {
  const router = useRouter();
  const { refresh } = useStoreState();
  const [step, setStep] = useState(1);
  
  // Form State
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [provider, setProvider] = useState<CloudProvider>("aws");
  const [healthUrl, setHealthUrl] = useState("https://");
  const [checkInterval, setCheckInterval] = useState(30);
  const [latencyThreshold, setLatencyThreshold] = useState(500);
  const [errorRateThreshold, setErrorRateThreshold] = useState(5);
  const [logSource, setLogSource] = useState("webhook");
  const [enableRestartTemplate, setEnableRestartTemplate] = useState(true);
  const [enableRollbackTemplate, setEnableRollbackTemplate] = useState(true);

  // Status simulation
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionPassed, setConnectionPassed] = useState<boolean | null>(null);
  
  const handleTestConnection = () => {
    setTestingConnection(true);
    setConnectionPassed(null);
    setTimeout(() => {
      setTestingConnection(false);
      setConnectionPassed(true);
    }, 1200);
  };

  const handleFinish = () => {
    if (!name.trim()) return;

    const newService: Service = {
      id: name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.floor(Math.random() * 1000),
      name,
      environment,
      provider,
      status: "healthy",
      latencyThreshold,
      errorRateThreshold: errorRateThreshold / 100, // percentage to decimal
      uptimePercent: 100.0,
      avgLatency: 35,
      currentErrorRate: 0.0,
      isPublic: true
    };

    // Save service
    const currentServices = store.getServices();
    store.setServices([...currentServices, newService]);

    // Save runbooks if toggled
    const currentRunbooks = store.getRunbooks();
    const newRunbooks = [...currentRunbooks];
    
    if (enableRestartTemplate) {
      newRunbooks.push({
        id: `rb-restart-${newService.id}`,
        serviceId: newService.id,
        name: "Auto-Restart on Telemetry Collapse",
        description: `Automatically restarts ${newService.name} container when latency averages cross ${latencyThreshold}ms.`,
        isEnabled: true,
        requireApproval: false,
        useCount: 0,
        steps: [
          { id: "step-1", type: "restart", name: "Perform container hot-restart", params: {}, requireApproval: false }
        ]
      });
    }

    if (enableRollbackTemplate) {
      newRunbooks.push({
        id: `rb-rollback-${newService.id}`,
        serviceId: newService.id,
        name: "Outage Code Release Rollback",
        description: `Triggers a Git commit rollback if error rate spikes cross ${errorRateThreshold}%.`,
        isEnabled: true,
        requireApproval: false,
        useCount: 0,
        steps: [
          { id: "step-1", type: "rollback", name: "Revert deployed build to prior release", params: {}, requireApproval: false }
        ]
      });
    }

    store.setRunbooks(newRunbooks);
    
    // Seed initial telemetry sample
    store.getMetrics(newService.id);

    refresh();
    setStep(6); // Success screen
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Back Link */}
        <div>
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs flex items-center gap-1">
            <ArrowLeft size={12} /> Cancel Wizard
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-bold text-white">Register New Service</h1>
          <p className="text-xs text-zinc-400 mt-1 select-none">
            {step < 6 ? `Step ${step} of 5 — Configure SRE policies` : "Success!"}
          </p>
        </div>

        {/* Progress Bar (Visual micro-animations) */}
        {step < 6 && (
          <div className="h-1 bg-white/5 rounded-full overflow-hidden select-none">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-350"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Step Contents */}
        <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-xl min-h-[350px] flex flex-col justify-between">
          
          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white">Step 1: Service Identity</h3>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Service Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. billing-processor"
                  className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Environment</label>
                <div className="grid grid-cols-3 gap-2">
                  {["production", "staging", "development"].map(env => (
                    <button
                      key={env}
                      onClick={() => setEnvironment(env)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border capitalize transition-all ${
                        environment === env
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Health Check */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white">Step 2: HTTP Health Metrics</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Health endpoint URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={healthUrl}
                    onChange={e => setHealthUrl(e.target.value)}
                    placeholder="https://api.billing.prod.internal/healthz"
                    className="flex-1 bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="bg-white/5 hover:bg-white/10 text-white font-semibold px-4 rounded-lg text-xs border border-white/10 transition-all shrink-0"
                  >
                    {testingConnection ? "Verifying..." : "Test Connection"}
                  </button>
                </div>
                {connectionPassed && (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 size={12} /> Connection verified successfully. Host returned 200 OK.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Poll Interval (seconds)</label>
                  <input 
                    type="number" 
                    value={checkInterval}
                    onChange={e => setCheckInterval(Number(e.target.value))}
                    className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Latency Threshold (ms)</label>
                  <input 
                    type="number" 
                    value={latencyThreshold}
                    onChange={e => setLatencyThreshold(Number(e.target.value))}
                    className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Logs */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white">Step 3: Log Ingestion Adapter</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Log Provider Source</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "webhook", label: "HTTP Webhook push" },
                    { id: "cloudwatch", label: "AWS CloudWatch Logs" },
                    { id: "vercel", label: "Vercel Log Drain" },
                    { id: "railway", label: "Railway Logs Api" },
                  ].map(src => (
                    <button
                      key={src.id}
                      onClick={() => setLogSource(src.id)}
                      className={`py-3 px-3 rounded-lg text-xs font-semibold border text-left transition-all ${
                        logSource === src.id
                          ? "bg-cyan-500/10 border-cyan-500/35 text-white"
                          : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {src.label}
                    </button>
                  ))}
                </div>
              </div>

              {logSource === "webhook" && (
                <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg mt-2 text-xs text-zinc-400 leading-normal">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1.5 font-mono">
                    <Webhook size={14} /> Webhook config endpoint
                  </div>
                  Configure your service logs runner to POST payload objects to:
                  <div className="bg-zinc-950 p-2 rounded-lg text-[10px] text-zinc-300 font-mono select-all break-all border border-white/[0.02] mt-2">
                    https://api.deploypilotos.com/v1/ingest-logs?token=tok_d3b5c82a17
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Deploys & Platform */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white">Step 4: Platform Integrations</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Cloud Provider Host</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "aws", label: "AWS" },
                    { id: "gcp", label: "GCP" },
                    { id: "azure", label: "Azure" },
                    { id: "oci", label: "OCI" },
                  ].map(prov => (
                    <button
                      key={prov.id}
                      onClick={() => setProvider(prov.id as any)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                        provider === prov.id
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {prov.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs text-zinc-400 font-medium">Cluster ID / Credentials Reference</label>
                <input 
                  type="text" 
                  placeholder="e.g. arn:aws:ecs:us-east-1:123456789012:cluster/prod-billing"
                  className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <span className="text-[10px] text-zinc-500">
                  DeployPilotOS uses secure secret references. No root cloud keys are stored on our servers.
                </span>
              </div>
            </div>
          )}

          {/* Step 5: Runbooks & Recovery templates */}
          {step === 5 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white">Step 5: Recovery Playbooks</h3>
              <p className="text-xs text-zinc-500 leading-normal mb-1">
                Toggle templates to pre-seed this service with standard, automated incident resolution scripts.
              </p>

              <div className="flex flex-col gap-3">
                <label className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all">
                  <div className="flex flex-col gap-0.5 max-w-[85%]">
                    <strong className="text-xs text-zinc-200">Auto-Restart Container</strong>
                    <span className="text-[10px] text-zinc-500 leading-normal">
                      Initiates a service container hot restart if health check URL responds with 5xx error or connections block.
                    </span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={enableRestartTemplate}
                    onChange={e => setEnableRestartTemplate(e.target.checked)}
                    className="h-4 w-4 accent-cyan-400 cursor-pointer"
                  />
                </label>

                <label className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all">
                  <div className="flex flex-col gap-0.5 max-w-[85%]">
                    <strong className="text-xs text-zinc-200">Outage Release Rollback</strong>
                    <span className="text-[10px] text-zinc-500 leading-normal">
                      Automatically issues a rollback build triggers to the connected platform adapter if error rate exceeds thresholds.
                    </span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={enableRollbackTemplate}
                    onChange={e => setEnableRollbackTemplate(e.target.checked)}
                    className="h-4 w-4 accent-cyan-400 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Step 6: Success screen */}
          {step === 6 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8 animate-fade-in">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">Service Integrated Successfully</h2>
              <p className="text-xs text-zinc-400 max-w-sm leading-normal">
                "{name}" is now connected to the DeployPilotOS control plane. Anomaly detectors are calibrating baseline rolling metrics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-2.5 rounded-lg text-xs border border-white/5 transition-all"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    const latestSvc = store.getServices().find(s => s.name === name);
                    if (latestSvc) {
                      startSimulation(latestSvc.id, () => refresh());
                      setTimeout(() => {
                        const act = store.getIncidents().find(i => i.status !== "resolved");
                        if (act) router.push(`/incidents/${act.id}`);
                      }, 500);
                    }
                  }}
                  className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-zinc-950 font-bold px-6 py-2.5 rounded-lg text-xs transition-all shadow-[0_0_20px_rgba(52,211,153,0.1)] flex items-center justify-center gap-1"
                >
                  Simulate Incident
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {step < 6 && (
            <div className="flex justify-between border-t border-white/5 pt-4 mt-6 select-none">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  step === 1 
                    ? "text-zinc-600 cursor-not-allowed" 
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <ArrowLeft size={14} /> Back
              </button>
              
              {step < 5 ? (
                <button
                  onClick={nextStep}
                  disabled={step === 1 && !name.trim()}
                  className={`bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-2 rounded-lg text-xs border border-white/10 transition-all flex items-center gap-1 ${
                    step === 1 && !name.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.05)]"
                >
                  Register Service
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
