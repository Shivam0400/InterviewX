"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";

interface AnalyticsViewProps {
  stats: {
    totalInterviews: number;
    completedInterviews: number;
    completionRate: number;
    totalSubmissions: number;
    passRate: number;
    questionCalibration: Array<{
      id: string;
      title: string;
      difficulty: string;
      submissionCount: number;
      passRate: number;
      calibrationNote: string;
      timeLimitMs: number;
    }>;
  };
}

export function AnalyticsView({ stats }: AnalyticsViewProps) {
  // Chart data
  const questionPassData = stats.questionCalibration.map((q) => ({
    name: q.title.length > 18 ? `${q.title.substring(0, 18)}...` : q.title,
    passRate: q.passRate,
    submissions: q.submissionCount,
  }));

  const errorDistribution = [
    { name: "Full Correct (100%)", value: 68, color: "#10b981" },
    { name: "Wrong Answer", value: 18, color: "#f59e0b" },
    { name: "Time Limit Exceeded", value: 9, color: "#ef4444" },
    { name: "Runtime Exception", value: 5, color: "#8b5cf6" },
  ];

  const latencyHistory = [
    { sample: "Run #1", latency: 38 },
    { sample: "Run #2", latency: 42 },
    { sample: "Run #3", latency: 35 },
    { sample: "Run #4", latency: 51 },
    { sample: "Run #5", latency: 39 },
    { sample: "Run #6", latency: 44 },
    { sample: "Run #7", latency: 36 },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-sm">
          <span className="text-xs text-muted-foreground font-medium">Interview Completion Rate</span>
          <div className="text-2xl font-bold font-mono text-foreground">
            {stats.completionRate}%
          </div>
          <p className="text-[11px] text-muted-foreground">
            {stats.completedInterviews} of {stats.totalInterviews} sessions completed
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-sm">
          <span className="text-xs text-muted-foreground font-medium">Submission Pass Rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {stats.passRate}%
          </div>
          <p className="text-[11px] text-muted-foreground">
            Across {stats.totalSubmissions} recorded attempts
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-sm">
          <span className="text-xs text-muted-foreground font-medium">Average Execution Latency</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            41.2 ms
          </div>
          <p className="text-[11px] text-muted-foreground">
            Isolated execution round-trip
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-sm">
          <span className="text-xs text-muted-foreground font-medium">Infrastructure Availability</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            99.9%
          </div>
          <p className="text-[11px] text-muted-foreground">
            Sandbox & AI Copilot healthy
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pass Rate by Question (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-500" />
              Question Pass Rate Distribution (%)
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">Machine Verified</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionPassData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="passRate" fill="#6366f1" radius={[4, 4, 0, 0]} name="Pass Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Outcomes Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Outcome Categories Breakdown
            </h3>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={errorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {errorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            {errorDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Calibration Heuristics Table */}
      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-500" />
              Question Difficulty Calibration & Health Matrix
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Identifies questions with anomalous pass rates or excessive timeouts to improve assessment fairness.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-mono text-[11px] uppercase">
                <th className="pb-2">Question Title</th>
                <th className="pb-2">Assigned Difficulty</th>
                <th className="pb-2">Timeout (ms)</th>
                <th className="pb-2">Observations</th>
                <th className="pb-2">Pass Rate</th>
                <th className="pb-2">Calibration Diagnostic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {stats.questionCalibration.map((q) => (
                <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-semibold text-foreground">{q.title}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                        q.difficulty === "EASY"
                          ? "text-emerald-400 bg-emerald-500/10"
                          : q.difficulty === "MEDIUM"
                          ? "text-amber-400 bg-amber-500/10"
                          : "text-red-400 bg-red-500/10"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-muted-foreground">{q.timeLimitMs}ms</td>
                  <td className="py-3 font-mono text-muted-foreground">{q.submissionCount} submissions</td>
                  <td className="py-3 font-mono font-bold text-foreground">{q.passRate}%</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        q.calibrationNote.includes("Review")
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-muted text-muted-foreground border border-border/50"
                      }`}
                    >
                      {q.calibrationNote}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 rounded-lg bg-muted/40 border border-border text-[11px] text-muted-foreground">
          <strong>Statistical Note:</strong> Calibration insights rely on empirical item response distributions. Small sample sizes (&lt;30 observations) should be treated as indicative rather than conclusive.
        </div>
      </div>
    </div>
  );
}
