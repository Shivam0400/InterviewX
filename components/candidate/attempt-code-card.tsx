"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight, AlertCircle, Play, Sparkles, CheckCircle2 } from "lucide-react";

interface AttemptCodeCardProps {
  initialCode?: string;
}

export function AttemptCodeCard({ initialCode = "" }: AttemptCodeCardProps) {
  const router = useRouter();
  const [accessCode, setAccessCode] = React.useState(initialCode);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError("Please enter your interview invitation code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Lookup interview by access token
      const cleanToken = accessCode.trim().toUpperCase();
      const res = await fetch(`/api/v1/interviews?status=ALL`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to search interviews");
      }

      const match = data.interviews?.find(
        (i: any) => i.inviteToken?.toUpperCase() === cleanToken
      );

      if (!match) {
        throw new Error(`No active interview found matching code "${cleanToken}". Please check the code or contact your interviewer.`);
      }

      // Found interview, redirect to workspace
      router.push(`/interviews/${match.id}/workspace`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to verify invitation code.");
    } finally {
      setLoading(false);
    }
  };

  const sampleCodes = [
    { code: "IVX-BLR-8492-RM", label: "Rohan's Live Session (LRU Cache)" },
    { code: "IVX-PUN-3921-SP", label: "Sneha's Completed Evaluation" },
  ];

  return (
    <div id="attempt" className="p-6 rounded-2xl bg-card border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/5 space-y-5 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Attempt Live Interview
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Enter Interview Invitation Access Code
          </h2>
          <p className="text-xs text-muted-foreground">
            Your interviewer provided a secure access code (e.g. <code className="text-foreground font-mono">IVX-BLR-8492-RM</code>) to launch your isolated assessment session.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
          <input
            type="text"
            required
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="e.g. IVX-BLR-8492-RM"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-500/25 transition-all disabled:opacity-50 shrink-0"
        >
          {loading ? (
            "Connecting..."
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Assessment Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Fast 1-Click Code Pills for Candidates */}
      <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-mono text-muted-foreground">Quick Demo Codes:</span>
        {sampleCodes.map((s) => (
          <button
            key={s.code}
            type="button"
            onClick={() => setAccessCode(s.code)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted border border-border/70 text-[11px] font-mono text-foreground transition-colors group"
          >
            <span className="font-semibold text-emerald-400">{s.code}</span>
            <span className="text-muted-foreground text-[10px] hidden sm:inline">({s.label})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
