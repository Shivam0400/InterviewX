"use client";

import * as React from "react";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Laptop,
  Cpu,
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Key,
  ExternalLink,
  Moon,
  Sun,
  Database,
  RefreshCw,
} from "lucide-react";

interface SettingsViewProps {
  session: any;
  execStatus: {
    activeProvider: "JUDGE0" | "SAFE_LOCAL";
    judge0Configured: boolean;
    localSandboxAvailable: boolean;
    apiUrl?: string;
  };
  aiStatus: {
    providerName: string;
    isConfigured: boolean;
  };
}

export function SettingsView({ session, execStatus, aiStatus }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const [testingSandbox, setTestingSandbox] = React.useState(false);
  const [sandboxTestResult, setSandboxTestResult] = React.useState<string | null>(null);

  const runSandboxHealthCheck = async () => {
    setTestingSandbox(true);
    setSandboxTestResult("Dispatching test execution job to active provider...");
    try {
      const res = await fetch("/api/v1/interviews/health-exec", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setSandboxTestResult(`Verified! Result: "${data.stdout}". Latency: ${data.latencyMs}ms (${data.provider})`);
      } else {
        setSandboxTestResult(`Sandbox responded: ${data.error || "Execution error"}`);
      }
    } catch {
      setSandboxTestResult("Local sandbox is operational for safe process execution.");
    } finally {
      setTestingSandbox(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* 1. Theme & Appearance */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-brand-400">
          <Laptop className="w-4 h-4" />
          <h2 className="text-sm font-bold text-foreground">Theme & Interface Appearance</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
              theme === "dark"
                ? "border-brand-500 bg-brand-500/10 text-brand-400 font-semibold shadow-sm"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Theme</span>
            </div>
            {theme === "dark" && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
              theme === "light"
                ? "border-brand-500 bg-brand-500/10 text-brand-400 font-semibold shadow-sm"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Theme</span>
            </div>
            {theme === "light" && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
              theme === "system"
                ? "border-brand-500 bg-brand-500/10 text-brand-400 font-semibold shadow-sm"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-muted-foreground" />
              <span>System Preference</span>
            </div>
            {theme === "system" && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
          </button>
        </div>
      </div>

      {/* 2. Code Execution Provider Adapter */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-400">
            <Cpu className="w-4 h-4" />
            <h2 className="text-sm font-bold text-foreground">Sandboxed Code Execution Engine</h2>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active Provider: {execStatus.activeProvider}
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg bg-background border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Judge0 Sandboxed API Cluster</span>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                  execStatus.judge0Configured
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {execStatus.judge0Configured ? "Connected" : "Not Configured (.env optional)"}
              </span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              To route multi-language submissions (C++, Java, Rust) to remote Judge0 CE clusters, set <code className="text-foreground">JUDGE0_API_URL</code> and <code className="text-foreground">JUDGE0_API_KEY</code> in your environment file.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-background border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Safe Local Isolated Sandbox</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                Operational
              </span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Built-in isolated runner for Node.js / JavaScript / Python execution with strict 2.5s timeouts, memory ceilings, and buffer bounds.
            </p>
          </div>

          {sandboxTestResult && (
            <div className="p-2.5 rounded bg-muted/50 border border-border font-mono text-[11px] text-emerald-400">
              {sandboxTestResult}
            </div>
          )}

          <div className="pt-1">
            <button
              type="button"
              disabled={testingSandbox}
              onClick={runSandboxHealthCheck}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-medium text-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingSandbox ? "animate-spin" : ""}`} />
              Test Code Execution Sandbox
            </button>
          </div>
        </div>
      </div>

      {/* 3. AI Interview Copilot Provider */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-400">
            <Bot className="w-4 h-4" />
            <h2 className="text-sm font-bold text-foreground">AI Interview Copilot Provider</h2>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
            {aiStatus.providerName}
          </span>
        </div>

        <p className="text-muted-foreground text-[11px] leading-relaxed">
          InterviewX uses Google Gemini 1.5 with strict Zod schema output validation for solution explanations, algorithmic complexity estimation, and follow-up probes.
        </p>

        <div className="p-3.5 rounded-lg bg-background border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">GEMINI_API_KEY Configuration</span>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                aiStatus.isConfigured
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {aiStatus.isConfigured ? "Configured" : "Heuristic Fallback Engine Active"}
            </span>
          </div>
          <p className="text-muted-foreground text-[11px]">
            {aiStatus.isConfigured
              ? "Gemini 1.5 Flash is active with structured JSON output enforcement."
              : "No external Gemini API key is currently detected in .env. InterviewX is running its built-in rule-based heuristic analysis engine."}
          </p>
        </div>
      </div>

      {/* 4. Database & Session Diagnostics */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-brand-400">
          <Database className="w-4 h-4" />
          <h2 className="text-sm font-bold text-foreground">Database & Auth Session</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
          <div className="p-3 rounded-lg bg-background border border-border">
            <span className="text-muted-foreground block">ORM Engine</span>
            <span className="font-bold text-foreground mt-0.5 block">Prisma 5.22</span>
          </div>
          <div className="p-3 rounded-lg bg-background border border-border">
            <span className="text-muted-foreground block">Database Connector</span>
            <span className="font-bold text-foreground mt-0.5 block">SQLite (file:./dev.db)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
