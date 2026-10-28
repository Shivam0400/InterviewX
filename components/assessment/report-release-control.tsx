"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Share2, Lock } from "lucide-react";

interface ReportReleaseControlProps {
  reportId: string;
  initialStatus: string;
}

export function ReportReleaseControl({ reportId, initialStatus }: ReportReleaseControlProps) {
  const router = useRouter();
  const [status, setStatus] = React.useState(initialStatus);
  const [loading, setLoading] = React.useState(false);

  const releaseReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/reports/${reportId}/release`, {
        method: "POST",
      });
      if (res.ok) {
        setStatus("RELEASED");
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {status === "RELEASED" ? (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Check className="w-3.5 h-3.5" />
          Released to Candidate
        </span>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={releaseReport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
        >
          <Share2 className="w-3.5 h-3.5" />
          {loading ? "Releasing..." : "Release Report to Candidate"}
        </button>
      )}
    </div>
  );
}
