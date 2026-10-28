import Link from "next/link";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import {
  CalendarDays,
  Code2,
  CheckCircle2,
  Cpu,
  Clock,
  ArrowRight,
  PlusCircle,
  Play,
  FileText,
  User,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  // Load real records from the database
  const [interviews, questionsCount, submissions, reports] = await Promise.all([
    prisma.interview.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        questions: {
          include: { question: true },
        },
      },
    }),
    prisma.question.count(),
    prisma.submission.findMany({
      orderBy: { submittedAt: "desc" },
      take: 5,
      include: {
        question: true,
        candidate: true,
        interview: true,
      },
    }),
    prisma.assessmentReport.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        interview: true,
      },
    }),
  ]);

  const activeInterviews = interviews.filter(
    (i) => i.status === "IN_PROGRESS" || i.status === "SCHEDULED" || i.status === "READY"
  );

  const completedInterviews = interviews.filter((i) => i.status === "COMPLETED");

  const averageScore =
    reports.length > 0
      ? Math.round(reports.reduce((acc, r) => acc + r.percentageScore, 0) / reports.length)
      : 100;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Assessment Operations Hub
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Welcome back, <strong className="text-foreground">{session?.name || "Shivam Sony"}</strong>. Live technical interview sessions and evidence logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/questions/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-brand-500" />
            Add Problem
          </Link>
          <Link
            href="/interviews/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm shadow-brand-500/25 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Schedule Interview
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active / Ready Sessions</span>
            <CalendarDays className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{activeInterviews.length}</div>
          <div className="text-[11px] text-muted-foreground">
            {completedInterviews.length} sessions completed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Questions in Library</span>
            <Code2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{questionsCount}</div>
          <div className="text-[11px] text-muted-foreground">
            Algorithms, Data Structures & SQL
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Average Test Score</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{averageScore}%</div>
          <div className="text-[11px] text-muted-foreground">Deterministic test verification</div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Execution Engine</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base font-bold font-mono text-cyan-400 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Judge0 / Safe Sandbox
          </div>
          <div className="text-[11px] text-muted-foreground">
            2500ms timeout • 128MB RAM
          </div>
        </div>
      </div>

      {/* Main Grid: Active Interviews + Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Scheduled & Live Interviews */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-brand-500" />
              Interview Sessions
            </h2>
            <Link
              href="/interviews"
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {interviews.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-card border border-dashed border-border text-muted-foreground text-xs">
                No interviews scheduled yet. Click "Schedule Interview" to create one.
              </div>
            ) : (
              interviews.map((iv) => {
                const isLive = iv.status === "IN_PROGRESS";
                const isCompleted = iv.status === "COMPLETED";

                return (
                  <div
                    key={iv.id}
                    className="p-4 rounded-xl bg-card border border-border/80 hover:border-brand-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                            isLive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : isCompleted
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isLive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1 animate-pulse"></span>
                          )}
                          {iv.status.replace("_", " ")}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {iv.durationMinutes} mins • {iv.questions.length} problems
                        </span>
                      </div>

                      <h3 className="font-semibold text-foreground text-sm leading-snug">
                        {iv.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-brand-500" />
                          {iv.candidateName} ({iv.candidateEmail})
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">{formatDate(iv.scheduledAt || iv.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/interviews/${iv.id}`}
                        className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors"
                      >
                        Details
                      </Link>

                      {isCompleted ? (
                        <Link
                          href={`/reports/${iv.id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Report
                        </Link>
                      ) : (
                        <Link
                          href={`/interviews/${iv.id}/workspace`}
                          className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Launch Workspace
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Recent Submissions & Developer Badge */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Submissions Feed */}
          <div className="p-4 rounded-xl bg-card border border-border/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Recent Submissions
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground">Deterministic</span>
            </div>

            <div className="space-y-3 text-xs">
              {submissions.length === 0 ? (
                <p className="text-muted-foreground text-xs py-2">No candidate submissions recorded yet.</p>
              ) : (
                submissions.map((sub) => (
                  <div key={sub.id} className="p-2.5 rounded-lg bg-background border border-border/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground truncate max-w-[150px]">
                        {sub.question.title}
                      </span>
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                        {sub.deterministicScore} / {sub.maxScore} pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{sub.language.toUpperCase()} • {sub.executionTimeMs ? `${sub.executionTimeMs}ms` : "Instant"}</span>
                      <span>{formatDate(sub.submittedAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* About Developer Callout Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-brand-950/30 to-indigo-950/30 border border-brand-500/20 space-y-3">
            <div className="flex items-center gap-2 text-brand-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                Architect & Engineer
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              InterviewX is designed and built by <strong>Shivam Sony</strong> (B.Tech CS & Data Science, GEC Jamui) as a production-grade live technical assessment system.
            </p>
            <div className="pt-1">
              <Link
                href="/about-developer"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                Read Shivam's Full Developer Profile <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
