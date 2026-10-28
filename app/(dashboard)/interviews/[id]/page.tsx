import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import {
  CalendarDays,
  Play,
  Copy,
  Clock,
  User,
  Mail,
  ShieldCheck,
  Code2,
  FileText,
  CheckCircle2,
  ExternalLink,
  Share2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { InterviewDetailControls } from "@/components/interview/interview-detail-controls";

export const dynamic = "force-dynamic";

export default async function InterviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCurrentSession();
  const interview = await prisma.interview.findUnique({
    where: { id: params.id },
    include: {
      interviewer: true,
      questions: {
        include: { question: true },
        orderBy: { orderIndex: "asc" },
      },
      submissions: {
        include: { question: true },
        orderBy: { submittedAt: "desc" },
      },
      reports: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!interview) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const candidateInviteUrl = `${appUrl}/interviews/${interview.id}/workspace?token=${interview.inviteToken}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {interview.status.replace("_", " ")}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              ID: {interview.id.substring(0, 10)}...
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {interview.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/interviews/${interview.id}/workspace`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Launch Live Workspace
          </Link>
        </div>
      </div>

      {/* Grid: Invitation Card + State Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Details and Invitation */}
        <div className="md:col-span-2 space-y-6">
          {/* Candidate Invitation Box */}
          <div className="p-5 rounded-xl bg-card border border-border/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4 text-brand-500" />
                Candidate Access & Invitation Link
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Cryptographic Token
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Send this secure URL to candidate <strong>{interview.candidateName}</strong>. The token authenticates access directly into the sandboxed live coding workspace.
            </p>

            {/* URL Display with Copy Box */}
            <InterviewDetailControls
              interviewId={interview.id}
              inviteUrl={candidateInviteUrl}
              inviteToken={interview.inviteToken}
              status={interview.status}
            />
          </div>

          {/* Assigned Problems List */}
          <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-500" />
              Assigned Assessment Challenges ({interview.questions.length})
            </h2>

            <div className="space-y-3">
              {interview.questions.map((iq, idx) => (
                <div
                  key={iq.id}
                  className="p-3.5 rounded-lg bg-background border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-muted-foreground font-semibold">#{idx + 1}</span>
                      <span className="font-semibold text-foreground text-sm">
                        {iq.question.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                          iq.question.difficulty === "EASY"
                            ? "text-emerald-400 bg-emerald-500/10"
                            : iq.question.difficulty === "MEDIUM"
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-red-400 bg-red-500/10"
                        }`}
                      >
                        {iq.question.difficulty}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      Timeout: {iq.question.timeLimitMs}ms • Max Points: {iq.pointsAvailable}
                    </div>
                  </div>

                  <Link
                    href={`/questions/${iq.question.id}`}
                    className="px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted text-xs text-muted-foreground hover:text-foreground font-medium shrink-0 text-center"
                  >
                    View Problem Specs
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Submissions in this session */}
          {interview.submissions.length > 0 && (
            <div className="p-5 rounded-xl bg-card border border-border/80 space-y-3 shadow-sm">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Session Submissions ({interview.submissions.length})
              </h2>

              <div className="space-y-2 text-xs">
                {interview.submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-lg bg-background border border-border/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-foreground">{sub.question.title}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {sub.language.toUpperCase()} • {sub.executionTimeMs}ms • {formatDate(sub.submittedAt)}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {sub.deterministicScore} / {sub.maxScore} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Metadata */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm text-xs">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] font-mono border-b border-border pb-2">
              Session Metadata
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground block text-[11px]">Interviewer</span>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-brand-500" />
                  {interview.interviewer.name}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Candidate</span>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-brand-500" />
                  {interview.candidateName}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono block">
                  {interview.candidateEmail}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Duration Allocated</span>
                <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-brand-500" />
                  {interview.durationMinutes} Minutes
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Scheduled Timestamp</span>
                <span className="font-mono text-muted-foreground block mt-0.5">
                  {formatDate(interview.scheduledAt || interview.createdAt)}
                </span>
              </div>

              {interview.notes && (
                <div className="pt-2 border-t border-border">
                  <span className="text-muted-foreground block text-[11px]">Private Notes</span>
                  <p className="text-foreground mt-0.5 italic">{interview.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assessment Report Link */}
          {interview.reports.length > 0 && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                <FileText className="w-4 h-4" />
                Assessment Report Generated
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                A structured evaluation dossier with deterministic scores and AI-assisted observations is available.
              </p>
              <div className="pt-1">
                <Link
                  href={`/reports/${interview.id}`}
                  className="text-xs text-purple-400 font-semibold hover:underline flex items-center gap-1"
                >
                  Open Candidate Report <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
