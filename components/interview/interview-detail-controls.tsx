"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Play, Square, AlertOctagon } from "lucide-react";

interface InterviewDetailControlsProps {
  interviewId: string;
  inviteUrl: string;
  inviteToken: string;
  status: string;
}

export function InterviewDetailControls({
  interviewId,
  inviteUrl,
  inviteToken,
  status: initialStatus,
}: InterviewDetailControlsProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const [status, setStatus] = React.useState(initialStatus);
  const [updating, setUpdating] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/interviews/${interviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Invite URL Input and Copy */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={inviteUrl}
          className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono select-all focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy URL
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
        <span>Token Hash: <code className="text-foreground">{inviteToken}</code></span>
        <span>Valid for assigned candidate</span>
      </div>

      {/* State Transitions */}
      <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium mr-1">Session Controls:</span>

        {status !== "IN_PROGRESS" && status !== "COMPLETED" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => updateStatus("IN_PROGRESS")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-white" />
            Mark In Progress
          </button>
        )}

        {status === "IN_PROGRESS" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => updateStatus("COMPLETED")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Square className="w-3 h-3 fill-white" />
            Complete Interview
          </button>
        )}

        {status !== "CANCELLED" && status !== "COMPLETED" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => updateStatus("CANCELLED")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground text-xs font-medium transition-colors disabled:opacity-50"
          >
            <AlertOctagon className="w-3 h-3" />
            Cancel Session
          </button>
        )}
      </div>
    </div>
  );
}
