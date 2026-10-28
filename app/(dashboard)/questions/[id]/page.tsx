import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import { getCurrentSession } from "@/lib/auth/jwt";
import {
  Code2,
  Clock,
  Cpu,
  CheckCircle2,
  ChevronLeft,
  Lock,
  Play,
  FileCode,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function QuestionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCurrentSession();
  const question = await prisma.question.findUnique({
    where: { id: params.id },
    include: {
      testCases: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!question) {
    notFound();
  }

  let starterCodes: Record<string, string> = {};
  try {
    starterCodes = JSON.parse(question.starterCodes || "{}");
  } catch {
    starterCodes = {};
  }

  const isInterviewerOrAdmin = session?.role === "INTERVIEWER" || session?.role === "ADMIN" || !session;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <Link
          href="/questions"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Question Library
        </Link>
      </div>

      {/* Main Spec Card */}
      <div className="p-6 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                question.difficulty === "EASY"
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : question.difficulty === "MEDIUM"
                  ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                  : "text-red-400 bg-red-500/10 border border-red-500/20"
              }`}
            >
              {question.difficulty}
            </span>
            <span className="text-xs font-mono text-muted-foreground">slug: {question.slug}</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span>Wall Time Limit: {question.timeLimitMs}ms</span>
            <span>Memory Limit: {question.memoryLimitKb / 1000} MB</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {question.title}
        </h1>

        <div className="prose prose-invert prose-xs max-w-none text-muted-foreground leading-relaxed pt-2 border-t border-border">
          <div
            dangerouslySetInnerHTML={{
              __html: question.description
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/### (.*?)\n/g, "<h3 class='text-foreground font-bold text-sm mt-3 mb-1'>$1</h3>")
                .replace(/`([^`]+)`/g, "<code class='bg-muted px-1 py-0.5 rounded text-foreground font-mono'>$1</code>"),
            }}
          />
        </div>
      </div>

      {/* Test Cases Specification */}
      <div className="p-6 rounded-xl bg-card border border-border/80 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-500" />
            Verification Test Matrix ({question.testCases.length} cases)
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {question.testCases.filter((tc) => tc.isHidden).length} hidden verification suites
          </span>
        </div>

        <div className="space-y-3">
          {question.testCases.map((tc, idx) => (
            <div
              key={tc.id}
              className={`p-4 rounded-lg border text-xs font-mono space-y-2 ${
                tc.isHidden
                  ? "bg-amber-500/5 border-amber-500/30"
                  : "bg-background border-border/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">Test Case #{idx + 1}</span>
                  {tc.isHidden ? (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Hidden Confidential Test
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      Public Sample Test
                    </span>
                  )}
                </div>
                <span className="text-foreground font-bold">{tc.points} Points</span>
              </div>

              {isInterviewerOrAdmin ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
                  <div className="p-2 rounded bg-muted/40 border border-border/60">
                    <span className="text-muted-foreground block font-semibold mb-0.5">Input:</span>
                    <pre className="whitespace-pre-wrap">{tc.inputData}</pre>
                  </div>
                  <div className="p-2 rounded bg-muted/40 border border-border/60">
                    <span className="text-emerald-400 block font-semibold mb-0.5">Expected Output:</span>
                    <pre className="whitespace-pre-wrap">{tc.expectedOutput}</pre>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground italic text-[11px]">
                  Confidential assertion kept strictly server-side.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
