"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStoreState } from "@/src/lib/store";
import { Search, Server, AlertTriangle, FileText, ChevronRight, X } from "lucide-react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { services, incidents, runbooks } = useStoreState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase();
  
  const filteredServices = services
    .filter(s => s.name.toLowerCase().includes(q))
    .map(s => ({ ...s, type: "service", icon: Server, url: `/services/${s.id}` }));
    
  const filteredIncidents = incidents
    .filter(i => i.title.toLowerCase().includes(q))
    .map(i => ({ ...i, type: "incident", icon: AlertTriangle, url: `/incidents/${i.id}` }));
    
  const filteredRunbooks = runbooks
    .filter(r => r.name.toLowerCase().includes(q))
    .map(r => ({ ...r, type: "runbook", icon: FileText, url: `/runbooks/${r.id}` }));

  const results = [...filteredServices, ...filteredIncidents, ...filteredRunbooks].slice(0, 10);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 bg-black/80 backdrop-blur-sm p-4">
      {/* Background click handler */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      
      <div 
        className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
      >
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-zinc-900/50">
          <Search size={18} className="text-zinc-500 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search services, incidents, or runbooks..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm"
          />
          <div className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5 font-mono ml-2">
            ESC
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {results.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item.url)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between w-full p-3 rounded-xl text-left transition-colors ${
                      isSelected 
                        ? "bg-cyan-500/10 border border-cyan-500/20 text-white" 
                        : "bg-transparent border border-transparent text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${
                        item.type === "incident" ? "bg-red-500/10 text-red-400" :
                        item.type === "service" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-zinc-800 text-zinc-300"
                      }`}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="text-sm font-bold truncate max-w-xs">
                          {"title" in item ? item.title : item.name}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider font-mono text-zinc-500">
                          {item.type}
                        </div>
                      </div>
                    </div>
                    {isSelected && <ChevronRight size={16} className="text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
