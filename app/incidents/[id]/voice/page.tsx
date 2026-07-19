"use client";

import React, { use, useState, useEffect, useRef } from "react";
import { 
  useStoreState, store, Incident, 
  IncidentEvent, Service 
} from "@/src/lib/store";
import { 
  Volume2, VolumeX, Mic, PhoneOff, 
  MessageSquare, HelpCircle, Send, Play, Sparkles, ArrowLeft, AlertTriangle 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type VoiceState = "idle" | "listening" | "speaking" | "executing";

type DialogueLine = {
  sender: "human" | "agent";
  text: string;
  timestamp: string;
};

export default function VoiceCommanderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = use(params);
  const router = useRouter();
  const { incidents, services, refresh } = useStoreState();

  const incident = incidents.find(i => i.id === incidentId);
  const service = incident ? services.find(s => s.id === incident.serviceId) : null;

  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [muted, setMuted] = useState(false);
  const [dialogue, setDialogue] = useState<DialogueLine[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome dialogue line
  useEffect(() => {
    if (!incident) return;
    
    setDialogue([
      {
        sender: "agent",
        text: `DeployPilotOS Voice Commander session opened. I am monitoring the ${service?.name || "infrastructure"} incident. Ready for your instructions.`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, [incidentId, service?.name]);

  // Scroll transcript to bottom
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dialogue]);

  if (!incident) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-zinc-400">
        <AlertTriangle className="text-red-400 mb-4" size={48} />
        <h2 className="text-xl font-bold text-white">Incident Not Found</h2>
        <Link href="/dashboard" className="text-cyan-400 hover:underline mt-4">
          Return to Dashboard
        </Link>
      </main>
    );
  }

  // Trigger agent speech simulation
  const triggerAgentSpeech = (text: string, responseTime = 1200) => {
    setVoiceState("executing");
    
    setTimeout(() => {
      setVoiceState("speaking");
      setDialogue(prev => [
        ...prev,
        {
          sender: "agent",
          text,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);

      // Speak text aloud using browser SpeechSynthesis if supported (wow factor!)
      if (typeof window !== "undefined" && window.speechSynthesis && !muted) {
        const utterance = new SpeechSynthesisUtterance(text);
        // Find a suitable english voice
        const voices = window.speechSynthesis.getVoices();
        const engVoice = voices.find(v => v.lang.startsWith("en")) || null;
        if (engVoice) utterance.voice = engVoice;
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }

      // Return to idle state after speech length estimate
      const duration = Math.max(2500, text.length * 55);
      setTimeout(() => {
        setVoiceState("idle");
      }, duration);
    }, responseTime);
  };

  // Simulate human command options
  const handleCommand = (cmdText: string, replyText: string) => {
    if (voiceState !== "idle") return;

    // Add human speech bubble
    setDialogue(prev => [
      ...prev,
      {
        sender: "human",
        text: cmdText,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    setVoiceState("listening");

    // Trigger simulation sequence
    triggerAgentSpeech(replyText);
  };

  const handleEndSession = () => {
    // Save transcript to incident
    const transcriptString = dialogue.map(d => `[${d.sender.toUpperCase()}] ${d.text}`).join("\n");
    const updatedIncidents = incidents.map(i => {
      if (i.id === incidentId) {
        return { ...i, voiceTranscript: transcriptString };
      }
      return i;
    });
    store.setIncidents(updatedIncidents);
    refresh();
    router.push(`/incidents/${incidentId}`);
  };

  // Waveform bars styling
  const waveformBars = Array.from({ length: 15 }, (_, i) => i);

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden flex flex-col justify-between p-6">
      
      {/* Background radar sweep circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/5 flex items-center justify-center pointer-events-none select-none">
        <div className="h-[450px] w-[450px] rounded-full border border-dashed border-white/5 flex items-center justify-center">
          <div className="h-[300px] w-[300px] rounded-full border border-white/5 flex items-center justify-center">
            {/* Animated sweep line */}
            <div className={`absolute h-[290px] w-0.5 bg-gradient-to-t from-cyan-500 to-transparent origin-bottom -translate-y-1/2 rotate-0 ${
              voiceState !== "idle" ? "animate-spin-slow" : ""
            }`} />
          </div>
        </div>
      </div>

      {/* Header controls */}
      <header className="relative z-10 w-full flex items-center justify-between border-b border-white/5 pb-4 select-none">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleEndSession}
            className="text-zinc-500 hover:text-zinc-300 transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
              P1 WAR ROOM CONNECTED
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wide">
              {service?.name} Outage session
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className={`p-2.5 rounded-lg border transition-all ${
              muted 
                ? "bg-red-500/10 border-red-500/30 text-red-400" 
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </header>

      {/* Center Avatar & Waveform */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center py-10 gap-8">
        
        {/* Pulsing Avatar Container */}
        <div className="relative h-44 w-44 rounded-full flex items-center justify-center select-none">
          
          {/* External pulse rings */}
          {voiceState === "listening" && (
            <>
              <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping opacity-75" />
              <div className="absolute inset-4 rounded-full border border-emerald-400/40 animate-pulse" />
            </>
          )}
          {voiceState === "speaking" && (
            <>
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
              <div className="absolute inset-4 rounded-full border border-cyan-400/40 animate-pulse" />
            </>
          )}

          {/* Core circular avatar */}
          <div className={`h-36 w-36 rounded-full border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 shadow-2xl ${
            voiceState === "listening"
              ? "bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-emerald-500/10"
              : voiceState === "speaking"
              ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-cyan-500/10"
              : voiceState === "executing"
              ? "bg-yellow-500/10 border-yellow-400 text-yellow-400 shadow-yellow-500/10 animate-pulse"
              : "bg-zinc-900 border-white/10 text-zinc-400"
          }`}>
            <Mic size={28} className={voiceState === "listening" ? "animate-pulse" : ""} />
            <span className="text-[9px] font-bold uppercase tracking-widest font-mono">
              {voiceState === "listening" 
                ? "Listening..." 
                : voiceState === "speaking" 
                ? "Speaking" 
                : voiceState === "executing"
                ? "Executing"
                : "DeployPilotOS"}
            </span>
          </div>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="h-10 flex items-center gap-1 w-64 justify-center select-none">
          {waveformBars.map(bar => {
            let heightClass = "h-1 bg-zinc-800";
            let animStyle = {};

            if (voiceState === "speaking") {
              const delay = Math.random() * 0.5;
              const duration = 0.5 + Math.random() * 0.5;
              heightClass = "bg-cyan-400 rounded-full w-1";
              animStyle = {
                animation: `waveformAnim ${duration}s ease-in-out infinite alternate`,
                animationDelay: `${delay}s`,
              };
            } else if (voiceState === "listening") {
              const delay = Math.random() * 0.5;
              heightClass = "bg-emerald-400 rounded-full w-1 h-3";
              animStyle = {
                animation: `pulse 1s infinite alternate`,
                animationDelay: `${delay}s`,
              };
            }

            return (
              <div 
                key={bar} 
                className={`transition-all duration-300 ${heightClass}`} 
                style={{ ...animStyle, width: "3px" }}
              />
            );
          })}
        </div>
      </section>

      {/* Live Transcript / Dialogue bubble area */}
      <section className="relative z-10 max-w-xl w-full mx-auto bg-zinc-900/60 border border-white/5 rounded-xl h-60 flex flex-col p-4 backdrop-blur-md mb-6 shadow-2xl">
        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 select-none border-b border-white/5 pb-2 flex items-center gap-1.5">
          <MessageSquare size={12} /> Timeline dialogue transcript
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {dialogue.map((line, idx) => {
            const isAgent = line.sender === "agent";
            return (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] ${
                  isAgent ? "self-start items-start" : "self-end items-end text-right"
                } animate-fade-in`}
              >
                <div className={`p-3 rounded-xl text-xs ${
                  isAgent 
                    ? "bg-zinc-950 border border-white/5 text-zinc-300" 
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 text-zinc-950 font-medium"
                }`}>
                  {line.text}
                </div>
                <span className="text-[8px] text-zinc-600 mt-1 select-none font-mono">
                  {isAgent ? "DeployPilotOS" : "You"} • {line.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={transcriptEndRef} />
        </div>
      </section>

      {/* Bottom Controls / Commands Simulation */}
      <footer className="relative z-10 max-w-xl w-full mx-auto flex flex-col gap-4 border-t border-white/5 pt-4 select-none">
        
        {/* Commands pills selector */}
        {voiceState === "idle" ? (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1 select-none">
              <HelpCircle size={12} /> SIMULATE YOUR VOICE COMMAND:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleCommand(
                  "What is the current incident status?",
                  `The current status is P1 Critical on api-service. Average response latency is 847ms, which is 20 times normal. I have checked logs and identified database pool limits as the root cause.`
                )}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2.5 text-[10px] font-bold text-left transition-all text-zinc-300 hover:text-white flex items-center justify-between"
              >
                <span>Ask status & data</span>
                <Send size={10} className="text-zinc-500" />
              </button>
              
              <button
                onClick={() => handleCommand(
                  "Run database config update and hot restart.",
                  `Understood. Increasing pool_size connection parameters to 30 and issuing a restart request to the connection-manager cluster. Executing runbook script now.`
                )}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2.5 text-[10px] font-bold text-left transition-all text-zinc-300 hover:text-white flex items-center justify-between"
              >
                <span>Order hot-restart</span>
                <Send size={10} className="text-zinc-500" />
              </button>
              
              <button
                onClick={() => handleCommand(
                  "Update Slack incidents channel with ETA.",
                  `Executing Slack notification trigger. I have successfully sent the incident progress summary card to the #incidents channel with recovery ETA.`
                )}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2.5 text-[10px] font-bold text-left transition-all text-zinc-300 hover:text-white flex items-center justify-between"
              >
                <span>Order Slack alert</span>
                <Send size={10} className="text-zinc-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950/40 p-4 border border-dashed border-white/5 text-center text-xs text-zinc-500 rounded-xl">
            Commander channel occupied by agent speech signals...
          </div>
        )}

        {/* End Call Button */}
        <div className="flex justify-center mt-2">
          <button
            onClick={handleEndSession}
            className="bg-red-500 hover:bg-red-600 text-zinc-950 font-bold px-6 py-2.5 rounded-full text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <PhoneOff size={14} /> End War Room Session
          </button>
        </div>
      </footer>
    </main>
  );
}
