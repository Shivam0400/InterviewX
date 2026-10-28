"use client";

import * as React from "react";
import { Play, CheckCircle2, Bot, BarChart3, ShieldCheck, Terminal, ArrowRight, Sparkles } from "lucide-react";

export function InteractivePreview() {
  const [activeTab, setActiveTab] = React.useState<"workspace" | "tests" | "ai" | "analytics">("workspace");
  const [selectedLanguage, setSelectedLanguage] = React.useState("javascript");

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl border border-border/80 bg-card/90 shadow-2xl shadow-brand-500/10 overflow-hidden backdrop-blur">
      {/* Top Tab Bar / Window Chrome */}
      <div className="flex flex-wrap items-center justify-between border-b border-border px-4 py-2.5 bg-muted/40 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-2 hidden sm:inline">
            interviewx-session // ivx-live-demo-2026
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded-lg border border-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("workspace")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              activeTab === "workspace"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live Workspace
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              activeTab === "tests"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Deterministic Tests
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              activeTab === "ai"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            AI Copilot
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              activeTab === "analytics"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 bg-background/50">
        {activeTab === "workspace" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-sm font-mono">
            {/* Left: Problem Statement */}
            <div className="lg:col-span-4 p-4 rounded-lg bg-card border border-border/80 space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                  Medium
                </span>
                <span className="text-xs text-muted-foreground font-mono">Time Limit: 2.0s</span>
              </div>
              <h3 className="font-bold text-base text-foreground font-sans">LRU Cache Implementation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) average time complexity for both <code className="bg-muted px-1 rounded">get</code> and <code className="bg-muted px-1 rounded">put</code> operations.
              </p>
              <div className="p-2.5 rounded bg-muted/50 border border-border/50 text-[11px] font-mono space-y-1">
                <p className="text-foreground font-semibold">Example:</p>
                <p className="text-muted-foreground">LRUCache cache = new LRUCache(2);</p>
                <p className="text-muted-foreground">cache.put(1, 1); cache.put(2, 2);</p>
                <p className="text-emerald-500">cache.get(1); // returns 1</p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Interviewer: Aditya Verma</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Connected
                </span>
              </div>
            </div>

            {/* Right: Monaco Editor Simulation */}
            <div className="lg:col-span-8 rounded-lg bg-[#1e1e1e] border border-border text-slate-200 overflow-hidden flex flex-col font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#333]">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-semibold">solution.js</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Autosaved</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Language: JavaScript (Node.js 20)</span>
                  <button type="button" className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium transition-colors">
                    <Play className="w-3 h-3 fill-white" /> Run Tests
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-1 overflow-x-auto leading-relaxed select-none">
                <div className="flex gap-4"><span className="text-slate-600 select-none">1</span><span className="text-purple-400">class</span> <span className="text-amber-300">LRUCache</span> &#123;</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">2</span>  <span className="text-blue-400">constructor</span>(capacity) &#123;</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">3</span>    <span className="text-cyan-300">this</span>.capacity = capacity;</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">4</span>    <span className="text-cyan-300">this</span>.cache = <span className="text-purple-400">new</span> <span className="text-emerald-400">Map</span>();</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">5</span>  &#125;</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">6</span></div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">7</span>  <span className="text-blue-400">get</span>(key) &#123;</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">8</span>    <span className="text-purple-400">if</span> (!<span className="text-cyan-300">this</span>.cache.has(key)) <span className="text-purple-400">return</span> -<span className="text-emerald-300">1</span>;</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">9</span>    <span className="text-purple-400">const</span> val = <span className="text-cyan-300">this</span>.cache.get(key);</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">10</span>    <span className="text-cyan-300">this</span>.cache.delete(key);</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">11</span>    <span className="text-cyan-300">this</span>.cache.set(key, val); <span className="text-slate-500">// Mark recently used</span></div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">12</span>    <span className="text-purple-400">return</span> val;</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">13</span>  &#125;</div>
                <div className="flex gap-4"><span className="text-slate-600 select-none">14</span>&#125;</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tests" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Deterministic Verification Passed</h4>
                  <p className="text-xs text-muted-foreground">3 of 3 Test Suites Passed (100% Score) • Total execution time: 38ms</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-500 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                100 / 100 PTS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-card border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Test Case #1 (Public)</span>
                  <span className="text-emerald-500 font-bold">Passed</span>
                </div>
                <p className="text-muted-foreground font-mono text-[11px]">Standard Eviction Sequence</p>
                <div className="text-[10px] text-muted-foreground flex justify-between pt-1 border-t border-border">
                  <span>Latency: 12ms</span>
                  <span>Points: 20/20</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-card border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Test Case #2 (Hidden)</span>
                  <span className="text-emerald-500 font-bold">Passed</span>
                </div>
                <p className="text-muted-foreground font-mono text-[11px]">Single-Capacity Boundary</p>
                <div className="text-[10px] text-muted-foreground flex justify-between pt-1 border-t border-border">
                  <span>Latency: 14ms</span>
                  <span>Points: 30/30</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-card border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Test Case #3 (Hidden)</span>
                  <span className="text-emerald-500 font-bold">Passed</span>
                </div>
                <p className="text-muted-foreground font-mono text-[11px]">Duplicate Key Overwrite</p>
                <div className="text-[10px] text-muted-foreground flex justify-between pt-1 border-t border-border">
                  <span>Latency: 12ms</span>
                  <span>Points: 50/50</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-3 font-sans text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
              <span>
                <strong>Advisory AI Analysis:</strong> Generated via structured schema validation. For interviewer reference only; consequential decisions require human review.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-card border border-border space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-brand-500" /> Algorithmic Complexity & Architecture
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Candidate utilized the JavaScript <code className="text-foreground font-mono">Map</code> data structure which maintains key insertion order.
                </p>
                <div className="flex items-center gap-3 font-mono text-[11px] pt-1">
                  <span className="text-emerald-500 font-bold">Time: O(1) avg</span>
                  <span className="text-indigo-400 font-bold">Space: O(Capacity)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-card border border-border space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> Suggested Follow-up Probes
                </h4>
                <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                  <li>How would you implement this in C++ without built-in ordered hash tables?</li>
                  <li>What concurrency hazards arise in a multi-threaded web server?</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-lg bg-card border border-border">
              <div className="text-xl sm:text-2xl font-bold font-mono text-brand-500">92.4%</div>
              <div className="text-[11px] text-muted-foreground mt-1">Completion Rate</div>
            </div>
            <div className="p-3.5 rounded-lg bg-card border border-border">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500">41ms</div>
              <div className="text-[11px] text-muted-foreground mt-1">Avg Execution Latency</div>
            </div>
            <div className="p-3.5 rounded-lg bg-card border border-border">
              <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-400">100%</div>
              <div className="text-[11px] text-muted-foreground mt-1">Hidden Tests Kept Private</div>
            </div>
            <div className="p-3.5 rounded-lg bg-card border border-border">
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-500">14.2 min</div>
              <div className="text-[11px] text-muted-foreground mt-1">Time to 1st Submission</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t border-border px-4 py-2 bg-muted/20 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Judge0 Sandbox Adapter: Active
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Memory Limit: 128 MB</span>
        </div>
        <div>
          <span>Demonstration Preview — Click tabs above to inspect</span>
        </div>
      </div>
    </div>
  );
}
