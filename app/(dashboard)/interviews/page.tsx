import Link from "next/link";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import {
  CalendarDays,
  PlusCircle,
  Play,
  FileText,
  User,
  ExternalLink,
  Clock,
  Filter,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams?: { status?: string; search?: string };
}) {
  const session = await getCurrentSession();
  const filterStatus = searchParams?.status || "ALL";

  const whereClause: { status?: string } = {};
  if (filterStatus !== "ALL") {
    whereClause.status = filterStatus;
  }

  const interviews = await prisma.interview.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      questions: {
        include: { question: true },
      },
      interviewer: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Technical Interviews
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage scheduled technical screens, candidate invitation tokens, and live coding sessions.
          </p>
        </div>

        <Link
          href="/interviews/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Schedule Assessment
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3 text-xs">
        {["ALL", "IN_PROGRESS", "SCHEDULED", "COMPLETED"].map((st) => (
          <Link
            key={st}
            href={`/interviews${st === "ALL" ? "" : `?status=${st}`}`}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === st
                ? "bg-brand-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-card border border-border"
            }`}
          >
            {st.replace("_", " ")}
          </Link>
        ))}
      </div>

      {/* Interview List Cards */}
      <div className="space-y-3">
        {interviews.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-card border border-dashed border-border space-y-3">
            <CalendarDays className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h3 className="text-sm font-semibold text-foreground">No interview sessions found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are no interviews matching this filter. Schedule a new technical interview to get started.
            </p>
            <div className="pt-2">
              <Link
                href="/interviews/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Schedule Interview
              </Link>
            </div>
          </div>
        ) : (
          interviews.map((iv) => {
            const isLive = iv.status === "IN_PROGRESS";
            const isCompleted = iv.status === "COMPLETED";

            return (
              <div
                key={iv.id}
                className="p-5 rounded-xl bg-card border border-border/80 hover:border-brand-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5 max-w-xl">
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
                      {iv.durationMinutes} min • {iv.interviewType.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="font-bold text-foreground text-base leading-snug">
                    {iv.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brand-500" />
                      Candidate: <strong>{iv.candidateName}</strong> ({iv.candidateEmail})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3" />
                      {formatDate(iv.scheduledAt || iv.createdAt)}
                    </span>
                  </div>

                  {iv.questions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {iv.questions.map((iq) => (
                        <span
                          key={iq.id}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border"
                        >
                          {iq.question.title} ({iq.question.difficulty})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                  <Link
                    href={`/interviews/${iv.id}`}
                    className="px-3.5 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors"
                  >
                    Session Token & Details
                  </Link>

                  {isCompleted ? (
                    <Link
                      href={`/reports/${iv.id}`}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Assessment Report
                    </Link>
                  ) : (
                    <Link
                      href={`/interviews/${iv.id}/workspace`}
                      className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Live Workspace
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
