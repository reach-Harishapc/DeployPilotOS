"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { store, useStoreState, OrgSettings } from "@/src/lib/store";
import { 
  Sliders, Settings, ShieldAlert, Sparkles, 
  Slack, Github, Key, Check, Info, Lock, Download, Upload
} from "lucide-react";

export default function SettingsPage() {
  const { settings, refresh } = useStoreState();
  const [localSettings, setLocalSettings] = useState<OrgSettings | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings && !localSettings) {
      setLocalSettings(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings, localSettings]);

  if (!localSettings) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.setSettings(localSettings);
    refresh();
    
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AppShell>
      <form onSubmit={handleSave} className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mb-1 select-none">
              Workspace Administration
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in select-none">
                <Check size={14} /> Saved Settings
              </span>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.05)]"
            >
              Save Configuration
            </button>
          </div>
        </div>

        {/* Settings categories */}
        <div className="flex flex-col gap-6">
          
          {/* General Workspace Settings */}
          <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2 flex items-center gap-1.5 select-none">
              <Sliders size={16} className="text-blue-400" /> General Workspace
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Organization Name</label>
                <input 
                  type="text" 
                  value={localSettings.name}
                  onChange={e => setLocalSettings({ ...localSettings, name: e.target.value })}
                  className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Local Timezone</label>
                <select
                  value={localSettings.timezone}
                  onChange={e => setLocalSettings({ ...localSettings, timezone: e.target.value })}
                  className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-xs text-white cursor-pointer focus:outline-none focus:border-cyan-400"
                >
                  <option value="UTC -08:00">UTC -08:00 (Pacific Time)</option>
                  <option value="UTC -05:00">UTC -05:00 (Eastern Time)</option>
                  <option value="UTC +00:00">UTC +00:00 (GMT)</option>
                  <option value="UTC +05:30">UTC +05:30 (India Standard Time)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Decision Autonomy */}
          <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Sparkles size={16} className="text-cyan-400" /> AI Autonomy Gating Policy
              </h3>
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Safety Guardrails</span>
            </div>

            {/* Radio pills autonomy */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-400 font-medium">Mitigation Execution Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "ask", title: "Manual Approval", desc: "Ask before every script action" },
                  { id: "notify", title: "Notify & Act", desc: "Wait 30s before executing" },
                  { id: "full", title: "Fully Autonomous", desc: "Perform resolutions in seconds" }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLocalSettings({ ...localSettings, autonomy: opt.id as any })}
                    className={`py-3 px-3 rounded-lg text-xs font-semibold border text-left flex flex-col gap-1 transition-all ${
                      localSettings.autonomy === opt.id
                        ? "bg-cyan-500/10 border-cyan-500/35 text-white"
                        : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span>{opt.title}</span>
                    <span className="text-[9px] font-normal text-zinc-500 leading-none">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Confidence */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-400 font-medium">Automatic Rollback Confidence Threshold</label>
                <span className="text-cyan-400 font-mono font-bold">
                  {Math.round(localSettings.rollbackConfidence * 100)}% Confidence
                </span>
              </div>
              <input 
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={localSettings.rollbackConfidence}
                onChange={e => setLocalSettings({ ...localSettings, rollbackConfidence: Number(e.target.value) })}
                className="w-full accent-cyan-400 h-1 bg-zinc-950 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 flex items-center gap-1 select-none">
                <Info size={10} /> Rollback requests will execute without approval only if GPT diagnosis confidence score exceeds threshold.
              </span>
            </div>
          </div>

          {/* LLM Model & Reasoning Engine */}
          <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Settings size={16} className="text-purple-400" /> LLM Reasoning Engine
              </h3>
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Core Intelligence</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Model Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400 font-medium">Primary Diagnosis Model</label>
                <select
                  value={localSettings.aiModel || "gpt-5.6-sol"}
                  onChange={e => setLocalSettings({ ...localSettings, aiModel: e.target.value })}
                  className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-xs text-white cursor-pointer focus:outline-none focus:border-cyan-400"
                >
                  <optgroup label="Frontier Models">
                    <option value="gpt-5.6-sol">GPT-5.6 Sol (Recommended)</option>
                    <option value="gpt-5.6-terra">GPT-5.6 Terra (Balanced)</option>
                    <option value="gpt-5.6-luna">GPT-5.6 Luna (Cost-sensitive)</option>
                    <option value="gpt-5.5-pro">GPT-5.5 Pro</option>
                    <option value="gpt-5.4-mini">GPT-5.4 mini (Agentic Coding)</option>
                    <option value="gpt-5.4-nano">GPT-5.4 nano</option>
                  </optgroup>
                  <optgroup label="Reasoning Models">
                    <option value="o3-pro">o3-pro (Deep Compute)</option>
                    <option value="o3">o3 (Complex Tasks)</option>
                  </optgroup>
                </select>
                <span className="text-[9px] text-zinc-500 leading-relaxed">Model used for deep root-cause analysis and log ingestion.</span>
              </div>

              {/* Temperature Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-zinc-400 font-medium">Agent Creativity (Temperature)</label>
                  <span className="text-purple-400 font-mono font-bold">
                    {localSettings.aiTemperature || 0.2}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={localSettings.aiTemperature || 0.2}
                  onChange={e => setLocalSettings({ ...localSettings, aiTemperature: Number(e.target.value) })}
                  className="w-full accent-purple-400 h-1 mt-2 bg-zinc-950 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] text-zinc-500 mt-1">Lower values (0.2) force strict, deterministic debugging.</span>
              </div>
            </div>

            {/* System Prompt Override */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs text-zinc-400 font-medium">Custom System Prompt Override</label>
              <textarea 
                rows={3}
                value={localSettings.systemPrompt || ""}
                onChange={e => setLocalSettings({ ...localSettings, systemPrompt: e.target.value })}
                placeholder="You are an elite SRE Agent..."
                className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-[11px] text-white focus:outline-none focus:border-cyan-400 transition-colors w-full font-mono leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Third Party Integrations */}
          <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2 flex items-center gap-1.5 select-none">
              <Slack size={16} className="text-emerald-400" /> Notifications & Platform integrations
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium flex items-center gap-1 select-none">
                  <Slack size={14} className="text-zinc-500" /> Slack Default Incoming Webhook URL
                </label>
                <input 
                  type="text" 
                  value={localSettings.slackWebhook || ""}
                  onChange={e => setLocalSettings({ ...localSettings, slackWebhook: e.target.value })}
                  placeholder="https://hooks.slack.com/services/YOUR_WORKSPACE/YOUR_CHANNEL/YOUR_TOKEN"
                  className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-medium flex items-center gap-1 select-none">
                    <Key size={14} className="text-zinc-500" /> Vercel Deploy API Token
                  </label>
                  <input 
                    type="password" 
                    value={localSettings.vercelToken || ""}
                    onChange={e => setLocalSettings({ ...localSettings, vercelToken: e.target.value })}
                    placeholder="••••••••••••••••••••••••••••••••"
                    className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-medium flex items-center gap-1 select-none">
                    <Github size={14} className="text-zinc-500" /> GitHub Commit Access Key
                  </label>
                  <input 
                    type="password" 
                    value={localSettings.githubToken || ""}
                    onChange={e => setLocalSettings({ ...localSettings, githubToken: e.target.value })}
                    placeholder="••••••••••••••••••••••••••••••••"
                    className="bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Secure Webhook keys */}
          <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2 flex items-center gap-1.5 select-none">
              <Lock size={16} className="text-red-400" /> Security & Ingestion keys
            </h3>
            
            <div className="bg-zinc-950 p-4 rounded-xl border border-white/[0.02] flex items-center justify-between text-xs">
              <div>
                <strong className="text-zinc-300 block mb-1">Global Log Token ID</strong>
                <code className="text-[10px] text-zinc-500 font-mono select-all">tok_d3b5c82a17f694e803a6bc</code>
              </div>
              <button
                type="button"
                className="bg-white/5 hover:bg-white/10 text-white font-semibold px-3 py-1.5 rounded border border-white/10 transition-all text-[10px]"
              >
                Rotate Token
              </button>
            </div>
          </div>

        </div>

        {/* Data Management Export / Import */}
        <div className="border border-white/5 bg-zinc-900/20 p-5 rounded-xl flex flex-col gap-4 mt-6">
          <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-2 flex items-center gap-1.5 select-none">
            <Download size={16} className="text-cyan-400" /> Data Management
          </h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="button"
              onClick={() => {
                const data = localStorage.getItem("deploypilot_store");
                if (!data) return;
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `deploypilot-backup.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-lg border border-white/10 transition-all text-xs flex items-center gap-2"
            >
              <Download size={14} /> Export Configuration
            </button>
            
            <label className="bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-lg border border-white/10 transition-all text-xs flex items-center gap-2 cursor-pointer">
              <Upload size={14} /> Import Configuration
              <input 
                type="file" 
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const text = e.target?.result as string;
                    if (text) {
                      try {
                        JSON.parse(text); // validate
                        localStorage.setItem("deploypilot_store", text);
                        window.location.reload();
                      } catch(err) {
                        alert("Invalid configuration file");
                      }
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Export your local simulated data including services, incidents, and runbooks.</p>
        </div>
      </form>
    </AppShell>
  );
}
