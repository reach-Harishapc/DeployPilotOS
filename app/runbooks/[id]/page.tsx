"use client";

import React, { use, useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { 
  useStoreState, store, Runbook, RunbookStep 
} from "@/src/lib/store";
import { 
  ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, 
  Play, BookOpen, Check, Settings, Eye, HelpCircle 
} from "lucide-react";
import Link from "next/link";

export default function RunbookEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: runbookId } = use(params);
  const { runbooks, services, refresh } = useStoreState();
  const [runbook, setRunbook] = useState<Runbook | null>(null);
  const [dryRunning, setDryRunning] = useState(false);
  const [dryRunSuccess, setDryRunSuccess] = useState(false);

  useEffect(() => {
    const rb = runbooks.find(r => r.id === runbookId);
    if (rb && (!runbook || runbook.id !== runbookId)) {
      setRunbook(JSON.parse(JSON.stringify(rb))); // Deep clone to edit local state
    }
  }, [runbookId, runbooks, runbook]);

  if (!runbook) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <BookOpen className="text-zinc-600 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-white">Runbook Not Found</h2>
          <Link href="/dashboard" className="text-cyan-400 hover:underline mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const service = services.find(s => s.id === runbook.serviceId);

  const handleSave = () => {
    const updatedRunbooks = runbooks.map(r => {
      if (r.id === runbook.id) {
        return runbook;
      }
      return r;
    });
    store.setRunbooks(updatedRunbooks);
    refresh();
    alert("Runbook changes saved successfully.");
  };

  const handleUpdateStepParam = (stepIdx: number, paramKey: string, val: any) => {
    const updated = { ...runbook };
    updated.steps[stepIdx].params[paramKey] = val;
    setRunbook(updated);
  };

  const handleUpdateStepType = (stepIdx: number, type: RunbookStep["type"]) => {
    const updated = { ...runbook };
    updated.steps[stepIdx].type = type;
    
    // Set default params based on type
    if (type === "restart") updated.steps[stepIdx].params = { component: "web" };
    else if (type === "scale") updated.steps[stepIdx].params = { replicas: 3 };
    else if (type === "rollback") updated.steps[stepIdx].params = {};
    else if (type === "command") updated.steps[stepIdx].params = { command: "echo 'hello'" };
    else if (type === "notify") updated.steps[stepIdx].params = { channel: "#incidents" };
    else if (type === "wait") updated.steps[stepIdx].params = { seconds: 5 };
    else if (type === "check") updated.steps[stepIdx].params = { checkPath: "/healthz" };

    setRunbook(updated);
  };

  const handleAddStep = () => {
    const updated = { ...runbook };
    const newStep: RunbookStep = {
      id: "step-" + Date.now(),
      type: "check",
      name: "Validate service state",
      params: { checkPath: "/healthz" },
      requireApproval: false
    };
    updated.steps.push(newStep);
    setRunbook(updated);
  };

  const handleDeleteStep = (idx: number) => {
    const updated = { ...runbook };
    updated.steps.splice(idx, 1);
    setRunbook(updated);
  };

  const handleMoveStep = (idx: number, direction: "up" | "down") => {
    const updated = { ...runbook };
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= updated.steps.length) return;
    
    // Swap
    const temp = updated.steps[idx];
    updated.steps[idx] = updated.steps[targetIdx];
    updated.steps[targetIdx] = temp;
    setRunbook(updated);
  };

  const handleDryRun = () => {
    setDryRunning(true);
    setDryRunSuccess(false);
    setTimeout(() => {
      setDryRunning(false);
      setDryRunSuccess(true);
    }, 2000);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        
        {/* Back Link */}
        <div>
          {service ? (
            <Link href={`/services/${service.id}`} className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs flex items-center gap-1">
              <ArrowLeft size={12} /> Back to {service.name}
            </Link>
          ) : (
            <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs flex items-center gap-1">
              <ArrowLeft size={12} /> Back to Dashboard
            </Link>
          )}
        </div>

        {/* Header */}
        <div className="border-b border-white/5 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mb-1 select-none">
              Playbook Studio
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">{runbook.name}</h1>
          </div>
          
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.05)]"
          >
            Save Playbook
          </button>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Editor */}
          <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-5">
            <h3 className="text-xs font-semibold text-white border-b border-white/5 pb-2 select-none">
              Playbook Trigger Rules
            </h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-medium">Description Formula (Natural Language)</label>
              <textarea 
                value={runbook.description}
                onChange={e => setRunbook({ ...runbook, description: e.target.value })}
                rows={3}
                placeholder="Describe when the AI agent should match and run this playbook..."
                className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-2 pt-2 select-none">
              <h3 className="text-xs font-semibold text-white">Mitigation Steps Sequence</h3>
              <button
                onClick={handleAddStep}
                className="bg-white/5 hover:bg-white/10 text-white font-semibold px-2.5 py-1.5 rounded border border-white/10 transition-all text-[10px] flex items-center gap-1"
              >
                <Plus size={10} /> Add Action Step
              </button>
            </div>

            {/* Steps block */}
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
              {runbook.steps.map((st, idx) => (
                <div key={st.id} className="bg-zinc-950 border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between select-none">
                    <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 font-mono">
                      STEP {idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMoveStep(idx, "up")}
                        disabled={idx === 0}
                        className="text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleMoveStep(idx, "down")}
                        disabled={idx === runbook.steps.length - 1}
                        className="text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteStep(idx)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-semibold select-none">Step Name</label>
                      <input 
                        type="text"
                        value={st.name}
                        onChange={e => {
                          const updated = { ...runbook };
                          updated.steps[idx].name = e.target.value;
                          setRunbook(updated);
                        }}
                        className="bg-zinc-900 border border-white/5 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-semibold select-none">Action Type</label>
                      <select
                        value={st.type}
                        onChange={e => handleUpdateStepType(idx, e.target.value as any)}
                        className="bg-zinc-900 border border-white/5 rounded p-1.5 text-xs text-white cursor-pointer"
                      >
                        <option value="restart">Restart Service</option>
                        <option value="scale">Scale Replicas</option>
                        <option value="rollback">Rollback Deploy</option>
                        <option value="command">Run Shell Command</option>
                        <option value="notify">Send Slack Alert</option>
                        <option value="wait">Wait/Delay</option>
                        <option value="check">HTTP Health Check</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Parameters Input */}
                  {st.type === "restart" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-semibold select-none">Cluster Component Target</label>
                      <input 
                        type="text"
                        value={st.params.component || ""}
                        onChange={e => handleUpdateStepParam(idx, "component", e.target.value)}
                        className="bg-zinc-900 border border-white/5 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                  )}

                  {st.type === "scale" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-semibold select-none">Scale Target Replicas Count</label>
                      <input 
                        type="number"
                        value={st.params.replicas || 1}
                        onChange={e => handleUpdateStepParam(idx, "replicas", Number(e.target.value))}
                        className="bg-zinc-900 border border-white/5 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                  )}

                  {st.type === "command" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-semibold select-none">Script Execution Command</label>
                      <input 
                        type="text"
                        value={st.params.command || ""}
                        onChange={e => handleUpdateStepParam(idx, "command", e.target.value)}
                        className="bg-zinc-900 border border-white/5 rounded p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  )}

                  {st.type === "notify" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-semibold select-none">Slack Channel Webhook Reference</label>
                      <input 
                        type="text"
                        value={st.params.channel || ""}
                        onChange={e => handleUpdateStepParam(idx, "channel", e.target.value)}
                        className="bg-zinc-900 border border-white/5 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                  )}

                  {st.type === "wait" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-semibold select-none">Duration Delay (seconds)</label>
                      <input 
                        type="number"
                        value={st.params.seconds || 5}
                        onChange={e => handleUpdateStepParam(idx, "seconds", Number(e.target.value))}
                        className="bg-zinc-900 border border-white/5 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                  )}

                  {st.type === "check" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-semibold select-none">Target Healthcheck Route</label>
                      <input 
                        type="text"
                        value={st.params.checkPath || ""}
                        onChange={e => handleUpdateStepParam(idx, "checkPath", e.target.value)}
                        className="bg-zinc-900 border border-white/5 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                  )}
                </div>
              ))}

              {runbook.steps.length === 0 && (
                <div className="text-center py-10 text-xs text-zinc-600 border border-dashed border-white/5 rounded-lg select-none">
                  Click 'Add Action Step' to build playbook sequence
                </div>
              )}
            </div>
          </div>

          {/* Right Live Preview & Dry Run Simulator */}
          <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col justify-between min-h-[450px]">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4 select-none">
                <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Eye size={14} /> Agent Execution Preview
                </h3>
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Telemetry Flow</span>
              </div>

              {/* Steps vertical visual display */}
              <div className="flex flex-col gap-4 relative pl-4 mt-2">
                {/* Vertical connecting line */}
                <div className="absolute left-[20px] top-3 bottom-3 w-0.5 bg-zinc-800" />

                {runbook.steps.map((st, i) => (
                  <div key={st.id} className="flex gap-4 relative">
                    {/* Circle marker */}
                    <div className="absolute -left-[5px] h-3.5 w-3.5 rounded-full border-2 border-zinc-800 bg-zinc-950 flex items-center justify-center text-[8px] font-bold text-zinc-500 font-mono">
                      {i + 1}
                    </div>
                    
                    <div className="bg-zinc-950/60 border border-white/[0.02] p-3 rounded-lg text-xs leading-normal flex-1">
                      <strong className="text-zinc-200 block">{st.name}</strong>
                      <span className="text-[9px] text-zinc-500 block capitalize mt-0.5 font-mono select-none">
                        Action Type: {st.type}
                      </span>
                      {Object.keys(st.params).length > 0 && (
                        <div className="mt-1.5 text-[9px] text-zinc-500 font-mono select-all bg-white/[0.01] p-1 rounded">
                          {JSON.stringify(st.params)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dry Run simulation control */}
            <div className="border-t border-white/5 pt-4 mt-6 flex flex-col gap-3 select-none">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 flex items-center gap-1">
                  <HelpCircle size={12} /> Dry Run tests logic without executing cloud resources
                </span>
                {dryRunSuccess && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check size={12} /> Success
                  </span>
                )}
              </div>
              
              <button
                onClick={handleDryRun}
                disabled={dryRunning}
                className="bg-white/5 hover:bg-white/10 text-white font-bold p-3 rounded-lg text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <Play size={12} fill="currentColor" className={dryRunning ? "animate-pulse" : ""} />
                {dryRunning ? "Synthesizing playbooks dry run..." : "Test Run (Dry Mode)"}
              </button>
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  );
}
