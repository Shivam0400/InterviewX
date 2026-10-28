import Link from "next/link";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import { AttemptCodeCard } from "@/components/candidate/attempt-code-card";
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
  ShieldCheck,
  BookOpen,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getCurrentSession();
  const role = session?.role || "INTERVIEWER";
  const isCandidate = role === "CANDIDATE";
  const isAdmin = role === "ADMIN";

  // ----------------------------------------------------
  // CANDIDATE PORTAL VIEW
  // ----------------------------------------------------
  if (isCandidate) {
    const [candidateInterviews, practiceQuestions] = await Promise.all([
      prisma.interview.findMany({
        where: {
          OR: [
            { candidateEmail: session?.email || "" },
            { status: { in: ["SCHEDULED", "IN_PROGRESS", "READY", "COMPLETED"] } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          questions: {
            include: { question: true },
          },
          interviewer: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.question.findMany({
        where: { visibility: "PUBLIC" },
        take: 6,
        orderBy: { difficulty: "asc" },
      }),
    ]);

    return (
      <div className="space-y-8">
        {/* Candidate Welcome Banner */}
        <div className="pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Candidate Assessment & Practice Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome, {session?.name || "Candidate"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Attempt your live scheduled technical interview or prepare with mock algorithmic challenges in the sandbox.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Explore Mock Practice</span>
            </Link>
          </div>
        </div>

        {/* Section 1: Attempt Live Interview (Access Code Entry) */}
        <AttemptCodeCard initialCode="" />

        {/* Section 2: Assigned Technical Interviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              <span>Your Assigned Technical Interviews</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {candidateInterviews.length} Scheduled Session(s)
            </span>
          </div>

          {candidateInterviews.length === 0 ? (
            <div className="p-8 rounded-xl bg-card border border-border/80 text-center space-y-2">
              <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-xs text-foreground font-semibold">No interviews scheduled yet</p>
              <p className="text-xs text-muted-foreground">
                Enter your invitation access code above to join your session, or practice questions below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidateInterviews.map((interview) => {
                const isCompleted = interview.status === "COMPLETED";
                const isReady =
                  interview.status === "SCHEDULED" ||
                  interview.status === "IN_PROGRESS" ||
                  interview.status === "READY";

                return (
                  <div
                    key={interview.id}
                    className="p-5 rounded-xl bg-card border border-border/80 space-y-3 shadow-sm hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                          interview.status === "IN_PROGRESS"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                            : interview.status === "COMPLETED"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {interview.status}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {interview.durationMinutes} Minutes
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-foreground">{interview.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Interviewer: <strong className="text-foreground">{interview.interviewer?.name || "Shivam Sony"}</strong> ({interview.interviewer?.email || "shivamjais.op09@gmail.com"})
                      </p>
                    </div>

                    <div className="text-[11px] font-mono text-muted-foreground bg-muted/50 p-2 rounded-lg border border-border/60 flex items-center justify-between">
                      <span>Access Code:</span>
                      <span className="font-bold text-emerald-400">{interview.inviteToken}</span>
                    </div>

                    <div className="pt-1">
                      {isReady ? (
                        <Link
                          href={`/interviews/${interview.id}/workspace`}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Enter Live Assessment Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      ) : (
                        <Link
                          href={`/interviews/${interview.id}`}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-400" />
                          <span>View Assessment Summary</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Practice Challenges & Mock Prep */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Code2 className="w-4 h-4 text-brand-400" />
                <span>Mock Interview Preparation (Zero-Risk Sandbox)</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Practice real algorithms with incomplete function headers (HackerRank / GFG style) before your live evaluation.
              </p>
            </div>
            <Link
              href="/practice"
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
            >
              <span>View All Challenges</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {practiceQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-card border border-border/80 hover:border-brand-500/40 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.2 rounded font-bold border ${
                        q.difficulty === "HARD"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : q.difficulty === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{q.timeLimitMs}ms</span>
                  </div>
                  <h4 className="font-bold text-xs text-foreground">{q.title}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {q.description.replace(/###/g, "").replace(/`/g, "")}
                  </p>
                </div>

                <Link
                  href={`/practice/${q.slug}`}
                  className="w-full flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-brand-600/15 hover:bg-brand-600 text-brand-300 hover:text-white border border-brand-500/30 text-xs font-semibold transition-all"
                >
                  <Play className="w-3 h-3" />
                  <span>Start Mock Practice</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // INTERVIEWER & ADMIN OPERATIONS HUB
  // ----------------------------------------------------
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
      {/* Superuser Admin Banner (Only visible to Admin Shivam Sony) */}
      {isAdmin && (
        <div className="p-4 rounded-xl bg-purple-950/25 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-sm">Superuser Administrator Privileges</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Full Authority
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Logged in as <strong>Shivam Sony</strong> (shivamjais.op09@gmail.com). You have full control to manage users, interviews, and questions.
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md shrink-0 flex items-center gap-1.5"
          >
            <span>Open Admin Control Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

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
            <span>Add Problem</span>
          </Link>
          <Link
            href="/interviews/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm shadow-brand-500/25 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Schedule Interview</span>
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
              <span>Interview Sessions</span>
            </h2>
            <Link
              href="/interviews"
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {interviews.length === 0 ? (
              <div className="p-8 text-center border border-border rounded-xl bg-card text-muted-foreground text-xs">
                No interviews scheduled yet. Click "Schedule Interview" above to launch a new session.
              </div>
            ) : (
              interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-4 rounded-xl bg-card border border-border/80 hover:border-border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          interview.status === "IN_PROGRESS"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                            : interview.status === "COMPLETED"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {interview.status}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {interview.durationMinutes} min
                      </span>
                    </div>

                    <Link
                      href={`/interviews/${interview.id}`}
                      className="font-semibold text-foreground text-sm hover:text-brand-400 transition-colors block"
                    >
                      {interview.title}
                    </Link>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {interview.candidateName} ({interview.candidateEmail})
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline text-xs font-mono text-brand-400">
                        Code: {interview.inviteToken}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/interviews/${interview.id}/workspace`}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Workspace</span>
                    </Link>
                    <Link
                      href={`/interviews/${interview.id}`}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Recent Evidence & Submissions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-500" />
              <span>Recent Submissions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {submissions.length === 0 ? (
              <div className="p-6 text-center border border-border rounded-xl bg-card text-muted-foreground text-xs">
                No submissions recorded yet. Submissions evaluated in the workspace will appear here.
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground truncate max-w-[180px]">
                      {sub.question.title}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        sub.deterministicScore === 100
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {sub.deterministicScore}%
                    </span>
                  </div>

                  <div className="text-[11px] text-muted-foreground flex items-center justify-between font-mono">
                    <span className="uppercase">{sub.language}</span>
                    <span>{sub.executionTimeMs?.toFixed(1) || 0}ms</span>
                    <span>{formatDate(sub.submittedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
